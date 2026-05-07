import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDrugConsumption extends Document {
  region: string;
  drug: string;
  year: number;
  month: number;
  quantity: number;
}

const DrugConsumptionSchema: Schema = new Schema({
  region: { type: String, required: true },
  drug: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  quantity: { type: Number, required: true },
}
);

const DrugConsumption: Model<IDrugConsumption> =
  mongoose.models.DrugConsumption ||
  mongoose.model<IDrugConsumption>("DrugConsumption", DrugConsumptionSchema);

export default DrugConsumption;
