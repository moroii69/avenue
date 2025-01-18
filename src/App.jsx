import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "../src/components/layouts/Header";
import Footer from "../src/components/layouts/Footer";
import Home from "./pages/User/Home";
import Info from "./pages/User/Info";
import Creater from "./pages/User/Creater";
import Checkout from "./pages/User/Checkout";
import { stripePromise } from "./constants/stripePromise"
import Element from "antd/es/skeleton/Element";
import { Elements } from "@stripe/react-stripe-js";
import QrTicket from "./pages/User/QrTicket";
import Tickets from "./pages/User/Tickets";
import Profile from "./pages/User/Profile";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideHeader = ["/login", "/qr-ticket"];
  const hideFooter = ["/login", "/info", "/creater", "/checkout", "/qr-ticket", "/tickets", "/profile"];

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
      <div className="bg-primary h-screen">
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
            } />
          <Route path="/qr-ticket/:id" element={<QrTicket />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/profile" element={<Profile />} />
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
