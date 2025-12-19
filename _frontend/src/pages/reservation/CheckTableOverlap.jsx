import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckTableOverlap() {
    const [fromDate, setFromDate] = useState("");
    const [fromTime, setFromTime] = useState("");
    const [toDate, setToDate] = useState("");
    const [toTime, setToTime] = useState("");

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);

    const combineDateTime = (dateStr, timeStr) => {
        const [year, month, day] = dateStr.split("-");
        const [hour, minute] = timeStr.split(":");

        return new Date(year, month - 1, // month bắt đầu từ 0
            day, hour, minute);
    };

    const handleCheck = async () => {
        if (!fromDate || !fromTime || !toDate || !toTime) {
            alert("Vui lòng chọn đầy đủ From / To");
            return;
        }

        const from = combineDateTime(fromDate, fromTime) //`${fromDate}T${fromTime}:00`;
        const to = combineDateTime(toDate, toTime) //`${toDate}T${toTime}:00`;

        setLoading(true);

        try {
            const res = await fetch("/api/reservations/overlap_check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ from, to }) // string
            });

            const data = await res.json();
            setTables(data.availableTables || []);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi gọi API");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-4">
            <CardContent className="space-y-4 p-6 pt-1 items-center">
                <h2 className="text-xl font-bold">Kiểm tra bàn trống</h2>

                {/* FROM */}
                <div className="grid grid-cols-3 gap-1 pr-40">
                    <p>Thời gian bắt đầu: </p>
                    <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                    <Input type="time" value={fromTime} onChange={e => setFromTime(e.target.value)} />
                </div>

                {/* TO */}
                <div className="grid grid-cols-3 gap-1 pr-40">
                    <p>Thời gian kết thúc: </p>
                    <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                    <Input type="time" value={toTime} onChange={e => setToTime(e.target.value)} />
                </div>

                <Button onClick={handleCheck} disabled={loading}>
                    {loading ? "Đang kiểm tra..." : "Hiển thị bàn chưa đặt"}
                </Button>

                {/* RESULT */}
                <div className="grid grid-cols-3 gap-2">
                    {tables.length === 0 && !loading && (
                        <p className="text-sm text-muted-foreground col-span-3">
                            Không có bàn trống
                        </p>
                    )}

                    {tables.map(table => (
                        <div
                            key={table._id}
                            className="flex justify-between border rounded-lg p-3"
                        >
                            <span>Bàn {table.name} - {table.capacity} người</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
