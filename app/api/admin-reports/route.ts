import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import VendorInventory from '@/lib/models/Vendor-Inventory';
import Order from '@/lib/models/orderh';
import PharmacyOrder from '@/lib/models/orderp';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const formatType = searchParams.get('format') || 'json';

  if (!type) return NextResponse.json({ success: false, message: 'Missing type' });

  let data: any = [];

  // Step 1: Fetch Data
  switch (type) {
    case 'Inventory Status':
      data = await VendorInventory.find().populate('medicineId').lean();
      break;
    case 'Delivery Performance': {
      const ho = await Order.find().lean();
      const po = await PharmacyOrder.find().lean();
      const all = ho.concat(po);
      const totalHours = all.reduce((sum, o) => {
        const start = new Date(o.createdAt).getTime();
        const end = new Date(o.updatedAt).getTime();
        return sum + (end - start) / (1000 * 60 * 60);
      }, 0);
      const avg = totalHours / all.length;
      data = [{ averageDeliveryHours: avg.toFixed(2), totalOrders: all.length }];
      break;
    }
    case 'Hospital Requests':
      data = await Order.find().populate('hospitalId').populate('medicineId').lean();
      break;
    case 'Pharmacy Orders':
      data = await PharmacyOrder.find().populate('pharmacyId').populate('medicineId').lean();
      break;
    case 'Stock Alerts':
      data = await VendorInventory.find({ stockQuantity: { $lt: 10 } }).populate('medicineId').lean();
      break;
    default:
      return NextResponse.json({ success: false, message: 'Invalid report type' });
  }

  // Step 2: Normalize Data
  if (type === 'Hospital Requests') {
    data = data.map((d: any) => ({
      orderId: d._id?.toString() || '',
      createdAt: d.createdAt?.toISOString() || '',
      updatedAt: d.updatedAt?.toISOString() || '',
      status: d.status || '',
      quantity: d.quantity || '',
      hospitalName: d.hospitalId?.name || '',
      medicineName: d.medicineId?.name || '',
    }));
  }

  if (type === 'Pharmacy Orders') {
    data = data.map((d: any) => ({
      orderId: d._id?.toString() || '',
      createdAt: d.createdAt?.toISOString() || '',
      updatedAt: d.updatedAt?.toISOString() || '',
      status: d.status || '',
      quantity: d.quantity || '',
      pharmacyName: d.pharmacyId?.name || '',
      medicineName: d.medicineId?.name || '',
    }));
  }

  if (type === 'Inventory Status' || type === 'Stock Alerts') {
    data = data.map((item: any) => ({
      inventoryId: item._id?.toString() || '',
      medicineName: item.medicineId?.name || '',
      stockQuantity: item.stockQuantity || '',
      updatedAt: item.updatedAt?.toISOString() || '',
    }));
  }

  const filename = `${type.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd_HH-mm')}`;

  // Step 3: CSV
  if (formatType === 'csv') {
    const parser = new Parser();
    const csv = parser.parse(data);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    });
  }

  // Step 4: Excel
  if (formatType === 'excel') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(type);
    if (data.length > 0) {
      sheet.columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key,
        width: 25,
      }));
      data.forEach((row: any) => sheet.addRow(row));
    }
    const buffer = await workbook.xlsx.writeBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
      },
    });
  }

  // Step 5: PDF using get-stream
  if (formatType === 'pdf') {
    const doc = new PDFDocument();
    doc.fontSize(18).text(`${type} Report`, { align: 'center' }).moveDown();

    data.forEach((item: any, i: number) => {
      doc.fontSize(12).text(`Item #${i + 1}`, { underline: true });
      Object.entries(item).forEach(([k, v]) => {
        doc.fontSize(10).text(`${k}: ${v}`);
      });
      doc.moveDown();
    });

    doc.end();
    
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    const buffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
      },
    });
  }

  // Step 6: Fallback JSON
  return NextResponse.json({ success: true, data });
}
