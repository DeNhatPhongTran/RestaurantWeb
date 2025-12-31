import React, { useEffect, useState } from "react";
import { useApi } from "@/context/ApiContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react";

export default function Dish_menu_mgmt() {
    const { apiUrl } = useApi();
    const [dishes, setDishes] = useState([]);
    const [filterName, setFilterName] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [editDish, setEditDish] = useState(null);
    const [deleteDish, setDeleteDish] = useState(null);

    useEffect(() => {
        console.log("Log: Refresh lần đầu")
        fetchAllData();
    }, [apiUrl]);

    const fetchAllData = async () => {
        const body = await fetch(`${apiUrl}/api/dish_menu/list`)
            .then(res => res.json());
        setDishes(body);

        console.log(body)

    };

    const createNewDish = async () => {
        const name = document.getElementById("newDishName").value.trim();
        const category = document.getElementById("newDishCategory").value.trim();
        const price = document.getElementById("newDishPrice").value;
        const img = document.getElementById("newDishImg").value;
        const descript = document.getElementById("newDishDescript").value;

        if (!name || !category || !price) {
            alert("Vui lòng nhập thông tin cần thiết!");
            return;
        }

        const payload = { name, category, price, img, descript };

        try {
            const res = await fetch(`${apiUrl}/api/dish_menu/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(payload),
            });
            fetchAllData()
            const data = await res.json();
            alert(`${res.status}: ${data.message}`)
        } catch (err) {
            console.error(err);
            alert("Lỗi đường truyền");
        }
    }

    const sendEditDish = async () => {
        const payload = {
            id: editDish._id,
            name: document.getElementById("editFormDishName").value,
            category: document.getElementById("editFormCategory").value,
            price: document.getElementById("editFormPrice").value,
            img: document.getElementById("editFormImg").value,
            status: document.getElementById("editFormStatus").value,
            desc: document.getElementById("editFormDesc").value
        };

        try {
            const res = await fetch(`${apiUrl}/api/dish_menu/edit`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(payload),
            });
            fetchAllData()
            const data = await res.json();
            alert(`${res.status}: ${data.message}`)
            setEditDish(null)
        } catch (err) {
            console.error(err);
            alert("Lỗi đường truyền");
        }
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/dish_menu/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ id: deleteDish._id }),
            });
            fetchAllData()
            const data = await res.json();
            alert(`${res.status}: ${data.message}`)
            setDeleteDish(null) // đóng cửa sổ pop up
        } catch (err) {
            console.error(err);
            alert("Lỗi đường truyền");
        }
    };

    return (
        <div className="w-full p-6 grid grid-cols-1 lg:grid-cols-4 gap-2">
            {/* LEFT */}
            <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold">Danh sách các món ăn</h2>
                <div className="p-4">
                    {/* Bộ lọc + nút refresh */}
                    <div className="flex items-center gap-2 mb-2">
                        <Input placeholder="Lọc theo tên món..."
                            className="w-40"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                        <Select value={filterCategory} onValueChange={setFilterCategory} >
                            <SelectTrigger className="w-50">
                                <SelectValue placeholder="Lọc theo phân loại" />
                            </SelectTrigger>
                            <SelectContent className="z-50 bg-white">
                                <SelectItem value=" ">Tất cả loại</SelectItem>
                                <SelectItem value="Món khai vị">Món khai vị</SelectItem>
                                <SelectItem value="Món chính">Món chính</SelectItem>
                                <SelectItem value="Món súp">Món súp</SelectItem>
                                <SelectItem value="Món tráng miệng">Món tráng miệng</SelectItem>
                                <SelectItem value="Đồ uống">Đồ uống</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterStatus} onValueChange={setFilterStatus} >
                            <SelectTrigger className="w-50">
                                <SelectValue placeholder="Lọc theo trạng thái" />
                            </SelectTrigger>
                            <SelectContent className="z-50 bg-white">
                                <SelectItem value=" ">Tất cả</SelectItem>
                                <SelectItem value="Đang phục vụ">Đang phục vụ</SelectItem>
                                <SelectItem value="Dừng phục vụ">Dừng phục vụ</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => fetchAllData()}>Làm mới</Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                        Có {dishes.filter((d) => d.name.toLowerCase().includes(filterName.toLowerCase()) &&
                            d.category.includes(filterCategory) &&
                            d.status.includes(filterStatus)).length} món
                    </p>

                    <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                        {dishes.filter((d) => d.name.toLowerCase().includes(filterName.toLowerCase()) &&
                            d.category.includes(filterCategory) &&
                            d.status.includes(filterStatus)
                        ).map((dish) => {
                            return (
                                <Card key={dish._id} className="overflow-hidden">
                                    <img src={dish.image} alt={dish.name} className="h-32 object-cover" />
                                    <CardContent className="p-3 pt-2 flex flex-col h-[160px]">
                                        {/* HEADER */}
                                        <div className="space-y-1">
                                            {/* Tên món – chiếm không gian cố định */}
                                            <div
                                                className="font-medium text-sm leading-tight line-clamp-2 min-h-[1.8rem]"
                                                title={dish.name}
                                            >
                                                {dish.name}
                                            </div>

                                            {/* Trạng thái – dạng badge */}
                                            <span
                                                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-2 w-fit
                                                    ${dish.status === "Đang phục vụ"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {dish.status}
                                            </span>
                                        </div>

                                        {/* GIÁ */}
                                        <div className="text-sm text-muted-foreground mt-2">
                                            {dish.price.toLocaleString()}đ
                                        </div>

                                        {/* ACTIONS – luôn nằm dưới */}
                                        <div className="flex justify-between gap-2 mt-auto">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="bg-yellow-200 hover:bg-yellow-400 text-black"
                                                onClick={() => setEditDish(dish)}
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="flex-1 hover:bg-red-600"
                                                onClick={() => setDeleteDish(dish)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Popup Edit */}
                    <Dialog className="bg-black/10" open={!!editDish} onOpenChange={() => setEditDish(null)}>
                        <DialogContent className="z-50 bg-white">                            <DialogHeader>
                            <DialogTitle>Chỉnh sửa thông tin món ăn</DialogTitle>
                        </DialogHeader>
                            {editDish && (
                                <div className="space-y-2 text-sm grid grid-cols-2 items-center">
                                    <label>Tên món:</label>
                                    <Input id="editFormDishName" defaultValue={editDish.name} />
                                    <label>Phân loại:</label>
                                    <select id="editFormCategory" defaultValue={editDish.category} className="block border rounded-xl p-2" >
                                        <option value="Món khai vị">Món khai vị</option>
                                        <option value="Món chính">Món chính</option>
                                        <option value="Món súp">Món súp</option>
                                        <option value="Món tráng miệng">Món tráng miệng</option>
                                        <option value="Đồ uống">Đồ uống</option>
                                    </select>
                                    <label htmlFor="editFormPrice">Giá:</label>
                                    <Input id="editFormPrice" type="number" defaultValue={editDish.price} />
                                    <label>Hình ảnh (URL):</label>
                                    <Input id="editFormImg" defaultValue={editDish.image} />
                                    <label htmlFor="editFormStatus">Trạng thái:</label>
                                    <select id="editFormStatus" defaultValue={editDish.status} className="block border rounded-xl p-2" >
                                        <option value="Đang phục vụ">Đang phục vụ</option>
                                        <option value="Dừng phục vụ">Dừng phục vụ</option>
                                    </select>
                                    <label>Mô tả:</label>
                                    <Input id="editFormDesc" defaultValue={editDish.description} />
                                    <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => sendEditDish()}>Lưu</Button>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Popup Delete */}
                    <Dialog className="bg-black/10" open={!!deleteDish} onOpenChange={() => setDeleteDish(null)}>
                        <DialogContent className="z-50 bg-white p-0 max-w-md rounded-2xl">
                            {/* Header */}
                            <DialogHeader className="px-6 pt-6">
                                <DialogTitle className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="w-5 h-5" />
                                    Xác nhận xóa món ăn
                                </DialogTitle>
                            </DialogHeader>

                            {/* Content */}
                            {deleteDish && (
                                <div className="px-6 py-4">
                                    {/* Warning box – giống layout chung */}
                                    <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
                                        <p className="text-sm text-red-800 font-semibold">
                                            ⚠️ Cảnh báo: Hành động này không thể hoàn tác
                                        </p>
                                    </div>

                                    {/* Info container */}
                                    <div className="bg-secondary-50 rounded-lg p-4 space-y-2 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-secondary-600">Tên món</span>
                                            <span className="font-semibold text-secondary-900">
                                                {deleteDish.name}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-secondary-600">Giá</span>
                                            <span className="font-semibold text-secondary-900">
                                                {deleteDish.price.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-secondary-700 mb-2">
                                        Bạn có chắc chắn muốn xóa món ăn này?
                                    </p>
                                </div>
                            )}

                            {/* Footer – button giữ nguyên vị trí */}
                            <div className="flex gap-3 px-6 pb-6 pt-2 border-t border-secondary-200 bg-secondary-50">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setDeleteDish(null)}
                                >
                                    Hủy
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={confirmDelete}
                                >
                                    Xóa món
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* RIGHT */}
            <Card className="p-6 h-[500px]">
                <h2 className="text-xl font-bold">Thông tin tạo món ăn mới</h2>
                <div className="flex flex-col gap-1 text-sm pt-4">
                    <label htmlFor="newDishName">Tên món:</label>
                    <input id="newDishName" type="text" className="border rounded-xl p-2" />

                    <label htmlFor="newDishCategory">Phân loại:</label>
                    <select id="newDishCategory" className="border rounded-xl p-2" >
                        <option value="Món khai vị">Món khai vị</option>
                        <option value="Món chính">Món chính</option>
                        <option value="Món súp">Món súp</option>
                        <option value="Món tráng miệng">Món tráng miệng</option>
                        <option value="Đồ uống">Đồ uống</option>
                    </select>

                    <label htmlFor="newDishPrice">Giá:</label>
                    <input id="newDishPrice" type="number" className="border rounded-xl p-2" />

                    <label htmlFor="newDishImg">Hình ảnh (URL):</label>
                    <input id="newDishImg" type="text" className="border rounded-xl p-2" />

                    <label htmlFor="newDishDescipt">Mô tả:</label>
                    <input id="newDishDescript" type="text" className="border rounded-xl p-2 " />
                    <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => createNewDish()}>Tạo</Button>
                </div>
            </Card>
        </div>
    );
}