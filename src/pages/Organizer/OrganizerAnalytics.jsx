import React, { useState, useMemo, useEffect } from "react";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import SidebarToggle from "../../components/layouts/SidebarToggle";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Label } from "recharts";
import axios from "axios";
import url from "../../constants/url";

const OrganizerAnalytics = () => {
  const [analyticsData] = useState({
    revenue: 5450,
    ticketsSold: 36,
    currentlyLive: 24,
    ticketsViews: 24,
    revenueChange: "+8%",
    ticketsSoldChange: "-8%",
    currentlyLiveChange: "+8%",
    ticketsViewsChange: "-8%",
  });

  const [hoveredDay, setHoveredDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventMetrics, setEventMetrics] = useState({});
  const [oragnizerId, setOragnizerId] = useState(null);

  // Load organizer ID from localStorage
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedUserOrganizerId = localStorage.getItem("organizerId");
      setOragnizerId(storedUserOrganizerId);
    };
    
    loadFromLocalStorage();
    
    const handleStorageChange = () => {
      loadFromLocalStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetch events belonging to the organizer
  const fetchEvents = async () => {
    if (!oragnizerId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/event/get-event-by-organizer-id/${oragnizerId}`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (oragnizerId) {
      fetchEvents();
    }
  }, [oragnizerId]);

  // Filter events to show only Live and Past events
  const filteredEvents = useMemo(() => {
    if (!events.length) return [];
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of day for easier comparison
    
    return events.filter(event => {
      // Include only active events (not drafts or deactivated)
      if (event.status !== "active") return false;
      
      // Check if the event is published
      if (event.explore !== "YES") return false;
      
      // Get the event date for comparison
      const eventStartDate = new Date(event.start_date);
      eventStartDate.setHours(0, 0, 0, 0);
      
      // Include both live (future) and past events
      return true;
    }).map(event => {
      // Add a property to identify if the event is live or past
      const eventEndDate = new Date(event.end_date);
      eventEndDate.setHours(0, 0, 0, 0);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      return {
        ...event,
        isLive: eventEndDate >= currentDate
      };
    });
  }, [events]);
  
  // Separate events into live and past
  const liveEvents = useMemo(() => filteredEvents.filter(event => event.isLive), [filteredEvents]);
  const pastEvents = useMemo(() => filteredEvents.filter(event => !event.isLive), [filteredEvents]);

  // Fetch analytics data for each event
  useEffect(() => {
    const fetchEventsAnalytics = async () => {
      if (!filteredEvents || filteredEvents.length === 0) return;
      
      const metricsData = {};
      
      for (const event of filteredEvents) {
        try {
          // Fetch views
          const viewsResponse = await axios.get(
            `${url}/visit/get-visit/${event._id}`
          );
          const views = viewsResponse.data?.data?.count || 0;
          
          // Fetch payments (purchases)
          const paymentsResponse = await axios.get(
            `${url}/get-event-payment-list/${event._id}`
          );
          const purchases = paymentsResponse.data?.length || 0;
          
          // Calculate cart adds (assuming 2x the number of purchases for now)
          // In a real app, you would get this from a cart tracking database
          const cartAdds = purchases * 2;
          
          // Calculate conversion rate
          const conversionRate = views > 0 ? ((purchases / views) * 100).toFixed(1) : 0;
          
          metricsData[event._id] = {
            views: parseInt(views) || 0,
            cartAdds,
            purchases,
            conversionRate: `${conversionRate}%`
          };
        } catch (error) {
          console.error(`Error fetching analytics for event ${event._id}:`, error);
          metricsData[event._id] = {
            views: 0,
            cartAdds: 0,
            purchases: 0,
            conversionRate: '0%'
          };
        }
      }
      
      setEventMetrics(metricsData);
    };

    fetchEventsAnalytics();
  }, [filteredEvents]);

  const revenueData = [
    { date: "Mon", Revenue: 2000 },
    { date: "Tue", Revenue: 3000 },
    { date: "Wed", Revenue: 2000 },
    { date: "Thu", Revenue: 4000 },
    { date: "Fri", Revenue: 1800 },
    { date: "Sat", Revenue: 4200 },
    { date: "Sun", Revenue: 5000 },
  ];

  const categoriesData = [
    { name: "Arts & Culture", value: 24, fill: "#b7f542" },
    { name: "Music", value: 8, fill: "#f54242" },
    { name: "Sports", value: 4, fill: "#f59942" },
  ];

  const trafficData = [
    { name: "Direct", value: 3500, fill: "#42bdf5" },
    { name: "Social Media", value: 1200, fill: "#9442f5" },
    { name: "Search", value: 600, fill: "#f54242" },
    { name: "Referrals", value: 258, fill: "#42f5a4" },
  ];

  const funnelData = [
    { stage: "Page views", value: 2489, percentage: 100, color: "#34B2DA" },
    { stage: "Added to cart", value: 1344, percentage: 54, color: "#E74C3C" },
    { stage: "Purchased", value: 36, percentage: 4.2, color: "#9B59B6" },
  ];

  const popularDaysData = [
    { day: "Mon", visitors: 100 },
    { day: "Tue", visitors: 410 },
    { day: "Wed", visitors: 470 },
    { day: "Thu", visitors: 420 },
    { day: "Fri", visitors: 350 },
    { day: "Sat", visitors: 420 },
    { day: "Sun", visitors: 370 },
  ];

  const valueFormatter = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: "compact",
      compactDisplay: "short",
    }).format(number);
  };

  const numberFormatter = (number) => {
    return new Intl.NumberFormat("en-US").format(number).toString();
  };

  const totalSells = useMemo(() => {
    return categoriesData.reduce((sum, item) => sum + item.value, 0);
  }, [categoriesData]);

  const totalVisits = useMemo(() => {
    return trafficData.reduce((sum, item) => sum + item.value, 0);
  }, [trafficData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111] p-2 border border-white/10 rounded">
          <p className="text-white text-sm">{`${
            payload[0].name
          }: ${numberFormatter(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomizedShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    const gap = 0.05;
    const adjustedEndAngle = endAngle - gap;

    const angleRad = Math.PI / 180;
    const path = `
      M ${cx + outerRadius * Math.cos(startAngle * angleRad)} ${
      cy + outerRadius * Math.sin(startAngle * angleRad)
    }
      A ${outerRadius} ${outerRadius} 0 ${
      adjustedEndAngle - startAngle > 180 * angleRad ? 1 : 0
    } 1 
        ${cx + outerRadius * Math.cos(adjustedEndAngle * angleRad)} ${
      cy + outerRadius * Math.sin(adjustedEndAngle * angleRad)
    }
    `;

    return (
      <path
        d={path}
        fill="none"
        stroke={fill}
        strokeWidth={(outerRadius - innerRadius) * 0.65} // Reduced stroke width for thinner appearance
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  return (
    <SidebarLayout>
      <div className="m-4 mb-2 z-20">
        <SidebarToggle />
      </div>
      <div className="min-h-screen text-white p-6 max-w-7xl mx-auto @container">
        <h1 className="text-2xl md:text-3xl font-bold mb-9">Analytics</h1>

        <div className="mb-8">
          <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
            This week
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="ml-2"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white/70 text-sm mb-1">Revenue</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  ${analyticsData.revenue.toLocaleString()}
                </p>
                <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.revenueChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.revenueChange}
                </span>
              </div>
            </div>
            <div className="p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                  fill="white"
                  fillOpacity="0.5"
                />
              </svg>
            </div>
          </div>

          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white/70 text-sm mb-1">Tickets sold</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {analyticsData.ticketsSold}
                </p>
                <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.ticketsSoldChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.ticketsSoldChange}
                </span>
              </div>
            </div>
            <div className="p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
                  fill="white"
                  fillOpacity="0.5"
                />
              </svg>
            </div>
          </div>

          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white/70 text-sm mb-1">Currently live</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {analyticsData.currentlyLive}
                </p>
                <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.currentlyLiveChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.currentlyLiveChange}
                </span>
              </div>
            </div>
            <div className="p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                  fill="white"
                  fillOpacity="0.5"
                />
              </svg>
            </div>
          </div>

          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white/70 text-sm mb-1">Tickets views</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {analyticsData.ticketsViews}
                </p>
                <span
                  className={`text-xs px-2 rounded ${
                    analyticsData.ticketsViewsChange.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {analyticsData.ticketsViewsChange}
                </span>
              </div>
            </div>
            <div className="p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                  fill="white"
                  fillOpacity="0.5"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden mb-6">
          <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10">
            Revenue overview
          </h3>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "rgba(255,255,255,0.5)" }}
                  tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.5)" }}
                  tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickFormatter={(value) => `$${value / 1000}K`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    color: "white",
                  }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                  labelFormatter={(label) => `${label}`}
                />
                <Line
                  type="linear"
                  dataKey="Revenue"
                  stroke="#34B2DA"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#34B2DA", strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    fill: "#34B2DA",
                    stroke: "rgba(52, 178, 218, 0.3)",
                    strokeWidth: 3,
                  }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <rect x="7" y="7" width="3" height="3" />
                <rect x="14" y="7" width="3" height="3" />
                <rect x="7" y="14" width="3" height="3" />
                <rect x="14" y="14" width="3" height="3" />
              </svg>
              Categories
            </h3>
            <div className="p-4">
              <div className="flex flex-wrap gap-4 mb-6">
                {categoriesData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.fill }}
                      aria-hidden="true"
                    />
                    <span className="text-white text-sm">{item.name}</span>
                    <span className="text-white/70 text-sm">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={categoriesData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={105}
                      outerRadius={115}
                      strokeWidth={0}
                      paddingAngle={3}
                      activeShape={CustomizedShape}
                      shape={<CustomizedShape />}
                      activeIndex={[]}
                      startAngle={90}
                      endAngle={-270}
                      isAnimationActive={false}
                    >
                      {categoriesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          stroke={entry.fill}
                          strokeLinecap="round"
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox;
                          return (
                            <g>
                              <text
                                x={cx}
                                y={cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={cx}
                                  y={cy}
                                  className="fill-white text-3xl font-bold"
                                >
                                  {totalSells}
                                </tspan>
                                <tspan
                                  x={cx}
                                  y={cy + 25}
                                  className="fill-gray-400 text-sm"
                                >
                                  Total sells
                                </tspan>
                              </text>
                            </g>
                          );
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="8 12 12 16 16 12" />
                <line x1="12" y1="8" x2="12" y2="16" />
              </svg>
              Traffic Sources
            </h3>
            <div className="p-4">
              <div className="flex flex-wrap gap-4 mb-6">
                {trafficData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.fill }}
                      aria-hidden="true"
                    />
                    <span className="text-white text-sm">{item.name}</span>
                  </div>
                ))}
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={trafficData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={105}
                      outerRadius={115}
                      strokeWidth={0}
                      paddingAngle={3}
                      activeShape={CustomizedShape}
                      shape={<CustomizedShape />}
                      activeIndex={[]}
                      startAngle={90}
                      endAngle={-270}
                      isAnimationActive={false}
                    >
                      {trafficData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          stroke={entry.fill}
                          strokeLinecap="round"
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox;
                          return (
                            <g>
                              <text
                                x={cx}
                                y={cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={cx}
                                  y={cy}
                                  className="fill-white text-3xl font-bold"
                                >
                                  {numberFormatter(totalVisits)}
                                </tspan>
                                <tspan
                                  x={cx}
                                  y={cy + 25}
                                  className="fill-gray-400 text-sm"
                                >
                                  Total visits
                                </tspan>
                              </text>
                            </g>
                          );
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 8.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2.5" />
                <path d="M18.5 14v-5c0-.3-.2-.5-.5-.5H6c-.3 0-.5.2-.5.5v5" />
                <path d="M2 14h20" />
                <path d="M12 20v-6" />
                <path d="M2 8.5c0 2.5 4.5 4.5 10 4.5s10-2 10-4.5" />
              </svg>
              Conversion Funnel
            </h3>
            <div className="p-4">
              {funnelData.map((item, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex items-center mb-1">
                    {index === 0 && (
                      <div className="w-6 h-6 mr-2 flex items-center justify-center text-white/70">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="w-6 h-6 mr-2 flex items-center justify-center text-white/70">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="8" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                      </div>
                    )}
                    {index === 2 && (
                      <div className="w-6 h-6 mr-2 flex items-center justify-center text-white/70">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                    )}
                    <span className="text-sm text-white/70">{item.stage}</span>
                  </div>
                  <div className="relative h-10 w-full bg-[#151515] rounded-md overflow-hidden border border-[#252525]">
                    {index === 2 ? (
                      <div
                        className="absolute h-full rounded-md flex items-center px-3"
                        style={{
                          width: "auto",
                          minWidth: "120px",
                          background: `repeating-linear-gradient(-45deg, rgba(155, 89, 182, 0.2), rgba(155, 89, 182, 0.2) 10px, rgba(142, 68, 173, 0.2) 10px, rgba(142, 68, 173, 0.2) 20px)`,
                          borderRight: "1px solid rgba(155, 89, 182, 0.3)",
                        }}
                      >
                        <span className="text-white text-sm whitespace-nowrap">
                          {item.percentage}% - {item.value}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="absolute h-full rounded-md flex items-center px-3"
                        style={{
                          width: `${item.percentage}%`,
                          background:
                            index === 0
                              ? `repeating-linear-gradient(-45deg, rgba(52, 178, 218, 0.2), rgba(52, 178, 218, 0.2) 10px, rgba(47, 155, 191, 0.2) 10px, rgba(47, 155, 191, 0.2) 20px)`
                              : `repeating-linear-gradient(-45deg, rgba(231, 76, 60, 0.2), rgba(231, 76, 60, 0.2) 10px, rgba(192, 57, 43, 0.2) 10px, rgba(192, 57, 43, 0.2) 20px)`,
                          borderRight:
                            index === 0
                              ? "1px solid rgba(52, 178, 218, 0.3)"
                              : "1px solid rgba(231, 76, 60, 0.3)",
                        }}
                      >
                        <span className="text-white text-sm whitespace-nowrap">
                          {item.percentage}% - {item.value}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
            <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Popular days
            </h3>
            <div className="p-4">
              <div className="relative w-full h-[300px] flex flex-col">
                <div className="absolute top-0 left-0 h-[calc(100%-28px)] w-12 flex flex-col justify-between text-white/70 text-sm">
                  <div>500</div>
                  <div>400</div>
                  <div>300</div>
                  <div>200</div>
                  <div>100</div>
                  <div>0</div>
                </div>

                <div className="absolute left-12 right-0 top-0 h-[calc(100%-28px)] flex flex-col justify-between">
                  {[0, 1, 2, 3, 4, 5].map((_, i) => (
                    <div
                      key={i}
                      className="border-t border-white/10 w-full h-0"
                    ></div>
                  ))}
                </div>

                <div
                  className="absolute left-12 right-0 bottom-0 top-0 flex"
                  style={{
                    zIndex: 10,
                    height: "calc(100% - 28px)",
                    paddingTop: "25px",
                  }}
                >
                  {popularDaysData.map((item, index) => {
                    const maxValue = 500;
                    const height = (item.visitors / maxValue) * 100;

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col justify-end relative"
                      >
                        <div
                          className="w-full rounded-t-sm relative"
                          style={{
                            height: `${height}%`,
                            background:
                              "linear-gradient(to bottom, transparent 0%, rgba(140, 217, 255, 0.08) 2%, rgba(140, 217, 255, 0.005) 100%)",
                            backdropFilter: "blur(3px)",
                            borderTop: "3px solid #42bdf5",
                          }}
                          onMouseEnter={() => setHoveredDay(index)}
                          onMouseLeave={() => setHoveredDay(null)}
                        >
                          {hoveredDay === index && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#111] p-2 rounded border border-white/10 text-white text-xs whitespace-nowrap z-20">
                              {numberFormatter(item.visitors)}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-center text-white/70 text-sm">
                          {item.day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden mb-6">
          <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            Events performance
          </h3>
          <div className="p-0">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5">
                    <th className="text-left p-4">
                      <div className="flex items-center gap-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                        >
                          <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
                          <path d="M12 12H3" />
                          <path d="M16 6v6" />
                          <path d="M8 6v6" />
                        </svg>
                        Event
                      </div>
                    </th>
                    <th className="text-left p-4">
                      <div className="flex items-center gap-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Views
                      </div>
                    </th>
                    <th className="text-left p-4">
                      <div className="flex items-center gap-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                        >
                          <circle cx="8" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                        Cart adds
                      </div>
                    </th>
                    <th className="text-left p-4">
                      <div className="flex items-center gap-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                        >
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Purchases
                      </div>
                    </th>
                    <th className="text-left p-4">
                      <div className="flex items-center gap-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                        >
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </svg>
                        Conversion
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="border-b border-white/5">
                      <td colSpan="5" className="py-8 text-center text-white/50">
                        Loading event data...
                      </td>
                    </tr>
                  ) : filteredEvents.length === 0 ? (
                    <tr className="border-b border-white/5">
                      <td colSpan="5" className="py-8 text-center text-white/50">
                        No events found. Create your first event to see analytics.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {/* Live Events Section */}
                      {liveEvents.length > 0 && (
                        <>
                          <tr className="bg-white/[0.03]">
                            <td colSpan="5" className="py-3 px-4 text-left font-medium text-white/80">
                              Live Events ({liveEvents.length})
                            </td>
                          </tr>
                          {liveEvents.map((event) => (
                            <tr key={event._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center text-blue-400 overflow-hidden">
                                    {event.flyer ? (
                                      <img
                                        src={event.flyer}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      event.event_name?.charAt(0) || "E"
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-white">{event.event_name}</span>
                                    <span className="text-xs text-white/50">{new Date(event.start_date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-white/70">
                                {eventMetrics[event._id]?.views || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {eventMetrics[event._id]?.cartAdds || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {eventMetrics[event._id]?.purchases || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {eventMetrics[event._id]?.conversionRate || '0%'}
                              </td>
                            </tr>
                          ))}
                        </>
                      )}

                      {/* Past Events Section */}
                      {pastEvents.length > 0 && (
                        <>
                          <tr className="bg-white/[0.03]">
                            <td colSpan="5" className="py-3 px-4 text-left font-medium text-white/80">
                              Past Events ({pastEvents.length})
                            </td>
                          </tr>
                          {pastEvents.map((event) => (
                            <tr key={event._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500/20 to-gray-500/20 flex items-center justify-center text-purple-400 overflow-hidden">
                                    {event.flyer ? (
                                      <img
                                        src={event.flyer}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      event.event_name?.charAt(0) || "E"
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-white">{event.event_name}</span>
                                    <span className="text-xs text-white/50">{new Date(event.start_date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-white/70">
                                {eventMetrics[event._id]?.views || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {eventMetrics[event._id]?.cartAdds || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {eventMetrics[event._id]?.purchases || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {eventMetrics[event._id]?.conversionRate || '0%'}
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default OrganizerAnalytics;
