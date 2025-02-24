// 'use client';

import { RiExternalLinkLine } from "@remixicon/react";
import { AreaChart, Card } from "@tremor/react";

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

export default function AnalyticsTab() {
  return (
    <>
      <div className="p-0 sm:mx-auto sm:w-full bg-transparent border border-white/10 rounded-xl">
        <div className="p-6">
          <p className="text-white/60 text-sm">Balance</p>
          <p className="text-2xl font-semibold text-white">$60,143</p>
          <AreaChart
            data={data}
            index="date"
            categories={["Balance"]}
            showLegend={false}
            showGradient={false}
            yAxisWidth={45}
            valueFormatter={valueFormatter}
            showAnimation={true}
            showDataPoints={true}
            curveType="monotone"
            className="mt-8 hidden h-60 sm:block [&_circle]:!opacity-100 [&_circle]:!r-2"
          />
          <AreaChart
            data={data}
            index="date"
            categories={["Balance"]}
            showLegend={false}
            showGradient={false}
            showYAxis={false}
            startEndOnly={true}
            valueFormatter={valueFormatter}
            showAnimation={true}
            showDataPoints={true}
            curveType="monotone"
            className="mt-8 h-48 sm:hidden [&_circle]:!opacity-100 [&_circle]:!r-2"
          />
        </div>
      </div>
    </>
  );
}
