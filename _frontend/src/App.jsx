import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dish_menu_mgmt from './pages/dish_menu/Dish_menu_mgmt';
import Reservation_mgmt from './pages/reservation/Reservation_mgmt';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"


export default function App() {
    return (
        <BrowserRouter>
            <div>
                <h1>Restaurant Web Frontend</h1>
                <p>Welcome to Restaurant Management System</p>
            </div>

            <NavigationMenu className="bg-gray-800 text-white px-3 py-1">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/dish_menu_mgmt">Quản lý thực đơn</NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink href="/reservations_mgmt">Quản lý đặt bàn</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <Routes>
                <Route path="/dish_menu_mgmt" element={<Dish_menu_mgmt />} />
                <Route path="/reservations_mgmt" element={<Reservation_mgmt />} />
            </Routes>
        </BrowserRouter>
    )
}
