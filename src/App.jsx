import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Header from "../src/components/layouts/Header";
import Footer from "../src/components/layouts/Footer";
import Home from "./pages/User/Home";
import Info from "./pages/User/Info";
import Creater from "./pages/User/Creater";
import Checkout from "./pages/User/Checkout";
import { stripePromise } from "./constants/stripePromise";
import Element from "antd/es/skeleton/Element";
import { Elements } from "@stripe/react-stripe-js";
import QrTicket from "./pages/User/QrTicket";
import Tickets from "./pages/User/Tickets";
import Profile from "./pages/User/Profile";
import Type from "./pages/Organizer/Type";
import Ticket from "./pages/User/Ticket";
import Saved from "./pages/User/Saved";
import OrganizerProfile from "./pages/Organizer/OrganizerProfile";
import OrganizerDashboard from "./pages/Organizer/OrganizerDashboard";
import OrganizerEvents from "./pages/Organizer/OrganizerEvents";
import OrganizerWallet from "./pages/Organizer/OrganizerWallet";
import EventDetails from "./pages/Organizer/EventDetails";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideHeader = [
    "/login",
    "/qr-ticket",
    "/organizer/profile",
    "/organizer/dashboard",
    "/organizer/events",
    "/organizer/wallet",
  ];
  const hideFooter = [
    "/login",
    "/info",
    "/creater",
    "/checkout",
    "/qr-ticket",
    "/tickets",
    "/profile",
    "/ticket",
    "/saved",
    "/organizer/profile",
    "/organizer/dashboard",
    "/organizer/events",
    "/organizer/wallet",
  ];

  const shouldHideNavbarAndFooter = hideHeader.some((path) =>
    location.pathname.startsWith(path)
  );

  const shouldHideFooter = hideFooter.some((path) =>
    location.pathname.startsWith(path)
  );

  const handleDetail = (type, id, name) => {
    localStorage.setItem("user_organizer_id", id);

    if (type === "info") {
      navigate(`/info/${name}`);
    } else if (type === "creater") {
      navigate(`/creater/${id}`);
    }
  };

  return (
    <>
      <div className="bg-primary h-screen font-manrope">
        {!shouldHideNavbarAndFooter && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/info/:name" element={<Info />} />
          <Route path="/creater/:id" element={<Creater />} />
          <Route
            path="/checkout"
            element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            }
          />
          <Route path="/qr-ticket/:id" element={<QrTicket />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route
            path="/ticket"
            element={
              <Elements stripe={stripePromise}>
                <Ticket />
              </Elements>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/type" element={<Type />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/organizer/profile" element={<OrganizerProfile />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/events" element={<OrganizerEvents />} />
          <Route path="/organizer/wallet" element={<OrganizerWallet />} />
          <Route path="/organizer/events/:id" element={<EventDetails />} />
        </Routes>
        {!shouldHideFooter && <Footer />}
      </div>
    </>
  );
}

function Main() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default Main;
