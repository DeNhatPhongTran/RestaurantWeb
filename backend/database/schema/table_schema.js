import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  capacity: { type: Number, required: true },
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", default: null }, // N-1: Many Tables -> One Reservation (1 table thuộc 1 reservation tại một thời điểm)
  status: { type: String, enum: ["empty","reserved","serving"], default: "empty" }
});

export default mongoose.model("Table", tableSchema);
