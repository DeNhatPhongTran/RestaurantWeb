import React, { useEffect, useState } from "react";
import { useApi } from "@/context/ApiContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
                            <SelectContent>
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
                            <SelectContent>
                                <SelectItem value="Đang phục vụ">Đang phục vụ</SelectItem>
                                <SelectItem value="Dừng phục vụ">Dừng phục vụ</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => fetchAllData()}>Làm mới</Button>
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
                                    <CardContent className="p-3 pt-0">
                                        <div className="font-medium">{dish.name}</div>
                                        <div>({dish.status})</div>
                                        <div className="text-sm text-muted-foreground">
                                            {dish.price.toLocaleString()}đ
                                        </div>
                                        <div className="flex justify-between">
                                            <Button size="sm" variant="outline"
                                                onClick={() => setEditDish(dish)}
                                            >Sửa</Button>
                                            <Button size="sm" variant="destructive"
                                                onClick={() => setDeleteDish(dish)}
                                            >Xóa</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Popup Edit */}
                    <Dialog open={!!editDish} onOpenChange={() => setEditDish(null)}>
                        <DialogContent>
                            <DialogHeader>
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
                                    <Button onClick={() => sendEditDish()}>Lưu</Button>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Popup Delete */}
                    <Dialog open={!!deleteDish} onOpenChange={() => setDeleteDish(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Xác nhận xóa</DialogTitle>
                            </DialogHeader>
                            {deleteDish && (
                                <div className="space-y-2">
                                    <p>Bạn có chắc muốn xóa món ăn này?</p>
                                    <p><strong>{deleteDish.name}</strong> - {deleteDish.price}đ</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setDeleteDish(null)}>Hủy</Button>
                                        <Button variant="destructive" onClick={() => confirmDelete()}>Xóa</Button>
                                    </div>
                                </div>
                            )}
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