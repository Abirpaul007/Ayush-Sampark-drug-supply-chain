import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodborder";
import DrugConsumption from "@/lib/models/DrugConsumption";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const drug = searchParams.get("drug");
  const region = searchParams.get("region");

  if (!drug || !region) {
    return NextResponse.json({ error: "Missing drug or region" }, { status: 400 });
  }

  const data = await DrugConsumption.find({ drug, region })
    .sort({ year: -1, month: -1 })
    .limit(12)
    .lean();

  const history = data
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map((d) => d.quantity);

  return NextResponse.json({ history });
}
