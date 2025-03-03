import { AreaChart } from "@tremor/react";

function valueFormatter(number) {
    const formatter = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
        notation: "compact",
        compactDisplay: "short",
    });
    return formatter.format(number);
}

const data = [
    {
        date: "Jan 23",
        Balance: 38560,
    },
    {
        date: "Feb 23",
        Balance: 40320,
    },
    {
        date: "Mar 23",
        Balance: 50233,
    },
    {
        date: "Apr 23",
        Balance: 55123,
    },
    {
        date: "May 23",
        Balance: 56000,
    },
    {
        date: "Jun 23",
        Balance: 100000,
    },
    {
        date: "Jul 23",
        Balance: 85390,
    },
    {
        date: "Aug 23",
        Balance: 80100,
    },
    {
        date: "Sep 23",
        Balance: 75090,
    },
    {
        date: "Oct 23",
        Balance: 71080,
    },
    {
        date: "Nov 23",
        Balance: 68041,
    },
    {
        date: "Dec 23",
        Balance: 60143,
    },
];

// Custom colors for the chart
const customColors = {
    Balance: "white",
};

export default function AnalyticsTab() {
    return (
        <>
            <div className="p-0 sm:mx-auto sm:w-full bg-transparent border border-white/10 rounded-xl">
                <div className="p-0">
                    <div className="p-6">
                        <p className="text-white/60 text-sm">Balance</p>
                        <p className="text-2xl font-semibold text-white">$60,143</p>
                    </div>
                    <AreaChart
                        data={data}
                        index="date"
                        categories={["Balance"]}
                        colors={customColors}
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
                    <AreaChart
                        data={data}
                        index="date"
                        categories={["Balance"]}
                        colors={customColors}
                        showLegend={false}
                        showGradient={true}
                        gradientFromColor="rgba(255, 255, 255, 0.2)"
                        gradientToColor="rgba(255, 255, 255, 0.05)"
                        showYAxis={false}
                        showXAxis={false}
                        startEndOnly={true}
                        valueFormatter={valueFormatter}
                        showAnimation={true}
                        showDataPoints={true}
                        curveType="monotone"
                        showGridLines={false}
                        className="mt-8 h-48 sm:hidden [&_circle]:!opacity-100 [&_circle]:!r-2 [&_path.area-line]:!stroke-green-500 [&_path.area-line]:!stroke-[1px] [&_text]:!text-white/60 [&_line]:!hidden"
                    />
                </div>
            </div>
        </>
    );
}