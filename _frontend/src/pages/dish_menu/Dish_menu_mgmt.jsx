import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Reservation_mgmt() {
    const [dishes, setDishes] = useState([]);
    const [filter, setFilter] = useState("");
    const [editDish, setEditDish] = useState(null);
    const [deleteDish, setDeleteDish] = useState(null);

    // Auto refresh khi load lần đầu
    useEffect(() => {
        console.log("Log: Refresh lần đầu")
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        const body = await fetch("/api/menu/list")
            .then(res => res.json());
        /*const body = [
            {
                "_id": {
                    "$oid": "6943cd4fcc4a5b3f1dbd1f21"
                },
                "category": {
                    "$oid": "6943cd4fcc4a5b3f1dbd1f05"
                },
                "name": "Bánh sừng bò",
                "price": 30000,
                "image": "https://cdn.pixabay.com/photo/2014/12/15/13/40/croissants-569074_1280.jpg",
                "status": "available",
                "description": "Bánh sừng bò nướng mềm, thơm bơ.",
            },
            {
                "_id": "69442eec705c858414b34e59",
                "category": "69442eec705c858414b34e3b",
                "name": "Gà rán giòn",
                "price": 39000,
                "image": "https://cdn.pixabay.com/photo/2019/09/26/18/23/republic-of-korea-4506696_1280.jpg",
                "status": "available",
                "description": "Gà chiên giòn, vàng đều.",
                "__v": 0
            },
        ]*/
        setDishes(body);
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
            const res = await fetch("/api/menu/create", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            fetchAllData()
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
            desc: document.getElementById("editFormDesc").value
        };

        try {
            const res = await fetch("/api/menu/edit", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            fetchAllData()
            alert(`${res.status}: ${data.message}`)
            setEditDish(null)
        } catch (err) {
            console.error(err);
            alert("Lỗi đường truyền");
        }
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch("/api/menu/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ id: deleteDish._id }),
            });
            const data = await res.json();
            fetchAllData()
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
                    <div className="flex items-center gap-2 mb-4">
                        <Input
                            placeholder="Lọc theo tên..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <Button onClick={() => fetchAllData()}>Làm mới</Button>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {dishes.filter((d) => d.name.toLowerCase().includes(filter.toLowerCase()))
                            .map((dish) => {
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
                                <div className="space-y-2 text-sm">
                                    <label>Tên món</label>
                                    <Input id="editFormDishName" defaultValue={editDish.name} />
                                    <label>Phân loại</label>
                                    <Input id="editFormCategory" defaultValue={editDish.category} />
                                    <label>Giá</label>
                                    <Input id="editFormPrice" defaultValue={editDish.price} />
                                    <label>Hình ảnh (URL)</label>
                                    <Input id="editFormImg" defaultValue={editDish.image} />
                                    <label>Mô tả</label>
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
            <Card className="p-6">
                <h2 className="text-xl font-bold">Thông tin tạo món ăn mới</h2>
                <div className="flex flex-col gap-1 text-sm">
                    <label htmlFor="newName">Tên món:</label>
                    <input id="newDishName" type="text" className="border rounded-xl p-2" />

                    <label htmlFor="newDishCategory">Phân loại:</label>
                    <input id="newDishCategory" type="text" className="border rounded-xl p-2" />

                    <label htmlFor="newDishPrice">Giá:</label>
                    <input id="newDishPrice" type="number" className="border rounded-xl p-2" />

                    <label htmlFor="newDishImg">Hình ảnh (URL):</label>
                    <input id="newDishImg" type="text" className="border rounded-xl p-2" />

                    <label htmlFor="newDishDescipt">Mô tả:</label>
                    <input id="newDishDescript" type="text" className="border rounded-xl p-2" />
                    <Button onClick={() => createNewDish()}>Tạo</Button>
                </div>
            </Card>
        </div>
    );
}
