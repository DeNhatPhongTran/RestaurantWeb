import mongoose from "mongoose";

const reservationTableSchema = new mongoose.Schema({
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
        required: true
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true
    }
});

export default mongoose.model("ReservationOrderItem", reservationTableSchema);