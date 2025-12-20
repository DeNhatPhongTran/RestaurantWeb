import express from 'express'
import Reservation from '../database/schema/reservation_schema.js'
import Table from '../database/schema/table_schema.js'
import Reservation_Table from "../database/schema/reservation_table_schema.js";

const router = express.Router()

// API lấy danh sách đơn đặt bàn
router.get("/list", async (req, res) => {
    try {
        //const reservations_list = await Reservation.find().sort({ created_at: -1 });
        const reservations_list = await Reservation.aggregate([
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
                    tables: { name: 1 },
                    customer_name: 1,
                    customer_phone: 1,
                    guest_count: 1, 
                    datetime_checkin: 1,
                    datetime_out: 1,
                    status: 1,
                }
            }
        ]);

        res.json(reservations_list);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
});

// API chỉnh sửa thông tin đơn đặt bàn
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
            edit_table_name
        } = req.body;

        const updatedRes = await Reservation.findByIdAndUpdate(
            reservation_id,
            {
                customer_name,
                customer_phone,
                guest_count,
                datetime_checkin,
                datetime_out,
                status,
            },
            { new: true } // trả về document sau khi update
        );

        const edit_table_obj = await Table.findOne({name: edit_table_name})
        const res_tab_obj = await Reservation_Table.findOne({reservationId: reservation_id}) // 1 bàn-nhiều đơn
        const updatedResTab = await Reservation_Table.findByIdAndUpdate(
            res_tab_obj._id,
            {
                reservationId: reservation_id,
                tableId: edit_table_obj._id
            }
        )

        if (!updatedRes) {
            return res.status(404).json({ message: "Không tìm thấy reservation" });
        }
        res.status(200).json({ message: "Cập nhật thành công", data: updatedRes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi phía server" });
    }
});

// API xóa đơn đặt bàn
router.post("/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const deletedReservation = await Reservation.findByIdAndDelete(id);
        await Reservation_Table.deleteOne({ reservationId: id }); // 1 bàn-nhiều đơn

        if (!deletedReservation) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt bàn cần xóa" });
        }
        res.status(200).json({ message: "Xóa thành công", deletedReservation });
    } catch (error) {
        res.status(500).json({ message: "Lỗi phía server", error: error.message });
    }
});

// API tạo đơn đặt bàn mới
router.post("/create", async (req, res) => {
    try {
        // todo: check trùng

        const {
            customer_name,
            customer_phone,
            guest_count,
            datetime_checkin,
            datetime_out,
            assignTableName,
            status
        } = req.body

        const newReservation = await Reservation.create({
            customer_name,
            customer_phone,
            guest_count,
            datetime_checkin,
            datetime_out,
            status
        });

        const table = await Table.findOne({ name: assignTableName });
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }
        const newResTab = await Reservation_Table.create({
            reservationId: newReservation._id,
            tableId: table._id
        })
        res.status(201).json({ message: "Tạo mới thành công", newReservation });
    } catch (error) {
        res.status(500).json({ message: "Lỗi phía server", error: error.message });
    }
})

router.post("/overlap_check", async (req, res) => {
    const { from, to } = req.body;

    const fromDate = new Date(from);
    const toDate = new Date(to);
    console.log(fromDate, toDate)

    const overlappedReservations = await Reservation.find({
        status: { $nin: ["cancelled", "finished", "no-show"] },
        datetime_checkin: { $lt: toDate },
        datetime_out: { $gt: fromDate }
    }).select("_id");

    const overlapReservationIds = overlappedReservations.map(r => r._id);

    const busyTables = await Reservation_Table.find({
        reservationId: { $in: overlapReservationIds }
    }).select("tableId");

    const busyTableIds = busyTables.map(t => t.tableId);

    const overlapTables = await Table.find({
        _id: { $in: busyTableIds }
    })
    const availableTables = await Table.find({
        _id: { $nin: busyTableIds }
    });

    res.status(200).json({ fromDate, toDate, overlapTables, availableTables });
})

export default router
