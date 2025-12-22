import mongoose from "mongoose";

const reservationTableSchema = new mongoose.Schema({
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
        required: true
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true
    }
});

export default mongoose.model("ReservationTable", reservationTableSchema);