import { AreaChart, DonutChart, BarChart } from "@tremor/react";
import axios from "axios";
import { useEffect, useState } from "react";
import url from "../../constants/url"
import { Spin } from 'antd';
// TrafficSources Component
function TrafficSources({ eventId }) {
    const [visitData, setVisitData] = useState("");

    useEffect(() => {
        const fetchVisitData = async () => {
            try {
                const response = await fetch(`${url}/visit/get-visit/${eventId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch visit data");
                }
                const data = await response.json();
                setVisitData(data.data?.count);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchVisitData();
    }, [eventId]);

    const trafficData = [
        { name: "Direct", amount: Number(visitData), share: "27.0%", color: "bg-cyan-500" },
        // {
        //     name: "Social Media",
        //     amount: 2000,
        //     share: "36.0%",
        //     color: "bg-blue-500",
        // },
        // { name: "Search", amount: 1200, share: "21.6%", color: "bg-indigo-500" },
        // { name: "Referrals", amount: 858, share: "15.4%", color: "bg-violet-500" },
    ];

    const currencyFormatter = (number) =>
        Intl.NumberFormat("us").format(number).toString();

    return (
        <div className="w-full bg-transparent border border-white/10 rounded-xl">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10">
                Traffic Sources
            </h3>
            <div className="flex flex-wrap gap-4 p-4">
                {trafficData.map((item) => (
                    <div
                        key={item.name}
                        className="flex items-center space-x-2 px-3 py-1 border border-white/20 rounded-full"
                    >
                        <span
                            className={`${item.color} w-2 h-2 rounded-full`}
                            aria-hidden="true"
                        />
                        <span className="text-white text-sm">{item.name}</span>
                    </div>
                ))}
            </div>
            <div className="relative mt-8">
                <DonutChart
                    className="mt-8"
                    data={trafficData}
                    category="amount"
                    index="name"
                    valueFormatter={currencyFormatter}
                    showTooltip={true}
                    colors={["cyan", "blue", "indigo", "violet"]}
                    showLabel={false}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-semibold text-white">
                        {trafficData.reduce((acc, item) => acc + item.amount, 0)}
                    </p>
                    <p className="text-sm text-gray-400">Total visits</p>
                </div>
            </div>
        </div>
    );
}

// TicketSales Component
function TicketSales({ eventId }) {
    const [remain, setRemain] = useState([])

    const fetchRemainEvent = async (id) => {
        try {
            const response = await axios.get(`${url}/remain-tickets/${eventId}`);
            if (response.data) {
                setRemain(response.data);
            }
        } catch (error) {
            console.error("Error fetching remain events:", error);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchRemainEvent();
        }
    }, [eventId]);

    const totalSales = remain.reduce((acc, item) => acc + item.tickets_sold, 0);

    return (
        <div className="w-full bg-transparent border border-white/10 rounded-xl pb-5">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10">
                Ticket Sales
            </h3>
            <div className="flex flex-wrap gap-4 p-4">
                {remain.map((item) => (
                    <div
                        key={item.name}
                        className="flex items-center space-x-2 px-3 py-1 border border-white/20 rounded-full"
                    >
                        <span className="text-white text-sm">{item.ticket_name}</span>
                        <span className="text-white text-sm">{item.tickets_sold}</span>
                    </div>
                ))}
            </div>
            <div className="relative mt-8">
                <DonutChart
                    className="mt-8"
                    data={remain}
                    category="tickets_sold"
                    index="ticket_name"
                    valueFormatter={(number) => Intl.NumberFormat("us").format(number)}
                    showTooltip={true}
                    colors={["cyan", "blue", "indigo", "violet"]}
                    showLabel={false}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-semibold text-white">
                        {totalSales.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">Total sales</p>
                </div>
            </div>
        </div>
    );
}

// PurchaseActivity Component
function PurchaseActivity() {
    const purchaseData = [
        { day: "Mon", purchases: 150 },
        { day: "Tue", purchases: 300 },
        { day: "Wed", purchases: 450 },
        { day: "Thu", purchases: 320 },
        { day: "Fri", purchases: 280 },
        { day: "Sat", purchases: 350 },
        { day: "Sun", purchases: 200 },
    ];

    return (
        <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10">
                Purchase Activity
            </h3>
            <BarChart
                data={purchaseData}
                index="day"
                categories={["purchases"]}
                colors={["cyan"]}
                showTooltip={true}
                yAxisWidth={40}
                className="mt-8 hidden sm:block"
            />
            <BarChart
                data={purchaseData}
                index="day"
                categories={["purchases"]}
                colors={["cyan"]}
                showTooltip={true}
                showYAxis={false}
                className="mt-4 sm:hidden"
            />
        </div>
    );
}

// ConversionFunnel Component
function ConversionFunnel() {
    const funnelData = [
        {
            stage: "Page views",
            percentage: 100,
            count: 2489,
            color: "#0E292F",
            borderColor: "#34B2DA1A",
        },
        {
            stage: "Added to cart",
            percentage: 54,
            count: 1344,
            color: "#36141B",
            borderColor: "#F43F5E1A",
        },
        {
            stage: "Purchased",
            percentage: 4.2,
            count: 36,
            color: "#281934",
            borderColor: "#A855F71A",
        },
    ];

    return (
        <div className="w-full bg-transparent border border-white/10 rounded-xl">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10">
                Conversion Funnel
            </h3>
            <div className="p-4">
                {funnelData.map((item) => {
                    const textWidth = `${Math.max(item.percentage, 20)}%`;

                    return (
                        <div key={item.stage} className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white/70 text-sm">{item.stage}</span>
                            </div>
                            <div
                                style={{
                                    backgroundColor: item.color,
                                    width: textWidth,
                                    borderWidth: 1,
                                    borderColor: item.borderColor,
                                }}
                                className="h-8 rounded-md flex items-center justify-between px-2 text-white/70 text-sm"
                            >
                                <span>{item.percentage}%</span>
                                <span>{item.count}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Sample data for daily and weekly
const dailyData = [
    { date: "Mon", Balance: 1000 },
    { date: "Tue", Balance: 1500 },
    { date: "Wed", Balance: 1200 },
    { date: "Thu", Balance: 1800 },
    { date: "Fri", Balance: 1600 },
    { date: "Sat", Balance: 2000 },
    { date: "Sun", Balance: 1700 },
];

const weeklyData = [
    { date: "Week 1", Balance: 7000 },
    { date: "Week 2", Balance: 7500 },
    { date: "Week 3", Balance: 7200 },
    { date: "Week 4", Balance: 7800 },
];

function BalanceChart({ eventId }) {
    const [activeTab, setActiveTab] = useState("Daily");
    const [book, setBook] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dailyData, setDailyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);

    const fetchBook = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/get-event-payment-list/${eventId}`);
            setBook(response.data);
            processData(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBook();
    }, [eventId]);

    const processData = (bookings) => {
        let dailyMap = {};
        let weeklyMap = {};
        let total = 0;

        bookings.forEach((payout) => {
            if (!payout.transaction_id) return;

            const date = new Date(payout.date);
            const day = date.toLocaleDateString("en-US", { weekday: "short" });
            const week = `Week ${Math.ceil(date.getDate() / 7)}`;

            const payoutAmount =
                (payout.tickets?.price * payout.count) +
                (payout.tax ? parseFloat(payout.tax || 0) / 100 : 0);

            total += payoutAmount;
            dailyMap[day] = (dailyMap[day] || 0) + payoutAmount;
            weeklyMap[week] = (weeklyMap[week] || 0) + payoutAmount;
        });
        setDailyData(Object.entries(dailyMap).map(([date, Balance]) => ({ date, Balance })));
        setWeeklyData(Object.entries(weeklyMap).map(([date, Balance]) => ({ date, Balance })));

        setTotalAmount(total);
    };

    const data = activeTab === "Daily" ? dailyData : weeklyData;

    const customColors = { Balance: "white" };

    const valueFormatter = (number) => {
        return new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 0,
            notation: "compact",
            compactDisplay: "short",
        }).format(number);
    };

    return (
        <div className="p-0 sm:mx-auto sm:w-full bg-transparent border border-white/10 rounded-xl">
            <div className="p-0">
                <div className="p-6 flex flex-col md:flex-row gap-3 items-center justify-between">
                    <div className="flex flex-col items-start">
                        <p className="text-white/60 text-sm">Balance</p>
                        <p className="text-2xl font-semibold text-white">
                            {loading ? <Spin size="small" className="ml-5" /> : `$${totalAmount.toLocaleString()}`}
                        </p>
                    </div>
                    <div className="flex space-x-2 mb-4 bg-[#0F0F0F] rounded-full w-fit border border-white/10 p-2">
                        <button
                            onClick={() => setActiveTab("Daily")}
                            className={`px-4 py-2 h-8 flex text-sm items-center border justify-center rounded-full ${activeTab === "Daily"
                                ? "bg-white/[0.03] text-white border-white/[0.03]"
                                : "border-transparent"
                                }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setActiveTab("Weekly")}
                            className={`px-4 py-2 h-8 flex text-sm items-center border justify-center rounded-full ${activeTab === "Weekly"
                                ? "bg-white/[0.03] text-white border-white/[0.03]"
                                : "border-transparent"
                                }`}
                        >
                            Weekly
                        </button>
                    </div>
                </div>
                <AreaChart
                    data={data}
                    index="date"
                    categories={["Balance"]}
                    colors={{ Balance: "white" }}
                    showLegend={false}
                    showGradient={true}
                    gradientFromColor="rgba(255, 255, 255, 0.2)"
                    gradientToColor="rgba(255, 255, 255, 0.05)"
                    yAxisWidth={45}
                    valueFormatter={valueFormatter}
                    showAnimation={true}
                    showDataPoints={true}
                    curveType="monotone"
                    showGridLines={false}
                    showXAxis={false}
                    showYAxis={false}
                    className="mt-8 hidden h-60 sm:block [&_circle]:!opacity-100 [&_circle]:!r-2 [&_path.area-line]:!stroke-green-500 [&_path.area-line]:!stroke-[1px] [&_text]:!text-white/60 [&_line]:!hidden"
                />
            </div>
        </div>
    );
}

// Main AnalyticsTab Component
export default function AnalyticsTab({ eventId }) {
    return (
        <div className="grid gap-5">
            <BalanceChart eventId={eventId} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TrafficSources eventId={eventId} />
                <TicketSales eventId={eventId} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ConversionFunnel />
                <PurchaseActivity />
            </div>
        </div>
    );
}