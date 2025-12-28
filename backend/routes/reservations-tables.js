import express from "express";
import ReservationTable from "../database/schema/reservation_table_schema.js";
import Reservation from "../database/schema/reservation_schema.js";
import Table from "../database/schema/table_schema.js";

const router = express.Router();


router.post("/create", async (req, res) => {
    try {
        const { reservationId, tableId } = req.body;

        if (!reservationId || !tableId) {
            return res.status(400).json({ message: "Thiếu reservationId hoặc tableId" });
        }

        // Validate tồn tại
        const reservation = await Reservation.findById(reservationId);
        const table = await Table.findById(tableId);

        if (!reservation || !table) {
            return res.status(404).json({ message: "Reservation hoặc Table không tồn tại" });
        }

        const newResTable = await ReservationTable.create({
            reservationId,
            tableId
        });

        res.status(201).json({
            success: true,
            data: newResTable
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi phía server" });
    }
});



router.get("/by-reservation/:reservationId", async (req, res) => {
    try {
        const { reservationId } = req.params;

        const resTables = await ReservationTable.find({ reservationId })
            .populate("tableId");

        res.json({
            success: true,
            data: resTables
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi phía server" });
    }
});


router.get("/by-table/:tableId", async (req, res) => {
    try {
        const { tableId } = req.params;

        const resTables = await ReservationTable.find({ tableId })
            .populate("reservationId");

        res.json({
            success: true,
            data: resTables
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi phía server" });
    }
});


router.put("/update", async (req, res) => {
    try {
        const { reservationId, newTableId } = req.body;

        const resTable = await ReservationTable.findOne({ reservationId });
        if (!resTable) {
            return res.status(404).json({ message: "Không tìm thấy mapping reservation-table" });
        }

        resTable.tableId = newTableId;
        await resTable.save();

        res.json({
            success: true,
            message: "Cập nhật bàn thành công",
            data: resTable
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi phía server" });
    }
});


router.delete("/delete/by-reservation/:reservationId", async (req, res) => {
    try {
        const { reservationId } = req.params;

        await ReservationTable.deleteMany({ reservationId });

        res.json({
            success: true,
            message: "Đã xóa mapping reservation-table"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi phía server" });
    }
});


router.delete("/delete/by-table/:tableId", async (req, res) => {
    try {
        const { tableId } = req.params;

        await ReservationTable.deleteMany({ tableId });

        res.json({
            success: true,
            message: "Đã xóa mapping table-reservation"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi phía server" });
    }
});

export default router;
