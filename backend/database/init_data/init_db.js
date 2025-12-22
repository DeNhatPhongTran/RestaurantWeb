// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Role from "../schema/role_schema.js";
import Category from "../schema/category_schema.js";
import User from "../schema/user_schema.js";
import MenuItem from "../schema/menu_item_schema.js";
import Table from "../schema/table_schema.js";
import Reservation from "../schema/reservation_schema.js";
import OrderItem from "../schema/order_item_schema.js";
import Invoice from "../schema/invoice_schema.js";
import LeaveRequest from "../schema/leave_request_schema.js";
import Reservation_Table from "../schema/reservation_table_schema.js";

export async function add_init() {
    // 1. Roles
    const roleNames = ["manager", "waiter", "chef", "cashier"];
    const roleMap = {};
    for (let r of roleNames) {
        const exists = await Role.findOne({ role_name: r });
        if (!exists) {
            const role = await Role.create({ role_name: r });
            console.log(`Role ${r} added`);
            roleMap[r] = role._id;
        } else {
            roleMap[r] = exists._id;
            console.log(`Role ${r} already exists, Role ID: ${exists._id}`);

        }
    }

    // 2. Categories
    const categoryNames = ["Món khai vị", "Món súp", "Món chính", "Món tráng miệng", "Đồ uống"];
    const categoryMap = {};
    for (let c of categoryNames) {
        let cat = await Category.findOne({ category_name: c });
        if (!cat) {
            cat = await Category.create({ category_name: c });
            console.log(`Category ${c} added`);
        }
        //categoryMap[c] = cat._id;
    }

    // 3. Users (with roles)
    const usersData = [
        { fullname: "Manager One", username: "manager1", password_hash: "123", role: roleMap.manager, phone: "0123456789" },
        { fullname: "Waiter One", username: "waiter1", password_hash: "123", role: roleMap.waiter, phone: "0987654321" },
        { fullname: "Chef One", username: "chef1", password_hash: "123", role: roleMap.chef, phone: "0912345678" },
        { fullname: "Cashier One", username: "cashier1", password_hash: "123", role: roleMap.cashier, phone: "0918765432" }
    ];
    const userMap = {};
    for (let userData of usersData) {
        const exists = await User.findOne({ username: userData.username });
        if (!exists) {
            const user = await User.create(userData);
            console.log(`User ${userData.username} added`);
            userMap[userData.username] = user._id;
        } else {
            userMap[userData.username] = exists._id;
        }
    }

    // 4. Menu Items
    const menuItems = [
        // =======================
        // Appetizers
        // =======================
        { category: "Món khai vị", name: 'Bánh sừng bò', price: 30000, image: 'https://cdn.pixabay.com/photo/2014/12/15/13/40/croissants-569074_1280.jpg', status: 'Đang phục vụ', description: 'Bánh sừng bò nướng mềm, thơm bơ.' },
        { category: "Món khai vị", name: 'Gà rán giòn', price: 39000, image: 'https://cdn.pixabay.com/photo/2019/09/26/18/23/republic-of-korea-4506696_1280.jpg', status: 'Đang phục vụ', description: 'Gà chiên giòn, vàng đều.' },
        { category: "Món khai vị", name: 'Gỏi cuốn', price: 35000, image: 'https://cdn.pixabay.com/photo/2018/03/15/12/16/food-3228057_1280.jpg', status: 'Đang phục vụ', description: 'Gỏi cuốn tươi với tôm thịt và rau sống.' },
        { category: "Món khai vị", name: 'Hoành thánh chiên', price: 42000, image: 'https://cdn.pixabay.com/photo/2022/02/06/07/00/wontons-6996379_1280.jpg', status: 'Đang phục vụ', description: 'Hoành thánh chiên giòn vàng.' },
        { category: "Món khai vị", name: 'Bánh mì bơ tỏi', price: 30000, image: 'https://cdn.pixabay.com/photo/2014/10/09/10/53/bread-481530_1280.jpg', status: 'Đang phục vụ', description: 'Bánh mì nướng bơ tỏi thơm.' },
        { category: "Món khai vị", name: 'Đậu hũ chiên', price: 28000, image: 'https://cdn.pixabay.com/photo/2018/02/20/08/17/meals-3167100_1280.jpg', status: 'Đang phục vụ', description: 'Đậu hũ chiên giòn ăn kèm nước tương.' },
        { category: "Món khai vị", name: 'Tôm tempura chiên', price: 55000, image: 'https://cdn.pixabay.com/photo/2019/11/25/15/24/fry-4652305_1280.jpg', status: 'Đang phục vụ', description: 'Tôm tẩm bột chiên kiểu Nhật.' },
        { category: "Món khai vị", name: 'Khoai tây chiên múi cau', price: 32000, image: 'https://cdn.pixabay.com/photo/2021/10/11/13/47/potatoes-6700762_1280.jpg', status: 'Đang phục vụ', description: 'Khoai tây múi cau chiên giòn.' },
        { category: "Món khai vị", name: 'Salad trộn rau củ', price: 40000, image: 'https://cdn.pixabay.com/photo/2021/12/20/20/07/salad-6883857_1280.jpg', status: 'Dừng phục vụ', description: 'Salad rau trộn dầu giấm.' },

        // =======================
        // Soups
        // =======================
        { category: "Món súp", name: 'Súp Gà Nấm', price: 45000, image: 'https://cdn.pixabay.com/photo/2017/07/16/08/26/chicken-2508631_1280.jpg', status: 'Đang phục vụ', description: 'Súp gà nấu cùng nấm, thơm và bổ dưỡng.' },
        { category: "Món súp", name: 'Súp Bí Đỏ', price: 42000, image: 'https://cdn.pixabay.com/photo/2020/09/26/20/37/soup-5605053_1280.jpg', status: 'Đang phục vụ', description: 'Súp bí đỏ mịn, béo ngọt.' },
        { category: "Món súp", name: 'Súp Cà Chua Húng Quế', price: 39000, image: 'https://cdn.pixabay.com/photo/2023/05/27/13/49/soup-8021570_1280.jpg', status: 'Đang phục vụ', description: 'Súp cà chua thơm ngon với húng quế.' },
        { category: "Món súp", name: 'Súp Miso', price: 50000, image: 'https://cdn.pixabay.com/photo/2015/05/02/01/04/miso-soup-749368_1280.jpg', status: 'Đang phục vụ', description: 'Súp miso kiểu Nhật thanh đạm.' },
        { category: "Món súp", name: 'Súp Rau Củ', price: 35000, image: 'https://cdn.pixabay.com/photo/2020/06/02/12/20/soup-5250765_1280.jpg', status: 'Đang phục vụ', description: 'Súp rau củ thanh đạm, dễ ăn.' },

        // =======================
        // Main Dishes
        // =======================
        { category: "Món chính", name: 'Cơm Gà Hải Nam', price: 55000, image: 'https://cdn.pixabay.com/photo/2022/12/29/01/01/food-7683985_1280.jpg', status: 'Đang phục vụ', description: 'Cơm gà hải nam mềm thơm.' },
        { category: "Món chính", name: 'Biryani', price: 80000, image: 'https://cdn.pixabay.com/photo/2023/10/19/11/18/biryani-8326234_1280.jpg', status: 'Đang phục vụ', description: 'Món cơm Biryani Ấn Độ với gia vị đặc trưng.' },
        { category: "Món chính", name: 'Cơm Gà Nướng', price: 60000, image: 'https://cdn.pixabay.com/photo/2021/05/31/01/10/fried-rice-6297407_1280.jpg', status: 'Đang phục vụ', description: 'Cơm ăn kèm gà nướng da giòn, thơm.' },
        { category: "Món chính", name: 'Bít tết Bò', price: 120000, image: 'https://cdn.tgdd.vn/Files/2021/07/29/1371693/steak-la-gi-cac-loai-steak-ngon-va-muc-do-chin-cua-steak-202107292106198896.jpg', status: 'Đang phục vụ', description: 'Bít tết bò chín vừa, mềm và thơm.' },
        { category: "Món chính", name: 'Sườn Heo Nướng BBQ', price: 95000, image: 'https://file.hstatic.net/1000389344/file/5872521803f74780b93a1df3d51bf2a3_c617cc1be7b7422891ff86aa2c575062_grande.jpg', status: 'Đang phục vụ', description: 'Sườn heo nướng BBQ thơm ngon, mềm.' },
        { category: "Món chính", name: 'Combo Sushi', price: 150000, image: 'https://cdn.pixabay.com/photo/2017/06/01/12/39/sushi-2363418_1280.jpg', status: 'Đang phục vụ', description: 'Combo sushi nhiều loại tươi ngon.' },
        { category: "Món chính", name: 'Burger Bò', price: 70000, image: 'https://cdn.pixabay.com/photo/2022/05/25/21/28/burger-7221436_1280.jpg', status: 'Đang phục vụ', description: 'Burger bò kẹp rau củ và phô mai.' },
        { category: "Món chính", name: 'Mì Xào Thái', price: 65000, image: 'https://cdn.tgdd.vn/2020/07/CookRecipe/Avatar/pad-thai-thumbnail.jpg', status: 'Đang phục vụ', description: 'Mì xào kiểu Thái thơm cay.' },
        { category: "Món chính", name: 'Gà Sốt Teriyaki', price: 80000, image: 'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_610,h_458/k%2FPhoto%2FRecipes%2F2024-05-chicken-teriyaki-190%2Fchicken-teriyaki-190-171-horizontal', status: 'Đang phục vụ', description: 'Gà nướng sốt Teriyaki kiểu Nhật.' },
        { category: "Món chính", name: 'Heo Quay Giòn', price: 90000, image: 'https://cdn.tgdd.vn/Files/2018/12/05/1135784/mach-ban-cach-lam-heo-quay-tai-nha-dam-bao-thanh-cong-ngay-tu-lan-dau-202103142112431113.jpg', status: 'Đang phục vụ', description: 'Heo quay da giòn, thịt mềm.' },
        { category: "Món chính", name: 'Bún Bò Huế', price: 70000, image: 'https://cdn.tgdd.vn/Files/2018/04/01/1078873/nau-bun-bo-hue-cuc-de-tai-nha-tu-vien-gia-vi-co-san-202109161718317187.jpg', status: 'Đang phục vụ', description: 'Bún bò Huế thơm ngon, đậm đà.' },
        { category: "Món chính", name: 'Ramen', price: 85000, image: 'https://cdn2.fptshop.com.vn/unsafe/800x0/ramen_06_2a02f84f53.jpg', status: 'Đang phục vụ', description: 'Mì Ramen Nhật Bản với nước dùng thanh ngọt.' },
        { category: "Món chính", name: 'Pizza', price: 120000, image: 'https://cdn.pixabay.com/photo/2016/02/16/07/39/pizza-1202775_1280.jpg', status: 'Đang phục vụ', description: 'Pizza nhiều loại topping tươi ngon.' },
        { category: "Món chính", name: 'Pierogy', price: 75000, image: 'https://icdn.dantri.com.vn/thumb_w/960/2018/4/2/photo-9-15226284975761689082985.jpg', status: 'Đang phục vụ', description: 'Pierogy kiểu Ba Lan nhân khoai tây và phô mai.' },
        { category: "Món chính", name: 'Shakshuka', price: 65000, image: 'https://icdn.dantri.com.vn/thumb_w/960/2018/4/2/photo-18-15226284979821050748844.jpg', status: 'Đang phục vụ', description: 'Shakshuka trứng sốt cà chua, cay nhẹ.' },
        { category: "Món chính", name: 'Chilaquiles', price: 70000, image: 'https://icdn.dantri.com.vn/thumb_w/960/2018/4/2/photo-4-1522628497881615465890.jpg', status: 'Dừng phục vụ', description: 'Chilaquiles món ăn sáng Mexico với sốt đỏ và phô mai.' },

        // =======================
        // Desserts
        // =======================
        { category: "Món tráng miệng", name: 'Bánh Chocolate', price: 50000, image: 'https://cdn.pixabay.com/photo/2022/08/15/16/18/cake-7388277_1280.jpg', status: 'Đang phục vụ', description: 'Bánh chocolate mềm, ngọt vừa.' },
        { category: "Món tráng miệng", name: 'Salad Trái Cây', price: 40000, image: 'https://cdn.pixabay.com/photo/2016/08/19/19/54/melon-1606061_640.jpg', status: 'Đang phục vụ', description: 'Salad trái cây tươi mát, nhiều vitamin.' },
        { category: "Món tráng miệng", name: 'Kem Vani', price: 35000, image: 'https://cdn.pixabay.com/photo/2015/02/10/16/23/ice-cream-631205_960_720.jpg', status: 'Đang phục vụ', description: 'Kem vani mát lạnh, thơm ngon.' },
        { category: "Món tráng miệng", name: 'Tiramisu', price: 55000, image: 'https://daotaobeptruong.vn/wp-content/uploads/2020/11/banh-tiramisu.jpg', status: 'Đang phục vụ', description: 'Bánh Tiramisu mềm, béo, thơm cà phê.' },

        // =======================
        // Drinks
        // =======================
        { category: "Đồ uống", name: 'Trà Chanh Đá', price: 25000, image: 'http://hocphachehanoi.com.vn/upload/userfiles/images/cach-lam-tra-chanh.jpg', status: 'Đang phục vụ', description: 'Trà chanh đá mát lạnh, chua nhẹ.' },
        { category: "Đồ uống", name: 'Trà Sữa', price: 30000, image: 'https://www.huongnghiepaau.com/wp-content/uploads/2020/06/mon-tra-sua-tran-chau.jpg', status: 'Đang phục vụ', description: 'Trà sữa trân châu béo ngọt.' },
        { category: "Đồ uống", name: 'Nước Cam Ép', price: 25000, image: 'https://cdn2.fptshop.com.vn/unsafe/1080x0/filters:format(webp):quality(75)/Nuoc_ep_cam_0ae1447a8f.jpg', status: 'Đang phục vụ', description: 'Nước cam ép tươi, thơm ngon.' }
    ];

    for (let item of menuItems) {
        const exists = await MenuItem.findOne({ name: item.name });
        if (!exists) {
            await MenuItem.create(item);
            console.log(`MenuItem ${item.name} added`);
        }
    }

    // 5. Tables
    const existingTables = await Table.countDocuments();
    if (existingTables === 0) {
        for (let i = 1; i <= 10; i++) {
            await Table.create({ name: `B${i}`, capacity: 4, currentStatus: "empty"/*, reservation: null*/ });
            console.log(`Table B${i} added`);
        }
        for (let i = 11; i <= 12; i++) {
            await Table.create({ name: `B${i}`, capacity: 6, currentStatus: "empty"/*, reservation: null*/ });
            console.log(`Table B${i} added`);
        }
        for (let i = 13; i <= 14; i++) {
            await Table.create({ name: `B${i}`, capacity: 8, currentStatus: "empty"/*, reservation: null*/ });
            console.log(`Table B${i} added`);
        }
    }

    // 6. Reservations, OrderItems, and Invoices
    const existingReservations = await Reservation.countDocuments();
    if (existingReservations === 0) {
        // Create first reservation
        const datetime_checkin1 = new Date();
        const reservation1 = await Reservation.create({
            customer_name: "John Doe",
            customer_phone: "0123456789",
            guest_count: 4,
            datetime_checkin: datetime_checkin1,
            datetime_out: new Date(datetime_checkin1.getTime() + 60 * 60 * 1000),
            status: "finished"
        });
        console.log("Sample reservation 1 added");
        const tableB1 = await Table.findOne({ name: "B1" });
        await Reservation_Table.create({
            reservationId: reservation1._id,
            tableId: tableB1._id
        });
        console.log("Table B1 assigned to reservation1");
        // Get tables and assign to reservation (1-N: 1 Reservation có nhiều Tables)
        /*const tables = await Table.find({ status: "empty" }).limit(2);
        if (tables.length > 0) {
            for (let table of tables) {
                await Table.updateOne({ _id: table._id }, { reservation: reservation._id, status: "serving" });
            }
            console.log(`${tables.length} table(s) assigned to reservation 1`);
        }*/

        // Create order items for the first reservation
        const menuItem = await MenuItem.findOne({ name: "Pad Thai" });
        if (menuItem) {
            await OrderItem.create({
                reservation: reservation1._id,
                item: menuItem._id,
                quantity: 2,
                note: "Less spicy",
                status: "cooked",
                price_at_time: menuItem.price
            });
            console.log("Sample order item 1 added");
        }

        // Create invoice for the first reservation (1-1: 1 Reservation có 1 Invoice)
        const cashier = userMap.cashier1;
        if (cashier) {
            await Invoice.create({
                reservation: reservation1._id,
                total_price: 25.98,
                payment_method: "cash",
                cashier: cashier
            });
            console.log("Sample invoice added");
        }

        // Create second reservation to show multiple reservations with different tables
        const datetime_checkin2 = new Date(Date.now() + 7200000) // 2 hour later res1
        const reservation2 = await Reservation.create({
            customer_name: "Jane Smith",
            customer_phone: "0987654322",
            guest_count: 2,
            datetime_checkin: datetime_checkin2,
            datetime_out: new Date(datetime_checkin2.getTime() + 60 * 60 * 1000),
            status: "confirmed"
        });
        console.log("Sample reservation 2 added");
        await Reservation_Table.create({
            reservationId: reservation2._id,
            tableId: tableB1._id
        });
        console.log("Table B1 assigned to reservation2");

        const datetime_checkin3 = new Date(Date.now() + 14400000) // 4 hour later res1
        const reservation3 = await Reservation.create({
            customer_name: "Tom",
            customer_phone: "0975310135",
            guest_count: 4,
            datetime_checkin: datetime_checkin3,
            datetime_out: new Date(datetime_checkin3.getTime() + 60 * 60 * 1000),
            status: "confirmed"
        });
        console.log("Sample reservation 3 added");
        const tableB3 = await Table.findOne({ name: "B3" });
        await Reservation_Table.create({
            reservationId: reservation3._id,
            tableId: tableB3._id
        });
        console.log("Table B3 assigned to reservation3");

        // Assign remaining empty table to second reservation
        /*const remainingTable = await Table.findOne({ status: "empty" });
        if (remainingTable) {
            await Table.updateOne({ _id: remainingTable._id }, { reservation: reservation2._id, status: "reserved" });
            console.log("Table assigned to reservation 2");
        }*/
    }

    // 7. LeaveRequests
    const existingLeaves = await LeaveRequest.countDocuments();
    if (existingLeaves === 0) {
        const waiter = userMap.waiter1;
        const manager = userMap.manager1;

        if (waiter) {
            // Create a leave request from waiter
            await LeaveRequest.create({
                user: waiter,
                leave_type: "nghi_phep",
                start_date: new Date("2025-12-01"),
                end_date: new Date("2025-12-03"),
                total_days: 3,
                reason: "Personal leave",
                status: "pending"
            });
            console.log("Sample leave request 1 added");

            // Create another leave request and approve it by manager
            if (manager) {
                await LeaveRequest.create({
                    user: waiter,
                    leave_type: "nghi_thuong",
                    start_date: new Date("2025-12-10"),
                    end_date: new Date("2025-12-10"),
                    total_days: 1,
                    reason: "Sick leave",
                    status: "approved",
                    approved_by: manager
                });
                console.log("Sample leave request 2 added (approved by manager)");
            }
        }
    }

    console.log("\n Database initialization completed successfully!");
    // await mongoose.disconnect();
    // process.exit(0);
}