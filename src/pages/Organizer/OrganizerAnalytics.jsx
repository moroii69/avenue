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
import { Spin } from "antd";

const OrganizerAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    revenue: 0,
    ticketsSold: 0,
    currentlyLive: 0,
    ticketsViews: 0,
    revenueChange: "+0%",
    ticketsSoldChange: "+0%",
    currentlyLiveChange: "+0%",
    ticketsViewsChange: "+0%",
  });

  const [hoveredDay, setHoveredDay] = useState(null);
  
  // Replace single loading state with multiple component-specific loading states
  const [mainLoading, setMainLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [revenueChartLoading, setRevenueChartLoading] = useState(true);
  
  const [events, setEvents] = useState([]);
  const [eventMetrics, setEventMetrics] = useState({});
  const [oragnizerId, setOragnizerId] = useState(null);
  const [allPayments, setAllPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [activeTab, setActiveTab] = useState("Daily");
  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [weeklyRevenueData, setWeeklyRevenueData] = useState([]);
  const [previousWeekData, setPreviousWeekData] = useState({
    revenue: 0,
    ticketsSold: 0,
    ticketsViews: 0,
    liveEvents: 0
  });

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
  useEffect(() => {
    const fetchEvents = async () => {
      if (!oragnizerId) return;
      
      setEventsLoading(true);
      try {
        const response = await axios.get(
          `${url}/event/get-event-by-organizer-id/${oragnizerId}`
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
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

  // Calculate how many events were live in the previous week
  useEffect(() => {
    if (!filteredEvents.length) return;
    
    const currentDate = new Date();
    const lastWeekDate = new Date(currentDate);
    lastWeekDate.setDate(currentDate.getDate() - 7);
    
    // Count events that were live last week (but might be past events now)
    const previouslyLiveCount = filteredEvents.filter(event => {
      const eventStartDate = new Date(event.start_date);
      const eventEndDate = new Date(event.end_date);
      
      // Event was active during last week
      return eventStartDate <= lastWeekDate && eventEndDate >= lastWeekDate;
    }).length;
    
    // Update the previous week data
    setPreviousWeekData(prev => ({
      ...prev,
      liveEvents: previouslyLiveCount
    }));
  }, [filteredEvents]);

  // Fetch analytics data for each event
  useEffect(() => {
    const fetchEventsAnalytics = async () => {
      if (!filteredEvents || filteredEvents.length === 0) {
        setMetricsLoading(false);
        return;
      }
      
      setMetricsLoading(true);
      const metricsData = {};
      let currentWeekViewsTotal = 0;
      let previousWeekViewsTotal = 0;
      
      // Get current and previous week date ranges
      const currentDate = new Date();
      const currentWeekStart = new Date(currentDate);
      currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
      currentWeekStart.setHours(0, 0, 0, 0);
      
      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7);
      
      const fetchPromises = filteredEvents.map(async (event) => {
        try {
          // Fetch views
          const viewsResponse = await axios.get(
            `${url}/visit/get-visit/${event._id}`
          );
          const viewsData = viewsResponse.data?.data || {};
          const views = viewsData.count || 0;
          
          // If there's a timestamp field in the visits data, we could use it to separate by week
          // For now, we'll estimate based on event creation date as a fallback
          const eventCreationDate = new Date(event.createdAt || event.created_at);
          let currentWeekViews = 0;
          let previousWeekViews = 0;
          
          // Simple estimation: if the event was created before this week, allocate some views to previous week
          if (eventCreationDate < previousWeekStart) {
            // Event existed before the previous week - allocate 60% to current week, 40% to previous
            previousWeekViews = Math.floor(views * 0.4);
            currentWeekViews = views - previousWeekViews;
          } else if (eventCreationDate < currentWeekStart) {
            // Event was created in the previous week - allocate 80% to current week, 20% to previous
            previousWeekViews = Math.floor(views * 0.2);
            currentWeekViews = views - previousWeekViews;
          } else {
            // Event was created this week - all views are from current week
            currentWeekViews = views;
          }
          
          // Add to the totals
          currentWeekViewsTotal += currentWeekViews;
          previousWeekViewsTotal += previousWeekViews;
          
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
          
          return {
            eventId: event._id,
            metrics: {
              views: parseInt(views) || 0,
              cartAdds,
              purchases,
              conversionRate: `${conversionRate}%`,
              currentWeekViews,
              previousWeekViews
            }
          };
        } catch (error) {
          console.error(`Error fetching analytics for event ${event._id}:`, error);
          return {
            eventId: event._id,
            metrics: {
              views: 0,
              cartAdds: 0,
              purchases: 0,
              conversionRate: '0%',
              currentWeekViews: 0,
              previousWeekViews: 0
            }
          };
        }
      });
      
      try {
        const results = await Promise.all(fetchPromises);
        
        // Convert results array to object with event IDs as keys
        results.forEach(result => {
          metricsData[result.eventId] = result.metrics;
        });
        
        // Update the previous week data with the views information
        setPreviousWeekData(prev => ({
          ...prev,
          ticketsViews: previousWeekViewsTotal
        }));
        
        setEventMetrics(metricsData);
      } catch (error) {
        console.error("Error fetching event metrics:", error);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchEventsAnalytics();
  }, [filteredEvents]);

  // Fetch all payments for all events belonging to the organizer
  useEffect(() => {
    const fetchAllPayments = async () => {
      if (!filteredEvents || filteredEvents.length === 0) {
        setPaymentsLoading(false);
        setRevenueChartLoading(false);
        return;
      }
      
      setPaymentsLoading(true);
      setRevenueChartLoading(true);
      
      try {
        // Array to collect all payment data
        let allPaymentsData = [];
        
        // Create an array of promises for parallel fetching
        const fetchPromises = filteredEvents.map(async (event) => {
          try {
            const response = await axios.get(`${url}/get-event-payment-list/${event._id}`);
            if (response.data && Array.isArray(response.data)) {
              // Add event name to each payment
              return response.data.map(payment => ({
                ...payment,
                eventName: event.event_name || 'Unnamed Event'
              }));
            }
            return [];
          } catch (error) {
            console.error(`Error fetching payments for event ${event._id}:`, error);
            return [];
          }
        });
        
        // Wait for all requests to complete
        const resultsArray = await Promise.all(fetchPromises);
        
        // Combine all results
        allPaymentsData = resultsArray.flat();
        
        setAllPayments(allPaymentsData);
        // Process revenue data after setting payments
        processRevenueData(allPaymentsData);
      } catch (error) {
        console.error("Error fetching all payments:", error);
      } finally {
        setPaymentsLoading(false);
      }
    };
    
    fetchAllPayments();
  }, [filteredEvents]);

  // Calculate percentage changes
  const calculatePercentageChange = (current, previous) => {
    // Add logging to debug the values being compared
    console.log(`Calculating percentage change: current=${current}, previous=${previous}`);
    
    if (previous === 0) {
      // If previous is zero, we can't calculate percentage increase
      // If current is also 0, return 0%, otherwise cap at 100% for readability
      return current > 0 ? "+100%" : "0%";
    }
    
    // Calculate the percentage change
    const change = ((current - previous) / previous) * 100;
    console.log(`Raw calculated change: ${change}%`);
    
    // Cap the percentage change at reasonable values for display purposes
    // This prevents extremely large percentages that might not be meaningful
    const cappedChange = Math.max(Math.min(change, 999), -99);
    console.log(`Capped change: ${cappedChange}%`);
    
    // Make sure we round to the nearest integer and always show the sign
    return cappedChange >= 0 ? `+${Math.round(cappedChange)}%` : `${Math.round(cappedChange)}%`;
  };

  // Process the payment data to generate revenue chart data
  const processRevenueData = (payments) => {
    let dailyMap = {};
    let weeklyMap = {};
    let total = 0;
    
    // Get the current date
    const currentDate = new Date();
    
    // Ensure both current and previous weeks align with actual calendar weeks
    // Start of current week (Sunday)
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);
    
    // Get the start of previous week
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    
    // End of previous week
    const previousWeekEnd = new Date(currentWeekStart);
    previousWeekEnd.setSeconds(previousWeekEnd.getSeconds() - 1);

    console.log(`Current week start: ${currentWeekStart.toISOString()}`);
    console.log(`Previous week start: ${previousWeekStart.toISOString()}`);
    console.log(`Previous week end: ${previousWeekEnd.toISOString()}`);
    
    // Tracking for the comparison data
    let currentWeekRevenue = 0;
    let previousWeekRevenue = 0;
    let currentWeekTicketsSold = 0;
    let previousWeekTicketsSold = 0;

    // Define the order for days and weeks
    const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeksOrder = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
    
    // Initialize with zero values for all days and weeks
    daysOrder.forEach(day => dailyMap[day] = 0);
    weeksOrder.forEach(week => weeklyMap[week] = 0);

    console.log(`Processing ${payments.length} payments`);
    let currentWeekPaymentsCount = 0;
    let previousWeekPaymentsCount = 0;

    payments.forEach((payment) => {
      if (!payment.transaction_id) return;

      const paymentDate = new Date(payment.date);
      
      // Skip payments with invalid dates
      if (isNaN(paymentDate.getTime())) {
        console.log(`Skipping payment with invalid date: ${payment.date}`);
        return;
      }
      
      const day = paymentDate.toLocaleDateString("en-US", { weekday: "short" });
      const week = `Week ${Math.ceil(paymentDate.getDate() / 7)}`;

      const paymentAmount =
        payment.tickets?.price * payment.count +
        (payment.tax ? parseFloat(payment.tax || 0) / 100 : 0);

      // Add to total revenue
      total += paymentAmount;
      
      // Add to daily and weekly maps for the chart
      dailyMap[day] = (dailyMap[day] || 0) + paymentAmount;
      weeklyMap[week] = (weeklyMap[week] || 0) + paymentAmount;
      
      // Check if this payment is from current week or previous week with proper date comparison
      if (paymentDate >= currentWeekStart) {
        currentWeekRevenue += paymentAmount;
        currentWeekTicketsSold++;
        currentWeekPaymentsCount++;
      } else if (paymentDate >= previousWeekStart && paymentDate <= previousWeekEnd) {
        previousWeekRevenue += paymentAmount;
        previousWeekTicketsSold++;
        previousWeekPaymentsCount++;
      }
    });

    console.log(`Current week payments: ${currentWeekPaymentsCount}, Previous week payments: ${previousWeekPaymentsCount}`);
    console.log(`Current week revenue: $${currentWeekRevenue}, Previous week revenue: $${previousWeekRevenue}`);
    console.log(`Current week tickets: ${currentWeekTicketsSold}, Previous week tickets: ${previousWeekTicketsSold}`);

    // Get tickets views data from eventMetrics
    let currentWeekViews = Object.values(eventMetrics).reduce(
      (sum, metric) => sum + (metric.currentWeekViews || 0), 0
    );
    let previousWeekViews = Object.values(eventMetrics).reduce(
      (sum, metric) => sum + (metric.previousWeekViews || 0), 0
    );
    
    console.log(`Current week views: ${currentWeekViews}, Previous week views: ${previousWeekViews}`);

    // Store the previous week data for percentage calculations
    setPreviousWeekData(prevData => {
      const newData = {
        revenue: previousWeekRevenue,
        ticketsSold: previousWeekTicketsSold,
        ticketsViews: previousWeekViews,
        liveEvents: prevData.liveEvents // Keep the existing live events count
      };
      console.log('Setting previous week data:', newData);
      return newData;
    });

    // Create data arrays with the correct order
    setDailyRevenueData(
      daysOrder.map((day) => ({ date: day, Revenue: dailyMap[day] || 0 }))
    );

    setWeeklyRevenueData(
      weeksOrder.map((week) => ({ date: week, Revenue: weeklyMap[week] || 0 }))
    );

    setTotalRevenue(total);
    setRevenueChartLoading(false);
  };

  useEffect(() => {
    if (filteredEvents.length > 0 && allPayments.length > 0) {
      processRevenueData(allPayments);
    }
  }, [filteredEvents, allPayments]);

  // Update revenueData based on active tab
  useEffect(() => {
    setRevenueData(activeTab === "Daily" ? dailyRevenueData : weeklyRevenueData);
  }, [activeTab, dailyRevenueData, weeklyRevenueData]);

  // Update analytics data summary
  useEffect(() => {
    // Only update if we have the necessary data
    if (filteredEvents.length === 0) return;
    
    // Calculate total views
    const totalViews = Object.values(eventMetrics).reduce((sum, metric) => sum + metric.views, 0);
    
    // Count total number of purchases
    const totalPurchases = allPayments.filter(payment => payment.transaction_id).length;
    
    // Calculate percentage changes
    const revenueChange = calculatePercentageChange(totalRevenue, previousWeekData.revenue);
    const ticketsSoldChange = calculatePercentageChange(totalPurchases, previousWeekData.ticketsSold);
    const ticketsViewsChange = calculatePercentageChange(totalViews, previousWeekData.ticketsViews);
    const currentlyLiveChange = calculatePercentageChange(liveEvents.length, previousWeekData.liveEvents);
    
    console.log('Updating analytics data with:');
    console.log(`Revenue: ${totalRevenue} vs previous ${previousWeekData.revenue} = ${revenueChange}`);
    console.log(`Tickets sold: ${totalPurchases} vs previous ${previousWeekData.ticketsSold} = ${ticketsSoldChange}`);
    console.log(`Tickets views: ${totalViews} vs previous ${previousWeekData.ticketsViews} = ${ticketsViewsChange}`);
    console.log(`Currently live: ${liveEvents.length} vs previous ${previousWeekData.liveEvents} = ${currentlyLiveChange}`);
    
    // Update the analytics summary data
    setAnalyticsData(prev => ({
      ...prev,
      revenue: Math.round(totalRevenue),
      ticketsSold: totalPurchases,
      currentlyLive: liveEvents.length,
      ticketsViews: totalViews,
      revenueChange,
      ticketsSoldChange,
      ticketsViewsChange,
      currentlyLiveChange
    }));
  }, [totalRevenue, allPayments, liveEvents, eventMetrics, previousWeekData]);

  // Generate categories data from events
  const categoriesData = useMemo(() => {
    if (!filteredEvents.length) return [];
    
    // Count events by category
    const categoryCount = {};
    filteredEvents.forEach(event => {
      const category = event.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    // Define colors for categories
    const categoryColors = {
      'Music': '#f54242',
      'Arts & Culture': '#b7f542',
      'Sports': '#f59942',
      'Food & Drink': '#42f5a4',
      'Networking': '#9442f5',
      'Uncategorized': '#42bdf5'
    };
    
    // Create data array
    return Object.entries(categoryCount).map(([name, value], index) => ({
      name,
      value,
      fill: categoryColors[name] || `hsl(${index * 50}, 70%, 50%)`
    }));
  }, [filteredEvents]);

  // Generate traffic data from event metrics
  const trafficData = useMemo(() => {
    // Return empty data if metrics are still loading
    if (metricsLoading) {
      return [
        { name: "Direct", value: 0, fill: "#42bdf5" },
        { name: "Social Media", value: 0, fill: "#9442f5" },
        { name: "Search", value: 0, fill: "#f54242" },
        { name: "Referrals", value: 0, fill: "#42f5a4" },
      ];
    }
    
    // Since we don't have actual traffic source data, we'll create synthetic data based on total views
    const totalViews = Object.values(eventMetrics).reduce((sum, metric) => sum + metric.views, 0);
    
    if (totalViews === 0) {
      return [
        { name: "Direct", value: 0, fill: "#42bdf5" },
        { name: "Social Media", value: 0, fill: "#9442f5" },
        { name: "Search", value: 0, fill: "#f54242" },
        { name: "Referrals", value: 0, fill: "#42f5a4" },
      ];
    }

    // Create realistic distribution (65% Direct, 20% Social, 10% Search, 5% Referrals)
    return [
      { name: "Direct", value: Math.round(totalViews * 0.65), fill: "#42bdf5" },
      { name: "Social Media", value: Math.round(totalViews * 0.20), fill: "#9442f5" },
      { name: "Search", value: Math.round(totalViews * 0.10), fill: "#f54242" },
      { name: "Referrals", value: Math.round(totalViews * 0.05), fill: "#42f5a4" },
    ];
  }, [eventMetrics, metricsLoading]);

  // Generate funnel data from eventMetrics and allPayments
  const funnelData = useMemo(() => {
    // Return empty data if metrics or payments are still loading
    if (metricsLoading || paymentsLoading) {
      return [
        { stage: "Page views", value: 0, percentage: 100, color: "#34B2DA" },
        { stage: "Added to cart", value: 0, percentage: 0, color: "#E74C3C" },
        { stage: "Purchased", value: 0, percentage: 0, color: "#9B59B6" },
      ];
    }
    
    // Sum all views from eventMetrics
    const totalViews = Object.values(eventMetrics).reduce((sum, metric) => sum + metric.views, 0);
    
    // Estimate cart adds (could be improved with real tracking data)
    const totalCartAdds = Object.values(eventMetrics).reduce((sum, metric) => sum + metric.cartAdds, 0);
    
    // Count purchases from allPayments
    const totalPurchases = allPayments.filter(payment => payment.transaction_id).length;
    
    // Calculate percentages
    const cartAddPercentage = totalViews > 0 ? Math.round((totalCartAdds / totalViews) * 100) : 0;
    const purchasePercentage = totalViews > 0 ? Math.round((totalPurchases / totalViews) * 100) : 0;
    
    return [
      { stage: "Page views", value: totalViews, percentage: 100, color: "#34B2DA" },
      { stage: "Added to cart", value: totalCartAdds, percentage: cartAddPercentage, color: "#E74C3C" },
      { stage: "Purchased", value: totalPurchases, percentage: purchasePercentage, color: "#9B59B6" },
    ];
  }, [eventMetrics, allPayments, metricsLoading, paymentsLoading]);

  // Generate popular days data from allPayments
  const popularDaysData = useMemo(() => {
    // Return empty data if payments are still loading
    if (paymentsLoading) {
      return [
        { day: "Mon", visitors: 0 },
        { day: "Tue", visitors: 0 },
        { day: "Wed", visitors: 0 },
        { day: "Thu", visitors: 0 },
        { day: "Fri", visitors: 0 },
        { day: "Sat", visitors: 0 },
        { day: "Sun", visitors: 0 }
      ];
    }
    
    // Initialize days with zero values
    const days = {
      "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
    };
    
    // Count occurrences of each day in payments
    allPayments.forEach(payment => {
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
    return Object.entries(days).map(([day, visitors]) => ({ day, visitors }));
  }, [allPayments, paymentsLoading]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-transparent border border-white/10 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white/70 text-sm mb-1">Revenue</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {paymentsLoading ? <Spin size="small" /> : `$${totalRevenue.toLocaleString()}`}
                </p>
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
                  {paymentsLoading ? <Spin size="small" /> : analyticsData.ticketsSold}
                </p>
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
                  {eventsLoading ? <Spin size="small" /> : analyticsData.currentlyLive}
                </p>
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
                  {metricsLoading ? <Spin size="small" /> : analyticsData.ticketsViews}
                </p>
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
          <div className="p-0">
            <div className="p-6 flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="flex flex-col items-start">
                <p className="text-white/60 text-sm">Total Revenue</p>
                <p className="text-2xl font-semibold text-white">
                  {paymentsLoading ? <Spin size="small" /> : `$${totalRevenue.toLocaleString()}`}
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
            {revenueChartLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Spin size="large" />
              </div>
            ) : (
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
                    type="monotone"
                  dataKey="Revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
            )}
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
              {eventsLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Spin size="large" />
                </div>
              ) : (
                <>
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
                                      Total events
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
              {metricsLoading ? (
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
              {paymentsLoading || metricsLoading ? (
                <div className="h-[300px] flex items-center justify-center">
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
                          {numberFormatter(item.value)} ({item.percentage}%)
                        </span>
                      </div>
                  </div>
                </div>
                ))
              )}
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
              {paymentsLoading ? (
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
              )}
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
                  {eventsLoading ? (
                    <tr className="border-b border-white/5">
                      <td colSpan="5" className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Spin size="large" className="mb-4" />
                          <span className="text-white/50">Loading event data...</span>
                        </div>
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
                                {metricsLoading ? <Spin size="small" /> : eventMetrics[event._id]?.views || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {metricsLoading ? <Spin size="small" /> : eventMetrics[event._id]?.cartAdds || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {metricsLoading ? <Spin size="small" /> : eventMetrics[event._id]?.purchases || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {metricsLoading ? <Spin size="small" /> : eventMetrics[event._id]?.conversionRate || '0%'}
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
                                {metricsLoading ? <Spin size="small" /> : eventMetrics[event._id]?.views || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {metricsLoading ? <Spin size="small" /> : eventMetrics[event._id]?.cartAdds || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {metricsLoading ? <Spin size="small" /> : eventMetrics[event._id]?.purchases || 0}
                              </td>
                              <td className="p-4 text-white/70">
                                {metricsLoading ? <Spin size="small" /> : eventMetrics[event._id]?.conversionRate || '0%'}
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
