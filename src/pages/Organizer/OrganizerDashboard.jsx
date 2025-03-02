import { useEffect, useState } from "react";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import SidebarToggle from "../../components/layouts/SidebarToggle";
import axios from "axios";
import url from "../../constants/url"
import { Spin } from 'antd';
import { Link } from "react-router-dom";

// Sample data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "After Hours Neon",
    time: "22:00",
    status: "active",
    ticketsSold: 100,
  },
  {
    id: 2,
    title: "After Hours Neon",
    time: "23:00",
    status: "active",
    ticketsSold: 100,
  },
  {
    id: 3,
    title: "After Hours Neon",
    time: "21:00",
    status: "pending",
    ticketsSold: 100,
  },
  {
    id: 4,
    title: "Summer Vibes",
    time: "20:00",
    status: "active",
    ticketsSold: 100,
  },
  {
    id: 5,
    title: "Beach Party",
    time: "19:00",
    status: "pending",
    ticketsSold: 100,
  },
  {
    id: 6,
    title: "Sunset DJ Set",
    time: "18:30",
    status: "active",
    ticketsSold: 100,
  },
  {
    id: 7,
    title: "Midnight Rave",
    time: "00:00",
    status: "active",
    ticketsSold: 100,
  },
  {
    id: 8,
    title: "Techno Night",
    time: "21:30",
    status: "pending",
    ticketsSold: 100,
  },
];

// Sample data for recent sales
const recentSales = [
  {
    id: 1,
    event: "Neon Night",
    date: "Today 23:45",
    type: "VIP",
    location: "Cloud Nine Club",
    organizer: "kevinBrown",
  },
  {
    id: 2,
    event: "Synthwave Party",
    date: "Today 22:30",
    type: "Early Bird",
    location: "The Grand",
    organizer: "mikeBrown",
  },
  {
    id: 3,
    event: "After Hours Neon",
    date: "Yesterday 22:40",
    type: "VIP",
    location: "Neon Hall",
    organizer: "steveMarks",
  },
];

const OrganizerDashboard = () => {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [oragnizerId, setOragnizerId] = useState(null);
  const [organizer, setOrganizer] = useState({
    bio: "",
    name: "",
    email: "",
    phone: "",
    instagram: "",
    twitter: "",
    website: "",
    url: ""
  });
  const [loading, setLoading] = useState(false)
  const [orgEventList, setOrgEventList] = useState([])
  const [orgEventLoader, setOrgEventLoader] = useState(false);
  const [events, setEvents] = useState([]);
  const [soldTickets, setSoldTickets] = useState(0);
  const [remainCount, setRemainCount] = useState(0);
  const [visitTotal, setVisitTotal] = useState({});

  const displayedEvents = showAllEvents
    ? upcomingEvents
    : upcomingEvents.slice(0, 4);

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedUserOrganizerId = localStorage.getItem('organizerId');
      if (storedUserOrganizerId) {
        setOragnizerId(storedUserOrganizerId);
      } else {
        console.warn("No organizerId found in localStorage");
      }
    };

    loadFromLocalStorage();
    const handleStorageChange = () => {
      loadFromLocalStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchOrganizer = async () => {
    if (oragnizerId) {
      setLoading(true)
      try {
        const response = await axios.get(`${url}/get-organizer/${oragnizerId}`);
        setOrganizer(response.data);
      } catch (error) {
        console.error("Error fetching organizer:", error);
      } finally {
        setLoading(false)
      }
    } else {
      console.log("not found")
    }
  };

  useEffect(() => {
    if (oragnizerId) {
      fetchOrganizer();
    }
  }, [oragnizerId]);

  const fetchOrgEvents = async () => {
    if (!oragnizerId) {
      console.log("oragnizerId is undefined");
      return;
    }
    setOrgEventLoader(true)
    try {
      const response = await axios.get(
        `${url}/organizer-transactions/${oragnizerId}`
      );
      setOrgEventList(response.data?.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setOrgEventLoader(false)
    }
  }

  useEffect(() => {
    if (oragnizerId) {
      fetchOrgEvents();
    }
  }, [oragnizerId]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${url}/event/get-event-by-organizer-id/${oragnizerId}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [oragnizerId]);

  const totalAmount = orgEventList
    .filter(payment => payment.refund !== true)
    .reduce((sum, sale) => {
      if (!sale.amount) return sum;
      const amountAfterFee = (Number(sale.amount / 100) - 0.89) / 1.09;
      return sum + amountAfterFee;
    }, 0);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.start_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= currentDate && event.explore === "YES";
  });

  // Add stats data array
  const statsData = [
    {
      title: "Revenue",
      amount: `$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+6%",
      isPositive: true,
      redirection: "/organizer/wallet",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <path
            d="M7.125 5.5H8V7.25H7.125C7.01009 7.25 6.89631 7.22737 6.79015 7.18339C6.68399 7.13942 6.58753 7.07497 6.50628 6.99372C6.42503 6.91247 6.36058 6.81601 6.31661 6.70985C6.27263 6.60369 6.25 6.48991 6.25 6.375C6.25 6.26009 6.27263 6.14631 6.31661 6.04015C6.36058 5.93399 6.42503 5.83753 6.50628 5.75628C6.58753 5.67503 6.68399 5.61058 6.79015 5.56661C6.89631 5.52263 7.01009 5.5 7.125 5.5ZM9.5 10.5V8.75H10.375C10.6071 8.75 10.8296 8.84219 10.9937 9.00628C11.1578 9.17038 11.25 9.39294 11.25 9.625C11.25 9.85706 11.1578 10.0796 10.9937 10.2437C10.8296 10.4078 10.6071 10.5 10.375 10.5H9.5Z"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.75 8C15.75 9.85652 15.0125 11.637 13.6997 12.9497C12.387 14.2625 10.6065 15 8.75 15C6.89348 15 5.11301 14.2625 3.80025 12.9497C2.4875 11.637 1.75 9.85652 1.75 8C1.75 6.14348 2.4875 4.36301 3.80025 3.05025C5.11301 1.7375 6.89348 1 8.75 1C10.6065 1 12.387 1.7375 13.6997 3.05025C15.0125 4.36301 15.75 6.14348 15.75 8ZM8 3.75C8 3.55109 8.07902 3.36032 8.21967 3.21967C8.36032 3.07902 8.55109 3 8.75 3C8.94891 3 9.13968 3.07902 9.28033 3.21967C9.42098 3.36032 9.5 3.55109 9.5 3.75V4H12C12.1989 4 12.3897 4.07902 12.5303 4.21967C12.671 4.36032 12.75 4.55109 12.75 4.75C12.75 4.94891 12.671 5.13968 12.5303 5.28033C12.3897 5.42098 12.1989 5.5 12 5.5H9.5V7.25H10.375C11.0049 7.25 11.609 7.50022 12.0544 7.94562C12.4998 8.39102 12.75 8.99511 12.75 9.625C12.75 10.2549 12.4998 10.859 12.0544 11.3044C11.609 11.7498 11.0049 12 10.375 12H9.5V12.25C9.5 12.4489 9.42098 12.6397 9.28033 12.7803C9.13968 12.921 8.94891 13 8.75 13C8.55109 13 8.36032 12.921 8.21967 12.7803C8.07902 12.6397 8 12.4489 8 12.25V12H5.5C5.30109 12 5.11032 11.921 4.96967 11.7803C4.82902 11.6397 4.75 11.4489 4.75 11.25C4.75 11.0511 4.82902 10.8603 4.96967 10.7197C5.11032 10.579 5.30109 10.5 5.5 10.5H8V8.75H7.125C6.49511 8.75 5.89102 8.49978 5.44562 8.05438C5.00022 7.60898 4.75 7.00489 4.75 6.375C4.75 5.74511 5.00022 5.14102 5.44562 4.69562C5.89102 4.25022 6.49511 4 7.125 4H8V3.75Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
    },
    {
      title: "Events",
      amount: `${events.filter(event => event.explore === 'YES').length}`,
      change: "-4%",
      isPositive: false,
      redirection: "",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 4.5C1.5 4.10218 1.65804 3.72064 1.93934 3.43934C2.22064 3.15804 2.60218 3 3 3H14C14.3978 3 14.7794 3.15804 15.0607 3.43934C15.342 3.72064 15.5 4.10218 15.5 4.5V5.5C15.5 5.776 15.273 5.994 15.005 6.062C14.5743 6.1718 14.1925 6.42192 13.9198 6.77286C13.6472 7.1238 13.4991 7.55557 13.4991 8C13.4991 8.44443 13.6472 8.8762 13.9198 9.22714C14.1925 9.57808 14.5743 9.8282 15.005 9.938C15.273 10.006 15.5 10.224 15.5 10.5V11.5C15.5 11.8978 15.342 12.2794 15.0607 12.5607C14.7794 12.842 14.3978 13 14 13H3C2.60218 13 2.22064 12.842 1.93934 12.5607C1.65804 12.2794 1.5 11.8978 1.5 11.5V10.5C1.5 10.224 1.727 10.006 1.995 9.938C2.42565 9.8282 2.80747 9.57808 3.08016 9.22714C3.35285 8.8762 3.50088 8.44443 3.50088 8C3.50088 7.55557 3.35285 7.1238 3.08016 6.77286C2.80747 6.42192 2.42565 6.1718 1.995 6.062C1.727 5.994 1.5 5.776 1.5 5.5V4.5ZM10.5 5.75C10.5 5.55109 10.579 5.36032 10.7197 5.21967C10.8603 5.07902 11.0511 5 11.25 5C11.4489 5 11.6397 5.07902 11.7803 5.21967C11.921 5.36032 12 5.55109 12 5.75V6.75C12 6.94891 11.921 7.13968 11.7803 7.28033C11.6397 7.42098 11.4489 7.5 11.25 7.5C11.0511 7.5 10.8603 7.42098 10.7197 7.28033C10.579 7.13968 10.5 6.94891 10.5 6.75V5.75ZM11.25 8.5C11.0511 8.5 10.8603 8.57902 10.7197 8.71967C10.579 8.86032 10.5 9.05109 10.5 9.25V10.25C10.5 10.4489 10.579 10.6397 10.7197 10.7803C10.8603 10.921 11.0511 11 11.25 11C11.4489 11 11.6397 10.921 11.7803 10.7803C11.921 10.6397 12 10.4489 12 10.25V9.25C12 9.05109 11.921 8.86032 11.7803 8.71967C11.6397 8.57902 11.4489 8.5 11.25 8.5Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
    },
    {
      title: "Currently Live",
      amount: `${pastEvents.length}`,
      change: "+8%",
      isPositive: true,
      redirection: "/organizer/events",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.25 15C10.1065 15 11.887 14.2625 13.1997 12.9497C14.5125 11.637 15.25 9.85652 15.25 8C15.25 6.14348 14.5125 4.36301 13.1997 3.05025C11.887 1.7375 10.1065 1 8.25 1C6.39348 1 4.61301 1.7375 3.30025 3.05025C1.9875 4.36301 1.25 6.14348 1.25 8C1.25 9.85652 1.9875 11.637 3.30025 12.9497C4.61301 14.2625 6.39348 15 8.25 15ZM12.094 6.209C12.2157 6.05146 12.2699 5.85202 12.2446 5.65454C12.2193 5.45706 12.1165 5.27773 11.959 5.156C11.8015 5.03427 11.602 4.9801 11.4045 5.00542C11.2071 5.03073 11.0277 5.13346 10.906 5.291L7.206 10.081L5.557 8.248C5.49174 8.17247 5.41207 8.11073 5.32264 8.06639C5.23322 8.02205 5.13584 7.99601 5.03622 7.98978C4.9366 7.98356 4.83674 7.99729 4.7425 8.03016C4.64825 8.06303 4.56151 8.11438 4.48737 8.1812C4.41322 8.24803 4.35316 8.32898 4.31071 8.41931C4.26825 8.50965 4.24425 8.60755 4.24012 8.70728C4.23599 8.807 4.25181 8.90656 4.28664 9.00009C4.32148 9.09363 4.37464 9.17927 4.443 9.252L6.693 11.752C6.76649 11.8335 6.85697 11.8979 6.95806 11.9406C7.05915 11.9833 7.16838 12.0034 7.27805 11.9993C7.38772 11.9952 7.49515 11.967 7.59277 11.9169C7.69038 11.8667 7.7758 11.7958 7.843 11.709L12.094 6.209Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
    },
    {
      title: "Total Visits",
      amount: `${visitTotal?.totalCount?.toLocaleString('en-US')}`,
      change: "+8%",
      isPositive: true,
      redirection: "",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 9.5C8.39782 9.5 8.77936 9.34196 9.06066 9.06066C9.34196 8.77936 9.5 8.39782 9.5 8C9.5 7.60218 9.34196 7.22064 9.06066 6.93934C8.77936 6.65804 8.39782 6.5 8 6.5C7.60218 6.5 7.22064 6.65804 6.93934 6.93934C6.65804 7.22064 6.5 7.60218 6.5 8C6.5 8.39782 6.65804 8.77936 6.93934 9.06066C7.22064 9.34196 7.60218 9.5 8 9.5Z"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.38008 8.28C1.31699 8.0966 1.31699 7.89739 1.38008 7.714C1.85645 6.33737 2.75026 5.14356 3.93704 4.29881C5.12382 3.45407 6.54449 3.00044 8.00122 3.0011C9.45794 3.00176 10.8782 3.45667 12.0642 4.3025C13.2502 5.14832 14.143 6.34294 14.6181 7.72C14.6812 7.90339 14.6812 8.1026 14.6181 8.286C14.1419 9.66298 13.2481 10.8572 12.0612 11.7022C10.8743 12.5472 9.45342 13.001 7.99644 13.0003C6.53946 12.9997 5.11896 12.5446 3.93282 11.6985C2.74669 10.8524 1.85399 9.65741 1.37908 8.28H1.38008ZM11.0001 8C11.0001 8.79565 10.684 9.55871 10.1214 10.1213C9.55879 10.6839 8.79573 11 8.00008 11C7.20443 11 6.44137 10.6839 5.87876 10.1213C5.31615 9.55871 5.00008 8.79565 5.00008 8C5.00008 7.20435 5.31615 6.44129 5.87876 5.87868C6.44137 5.31607 7.20443 5 8.00008 5C8.79573 5 9.55879 5.31607 10.1214 5.87868C10.684 6.44129 11.0001 7.20435 11.0001 8Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${capitalizedMonth} ${day}, ${hours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const fetchEarnings = async () => {
      for (const event of events) {
        await fetchRemainEvent(event._id);
      }
    };
    fetchEarnings();
  }, [events]);

  const fetchRemainEvent = async (id) => {
    try {
      const response = await axios.get(`${url}/remain-tickets/${id}`);

      if (response.data) {
        const sold = response.data.reduce((acc, event) => acc + Number(event.tickets_sold), 0);
        const remaining = response.data.reduce((acc, event) => acc + Number(event.remaining_tickets), 0);

        setSoldTickets((prev) => ({ ...prev, [id]: sold }));
        setRemainCount((prev) => ({ ...prev, [id]: remaining }));
      }
    } catch (error) {
      console.error(`Error fetching remain events for id: ${id}`, error);
    }
  };

  const visitCount = async () => {
    try {
      const response = await axios.get(`${url}/visit/get-visit-count/${oragnizerId}`);
      setVisitTotal(response.data)
    } catch (error) {
      console.error(`Error fetching remain events for id: ${oragnizerId}`, error);
    }
  }

  useEffect(() => {
    visitCount()
  }, [oragnizerId])

  return (
    <SidebarLayout>
      <div className="m-4 mb-2 z-20">
        <SidebarToggle />
      </div>
      <div className="min-h-screen text-white p-6 max-w-5xl mx-auto @container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome back, {organizer?.name}</h1>
          <p className="text-gray-400">
            Here you can see an overview of your organization
          </p>
        </div>
        {
          orgEventLoader ? (
            <>
              <div className='text-center'>
                <Spin size="default" />
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {statsData.map((stat, index) => (
                    <Link
                      key={index}
                      className={`p-4 rounded-xl border border-white/5 bg-opacity-5 backdrop-blur-sm ${stat.title === "Revenue" || stat.title === "Currently Live" ? "" : "cursor-default"}`}
                      to={stat.redirection}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-start justify-between w-full">
                          <div className="flex flex-col items-start gap-3">
                            <p className="text-gray-400 flex items-center">
                              <span className={`${stat.title === "Revenue" || stat.title === "Currently Live" ? "hover:underline" : ""}`}>{stat.title}</span>
                              {
                                stat.title === "Revenue" || stat.title === "Currently Live" ? (
                                  <span className="ml-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4.22007 11.78C4.07962 11.6394 4.00073 11.4488 4.00073 11.25C4.00073 11.0512 4.07962 10.8606 4.22007 10.72L9.44007 5.5H5.75007C5.55116 5.5 5.36039 5.42098 5.21974 5.28033C5.07909 5.13968 5.00007 4.94891 5.00007 4.75C5.00007 4.55109 5.07909 4.36032 5.21974 4.21967C5.36039 4.07902 5.55116 4 5.75007 4H11.2501C11.449 4 11.6398 4.07902 11.7804 4.21967C11.9211 4.36032 12.0001 4.55109 12.0001 4.75V10.25C12.0001 10.4489 11.9211 10.6397 11.7804 10.7803C11.6398 10.921 11.449 11 11.2501 11C11.0512 11 10.8604 10.921 10.7197 10.7803C10.5791 10.6397 10.5001 10.4489 10.5001 10.25V6.56L5.28007 11.78C5.13945 11.9205 4.94882 11.9993 4.75007 11.9993C4.55132 11.9993 4.3607 11.9205 4.22007 11.78Z"
                                        fill="white"
                                        fillOpacity="0.5"
                                      />
                                    </svg>
                                  </span>
                                ) : (
                                  ""
                                )
                              }
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-2xl font-bold">{stat.amount}</p>
                              {/* <div
                                className={`${stat.isPositive
                                    ? "text-green-500 bg-green-500/10 border-green-500/20"
                                    : "text-red-500 bg-red-500/10 border-red-500/20"
                                  } border h-6 px-2 flex items-center justify-center rounded-full text-xs`}
                              >
                                {stat.change}
                              </div> */}
                            </div>
                          </div>
                          <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
                            {stat.icon}
                          </div>
                        </div>
                      </div>
                    </Link>

                  ))}
                </div>

                {/* Upcoming Events */}
                <div className="border rounded-xl border-white/10 overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-white/10 p-4 bg-white/5 justify-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1 4.5C1 4.10218 1.15804 3.72064 1.43934 3.43934C1.72064 3.15804 2.10218 3 2.5 3H13.5C13.8978 3 14.2794 3.15804 14.5607 3.43934C14.842 3.72064 15 4.10218 15 4.5V5.5C15 5.776 14.773 5.994 14.505 6.062C14.0743 6.1718 13.6925 6.42192 13.4198 6.77286C13.1472 7.1238 12.9991 7.55557 12.9991 8C12.9991 8.44443 13.1472 8.8762 13.4198 9.22714C13.6925 9.57808 14.0743 9.8282 14.505 9.938C14.773 10.006 15 10.224 15 10.5V11.5C15 11.8978 14.842 12.2794 14.5607 12.5607C14.2794 12.842 13.8978 13 13.5 13H2.5C2.10218 13 1.72064 12.842 1.43934 12.5607C1.15804 12.2794 1 11.8978 1 11.5V10.5C1 10.224 1.227 10.006 1.495 9.938C1.92565 9.8282 2.30747 9.57808 2.58016 9.22714C2.85285 8.8762 3.00088 8.44443 3.00088 8C3.00088 7.55557 2.85285 7.1238 2.58016 6.77286C2.30747 6.42192 1.92565 6.1718 1.495 6.062C1.227 5.994 1 5.776 1 5.5V4.5ZM10 5.75C10 5.55109 10.079 5.36032 10.2197 5.21967C10.3603 5.07902 10.5511 5 10.75 5C10.9489 5 11.1397 5.07902 11.2803 5.21967C11.421 5.36032 11.5 5.55109 11.5 5.75V6.75C11.5 6.94891 11.421 7.13968 11.2803 7.28033C11.1397 7.42098 10.9489 7.5 10.75 7.5C10.5511 7.5 10.3603 7.42098 10.2197 7.28033C10.079 7.13968 10 6.94891 10 6.75V5.75ZM10.75 8.5C10.5511 8.5 10.3603 8.57902 10.2197 8.71967C10.079 8.86032 10 9.05109 10 9.25V10.25C10 10.4489 10.079 10.6397 10.2197 10.7803C10.3603 10.921 10.5511 11 10.75 11C10.9489 11 11.1397 10.921 11.2803 10.7803C11.421 10.6397 11.5 10.4489 11.5 10.25V9.25C11.5 9.05109 11.421 8.86032 11.2803 8.71967C11.1397 8.57902 10.9489 8.5 10.75 8.5Z"
                        fill="white"
                        fillOpacity="0.5"
                      />
                    </svg>
                    <h2 className="text-sm font-bold">Your upcoming events</h2>
                  </div>

                  <div className={`grid grid-cols-1 ${pastEvents.length === 1 ? "@4xl:grid-cols-1" : "@4xl:grid-cols-1"} overflow-hidden`}>
                    {pastEvents.filter(event => event.explore === 'YES').map((event) => {
                      const totalTickets = (soldTickets[event._id] || 0) + (remainCount[event._id] || 0);
                      const soldPercentage = totalTickets > 0 ? (soldTickets[event._id] || 0) / totalTickets * 100 : 0;
                      return (
                        <div
                          key={event._id}
                          className="p-4 flex items-center justify-between relative before:absolute before:-left-1 before:top-0 before:z-10 before:h-screen before:w-px before:bg-[#212121] before:content-[''] after:absolute after:-top-1 after:left-0 after:z-10 after:h-px after:w-screen after:bg-[#212121] after:content-['']"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-600 rounded-lg"></div>
                            <div>
                              <p className="font-semibold">{event.event_name}</p>
                              <p className="text-white/70 flex items-center gap-x-2 text-sm">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14ZM7.65625 2.625C7.65625 2.45095 7.58711 2.28403 7.46404 2.16096C7.34097 2.03789 7.17405 1.96875 7 1.96875C6.82595 1.96875 6.65903 2.03789 6.53596 2.16096C6.41289 2.28403 6.34375 2.45095 6.34375 2.625V7C6.34375 7.36225 6.63775 7.65625 7 7.65625H10.5C10.674 7.65625 10.841 7.58711 10.964 7.46404C11.0871 7.34097 11.1562 7.17405 11.1562 7C11.1562 6.82595 11.0871 6.65903 10.964 6.53596C10.841 6.41289 10.674 6.34375 10.5 6.34375H7.65625V2.625Z"
                                    fill="white"
                                    fillOpacity="0.4"
                                  />
                                </svg>
                                {formatDate(event.start_date)}
                              </p>
                            </div>
                          </div>
                          <div className="text-white/70 text-sm flex flex-col gap-y-2">
                            <span className="text-xs">Tickets Sold</span>
                            <span className="text-white">
                              {soldTickets[event._id] || 0}/{totalTickets || 100}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setShowAllEvents(!showAllEvents)}
                    className="text-white/70 flex items-center gap-2 p-4 border-t border-white/10 w-full justify-center hover:bg-white/5 transition-all duration-300 group"
                  >
                    <span className="group-hover:underline underline-offset-4">
                      {showAllEvents ? "Show less" : "See all events"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      className={`transition-transform duration-300 ${showAllEvents ? "rotate-90" : ""
                        }`}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.72007 4.22001C6.8607 4.07956 7.05132 4.00067 7.25007 4.00067C7.44882 4.00067 7.63945 4.07956 7.78007 4.22001L11.0301 7.47001C11.1705 7.61064 11.2494 7.80126 11.2494 8.00001C11.2494 8.19876 11.1705 8.38939 11.0301 8.53001L7.78007 11.78C7.6379 11.9125 7.44985 11.9846 7.25555 11.9812C7.06125 11.9778 6.87586 11.899 6.73845 11.7616C6.60104 11.6242 6.52233 11.4388 6.5189 11.2445C6.51547 11.0502 6.58759 10.8622 6.72007 10.72L9.44007 8.00001L6.72007 5.28001C6.57962 5.13939 6.50073 4.94876 6.50073 4.75001C6.50073 4.55126 6.57962 4.36064 6.72007 4.22001Z"
                        fill="white"
                        fillOpacity="0.5"
                      />
                    </svg>
                  </button>
                </div>

                {/* Recent Sales Table */}
                <div className="border rounded-xl border-white/10 overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-white/10 p-4 bg-white/5 justify-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8ZM8.75 3.75C8.75 3.55109 8.67098 3.36032 8.53033 3.21967C8.38968 3.07902 8.19891 3 8 3C7.80109 3 7.61032 3.07902 7.46967 3.21967C7.32902 3.36032 7.25 3.55109 7.25 3.75V8C7.25 8.414 7.586 8.75 8 8.75H11.25C11.4489 8.75 11.6397 8.67098 11.7803 8.53033C11.921 8.38968 12 8.19891 12 8C12 7.80109 11.921 7.61032 11.7803 7.46967C11.6397 7.32902 11.4489 7.25 11.25 7.25H8.75V3.75Z"
                        fill="white"
                        fillOpacity="0.5"
                      />
                    </svg>
                    <h2 className="text-sm font-bold">Recent sales</h2>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm">
                      <thead className="text-sm w-full">
                        <tr className="text-left text-white/60 [&>th]:font-medium [&>th]:min-w-[180px]">
                          <th className="p-4">
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                data-selected={
                                  location.pathname === "/organizer/profile" ? "true" : "false"
                                }
                                className={`sidebar-icon fill-white data-[selected=false]:opacity-50 group-hover:opacity-100 data-[selected=true]:opacity-100`}
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8ZM10 6C10 6.53043 9.78929 7.03914 9.41421 7.41421C9.03914 7.78929 8.53043 8 8 8C7.46957 8 6.96086 7.78929 6.58579 7.41421C6.21071 7.03914 6 6.53043 6 6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4C8.53043 4 9.03914 4.21071 9.41421 4.58579C9.78929 4.96086 10 5.46957 10 6ZM8 9C6.175 9 4.578 9.977 3.705 11.437C4.21992 12.0814 4.87345 12.6016 5.61703 12.9587C6.3606 13.3159 7.1751 13.5009 8 13.5C8.82473 13.5007 9.63904 13.3157 10.3824 12.9585C11.1258 12.6014 11.7792 12.0813 12.294 11.437C11.8506 10.6937 11.2217 10.0783 10.469 9.65112C9.71628 9.22392 8.8655 8.99956 8 9Z"
                                />
                              </svg>
                              Name
                            </div>
                          </th>
                          <th className="p-4">
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M11.4476 14.0671C11.2063 14.6032 10.9064 15.1283 10.5469 15.5826C13.5301 14.5771 15.7261 11.8605 15.9679 8.59998H14.9059C13.61 8.59998 12.569 9.6344 12.3584 10.9131C12.1642 12.0918 11.8535 13.1651 11.4476 14.0671Z"
                                  fill="#ffffff"
                                  fillOpacity="50%"
                                />
                                <path
                                  d="M9.09847 8.59998C10.4553 8.59998 11.5652 9.73192 11.316 11.0657C10.7747 13.9626 9.48934 15.9999 7.98984 15.9999C6.09247 15.9999 4.53794 12.7379 4.3999 8.59998H9.09847Z"
                                  fill="#ffffff"
                                  fillOpacity="50%"
                                />
                                <path
                                  d="M12.3859 5.25936C12.5844 6.55002 13.6301 7.59924 14.936 7.59924H15.9802C15.8153 4.25014 13.5909 1.44261 10.5469 0.416626C10.9064 0.870919 11.2063 1.39598 11.4476 1.93211C11.8733 2.87812 12.1942 4.01254 12.3859 5.25936Z"
                                  fill="#ffffff"
                                  fillOpacity="50%"
                                />
                                <path
                                  d="M11.3563 5.1582C11.5832 6.48521 10.4781 7.59987 9.13181 7.59987H4.39453C4.48829 3.3675 6.06222 0 7.99003 0C9.52789 0 10.8405 2.14285 11.3563 5.1582Z"
                                  fill="#ffffff"
                                  fillOpacity="50%"
                                />
                                <path
                                  d="M3.39431 7.59924C3.43975 5.43596 3.85245 3.44355 4.53261 1.93211C4.77385 1.39598 5.07376 0.870919 5.43336 0.416626C2.38936 1.44261 0.164915 4.25014 0 7.59924H3.39431Z"
                                  fill="#ffffff"
                                  fillOpacity="50%"
                                />
                                <path
                                  d="M0.012207 8.59998C0.253963 11.8605 2.45003 14.5771 5.43323 15.5826C5.07363 15.1283 4.77372 14.6032 4.53248 14.0671C3.87333 12.6024 3.46538 10.6859 3.39944 8.59998H0.012207Z"
                                  fill="#ffffff"
                                  fillOpacity="50%"
                                />
                              </svg>
                              Event
                            </div>
                          </th>
                          <th className="p-4">
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M1 4.5C1 4.10218 1.15804 3.72064 1.43934 3.43934C1.72064 3.15804 2.10218 3 2.5 3H13.5C13.8978 3 14.2794 3.15804 14.5607 3.43934C14.842 3.72064 15 4.10218 15 4.5V5.5C15 5.776 14.773 5.994 14.505 6.062C14.0743 6.1718 13.6925 6.42192 13.4198 6.77286C13.1472 7.1238 12.9991 7.55557 12.9991 8C12.9991 8.44443 13.1472 8.8762 13.4198 9.22714C13.6925 9.57808 14.0743 9.8282 14.505 9.938C14.773 10.006 15 10.224 15 10.5V11.5C15 11.8978 14.842 12.2794 14.5607 12.5607C14.2794 12.842 13.8978 13 13.5 13H2.5C2.10218 13 1.72064 12.842 1.43934 12.5607C1.15804 12.2794 1 11.8978 1 11.5V10.5C1 10.224 1.227 10.006 1.495 9.938C1.92565 9.8282 2.30747 9.57808 2.58016 9.22714C2.85285 8.8762 3.00088 8.44443 3.00088 8C3.00088 7.55557 2.85285 7.1238 2.58016 6.77286C2.30747 6.42192 1.92565 6.1718 1.495 6.062C1.227 5.994 1 5.776 1 5.5V4.5ZM10 5.75C10 5.55109 10.079 5.36032 10.2197 5.21967C10.3603 5.07902 10.5511 5 10.75 5C10.9489 5 11.1397 5.07902 11.2803 5.21967C11.421 5.36032 11.5 5.55109 11.5 5.75V6.75C11.5 6.94891 11.421 7.13968 11.2803 7.28033C11.1397 7.42098 10.9489 7.5 10.75 7.5C10.5511 7.5 10.3603 7.42098 10.2197 7.28033C10.079 7.13968 10 6.94891 10 6.75V5.75ZM10.75 8.5C10.5511 8.5 10.3603 8.57902 10.2197 8.71967C10.079 8.86032 10 9.05109 10 9.25V10.25C10 10.4489 10.079 10.6397 10.2197 10.7803C10.3603 10.921 10.5511 11 10.75 11C10.9489 11 11.1397 10.921 11.2803 10.7803C11.421 10.6397 11.5 10.4489 11.5 10.25V9.25C11.5 9.05109 11.421 8.86032 11.2803 8.71967C11.1397 8.57902 10.9489 8.5 10.75 8.5Z"
                                  fill="white"
                                  fillOpacity="0.5"
                                />
                              </svg>
                              Ticket
                            </div>
                          </th>
                          <th className="p-4">
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4 1.75C4 1.55109 4.07902 1.36032 4.21967 1.21967C4.36032 1.07902 4.55109 1 4.75 1C4.94891 1 5.13968 1.07902 5.28033 1.21967C5.42098 1.36032 5.5 1.55109 5.5 1.75V3H10.5V1.75C10.5 1.55109 10.579 1.36032 10.7197 1.21967C10.8603 1.07902 11.0511 1 11.25 1C11.4489 1 11.6397 1.07902 11.7803 1.21967C11.921 1.36032 12 1.55109 12 1.75V3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14H4C3.46957 14 2.96086 13.7893 2.58579 13.4142C2.21071 13.0391 2 12.5304 2 12V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3V1.75ZM4.5 6C4.23478 6 3.98043 6.10536 3.79289 6.29289C3.60536 6.48043 3.5 6.73478 3.5 7V11.5C3.5 11.7652 3.60536 12.0196 3.79289 12.2071C3.98043 12.3946 4.23478 12.5 4.5 12.5H11.5C11.7652 12.5 12.0196 12.3946 12.2071 12.2071C12.3946 12.0196 12.5 11.7652 12.5 11.5V7C12.5 6.73478 12.3946 6.48043 12.2071 6.29289C12.0196 6.10536 11.7652 6 11.5 6H4.5Z"
                                  fill="white"
                                  fillOpacity="0.5"
                                />
                              </svg>
                              Date
                            </div>
                          </th>
                          <th className="p-4">
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="16"
                                viewBox="0 0 17 16"
                                fill="none"
                              >
                                <path
                                  d="M6.875 5.5H7.75V7.25H6.875C6.76009 7.25 6.64631 7.22737 6.54015 7.18339C6.43399 7.13942 6.33753 7.07497 6.25628 6.99372C6.17503 6.91247 6.11058 6.81601 6.06661 6.70985C6.02263 6.60369 6 6.48991 6 6.375C6 6.26009 6.02263 6.14631 6.06661 6.04015C6.11058 5.93399 6.17503 5.83753 6.25628 5.75628C6.33753 5.67503 6.43399 5.61058 6.54015 5.56661C6.64631 5.52263 6.76009 5.5 6.875 5.5ZM9.25 10.5V8.75H10.125C10.3571 8.75 10.5796 8.84219 10.7437 9.00628C10.9078 9.17038 11 9.39294 11 9.625C11 9.85706 10.9078 10.0796 10.7437 10.2437C10.5796 10.4078 10.3571 10.5 10.125 10.5H9.25Z"
                                  fill="white"
                                  fillOpacity="0.5"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M15.5 8C15.5 9.85652 14.7625 11.637 13.4497 12.9497C12.137 14.2625 10.3565 15 8.5 15C6.64348 15 4.86301 14.2625 3.55025 12.9497C2.2375 11.637 1.5 9.85652 1.5 8C1.5 6.14348 2.2375 4.36301 3.55025 3.05025C4.86301 1.7375 6.64348 1 8.5 1C10.3565 1 12.137 1.7375 13.4497 3.05025C14.7625 4.36301 15.5 6.14348 15.5 8ZM7.75 3.75C7.75 3.55109 7.82902 3.36032 7.96967 3.21967C8.11032 3.07902 8.30109 3 8.5 3C8.69891 3 8.88968 3.07902 9.03033 3.21967C9.17098 3.36032 9.25 3.55109 9.25 3.75V4H11.75C11.9489 4 12.1397 4.07902 12.2803 4.21967C12.421 4.36032 12.5 4.55109 12.5 4.75C12.5 4.94891 12.421 5.13968 12.2803 5.28033C12.1397 5.42098 11.9489 5.5 11.75 5.5H9.25V7.25H10.125C10.7549 7.25 11.359 7.50022 11.8044 7.94562C12.2498 8.39102 12.5 8.99511 12.5 9.625C12.5 10.2549 12.2498 10.859 11.8044 11.3044C11.359 11.7498 10.7549 12 10.125 12H9.25V12.25C9.25 12.4489 9.17098 12.6397 9.03033 12.7803C8.88968 12.921 8.69891 13 8.5 13C8.30109 13 8.11032 12.921 7.96967 12.7803C7.82902 12.6397 7.75 12.4489 7.75 12.25V12H5.25C5.05109 12 4.86032 11.921 4.71967 11.7803C4.57902 11.6397 4.5 11.4489 4.5 11.25C4.5 11.0511 4.57902 10.8603 4.71967 10.7197C4.86032 10.579 5.05109 10.5 5.25 10.5H7.75V8.75H6.875C6.24511 8.75 5.64102 8.49978 5.19562 8.05438C4.75022 7.60898 4.5 7.00489 4.5 6.375C4.5 5.74511 4.75022 5.14102 5.19562 4.69562C5.64102 4.25022 6.24511 4 6.875 4H7.75V3.75Z"
                                  fill="white"
                                  fillOpacity="0.5"
                                />
                              </svg>
                              Price
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgEventList.slice(0, 10).map((sale) => (
                          <tr
                            key={sale.id}
                            className="border-t border-white/10 w-full"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-200 flex items-center justify-center">
                                  {sale.firstName.charAt(0).toUpperCase()}
                                </div>
                                <span>{sale.firstName}</span>
                              </div>
                            </td>
                            <td className="p-4 w-full ">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-purple-600 rounded-md"></div>
                                {sale?.party?.event_name}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs`}>
                                  {sale?.tickets?.ticket_name} x {sale.count}
                                </span>
                              </span>
                            </td>
                            <td className="p-4">
                              {(() => {
                                const dateObj = new Date(sale.date);
                                const formattedDate = dateObj.toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                });
                                const formattedTime = dateObj.toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                });
                                return `${formattedDate} at ${formattedTime}`;
                              })()}
                            </td>
                            <td className="p-4">${(((sale.amount / 100) - 0.89) / 1.09).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )
        }
      </div >
    </SidebarLayout >
  );
};

export default OrganizerDashboard;