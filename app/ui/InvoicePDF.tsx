// ✅ components/InvoicePDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

interface InvoiceProps {
  invoice: {
    invoiceNumber: string;
    generatedAt: string;
    vendor: { name: string; email: string };
    order: {
      orderId: string;
      hospital: string;
      medicineName: string;
      quantity: number;
      pricePerUnit: number;
      total: number;
    };
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e3a8a',
    textTransform: 'uppercase',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    alignSelf: 'center',
  },
  section: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#111827',
  },
  table: {
    // display: 'table',
    width: 'auto',
    marginTop: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    backgroundColor: '#2563eb',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#2563eb',
    padding: 8,
    width: '33.33%',
    fontWeight: 'bold',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 8,
    width: '33.33%',
    backgroundColor: '#ffffff',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#6b7280',
  },
});

export const InvoicePDF = ({ invoice }: InvoiceProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Logo */}
      <Image style={styles.logo} src="/logo.png" />

      <Text style={styles.header}>Invoice</Text>

      {/* Invoice Metadata */}
      <View style={styles.section}>
        <Text><Text style={styles.label}>Invoice Number:</Text> {invoice.invoiceNumber}</Text>
        <Text><Text style={styles.label}>Generated At:</Text> {invoice.generatedAt}</Text>
        <Text><Text style={styles.label}>Order ID:</Text> {invoice.order.orderId}</Text>
      </View>

      {/* Vendor Info */}
      <View style={styles.section}>
        <Text><Text style={styles.label}>Vendor Name:</Text> {invoice.vendor.name}</Text>
        <Text><Text style={styles.label}>Email:</Text> {invoice.vendor.email}</Text>
      </View>

      {/* Order Table */}
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Medicine</Text>
          <Text style={styles.headerCell}>Quantity</Text>
          <Text style={styles.headerCell}>Price/Unit</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>{invoice.order.medicineName}</Text>
          <Text style={styles.cell}>{invoice.order.quantity}</Text>
          <Text style={styles.cell}>₹{invoice.order.pricePerUnit.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Total</Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}>₹{invoice.order.total.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.footer}>Thank you for your business!</Text>
    </Page>
  </Document>
);
