import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CheckTableOverlap from "./CheckTableOverlap";

export default function Reservation_mgmt() {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("");
    const [editBooking, setEditBooking] = useState(null); // đơn booking đang được chọn để chuẩn bị edit
    const [deleteBooking, setDeleteBooking] = useState(null); // đơn booking đang được chọn để chuẩn bị delete

    // Auto refresh khi load lần đầu
    useEffect(() => {
        console.log("log: Refresh lần đầu")
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        const body = await fetch("/api/reservations/list")
            .then(res => res.json());
        setData(body);
        /*const mockdata = [
            {
                _id: 1, customer_name: 'Huy', customer_phone: "0123",
                guest_count: 6, datetime_checkin: Date(Date.now()), status: "confirmed"
            },
        ]
        setData(mockdata)*/
    };

    const combineDateTime = (dateStr, timeStr) => {
        const [year, month, day] = dateStr.split("-");
        const [hour, minute] = timeStr.split(":");

        return new Date(year, month - 1, // month bắt đầu từ 0
            day, hour, minute);
    };

    const createNew = async () => {
        const name = document.getElementById("newName").value.trim();
        const phone = document.getElementById("newPhone").value.trim();
        const count = document.getElementById("newCount").value;
        const date = document.getElementById("newInDate").value;
        const inTime = document.getElementById("newInClockTime").value;
        const outTime = document.getElementById("newOutClockTime").value;
        const assignTableName = document.getElementById("newAssignTableName").value;

        if (!name || !phone || !count || !date || !inTime || !outTime) {
            alert("Vui lòng nhập thông tin cần thiết!");
            return;
        }

        const payload = {
            customer_name: name,
            customer_phone: phone,
            guest_count: parseInt(count, 10), // Đảm bảo number
            datetime_checkin: combineDateTime(date, inTime),
            datetime_out: combineDateTime(date, outTime),
            assignTableName: assignTableName,
            status: "confirmed",
        };

        try {
            const res = await fetch("/api/reservations/create", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(payload),
            });
            fetchAllData()
            alert("Tạo đặt bàn thành công!");
        } catch (err) {
            console.error(err);
            alert("Tạo đặt bàn thất bại!");
        }
    }

    const sendEdit = async () => {
        const date = document.getElementById("editFormDate").value;
        const inTime = document.getElementById("editFormInClockTime").value;
        const outTime = document.getElementById("editFormOutClockTime").value;

        const payload = {
            reservation_id: editBooking._id,
            customer_name: document.getElementById("editFormName").value,
            customer_phone: document.getElementById("editFormPhone").value,
            guest_count: document.getElementById("editFormCount").value,
            datetime_checkin: combineDateTime(date, inTime),
            datetime_out: combineDateTime(date, outTime),
            status: document.getElementById("editFormStatus").value,
            edit_table_name: document.getElementById("editFormTable").value
        };

        try {
            const res = await fetch("/api/reservations/edit", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(payload),
            });

            fetchAllData()
            alert("Cập nhật thành công!");
            setEditBooking(null)
        } catch (err) {
            console.error(err);
            alert("Cập nhật thất bại!");
        }
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch("/api/reservations/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ id: deleteBooking._id }),
            });

            fetchAllData()
            alert("Xóa thành công!");
            setDeleteBooking(null)
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại!");
        }
    };

    return (
        <div className="w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-3">
            
            {/* LEFT */}
            <div className="lg:col-span-2">
                <Card className="p-6">
                    <h2 className="text-2xl font-bold">Danh sách đặt bàn tại nhà hàng</h2>
                    <div className="p-4 pt-1">
                        {/* Bộ lọc + nút refresh */}
                        <div className="flex items-center gap-2 mb-4">
                            <Input
                                placeholder="Lọc theo tên..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                            <Button onClick={() => fetchAllData()}>Làm mới</Button>
                        </div>

                        {/* Bảng dữ liệu */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="border border-gray-300">Bàn</TableHead>
                                    <TableHead className="border border-gray-300">Tên</TableHead>
                                    <TableHead className="border border-gray-300">SĐT</TableHead>
                                    <TableHead className="border border-gray-300">Số khách</TableHead>
                                    <TableHead className="border border-gray-300">Thời gian đến</TableHead>
                                    <TableHead className="border border-gray-300">Thời gian về dự kiến</TableHead>
                                    <TableHead className="border border-gray-300">Trạng thái</TableHead>
                                    <TableHead className="border border-gray-300">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.filter((b) => b.customer_name.toLowerCase().includes(filter.toLowerCase()))
                                    .map((booking) => (
                                        <TableRow key={booking._id}>
                                            <TableCell className="border border-gray-300">{booking.tables[0]["name"]}</TableCell>
                                            <TableCell className="border border-gray-300">{booking.customer_name}</TableCell>
                                            <TableCell className="border border-gray-300">{booking.customer_phone}</TableCell>
                                            <TableCell className="border border-gray-300">{booking.guest_count}</TableCell>
                                            <TableCell className="border border-gray-300">{new Date(booking.datetime_checkin).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' })}</TableCell>
                                            <TableCell className="border border-gray-300">{new Date(booking.datetime_out).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' })}</TableCell>
                                            <TableCell className="border border-gray-300">{booking.status}</TableCell>
                                            <TableCell className="border border-gray-300 flex gap-2">
                                                <Button variant="outline" onClick={() => setEditBooking(booking)}>Sửa</Button>
                                                <Button variant="destructive" onClick={() => setDeleteBooking(booking)}>Xóa</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>

                        {/* Popup Edit */}
                        <Dialog open={!!editBooking} onOpenChange={() => setEditBooking(null)}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Chỉnh sửa đơn đặt bàn</DialogTitle>
                                </DialogHeader>
                                {editBooking && (
                                    <div className="space-y-2">
                                        <label>Bàn được đặt</label>
                                        <Input id="editFormTable" defaultValue={editBooking.tables[0]["name"]} />
                                        <label>Tên khách đặt</label>
                                        <Input id="editFormName" defaultValue={editBooking.customer_name} />
                                        <label>Số điện thoại</label>
                                        <Input id="editFormPhone" defaultValue={editBooking.customer_phone} />
                                        <label>Số khách</label>
                                        <Input id="editFormCount" defaultValue={editBooking.guest_count} />
                                        <label>Ngày</label>
                                        <Input id="editFormDate" type="date" defaultValue={new Date(editBooking.datetime_checkin).toISOString().split('T')[0]} />
                                        <label>Giờ đến</label>
                                        <Input id="editFormInClockTime" type="time" defaultValue={new Date(editBooking.datetime_checkin).toTimeString().slice(0, 5)} />
                                        <label>Giờ về dự kiến</label>
                                        <Input id="editFormOutClockTime" type="time" defaultValue={new Date(editBooking.datetime_out).toTimeString().slice(0, 5)} />
                                        <label>Trạng thái</label>
                                        <Input id="editFormStatus" defaultValue={editBooking.status} />
                                        <Button onClick={() => sendEdit()}>Lưu</Button>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>

                        {/* Popup Delete */}
                        <Dialog open={!!deleteBooking} onOpenChange={() => setDeleteBooking(null)}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Xác nhận xóa</DialogTitle>
                                </DialogHeader>
                                {deleteBooking && (
                                    <div className="space-y-2">
                                        <p>Bạn có chắc muốn xóa đơn đặt bàn sau?</p>
                                        <p><strong>{deleteBooking.customer_name}</strong> - {deleteBooking.customer_phone}</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => setDeleteBooking(null)}>Hủy</Button>
                                            <Button variant="destructive" onClick={() => confirmDelete()}>Xóa</Button>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </Card>
                <CheckTableOverlap />
            </div>

            {/* RIGHT */}
            <Card className="p-6">
                <h2 className="text-xl font-bold">Thông tin tạo đặt bàn mới</h2>
                <div className="flex flex-col gap-2 text-sm">
                    <label htmlFor="newName">Tên khách đặt:</label>
                    <input id="newName" type="text" className="border rounded-xl p-2" />

                    <label htmlFor="newPhone">Số điện thoại:</label>
                    <input id="newPhone" type="text" className="border rounded-xl p-2" />

                    <label htmlFor="newCount">Số lượng khách:</label>
                    <input id="newCount" type="number" className="border rounded-xl p-2" />

                    <label htmlFor="newInDate">Ngày:</label>
                    <input id="newInDate" type="date" className="border rounded-xl p-2" />

                    <label>Giờ:</label>
                    <div className="flex items-center gap-4">
                        <input id="newInClockTime" type="time" className="border rounded-xl p-2" />
                        <p>đến</p>
                        <input id="newOutClockTime" type="time" className="border rounded-xl p-2" />
                    </div>
                    <label htmlFor="newAssignTableName">Bàn được đặt:</label>
                    <input id="newAssignTableName" type="text" className="border rounded-xl p-2" />
                    <Button onClick={() => createNew()}>Tạo</Button>
                </div>
            </Card>
        </div>
    );
}
