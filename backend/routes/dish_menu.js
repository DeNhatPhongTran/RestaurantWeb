import express from 'express'
import Menu_item from "../database/schema/menu_item_schema.js";
import Category from "../database/schema/category_schema.js"

const router = express.Router()

router.get("/list", async (req, res) => {
    try {
        //const list = await Menu_item.find().populate("category", "category_name");
        const list = await Menu_item.find()
        res.status(200).json(list);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Lỗi phía server" });
    }
});

router.post("/edit", async (req, res) => {
    try {
        const {id, name, category, price, img, status, desc} = req.body;
        const updatedDish = await Menu_item.findByIdAndUpdate(
            id,
            {
                name,
                category,
                price,
                image: img,
                status,
                description: desc,
            },
            { new: true } // trả về document sau khi update
        );

        if (!updatedDish) {
            return res.status(404).json({ message: "Không tìm thấy món cần sửa" });
        }

        res.status(200).json({ message: "Cập nhật món thành công", data: updatedDish });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi phía server" });
    }
});

router.post("/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const deletedDish = await Menu_item.findByIdAndDelete(id);

        if (!deletedDish) {
            return res.status(404).json({ message: "Không tìm thấy món cần xóa" });
        }
        
        res.status(200).json({ message: "Xóa món thành công" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Lỗi phía server" });
    }
});

router.post("/create", async (req, res) => {
    try {
        const {name, category, price, img, descript} = req.body
        const newDish = await Menu_item.create({
            name,
            category,
            price,
            image: img,
            description: descript
        });
        res.status(201).json({ message: "Tạo món mới thành công", data: newDish });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Lỗi phía server" });
    }
})

export default router