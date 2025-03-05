import { useParams } from "react-router-dom";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import SidebarToggle from "../../components/layouts/SidebarToggle";
import {
  Tabs,
  TabsList,
  TabTrigger,
  TabsContent,
} from "../../components/ui/Tabs";
import { useEffect, useState } from "react";
import SalesTab from "./SalesTab";
import AnalyticsTab from "./AnalyticsTab";
import TicketTab from "./TicketTab";
import PromosTab from "./PromosTab";
import CustomerTab from "./CustomerTab";
import SettingTab from "./SettingTab";
import TeamTab from "./TeamTab";
import axios from "axios";
import url from "../../constants/url"
import { Spin } from 'antd';

// Mock data structure (you should replace this with actual data fetching)
const eventData = {
  1: {
    id: 1,
    name: "After Hours Neon",
    date: "Dec 28, 22:00",
    location: "Cloud Nine",
    revenue: "$10,240",
    totalTickets: 500,
    ticketsSold: 256,
    description:
      "Experience the ultimate neon-themed party with the best electronic music.",
    organizer: "Neon Events Ltd",
    ticketPrice: "$40",
    status: "live",
  },
  // Add more events as needed
};

export default function EventDetails() {
  const { id } = useParams();
  //const event = eventData[id];
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState({})

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = "20" + date.getFullYear().toString().slice(-2);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${dayOfWeek}, ${day} ${month} ${hours}:${minutes} ${ampm}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return "N/A";

    const [hour, minute] = timeStr.split(':');
    if (!hour || !minute) return "Invalid Time";

    const hourNum = parseInt(hour, 10);
    const suffix = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  const fetchEvent = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}/event/get-event-by-id/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent()
  }, [id])

  const TABS = [
    {
      id: "overview",
      label: "Overview",
      icon: (
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
            d="M2 3.75C2 3.55109 2.07902 3.36032 2.21967 3.21967C2.36032 3.07902 2.55109 3 2.75 3H13.25C13.4489 3 13.6397 3.07902 13.7803 3.21967C13.921 3.36032 14 3.55109 14 3.75C14 3.94891 13.921 4.13968 13.7803 4.28033C13.6397 4.42098 13.4489 4.5 13.25 4.5H2.75C2.55109 4.5 2.36032 4.42098 2.21967 4.28033C2.07902 4.13968 2 3.94891 2 3.75ZM2 8C2 7.80109 2.07902 7.61032 2.21967 7.46967C2.36032 7.32902 2.55109 7.25 2.75 7.25H13.25C13.4489 7.25 13.6397 7.32902 13.7803 7.46967C13.921 7.61032 14 7.80109 14 8C14 8.19891 13.921 8.38968 13.7803 8.53033C13.6397 8.67098 13.4489 8.75 13.25 8.75H2.75C2.55109 8.75 2.36032 8.67098 2.21967 8.53033C2.07902 8.38968 2 8.19891 2 8ZM2 12.25C2 12.0511 2.07902 11.8603 2.21967 11.7197C2.36032 11.579 2.55109 11.5 2.75 11.5H7.25C7.44891 11.5 7.63968 11.579 7.78033 11.7197C7.92098 11.8603 8 12.0511 8 12.25C8 12.4489 7.92098 12.6397 7.78033 12.7803C7.63968 12.921 7.44891 13 7.25 13H2.75C2.55109 13 2.36032 12.921 2.21967 12.7803C2.07902 12.6397 2 12.4489 2 12.25Z"
            fill="white"
          />
        </svg>
      ),
      content: (
        <div className="grid gap-6 text-sm">
          <div className="rounded-xl border border-white/10 grid gap-6 p-4">
            <p className="text-white/50 font-semibold">ABOUT</p>
            <div className="flex items-center gap-x-3">
              <div className="bg-white/[0.06] h-8 p-2 px-2.5 w-fit rounded-full flex items-center justify-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M12.6126 1.2575C12.9079 1.05971 13.2626 0.970506 13.6163 1.00509C13.97 1.03968 14.3007 1.19591 14.5521 1.44714C14.8034 1.69837 14.9598 2.02903 14.9946 2.3827C15.0293 2.73638 14.9403 3.09115 14.7426 3.3865L12.8376 6.2425C11.9655 7.5507 10.7273 8.57294 9.27762 9.1815C9.07858 8.61307 8.75408 8.09677 8.32821 7.6709C7.90235 7.24504 7.38604 6.92054 6.81762 6.7215C7.42645 5.27168 8.44905 4.03343 9.75762 3.1615L12.6126 1.2575ZM5.49962 7.9995C4.83658 7.9995 4.2007 8.26289 3.73185 8.73173C3.26301 9.20057 2.99962 9.83645 2.99962 10.4995C2.99974 10.5826 2.97916 10.6644 2.93973 10.7375C2.9003 10.8107 2.84327 10.8728 2.77379 10.9184C2.70431 10.9639 2.62458 10.9915 2.54179 10.9985C2.459 11.0055 2.37577 10.9917 2.29962 10.9585C2.16033 10.8973 2.00573 10.88 1.85634 10.9087C1.70695 10.9374 1.56984 11.0109 1.46319 11.1194C1.35654 11.2279 1.28541 11.3663 1.25923 11.5161C1.23306 11.666 1.25307 11.8203 1.31662 11.9585C1.64897 12.6853 2.22003 13.2765 2.93489 13.6337C3.64975 13.991 4.46536 14.0929 5.24614 13.9224C6.02693 13.752 6.72586 13.3195 7.22678 12.6968C7.72769 12.074 8.00042 11.2987 7.99962 10.4995C7.99962 9.83645 7.73623 9.20057 7.26739 8.73173C6.79855 8.26289 6.16266 7.9995 5.49962 7.9995Z"
                    fill="#A3E635"
                  />
                </svg>
                <span>{event.category}</span>
              </div>
              <div className="bg-white/[0.06] h-8 p-2 px-2.5 w-fit rounded-full flex items-center justify-start gap-2">
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
                    fillOpacity="0.4"
                  />
                </svg>
                <span>{formatTime(event?.open_time)}</span>
              </div>
            </div>
            <p className="tracking-wide leading-6" dangerouslySetInnerHTML={{ __html: event.event_description }}></p>
          </div>

          <div className="rounded-xl border border-white/10 grid gap-6 p-4">
            <p>LOCATION</p>
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="text-lg font-medium">{event.venue_name}</p>
              <span className="text-white/50">
                {event.address}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M13.975 6.50005C14.003 6.77605 13.776 7.00005 13.5 7.00005H9.5C9.36739 7.00005 9.24021 6.94737 9.14645 6.8536C9.05268 6.75983 9 6.63265 9 6.50005V2.50005C9 2.22405 9.225 1.99705 9.5 2.02505C10.6473 2.14095 11.7193 2.64969 12.5346 3.46516C13.3499 4.28063 13.8583 5.35274 13.974 6.50005H13.975Z"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            d="M6.49994 4.02505C6.77594 3.99705 6.99994 4.22405 6.99994 4.50005V8.50005C6.99994 8.63265 7.05262 8.75983 7.14639 8.8536C7.24016 8.94737 7.36733 9.00005 7.49994 9.00005H11.4999C11.7759 9.00005 12.0029 9.22505 11.9749 9.50005C11.8803 10.4416 11.5204 11.337 10.9371 12.0822C10.3537 12.8274 9.5709 13.3917 8.67956 13.7095C7.78821 14.0274 6.82496 14.0858 5.90174 13.878C4.97852 13.6701 4.13324 13.2045 3.46414 12.5353C2.79505 11.8661 2.32961 11.0207 2.12191 10.0974C1.91421 9.17419 1.97279 8.21095 2.29084 7.31966C2.60889 6.42837 3.17334 5.64565 3.9186 5.06244C4.66387 4.47924 5.55833 4.1195 6.49994 4.02505Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
      content: <AnalyticsTab eventId={event._id} />,
    },
    {
      id: "sales",
      label: "Sales",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M6.49107 5.67857H7.30357V7.30357H6.49107C6.38437 7.30357 6.27872 7.28256 6.18014 7.24172C6.08156 7.20089 5.99199 7.14104 5.91655 7.0656C5.8411 6.99015 5.78125 6.90058 5.74042 6.802C5.69959 6.70342 5.67857 6.59777 5.67857 6.49107C5.67857 6.38437 5.69959 6.27872 5.74042 6.18014C5.78125 6.08156 5.8411 5.99199 5.91655 5.91655C5.99199 5.8411 6.08156 5.78125 6.18014 5.74042C6.27872 5.69959 6.38437 5.67857 6.49107 5.67857ZM8.69643 10.3214V8.69643H9.50893C9.72442 8.69643 9.93108 8.78203 10.0835 8.9344C10.2358 9.08678 10.3214 9.29344 10.3214 9.50893C10.3214 9.72442 10.2358 9.93108 10.0835 10.0835C9.93108 10.2358 9.72442 10.3214 9.50893 10.3214H8.69643Z"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.5 8C14.5 9.72391 13.8152 11.3772 12.5962 12.5962C11.3772 13.8152 9.72391 14.5 8 14.5C6.27609 14.5 4.62279 13.8152 3.40381 12.5962C2.18482 11.3772 1.5 9.72391 1.5 8C1.5 6.27609 2.18482 4.62279 3.40381 3.40381C4.62279 2.18482 6.27609 1.5 8 1.5C9.72391 1.5 11.3772 2.18482 12.5962 3.40381C13.8152 4.62279 14.5 6.27609 14.5 8ZM7.30357 4.05357C7.30357 3.86887 7.37694 3.69173 7.50755 3.56112C7.63816 3.43052 7.8153 3.35714 8 3.35714C8.1847 3.35714 8.36184 3.43052 8.49245 3.56112C8.62305 3.69173 8.69643 3.86887 8.69643 4.05357V4.28571H11.0179C11.2026 4.28571 11.3797 4.35909 11.5103 4.48969C11.6409 4.6203 11.7143 4.79744 11.7143 4.98214C11.7143 5.16685 11.6409 5.34399 11.5103 5.47459C11.3797 5.6052 11.2026 5.67857 11.0179 5.67857H8.69643V7.30357H9.50893C10.0938 7.30357 10.6548 7.53592 11.0684 7.94951C11.4819 8.36309 11.7143 8.92403 11.7143 9.50893C11.7143 10.0938 11.4819 10.6548 11.0684 11.0684C10.6548 11.4819 10.0938 11.7143 9.50893 11.7143H8.69643V11.9464C8.69643 12.1311 8.62305 12.3083 8.49245 12.4389C8.36184 12.5695 8.1847 12.6429 8 12.6429C7.8153 12.6429 7.63816 12.5695 7.50755 12.4389C7.37694 12.3083 7.30357 12.1311 7.30357 11.9464V11.7143H4.98214C4.79744 11.7143 4.6203 11.6409 4.48969 11.5103C4.35909 11.3797 4.28571 11.2026 4.28571 11.0179C4.28571 10.8332 4.35909 10.656 4.48969 10.5254C4.6203 10.3948 4.79744 10.3214 4.98214 10.3214H7.30357V8.69643H6.49107C5.90617 8.69643 5.34523 8.46408 4.93165 8.05049C4.51806 7.63691 4.28571 7.07597 4.28571 6.49107C4.28571 5.90617 4.51806 5.34523 4.93165 4.93165C5.34523 4.51806 5.90617 4.28571 6.49107 4.28571H7.30357V4.05357Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
      content: <SalesTab eventId={event._id} event={event} />,
    },
    {
      id: "tickets",
      label: "Tickets",
      icon: (
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
      ),
      content: <TicketTab event={event} />,
    },
    {
      id: "customers",
      label: "Customers",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8.00017 8C8.66321 8 9.2991 7.73661 9.76794 7.26777C10.2368 6.79893 10.5002 6.16304 10.5002 5.5C10.5002 4.83696 10.2368 4.20107 9.76794 3.73223C9.2991 3.26339 8.66321 3 8.00017 3C7.33713 3 6.70125 3.26339 6.23241 3.73223C5.76357 4.20107 5.50017 4.83696 5.50017 5.5C5.50017 6.16304 5.76357 6.79893 6.23241 7.26777C6.70125 7.73661 7.33713 8 8.00017 8ZM3.15617 11.763C3.31617 11.134 3.59617 10.553 3.96917 10.043C3.42665 9.93925 2.86504 10.0181 2.37205 10.2672C1.87907 10.5163 1.48246 10.9217 1.24417 11.42C1.10817 11.707 1.34617 12 1.66217 12H3.11117C3.12117 11.923 3.13617 11.844 3.15617 11.763ZM12.8472 11.763C12.8672 11.843 12.8832 11.923 12.8932 12H14.3392C14.6552 12 14.8932 11.707 14.7562 11.421C14.5182 10.9231 14.1221 10.5179 13.6297 10.2686C13.1374 10.0194 12.5764 9.94004 12.0342 10.043C12.4082 10.553 12.6872 11.133 12.8472 11.763ZM14.0002 7.5C14.0002 7.69698 13.9614 7.89204 13.886 8.07403C13.8106 8.25601 13.7001 8.42137 13.5608 8.56066C13.4215 8.69995 13.2562 8.81044 13.0742 8.88582C12.8922 8.9612 12.6972 9 12.5002 9C12.3032 9 12.1081 8.9612 11.9261 8.88582C11.7442 8.81044 11.5788 8.69995 11.4395 8.56066C11.3002 8.42137 11.1897 8.25601 11.1144 8.07403C11.039 7.89204 11.0002 7.69698 11.0002 7.5C11.0002 7.10218 11.1582 6.72064 11.4395 6.43934C11.7208 6.15804 12.1023 6 12.5002 6C12.898 6 13.2795 6.15804 13.5608 6.43934C13.8421 6.72064 14.0002 7.10218 14.0002 7.5ZM3.50017 9C3.898 9 4.27953 8.84196 4.56083 8.56066C4.84214 8.27936 5.00017 7.89782 5.00017 7.5C5.00017 7.10218 4.84214 6.72064 4.56083 6.43934C4.27953 6.15804 3.898 6 3.50017 6C3.10235 6 2.72082 6.15804 2.43951 6.43934C2.15821 6.72064 2.00017 7.10218 2.00017 7.5C2.00017 7.89782 2.15821 8.27936 2.43951 8.56066C2.72082 8.84196 3.10235 9 3.50017 9ZM5.00017 13C4.44817 13 3.98717 12.545 4.12417 12.01C4.34489 11.1495 4.84561 10.387 5.54745 9.84244C6.2493 9.29791 7.11236 9.00236 8.00067 9.00236C8.88899 9.00236 9.75205 9.29791 10.4539 9.84244C11.1557 10.387 11.6565 11.1495 11.8772 12.01C12.0132 12.545 11.5532 13 11.0002 13H5.00017Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
      content: <CustomerTab eventId={event._id} event={event} />,
    },
    {
      id: "promos",
      label: "Promos",
      icon: (
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
            d="M5.25 2C4.65326 2 4.08097 2.23705 3.65901 2.65901C3.23705 3.08097 3 3.65326 3 4.25V13.25C2.99989 13.3876 3.0376 13.5225 3.10902 13.64C3.18044 13.7576 3.28281 13.8532 3.40494 13.9165C3.52707 13.9798 3.66425 14.0083 3.80148 13.9988C3.9387 13.9894 4.07069 13.9424 4.183 13.863L5.875 12.668L7.567 13.863C7.69363 13.9525 7.84491 14.0006 8 14.0006C8.15509 14.0006 8.30637 13.9525 8.433 13.863L10.125 12.668L11.818 13.863C11.9303 13.9421 12.0622 13.9889 12.1993 13.9982C12.3363 14.0075 12.4733 13.979 12.5953 13.9157C12.7172 13.8525 12.8195 13.7569 12.8909 13.6395C12.9622 13.5221 13 13.3874 13 13.25V4.25C13 3.65326 12.7629 3.08097 12.341 2.65901C11.919 2.23705 11.3467 2 10.75 2H5.25ZM10.78 6.28C10.8537 6.21134 10.9128 6.12854 10.9538 6.03654C10.9948 5.94454 11.0168 5.84523 11.0186 5.74452C11.0204 5.64382 11.0018 5.54379 10.9641 5.4504C10.9264 5.35701 10.8703 5.27218 10.799 5.20096C10.7278 5.12974 10.643 5.0736 10.5496 5.03588C10.4562 4.99816 10.3562 4.97963 10.2555 4.98141C10.1548 4.98319 10.0555 5.00523 9.96346 5.04622C9.87146 5.08721 9.78866 5.14631 9.72 5.22L5.22 9.72C5.14631 9.78866 5.08721 9.87146 5.04622 9.96346C5.00523 10.0555 4.98319 10.1548 4.98141 10.2555C4.97963 10.3562 4.99816 10.4562 5.03588 10.5496C5.0736 10.643 5.12974 10.7278 5.20096 10.799C5.27218 10.8703 5.35701 10.9264 5.4504 10.9641C5.54379 11.0018 5.64382 11.0204 5.74452 11.0186C5.84523 11.0168 5.94454 10.9948 6.03654 10.9538C6.12854 10.9128 6.21134 10.8537 6.28 10.78L10.78 6.28ZM7 6.25C7 6.34849 6.9806 6.44602 6.94291 6.53701C6.90522 6.62801 6.84997 6.71069 6.78033 6.78033C6.71069 6.84997 6.62801 6.90522 6.53701 6.94291C6.44602 6.9806 6.34849 7 6.25 7C6.15151 7 6.05398 6.9806 5.96299 6.94291C5.87199 6.90522 5.78931 6.84997 5.71967 6.78033C5.65003 6.71069 5.59478 6.62801 5.55709 6.53701C5.5194 6.44602 5.5 6.34849 5.5 6.25C5.5 6.05109 5.57902 5.86032 5.71967 5.71967C5.86032 5.57902 6.05109 5.5 6.25 5.5C6.44891 5.5 6.63968 5.57902 6.78033 5.71967C6.92098 5.86032 7 6.05109 7 6.25ZM9.75 10.5C9.94891 10.5 10.1397 10.421 10.2803 10.2803C10.421 10.1397 10.5 9.94891 10.5 9.75C10.5 9.55109 10.421 9.36032 10.2803 9.21967C10.1397 9.07902 9.94891 9 9.75 9C9.55109 9 9.36032 9.07902 9.21967 9.21967C9.07902 9.36032 9 9.55109 9 9.75C9 9.94891 9.07902 10.1397 9.21967 10.2803C9.36032 10.421 9.55109 10.5 9.75 10.5Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
      content: <PromosTab eventId={event._id} event={event} />,
    },
    {
      id: "team",
      label: "Team",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8.49995 4.5C8.49995 5.16304 8.23656 5.79893 7.76772 6.26777C7.29888 6.73661 6.66299 7 5.99995 7C5.33691 7 4.70102 6.73661 4.23218 6.26777C3.76334 5.79893 3.49995 5.16304 3.49995 4.5C3.49995 3.83696 3.76334 3.20107 4.23218 2.73223C4.70102 2.26339 5.33691 2 5.99995 2C6.66299 2 7.29888 2.26339 7.76772 2.73223C8.23656 3.20107 8.49995 3.83696 8.49995 4.5ZM10.9 12.006C11.0099 12.548 10.552 13 9.99995 13H1.99995C1.44695 13 0.98995 12.548 1.09795 12.006C1.328 10.8758 1.94159 9.85974 2.83482 9.13C3.72805 8.40027 4.84603 8.00165 5.99945 8.00165C7.15287 8.00165 8.27085 8.40027 9.16408 9.13C10.0573 9.85974 10.6709 10.8758 10.901 12.006H10.9ZM14.002 12H12.412C12.4042 11.9026 12.3908 11.8058 12.372 11.71C12.1813 10.7664 11.7826 9.87714 11.205 9.107C11.94 8.9047 12.7244 8.98961 13.3991 9.34451C14.0738 9.69941 14.5882 10.2977 14.838 11.018C15.018 11.54 14.555 12 14.002 12ZM12 8C12.5304 8 13.0391 7.78929 13.4142 7.41421C13.7892 7.03914 14 6.53043 14 6C14 5.46957 13.7892 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4C11.4695 4 10.9608 4.21071 10.5857 4.58579C10.2107 4.96086 9.99995 5.46957 9.99995 6C9.99995 6.53043 10.2107 7.03914 10.5857 7.41421C10.9608 7.78929 11.4695 8 12 8Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
      content: <TeamTab eventId={event._id} event={event} />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
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
            d="M6.45404 1.45C6.46643 1.32675 6.52412 1.21249 6.61594 1.12936C6.70776 1.04622 6.82717 1.00012 6.95104 1H9.04704C9.17091 1.00012 9.29032 1.04622 9.38214 1.12936C9.47396 1.21249 9.53165 1.32675 9.54404 1.45L9.73004 3.308C10.2634 3.50518 10.7592 3.79196 11.196 4.156L12.899 3.387C13.0121 3.33593 13.1402 3.32873 13.2583 3.3668C13.3764 3.40487 13.4761 3.4855 13.538 3.593L14.585 5.407C14.6472 5.51425 14.6672 5.64075 14.6414 5.76196C14.6155 5.88317 14.5455 5.99045 14.445 6.063L12.928 7.153C13.0239 7.7136 13.0239 8.2864 12.928 8.847L14.444 9.937C14.5447 10.0094 14.6149 10.1166 14.6409 10.2378C14.667 10.3591 14.6471 10.4856 14.585 10.593L13.538 12.407C13.4761 12.5145 13.3764 12.5951 13.2583 12.6332C13.1402 12.6713 13.0121 12.6641 12.899 12.613L11.196 11.845C10.763 12.205 10.268 12.494 9.73004 12.692L9.54404 14.55C9.53165 14.6732 9.47396 14.7875 9.38214 14.8706C9.29032 14.9538 9.17091 14.9999 9.04704 15H6.95104C6.82717 14.9999 6.70776 14.9538 6.61594 14.8706C6.52412 14.7875 6.46643 14.6732 6.45404 14.55L6.26804 12.692C5.73465 12.4949 5.23885 12.2081 4.80204 11.844L3.09904 12.613C2.98596 12.6641 2.85792 12.6713 2.73982 12.6332C2.62172 12.5951 2.522 12.5145 2.46004 12.407L1.41304 10.593C1.35092 10.4858 1.33085 10.3593 1.35672 10.238C1.38258 10.1168 1.45255 10.0095 1.55304 9.937L3.07004 8.847C2.97433 8.28639 2.97433 7.71361 3.07004 7.153L1.55404 6.063C1.45338 5.9906 1.38322 5.88338 1.35716 5.76216C1.33111 5.64094 1.35102 5.51436 1.41304 5.407L2.45904 3.593C2.521 3.4855 2.62072 3.40487 2.73882 3.3668C2.85692 3.32873 2.98496 3.33593 3.09804 3.387L4.80104 4.156C5.23404 3.796 5.72904 3.506 6.26704 3.308L6.45404 1.45ZM6.27704 9.017L6.25504 8.98C5.99022 8.52038 5.91883 7.97439 6.05658 7.46213C6.19432 6.94987 6.52992 6.51332 6.98954 6.2485C7.44916 5.98368 7.99515 5.91229 8.50741 6.05004C9.01967 6.18778 9.45622 6.52338 9.72104 6.983L9.74304 7.02C10.0079 7.47962 10.0792 8.02561 9.9415 8.53787C9.80376 9.05013 9.46816 9.48668 9.00854 9.7515C8.54892 10.0163 8.00293 10.0877 7.49067 9.94996C6.97841 9.81222 6.54186 9.47662 6.27704 9.017Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
      content: <SettingTab />,
    },
  ];

  if (!event) {
    return (
      <SidebarLayout>
        <div className="m-4 mb-2">
          <SidebarToggle />
        </div>
        <div className="min-h-screen text-white p-6 ">
          <div className="border min-h-[300px] border-white/10 border-dashed rounded-xl flex items-center justify-center">
            <div className="text-center font-medium text-white/50">
              Event not found
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const eventDate = new Date(event.start_date);
  eventDate.setHours(0, 0, 0, 0);

  return (
    <SidebarLayout>
      <div className="m-4 mb-2">
        <SidebarToggle />
      </div>
      {
        loading ? (
          <div className='text-center'>
            <Spin size="default" />
          </div>
        ) : (
          <div className="grid gap-12 text-white p-6 max-w-7xl mx-auto">
            <div className="grid gap-6">
              <div className="flex items-center gap-4 text-sm h-8 w-fit rounded-md border border-white/10 border-dashed px-2">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Events
                </button>
                <div className="h-7 w-px bg-white/10" />
                <span className="text-white/50">Event Details</span>
              </div>

              <div className="grid gap-6 @container">
                <div className="w-32 h-32 rounded-lg">
                  <img
                    src={`${event.flyer}`}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex flex-col @4xl:flex-row items-start @4xl:items-end justify-between w-full gap-6">
                    <div className="grid gap-y-3">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">{event.event_name}</h2>
                        <div className="flex items-center justify-center gap-2 text-sm bg-white/[0.05] px-2 h-6 w-fit rounded-full">
                          <div className={`h-2 w-2 rounded-full ${eventDate < currentDate && event.explore === "YES" ? "bg-[#FF5733]" : "bg-[#10B981]" }`}></div>
                          <span className="text-white/50">
                            {
                              eventDate < currentDate && event.explore === "YES" ? "Past" : "Live"
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
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
                              fillOpacity="0.4"
                            />
                          </svg>
                          <span className="text-white/50">{formatDate(event.start_date)}</span>
                        </div>
                        {event.location && (
                          <div className="h-2 w-2 rounded-full bg-white/[0.03]"></div>
                        )}
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
                              d="M7.539 14.841L7.542 14.844L7.544 14.846C7.67522 14.9454 7.83535 14.9993 8 14.9993C8.16465 14.9993 8.32478 14.9454 8.456 14.846L8.458 14.844L8.461 14.841L8.473 14.832C8.53744 14.7824 8.60079 14.7314 8.663 14.679C9.40862 14.0505 10.0936 13.3535 10.709 12.597C11.81 11.235 13 9.255 13 7C13 5.67392 12.4732 4.40215 11.5355 3.46447C10.5979 2.52678 9.32608 2 8 2C6.67392 2 5.40215 2.52678 4.46447 3.46447C3.52678 4.40215 3 5.67392 3 7C3 9.255 4.19 11.235 5.292 12.597C5.90739 13.3535 6.59239 14.0505 7.338 14.679C7.4003 14.7309 7.46331 14.7819 7.527 14.832L7.539 14.842V14.841ZM8 8.5C8.19698 8.5 8.39204 8.4612 8.57403 8.38582C8.75601 8.31044 8.92137 8.19995 9.06066 8.06066C9.19995 7.92137 9.31044 7.75601 9.38582 7.57403C9.4612 7.39204 9.5 7.19698 9.5 7C9.5 6.80302 9.4612 6.60796 9.38582 6.42597C9.31044 6.24399 9.19995 6.07863 9.06066 5.93934C8.92137 5.80005 8.75601 5.68956 8.57403 5.61418C8.39204 5.5388 8.19698 5.5 8 5.5C7.60218 5.5 7.22064 5.65804 6.93934 5.93934C6.65804 6.22064 6.5 6.60218 6.5 7C6.5 7.39782 6.65804 7.77936 6.93934 8.06066C7.22064 8.34196 7.60218 8.5 8 8.5Z"
                              fill="white"
                              fillOpacity="0.4"
                            />
                          </svg>
                          <span className="text-white/50">{event.venue_name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="bg-transparent flex items-center gap-1 justify-center border border-white/10 text-white text-sm md:text-base h-8 md:h-10 px-4 rounded-full hover:bg-white/10 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M13.4872 2.51299C13.3247 2.35047 13.1318 2.22155 12.9194 2.13359C12.7071 2.04564 12.4795 2.00037 12.2497 2.00037C12.0199 2.00037 11.7923 2.04564 11.58 2.13359C11.3676 2.22155 11.1747 2.35047 11.0122 2.51299L6.74919 6.77399C6.49389 7.02932 6.29137 7.33242 6.15319 7.66599L5.30519 9.71299C5.24839 9.85005 5.23351 10.0009 5.26244 10.1464C5.29137 10.2919 5.36281 10.4256 5.46772 10.5305C5.57262 10.6354 5.70629 10.7068 5.8518 10.7357C5.99731 10.7647 6.14814 10.7498 6.28519 10.693L8.33219 9.84499C8.66577 9.70681 8.96887 9.50429 9.22419 9.24899L13.4852 4.98699C13.8131 4.65884 13.9973 4.21391 13.9973 3.74999C13.9973 3.28608 13.8131 2.84115 13.4852 2.51299H13.4872Z"
                            fill="white"
                            fillOpacity="0.5"
                          />
                          <path
                            d="M4.75 3.5C4.06 3.5 3.5 4.06 3.5 4.75V11.25C3.5 11.94 4.06 12.5 4.75 12.5H11.25C11.94 12.5 12.5 11.94 12.5 11.25V9C12.5 8.80109 12.579 8.61032 12.7197 8.46967C12.8603 8.32902 13.0511 8.25 13.25 8.25C13.4489 8.25 13.6397 8.32902 13.7803 8.46967C13.921 8.61032 14 8.80109 14 9V11.25C14 11.9793 13.7103 12.6788 13.1945 13.1945C12.6788 13.7103 11.9793 14 11.25 14H4.75C4.02065 14 3.32118 13.7103 2.80546 13.1945C2.28973 12.6788 2 11.9793 2 11.25V4.75C2 4.02065 2.28973 3.32118 2.80546 2.80546C3.32118 2.28973 4.02065 2 4.75 2H7C7.19891 2 7.38968 2.07902 7.53033 2.21967C7.67098 2.36032 7.75 2.55109 7.75 2.75C7.75 2.94891 7.67098 3.13968 7.53033 3.28033C7.38968 3.42098 7.19891 3.5 7 3.5H4.75Z"
                            fill="white"
                            fillOpacity="0.5"
                          />
                        </svg>
                        Edit
                      </button>
                      <button className="bg-transparent flex items-center gap-1 justify-center border border-white/10 text-white text-sm md:text-base h-8 md:h-10 px-4 rounded-full hover:bg-white/10 transition">
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
                            d="M1.37935 8.28C1.31626 8.0966 1.31626 7.89739 1.37935 7.714C1.85572 6.33737 2.74953 5.14356 3.93631 4.29881C5.12309 3.45407 6.54376 3.00044 8.00048 3.0011C9.45721 3.00176 10.8775 3.45667 12.0635 4.3025C13.2495 5.14832 14.1422 6.34294 14.6173 7.72C14.6804 7.90339 14.6804 8.1026 14.6173 8.286C14.1412 9.66298 13.2474 10.8572 12.0605 11.7022C10.8736 12.5472 9.45269 13.001 7.99571 13.0003C6.53872 12.9997 5.11822 12.5446 3.93209 11.6985C2.74596 10.8524 1.85326 9.65741 1.37835 8.28H1.37935ZM10.9993 8C10.9993 8.79565 10.6833 9.55871 10.1207 10.1213C9.55806 10.6839 8.795 11 7.99935 11C7.2037 11 6.44064 10.6839 5.87803 10.1213C5.31542 9.55871 4.99935 8.79565 4.99935 8C4.99935 7.20435 5.31542 6.44129 5.87803 5.87868C6.44064 5.31607 7.2037 5 7.99935 5C8.795 5 9.55806 5.31607 10.1207 5.87868C10.6833 6.44129 10.9993 7.20435 10.9993 8Z"
                            fill="white"
                            fillOpacity="0.5"
                          />
                        </svg>
                        Preview
                      </button>
                      <button className="bg-transparent flex items-center gap-1 justify-center border border-white/10 text-white text-sm md:text-base h-8 md:h-10 px-4 rounded-full hover:bg-white/10 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M5 6.5C5 6.10218 5.15804 5.72064 5.43934 5.43934C5.72064 5.15804 6.10218 5 6.5 5H12.5C12.8978 5 13.2794 5.15804 13.5607 5.43934C13.842 5.72064 14 6.10218 14 6.5V12.5C14 12.8978 13.842 13.2794 13.5607 13.5607C13.2794 13.842 12.8978 14 12.5 14H6.5C6.10218 14 5.72064 13.842 5.43934 13.5607C5.15804 13.2794 5 12.8978 5 12.5V6.5Z"
                            fill="white"
                            fillOpacity="0.5"
                          />
                          <path
                            d="M3.5 2C3.10218 2 2.72064 2.15804 2.43934 2.43934C2.15804 2.72064 2 3.10218 2 3.5V9.5C2 9.89782 2.15804 10.2794 2.43934 10.5607C2.72064 10.842 3.10218 11 3.5 11V6.5C3.5 5.70435 3.81607 4.94129 4.37868 4.37868C4.94129 3.81607 5.70435 3.5 6.5 3.5H11C11 3.10218 10.842 2.72064 10.5607 2.43934C10.2794 2.15804 9.89782 2 9.5 2H3.5Z"
                            fill="white"
                            fillOpacity="0.5"
                          />
                        </svg>
                        Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Tabs>
                <TabsList className="rounded-none relative w-full">
                  <div className="hidden @4xl:block absolute bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  {TABS.map((tab) => (
                    <TabTrigger
                      key={tab.id}
                      value={tab.id}
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 hover:bg-white/[0.03] @4xl:hover:bg-transparent p-2 @4xl:border-b-2 @4xl:rounded-none ${activeTab === tab.id ? "border-white" : "border-transparent"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                    </TabTrigger>
                  ))}
                </TabsList>
                <div className="mt-8">
                  {TABS.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} activeTab={activeTab}>
                      {tab.content}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          </div>
        )
      }
    </SidebarLayout>
  );
}