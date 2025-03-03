import { AreaChart } from "@tremor/react";
import { DonutChart, BarChart } from "@tremor/react";

const trafficData = [
  { name: "Direct", amount: 1500, share: "27.0%", color: "bg-cyan-500" },
  { name: "Social Media", amount: 2000, share: "36.0%", color: "bg-blue-500" },
  { name: "Search", amount: 1200, share: "21.6%", color: "bg-indigo-500" },
  { name: "Referrals", amount: 858, share: "15.4%", color: "bg-violet-500" },
];

const currencyFormatter = (number) => {
  return Intl.NumberFormat("us").format(number).toString();
};

function TrafficSources() {
  return (
    <>
      <div className="w-full bg-transparent border border-white/10 rounded-xl">
        <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="14"
            viewBox="0 0 13 14"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.50072 3C3.50072 2.20435 3.81679 1.44129 4.3794 0.87868C4.94201 0.31607 5.70507 0 6.50072 0C7.29637 0 8.05943 0.31607 8.62204 0.87868C9.18465 1.44129 9.50072 2.20435 9.50072 3V4H10.1437C10.5155 4.00012 10.874 4.13829 11.1496 4.38773C11.4253 4.63717 11.5985 4.98009 11.6357 5.35L12.3357 12.35C12.3567 12.5586 12.3337 12.7693 12.2682 12.9685C12.2027 13.1677 12.0962 13.3509 11.9555 13.5064C11.8148 13.6619 11.6431 13.7862 11.4514 13.8712C11.2598 13.9562 11.0524 14.0001 10.8427 14H2.15772C1.94813 13.9999 1.74088 13.9559 1.54933 13.8709C1.35778 13.7858 1.18619 13.6615 1.04561 13.5061C0.905038 13.3506 0.798604 13.1674 0.733172 12.9683C0.66774 12.7692 0.644763 12.5585 0.665722 12.35L1.36572 5.35C1.4029 4.98009 1.57612 4.63717 1.85179 4.38773C2.12747 4.13829 2.48595 4.00012 2.85772 4H3.50072V3ZM8.00072 3V4H5.00072V3C5.00072 2.60218 5.15876 2.22064 5.44006 1.93934C5.72137 1.65804 6.1029 1.5 6.50072 1.5C6.89855 1.5 7.28008 1.65804 7.56138 1.93934C7.84269 2.22064 8.00072 2.60218 8.00072 3ZM5.00072 6.75C5.00072 6.55109 4.9217 6.36032 4.78105 6.21967C4.6404 6.07902 4.44963 6 4.25072 6C4.05181 6 3.86104 6.07902 3.72039 6.21967C3.57974 6.36032 3.50072 6.55109 3.50072 6.75V7.75C3.50072 8.54565 3.81679 9.30871 4.3794 9.87132C4.94201 10.4339 5.70507 10.75 6.50072 10.75C7.29637 10.75 8.05943 10.4339 8.62204 9.87132C9.18465 9.30871 9.50072 8.54565 9.50072 7.75V6.75C9.50072 6.55109 9.4217 6.36032 9.28105 6.21967C9.1404 6.07902 8.94963 6 8.75072 6C8.55181 6 8.36104 6.07902 8.22039 6.21967C8.07974 6.36032 8.00072 6.55109 8.00072 6.75V7.75C8.00072 8.14782 7.84269 8.52936 7.56138 8.81066C7.28008 9.09196 6.89855 9.25 6.50072 9.25C6.1029 9.25 5.72137 9.09196 5.44006 8.81066C5.15876 8.52936 5.00072 8.14782 5.00072 7.75V6.75Z"
              fill="white"
              fillOpacity="0.5"
            />
          </svg>
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
    </>
  );
}

const ticketData = [
  { name: "Regular", amount: 156, color: "bg-blue-500" },
  { name: "VIP", amount: 64, color: "bg-green-500" },
  { name: "Early Bird", amount: 24, color: "bg-orange-500" },
];

const totalSales = ticketData.reduce((acc, item) => acc + item.amount, 0);

function TicketSales() {
  return (
    <>
      <div className="w-full bg-transparent border border-white/10 rounded-xl pb-5">
        <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="14"
            viewBox="0 0 13 14"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.50072 3C3.50072 2.20435 3.81679 1.44129 4.3794 0.87868C4.94201 0.31607 5.70507 0 6.50072 0C7.29637 0 8.05943 0.31607 8.62204 0.87868C9.18465 1.44129 9.50072 2.20435 9.50072 3V4H10.1437C10.5155 4.00012 10.874 4.13829 11.1496 4.38773C11.4253 4.63717 11.5985 4.98009 11.6357 5.35L12.3357 12.35C12.3567 12.5586 12.3337 12.7693 12.2682 12.9685C12.2027 13.1677 12.0962 13.3509 11.9555 13.5064C11.8148 13.6619 11.6431 13.7862 11.4514 13.8712C11.2598 13.9562 11.0524 14.0001 10.8427 14H2.15772C1.94813 13.9999 1.74088 13.9559 1.54933 13.8709C1.35778 13.7858 1.18619 13.6615 1.04561 13.5061C0.905038 13.3506 0.798604 13.1674 0.733172 12.9683C0.66774 12.7692 0.644763 12.5585 0.665722 12.35L1.36572 5.35C1.4029 4.98009 1.57612 4.63717 1.85179 4.38773C2.12747 4.13829 2.48595 4.00012 2.85772 4H3.50072V3ZM8.00072 3V4H5.00072V3C5.00072 2.60218 5.15876 2.22064 5.44006 1.93934C5.72137 1.65804 6.1029 1.5 6.50072 1.5C6.89855 1.5 7.28008 1.65804 7.56138 1.93934C7.84269 2.22064 8.00072 2.60218 8.00072 3ZM5.00072 6.75C5.00072 6.55109 4.9217 6.36032 4.78105 6.21967C4.6404 6.07902 4.44963 6 4.25072 6C4.05181 6 3.86104 6.07902 3.72039 6.21967C3.57974 6.36032 3.50072 6.55109 3.50072 6.75V7.75C3.50072 8.54565 3.81679 9.30871 4.3794 9.87132C4.94201 10.4339 5.70507 10.75 6.50072 10.75C7.29637 10.75 8.05943 10.4339 8.62204 9.87132C9.18465 9.30871 9.50072 8.54565 9.50072 7.75V6.75C9.50072 6.55109 9.4217 6.36032 9.28105 6.21967C9.1404 6.07902 8.94963 6 8.75072 6C8.55181 6 8.36104 6.07902 8.22039 6.21967C8.07974 6.36032 8.00072 6.55109 8.00072 6.75V7.75C8.00072 8.14782 7.84269 8.52936 7.56138 8.81066C7.28008 9.09196 6.89855 9.25 6.50072 9.25C6.1029 9.25 5.72137 9.09196 5.44006 8.81066C5.15876 8.52936 5.00072 8.14782 5.00072 7.75V6.75Z"
              fill="white"
              fillOpacity="0.5"
            />
          </svg>
          Ticket Sales
        </h3>
        <div className="flex flex-wrap gap-4 p-4">
          {ticketData.map((item) => (
            <div
              key={item.name}
              className="flex items-center space-x-2 px-3 py-1 border border-white/20 rounded-full"
            >
              <span className="text-white">{item.icon}</span>
              <span className="text-white text-sm">{item.name}</span>
              <span className="text-white text-sm">{item.amount}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-8">
          <DonutChart
            className="mt-8"
            data={ticketData}
            category="amount"
            index="name"
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
    </>
  );
}

const purchaseData = [
  { day: "Mon", purchases: 150 },
  { day: "Tue", purchases: 300 },
  { day: "Wed", purchases: 450 },
  { day: "Thu", purchases: 320 },
  { day: "Fri", purchases: 280 },
  { day: "Sat", purchases: 350 },
  { day: "Sun", purchases: 200 },
];

function PurchaseActivity() {
  return (
    <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
      <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.50072 3C3.50072 2.20435 3.81679 1.44129 4.3794 0.87868C4.94201 0.31607 5.70507 0 6.50072 0C7.29637 0 8.05943 0.31607 8.62204 0.87868C9.18465 1.44129 9.50072 2.20435 9.50072 3V4H10.1437C10.5155 4.00012 10.874 4.13829 11.1496 4.38773C11.4253 4.63717 11.5985 4.98009 11.6357 5.35L12.3357 12.35C12.3567 12.5586 12.3337 12.7693 12.2682 12.9685C12.2027 13.1677 12.0962 13.3509 11.9555 13.5064C11.8148 13.6619 11.6431 13.7862 11.4514 13.8712C11.2598 13.9562 11.0524 14.0001 10.8427 14H2.15772C1.94813 13.9999 1.74088 13.9559 1.54933 13.8709C1.35778 13.7858 1.18619 13.6615 1.04561 13.5061C0.905038 13.3506 0.798604 13.1674 0.733172 12.9683C0.66774 12.7692 0.644763 12.5585 0.665722 12.35L1.36572 5.35C1.4029 4.98009 1.57612 4.63717 1.85179 4.38773C2.12747 4.13829 2.48595 4.00012 2.85772 4H3.50072V3ZM8.00072 3V4H5.00072V3C5.00072 2.60218 5.15876 2.22064 5.44006 1.93934C5.72137 1.65804 6.1029 1.5 6.50072 1.5C6.89855 1.5 7.28008 1.65804 7.56138 1.93934C7.84269 2.22064 8.00072 2.60218 8.00072 3ZM5.00072 6.75C5.00072 6.55109 4.9217 6.36032 4.78105 6.21967C4.6404 6.07902 4.44963 6 4.25072 6C4.05181 6 3.86104 6.07902 3.72039 6.21967C3.57974 6.36032 3.50072 6.55109 3.50072 6.75V7.75C3.50072 8.54565 3.81679 9.30871 4.3794 9.87132C4.94201 10.4339 5.70507 10.75 6.50072 10.75C7.29637 10.75 8.05943 10.4339 8.62204 9.87132C9.18465 9.30871 9.50072 8.54565 9.50072 7.75V6.75C9.50072 6.55109 9.4217 6.36032 9.28105 6.21967C9.1404 6.07902 8.94963 6 8.75072 6C8.55181 6 8.36104 6.07902 8.22039 6.21967C8.07974 6.36032 8.00072 6.55109 8.00072 6.75V7.75C8.00072 8.14782 7.84269 8.52936 7.56138 8.81066C7.28008 9.09196 6.89855 9.25 6.50072 9.25C6.1029 9.25 5.72137 9.09196 5.44006 8.81066C5.15876 8.52936 5.00072 8.14782 5.00072 7.75V6.75Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
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

function ConversionFunnel() {
  return (
    <div className="w-full bg-transparent border border-white/10 rounded-xl">
      <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
        Conversion Funnel
      </h3>
      <div className="p-4">
        {funnelData.map((item) => {
          // Calculate width to ensure text fits
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
    <div className="grid gap-5">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TrafficSources />
        <TicketSales />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ConversionFunnel />
        <PurchaseActivity />
      </div>
    </div>
  );
}
