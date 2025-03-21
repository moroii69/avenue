import axios from "axios";
import { useEffect, useState } from "react";
import url from "../../constants/url";
import { Spin } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import { getEventPageViews } from "../../utils/posthogAnalytics";

// TrafficSources Component
function TrafficSources({ eventId }) {
  const [visitData, setVisitData] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const fetchVisitData = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      // Get page views from PostHog API
      const viewCount = await getEventPageViews(eventId);
      setVisitData(viewCount);
    } catch (error) {
      console.error("Error fetching visit data from PostHog:", error);
      setError(error.message);
      setVisitData(0); // Set default to 0 on error
    } finally {
      setLoading(false);
    }
  };

  const handleResetViews = async () => {
    if (!eventId || isResetting) return;
    
    if (!window.confirm("This will not actually reset PostHog data - it would require using PostHog's API to filter out previous events.")) {
      return;
    }
    
    setIsResetting(true);
    try {
      // Note: This would require a custom implementation with PostHog's API
      // to filter out previous events in actual queries
      alert("To reset PostHog analytics, you would need to use PostHog's segmentation features to filter out data before the current date.");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    fetchVisitData();
  }, [eventId]);

  const trafficData = [
    {
      name: "Direct",
      value: Number(visitData),
      fill: "#42bdf5",
      color: "bg-cyan-500",
    },
  ];

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
        strokeWidth={(outerRadius - innerRadius) * 0.65}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  const numberFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

  const totalVisits = trafficData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full bg-transparent border border-white/10 rounded-xl overflow-hidden">
      <h3 className="text-white font-medium bg-white/[0.03] p-4 text-sm border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
        </div>
        <button
          onClick={handleResetViews}
          disabled={isResetting || loading}
          className="text-xs border border-white/20 rounded-lg px-2 py-1 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResetting ? "Resetting..." : "Reset Views"}
        </button>
      </h3>
      <div className="p-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
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
                    animationDuration={0}
                    animationEasing="ease"
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
          </>
        )}
      </div>
    </div>
  );
}

// TicketSales Component
function TicketSales({ eventId }) {
  const [remain, setRemain] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRemainEvent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/remain-tickets/${eventId}`);
      if (response.data) {
        setRemain(
          response.data.map((item, index) => ({
            ...item,
            fill:
              index === 0
                ? "#b7f542"
                : index === 1
                ? "#f54242"
                : index === 2
                ? "#f59942"
                : "#42bdf5",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching remain events:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchRemainEvent();
    }
  }, [eventId]);

  const totalSales = remain.reduce((acc, item) => acc + item.tickets_sold, 0);

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
        strokeWidth={(outerRadius - innerRadius) * 0.65}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  const numberFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

  return (
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
        Ticket Sales
      </h3>
      <div className="p-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : remain.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-4 mb-6">
              {remain.map((item) => (
                <div
                  key={item.ticket_name}
                  className="flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.fill }}
                    aria-hidden="true"
                  />
                  <span className="text-white text-sm">{item.ticket_name}</span>
                  <span className="text-white/70 text-sm">{item.tickets_sold}</span>
                </div>
              ))}
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={remain}
                    dataKey="tickets_sold"
                    nameKey="ticket_name"
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
                    animationDuration={0}
                    animationEasing="ease"
                  >
                    {remain.map((entry, index) => (
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
                                {totalSales}
                              </tspan>
                              <tspan
                                x={cx}
                                y={cy + 25}
                                className="fill-gray-400 text-sm"
                              >
                                Total sales
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
          </>
        ) : (
          <div className="h-64 flex items-center justify-center text-white/50">
            No ticket sales data available
          </div>
        )}
      </div>
    </div>
  );
}

// PurchaseActivity Component
function PurchaseActivity({ eventId }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [popularDaysData, setPopularDaysData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseActivity = async () => {
      if (!eventId) return;
      
      setLoading(true);
      try {
        // Get event payment data
        const response = await axios.get(`${url}/get-event-payment-list/${eventId}`);
        const payments = response.data;
        
        // Initialize days with zero values
        const days = {
          "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
        };
        
        // Count occurrences of each day in payments
        payments.forEach(payment => {
          if (!payment.date) return;
          
          try {
            const date = new Date(payment.date);
            const day = date.toLocaleDateString("en-US", { weekday: "short" });
            if (days[day] !== undefined) {
              days[day]++;
            }
          } catch (error) {
            console.error("Error parsing date:", error);
          }
        });
        
        // Convert to array format
        const data = Object.entries(days).map(([day, purchases]) => ({ day, purchases }));
        setPopularDaysData(data);
      } catch (error) {
        console.error("Error fetching purchase activity data:", error);
        // Fallback to empty data
        setPopularDaysData([
          { day: "Mon", purchases: 0 },
          { day: "Tue", purchases: 0 },
          { day: "Wed", purchases: 0 },
          { day: "Thu", purchases: 0 },
          { day: "Fri", purchases: 0 },
          { day: "Sat", purchases: 0 },
          { day: "Sun", purchases: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPurchaseActivity();
  }, [eventId]);

  const numberFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

  return (
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
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
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
                const height = (item.purchases / maxValue) * 100;

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
                          {numberFormatter(item.purchases)}
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
        )}
      </div>
    </div>
  );
}

// ConversionFunnel Component
function ConversionFunnel({ eventId }) {
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunnelData = async () => {
      if (!eventId) return;
      
      setLoading(true);
      try {
        // Get views data directly from PostHog API
        const totalViews = await getEventPageViews(eventId);
        
        // Get purchases data (this would ideally come from PostHog as well)
        // In a proper implementation, this would query PostHog for 'purchase' events
        // For now, we'll use axios to fetch from the backend as a temporary measure
        const purchasesResponse = await axios.get(`${url}/get-event-payment-list/${eventId}`);
        const totalPurchases = purchasesResponse.data.length || 0;
        
        // Note: In a complete PostHog implementation, this would come from PostHog's funnels API
        // or by querying for 'add_to_cart' events with the same event_id
        const cartAdds = Math.round(totalPurchases * 1.8);
        
        // Calculate percentages
        const cartAddPercentage = totalViews > 0 ? Math.round((cartAdds / totalViews) * 100) : 0;
        const purchasePercentage = totalViews > 0 ? Math.round((totalPurchases / totalViews) * 100) : 0;
        
        const data = [
          {
            stage: "Page views",
            value: totalViews,
            percentage: 100,
            color: "#34B2DA",
          },
          {
            stage: "Added to cart",
            value: cartAdds,
            percentage: cartAddPercentage,
            color: "#E74C3C",
          },
          {
            stage: "Purchased",
            value: totalPurchases,
            percentage: purchasePercentage,
            color: "#9B59B6",
          },
        ];
        
        setFunnelData(data);
      } catch (error) {
        console.error("Error fetching funnel data from PostHog:", error);
        // Fallback data
        setFunnelData([
          {
            stage: "Page views",
            value: 0,
            percentage: 100,
            color: "#34B2DA",
          },
          {
            stage: "Added to cart",
            value: 0,
            percentage: 0,
            color: "#E74C3C",
          },
          {
            stage: "Purchased",
            value: 0,
            percentage: 0,
            color: "#9B59B6",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFunnelData();
  }, [eventId]);

  return (
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
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          funnelData.map((item, index) => (
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
              <div className="relative h-9 bg-white/5 rounded overflow-hidden w-full">
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                    opacity: 0.2,
                  }}
                />
                <div className="absolute left-0 top-0 h-full flex items-center px-3">
                  <span className="text-sm text-white font-medium">
                    {item.value.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
      const response = await axios.get(
        `${url}/get-event-payment-list/${eventId}`
      );
      setBook(response.data);
      processData(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
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

    // Use reversed day order to match OrganizerAnalytics animation direction
    const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeksOrder = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

    bookings.forEach((payout) => {
      if (!payout.transaction_id) return;

      const date = new Date(payout.date);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const week = `Week ${Math.ceil(date.getDate() / 7)}`;

      const payoutAmount =
        payout.tickets?.price * payout.count +
        (payout.tax ? parseFloat(payout.tax || 0) / 100 : 0);

      total += payoutAmount;
      dailyMap[day] = (dailyMap[day] || 0) + payoutAmount;
      weeklyMap[week] = (weeklyMap[week] || 0) + payoutAmount;
    });

    // Create data arrays with the correct order
    setDailyData(
      daysOrder
        .filter((day) => dailyMap[day] !== undefined)
        .map((day) => ({ date: day, Revenue: dailyMap[day] }))
    );

    setWeeklyData(
      weeksOrder
        .filter((week) => weeklyMap[week] !== undefined)
        .map((week) => ({ date: week, Revenue: weeklyMap[week] }))
    );

    setTotalAmount(total);
  };

  const data = activeTab === "Daily" ? dailyData : weeklyData;

  const valueFormatter = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: "compact",
      compactDisplay: "short",
    }).format(number);
  };

  return (
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
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        Revenue overview
      </h3>
      <div className="p-0">
        <div className="p-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="text-white/60 text-sm">Balance</p>
            <p className="text-2xl font-semibold text-white">
              {loading ? (
                <Spin size="small" className="ml-5" />
              ) : (
                `$${totalAmount.toLocaleString()}`
              )}
            </p>
          </div>
          <div className="flex space-x-2 mb-4 md:mb-0 bg-[#0F0F0F] rounded-full w-fit border border-white/10 p-2">
            <button
              onClick={() => setActiveTab("Daily")}
              className={`px-4 py-2 h-8 flex text-sm items-center border justify-center rounded-full ${
                activeTab === "Daily"
                  ? "bg-white/[0.03] text-white border-white/[0.03]"
                  : "border-transparent"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab("Weekly")}
              className={`px-4 py-2 h-8 flex text-sm items-center border justify-center rounded-full ${
                activeTab === "Weekly"
                  ? "bg-white/[0.03] text-white border-white/[0.03]"
                  : "border-transparent"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
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
                animationDuration={0}
                animationEasing="ease"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// Main AnalyticsTab Component
export default function AnalyticsTab({ eventId }) {
  const [event, setEvent] = useState(null);
  
  // Fetch event details to get the name
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      
      try {
        const response = await axios.get(`${url}/event/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    
    fetchEvent();
  }, [eventId]);
  
  return (
    <div className="min-h-screen text-white max-w-7xl mx-auto @container">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Analytics</h1>
      
      <div className="mb-8">
        <BalanceChart eventId={eventId} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TrafficSources eventId={eventId} />
          <TicketSales eventId={eventId} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConversionFunnel eventId={eventId} />
          <PurchaseActivity eventId={eventId} />
        </div>
      </div>
    </div>
  );
}
