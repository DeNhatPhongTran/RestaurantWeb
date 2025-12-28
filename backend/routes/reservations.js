import express from "express";
import Reservation from "../database/schema/reservation_schema.js";
import Table from "../database/schema/table_schema.js";
import ReservationTable from "../database/schema/reservation_table_schema.js";
import OrderItems from "../database/schema/order_item_schema.js";
import mongoose from "mongoose";


const router = express.Router();

/**
 * =====================================================
 * HELPER: normalize tableIds (BẮT BUỘC)
 * =====================================================
 */
const normalizeTableIds = (tableIds = []) => {
    return tableIds
        .filter(id => id)              // loại null / undefined
        .map(id => id.toString());     // đảm bảo ObjectId hợp lệ
};

/**
 * =====================================================
 * HELPER: check overlap cho N bàn
 * =====================================================
 */
const isOverlap = async (
    excludeReservationId,
    tableIds,
    datetimeIn,
    datetimeOut
) => {
    const query = {
        status: { $nin: ["cancelled", "finished", "no-show"] },
        datetime_checkin: { $lt: new Date(datetimeOut) },
        datetime_out: { $gt: new Date(datetimeIn) }
    };

    if (excludeReservationId) {
        query._id = { $ne: excludeReservationId };
    }

    const overlappedReservations = await Reservation.find(query).select("_id");
    if (!overlappedReservations.length) return false;

    const overlapIds = overlappedReservations.map(r => r._id);

    const busy = await ReservationTable.find({
        reservationId: { $in: overlapIds },
        tableId: { $in: tableIds }
    });

    return busy.length > 0;
};

/**
 * =====================================================
 * GET LIST
 * =====================================================
 */
router.get("/list", async (req, res) => {
    try {
        const reservations = await Reservation.aggregate([
            { $sort: { created_at: -1 } },
            {
                $lookup: {
                    from: "reservationtables",
                    localField: "_id",
                    foreignField: "reservationId",
                    as: "reservationTables"
                }
            },
            {
                $lookup: {
                    from: "tables",
                    localField: "reservationTables.tableId",
                    foreignField: "_id",
                    as: "tables"
                }
            },
            {
                $project: {
                    customer_name: 1,
                    customer_phone: 1,
                    guest_count: 1,
                    datetime_checkin: 1,
                    datetime_out: 1,
                    status: 1,
                    tables: { _id: 1, name: 1, capacity: 1 }
                }
            }
        ]);

        res.json(reservations);
        console.log(res.json(reservations));
    } catch (err) {
        console.error("LIST ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});


/**
 * =====================================================
 * CREATE (N TABLES)
 * =====================================================
 */
router.post("/create", async (req, res) => {
    try {
        const {
            customer_name,
            customer_phone,
            guest_count,
            datetime_checkin,
            datetime_out,
            status = "confirmed",
            tableIds
        } = req.body;

        const cleanTableIds = normalizeTableIds(tableIds);

        if (!cleanTableIds.length) {
            return res.status(400).json({ message: "Phải chọn ít nhất 1 bàn hợp lệ" });
        }

        const overlapped = await isOverlap(
            null,
            cleanTableIds,
            datetime_checkin,
            datetime_out
        );

        if (overlapped) {
            return res.status(409).json({
                message: "Có bàn đã được đặt trong khoảng thời gian này"
            });
        }

        const reservation = await Reservation.create({
            customer_name,
            customer_phone,
            guest_count,
            datetime_checkin,
            datetime_out,
            status
        });

        await ReservationTable.insertMany(
            cleanTableIds.map(tableId => ({
                reservationId: reservation._id,
                tableId
            }))
        );

        res.status(201).json({
            success: true,
            message: "Tạo mới thành công",
            data: reservation
        });
    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * =====================================================
 * EDIT (N TABLES)
 * =====================================================
 */
router.post("/edit", async (req, res) => {
    try {
        const {
            reservation_id,
            customer_name,
            customer_phone,
            guest_count,
            datetime_checkin,
            datetime_out,
            status,
            tableIds
        } = req.body;

        const cleanTableIds = normalizeTableIds(tableIds);

        if (!cleanTableIds.length) {
            return res.status(400).json({ message: "Danh sách bàn không hợp lệ" });
        }

        const overlapped = await isOverlap(
            reservation_id,
            cleanTableIds,
            datetime_checkin,
            datetime_out
        );

        if (overlapped) {
            return res.status(409).json({
                message: "Có bàn đã được đặt trong khoảng thời gian này"
            });
        }

        const reservation = await Reservation.findByIdAndUpdate(
            reservation_id,
            {
                customer_name,
                customer_phone,
                guest_count,
                datetime_checkin,
                datetime_out,
                status
            },
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: "Không tìm thấy reservation" });
        }

        await ReservationTable.deleteMany({ reservationId: reservation_id });

        await ReservationTable.insertMany(
            cleanTableIds.map(tableId => ({
                reservationId: reservation_id,
                tableId
            }))
        );

        res.json({
            success: true,
            message: "Cập nhật thành công",
            data: reservation
        });
    } catch (err) {
        console.error("EDIT ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * =====================================================
 * DELETE
 * =====================================================
 */
router.post("/delete", async (req, res) => {
    try {
        const { id } = req.body;

        await Reservation.findByIdAndDelete(id);
        await ReservationTable.deleteMany({ reservationId: id });

        res.json({ success: true, message: "Xóa thành công" });
    } catch (err) {
        console.error("DELETE ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        const reservation = await Reservation.findById(id)
            .populate({
                path: "orderItems",
                model: "OrderItem",
                select: "_id item quantity note status serving_status price_at_time ordered_at",
                populate: {
                    path: "item",
                    select: "_id name price category"
                }
            });

        if (!reservation) {
            return res.status(404).json({ success: false, message: "Reservation không tồn tại" });
        }

        // Đảm bảo orderItems là [] nếu null
        const data = {
            ...reservation.toObject(),
            orderItems: reservation.orderItems || []
        };

        res.json({ success: true, data });
    } catch (err) {
        console.error("GET BY ID ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});




/**
 * =====================================================
 * OVERLAP CHECK (MULTI)
 * =====================================================
 */
router.post("/overlap_check", async (req, res) => {
    try {
        const { from, to, exclude_reservation_id } = req.body;

        const query = {
            status: { $nin: ["cancelled", "finished", "no-show"] },
            datetime_checkin: { $lt: new Date(to) },
            datetime_out: { $gt: new Date(from) }
        };

        if (exclude_reservation_id) {
            query._id = { $ne: exclude_reservation_id };
        }

        const overlappedReservations = await Reservation.find(query).select("_id");
        const overlapIds = overlappedReservations.map(r => r._id);

        const busyMappings = await ReservationTable.find({
            reservationId: { $in: overlapIds }
        }).select("tableId");

        const busyTableIds = busyMappings.map(b => b.tableId);

        const overlapTables = await Table.find({ _id: { $in: busyTableIds } });
        const availableTables = await Table.find({ _id: { $nin: busyTableIds } });

        res.json({ overlapTables, availableTables });
    } catch (err) {
        console.error("OVERLAP CHECK ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
