/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { SidebarContext } from "../../contexts/SidebarContext";

const SidebarLayout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    {
      path: "/organizer/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          data-selected={
            location.pathname === "/organizer/dashboard" ? "true" : "false"
          }
          className={`sidebar-icon fill-white data-[selected=false]:opacity-50 group-hover:opacity-100 data-[selected=true]:opacity-100`}
        >
          <path d="M3.5 2C3.10218 2 2.72064 2.15804 2.43934 2.43934C2.15804 2.72064 2 3.10218 2 3.5V5.5C2 5.89782 2.15804 6.27936 2.43934 6.56066C2.72064 6.84196 3.10218 7 3.5 7H5.5C5.89782 7 6.27936 6.84196 6.56066 6.56066C6.84196 6.27936 7 5.89782 7 5.5V3.5C7 3.10218 6.84196 2.72064 6.56066 2.43934C6.27936 2.15804 5.89782 2 5.5 2H3.5ZM3.5 9C3.10218 9 2.72064 9.15804 2.43934 9.43934C2.15804 9.72064 2 10.1022 2 10.5V12.5C2 12.8978 2.15804 13.2794 2.43934 13.5607C2.72064 13.842 3.10218 14 3.5 14H5.5C5.89782 14 6.27936 13.842 6.56066 13.5607C6.84196 13.2794 7 12.8978 7 12.5V10.5C7 10.1022 6.84196 9.72064 6.56066 9.43934C6.27936 9.15804 5.89782 9 5.5 9H3.5ZM9 3.5C9 3.10218 9.15804 2.72064 9.43934 2.43934C9.72064 2.15804 10.1022 2 10.5 2H12.5C12.8978 2 13.2794 2.15804 13.5607 2.43934C13.842 2.72064 14 3.10218 14 3.5V5.5C14 5.89782 13.842 6.27936 13.5607 6.56066C13.2794 6.84196 12.8978 7 12.5 7H10.5C10.1022 7 9.72064 6.84196 9.43934 6.56066C9.15804 6.27936 9 5.89782 9 5.5V3.5ZM10.5 9C10.1022 9 9.72064 9.15804 9.43934 9.43934C9.15804 9.72064 9 10.1022 9 10.5V12.5C9 12.8978 9.15804 13.2794 9.43934 13.5607C9.72064 13.842 10.1022 14 10.5 14H12.5C12.8978 14 13.2794 13.842 13.5607 13.5607C13.842 13.2794 14 12.8978 14 12.5V10.5C14 10.1022 13.842 9.72064 13.5607 9.43934C13.2794 9.15804 12.8978 9 12.5 9H10.5Z" />
        </svg>
      ),
      label: "Dashboard",
    },
    {
      path: "/organizer/profile",
      icon: (
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
      ),
      label: "Profile",
    },
    {
      path: "/organizer/events",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="10"
          viewBox="0 0 14 10"
          data-selected={
            location.pathname === "/organizer/events" ? "true" : "false"
          }
          className={`sidebar-icon fill-white data-[selected=false]:opacity-50 group-hover:opacity-100 data-[selected=true]:opacity-100`}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10218 14 1.5V2.5C14 2.776 13.773 2.994 13.505 3.062C13.0743 3.1718 12.6925 3.42192 12.4198 3.77286C12.1472 4.1238 11.9991 4.55557 11.9991 5C11.9991 5.44443 12.1472 5.8762 12.4198 6.22714C12.6925 6.57808 13.0743 6.8282 13.505 6.938C13.773 7.006 14 7.224 14 7.5V8.5C14 8.89782 13.842 9.27936 13.5607 9.56066C13.2794 9.84196 12.8978 10 12.5 10H1.5C1.10218 10 0.720644 9.84196 0.43934 9.56066C0.158035 9.27936 0 8.89782 0 8.5V7.5C0 7.224 0.227 7.006 0.495 6.938C0.925654 6.8282 1.30747 6.57808 1.58016 6.22714C1.85285 5.8762 2.00088 5.44443 2.00088 5C2.00088 4.55557 1.85285 4.1238 1.58016 3.77286C1.30747 3.42192 0.925654 3.1718 0.495 3.062C0.227 2.994 0 2.776 0 2.5V1.5ZM9 2.75C9 2.55109 9.07902 2.36032 9.21967 2.21967C9.36032 2.07902 9.55109 2 9.75 2C9.94891 2 10.1397 2.07902 10.2803 2.21967C10.421 2.36032 10.5 2.55109 10.5 2.75V3.75C10.5 3.94891 10.421 4.13968 10.2803 4.28033C10.1397 4.42098 9.94891 4.5 9.75 4.5C9.55109 4.5 9.36032 4.42098 9.21967 4.28033C9.07902 4.13968 9 3.94891 9 3.75V2.75ZM9.75 5.5C9.55109 5.5 9.36032 5.57902 9.21967 5.71967C9.07902 5.86032 9 6.05109 9 6.25V7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25V6.25C10.5 6.05109 10.421 5.86032 10.2803 5.71967C10.1397 5.57902 9.94891 5.5 9.75 5.5Z"
          />
        </svg>
      ),
      label: "Events",
    },
    {
      path: "/organizer/wallet",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          data-selected={
            location.pathname === "/organizer/wallet" ? "true" : "false"
          }
          className={`sidebar-icon fill-white data-[selected=false]:opacity-50 group-hover:opacity-100 data-[selected=true]:opacity-100`}
        >
          <path d="M2 3.5C2 3.10218 2.15804 2.72064 2.43934 2.43934C2.72064 2.15804 3.10218 2 3.5 2H12.5C12.8978 2 13.2794 2.15804 13.5607 2.43934C13.842 2.72064 14 3.10218 14 3.5V3.901C13.5441 3.6374 13.0266 3.49906 12.5 3.5H3.5C2.954 3.5 2.441 3.646 2 3.901V3.5ZM3.5 5C3.10218 5 2.72064 5.15804 2.43934 5.43934C2.15804 5.72064 2 6.10218 2 6.5V6.901C2.45589 6.6374 2.97339 6.49906 3.5 6.5H12.5C13.046 6.5 13.559 6.646 14 6.901V6.5C14 6.10218 13.842 5.72064 13.5607 5.43934C13.2794 5.15804 12.8978 5 12.5 5H3.5ZM8 10C8.44431 10 8.876 9.85215 9.22692 9.57963C9.57785 9.30711 9.82803 8.92549 9.938 8.495C10.006 8.227 10.224 8 10.5 8H12.5C12.8978 8 13.2794 8.15804 13.5607 8.43934C13.842 8.72064 14 9.10218 14 9.5V12.5C14 12.8978 13.842 13.2794 13.5607 13.5607C13.2794 13.842 12.8978 14 12.5 14H3.5C3.10218 14 2.72064 13.842 2.43934 13.5607C2.15804 13.2794 2 12.8978 2 12.5V9.5C2 9.10218 2.15804 8.72064 2.43934 8.43934C2.72064 8.15804 3.10218 8 3.5 8H5.5C5.776 8 5.994 8.227 6.062 8.495C6.17197 8.92549 6.42215 9.30711 6.77308 9.57963C7.124 9.85215 7.55569 10 8 10Z" />
        </svg>
      ),
      label: "Wallet",
    },
    {
      path: "/organizer/members",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          data-selected={
            location.pathname === "/organizer/members" ? "true" : "false"
          }
          className={`sidebar-icon fill-white data-[selected=false]:opacity-50 group-hover:opacity-100 data-[selected=true]:opacity-100`}
        >
          <path
            d="M8.49995 4.5C8.49995 5.16304 8.23656 5.79893 7.76772 6.26777C7.29888 6.73661 6.66299 7 5.99995 7C5.33691 7 4.70102 6.73661 4.23218 6.26777C3.76334 5.79893 3.49995 5.16304 3.49995 4.5C3.49995 3.83696 3.76334 3.20107 4.23218 2.73223C4.70102 2.26339 5.33691 2 5.99995 2C6.66299 2 7.29888 2.26339 7.76772 2.73223C8.23656 3.20107 8.49995 3.83696 8.49995 4.5ZM10.9 12.006C11.0099 12.548 10.552 13 9.99995 13H1.99995C1.44695 13 0.98995 12.548 1.09795 12.006C1.328 10.8758 1.94159 9.85974 2.83482 9.13C3.72805 8.40027 4.84603 8.00165 5.99945 8.00165C7.15287 8.00165 8.27085 8.40027 9.16408 9.13C10.0573 9.85974 10.6709 10.8758 10.901 12.006H10.9ZM14.002 12H12.412C12.4042 11.9026 12.3908 11.8058 12.372 11.71C12.1813 10.7664 11.7826 9.87714 11.205 9.107C11.94 8.9047 12.7244 8.98961 13.3991 9.34451C14.0738 9.69941 14.5882 10.2977 14.838 11.018C15.018 11.54 14.555 12 14.002 12ZM12 8C12.5304 8 13.0391 7.78929 13.4142 7.41421C13.7892 7.03914 14 6.53043 14 6C14 5.46957 13.7892 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4C11.4695 4 10.9608 4.21071 10.5857 4.58579C10.2107 4.96086 9.99995 5.46957 9.99995 6C9.99995 6.53043 10.2107 7.03914 10.5857 7.41421C10.9608 7.78929 11.4695 8 12 8Z"
            fill="white"
          />
        </svg>
      ),
      label: "Members",
    },
  ];

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <div className="flex min-h-screen bg-[#111111]">
        {/* Mobile Navigation */}
        <div className="md:hidden">
          {/* Mobile Header */}
          <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-3xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <Link
              to="/"
              className="text-base font-bold flex items-center gap-2.5 text-white cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M11.4476 14.0671C11.2063 14.6032 10.9064 15.1283 10.5469 15.5826C13.5301 14.5771 15.7261 11.8605 15.9679 8.59998H14.9059C13.61 8.59998 12.569 9.6344 12.3584 10.9131C12.1642 12.0918 11.8535 13.1651 11.4476 14.0671Z"
                  fill="#34B2DA"
                />
                <path
                  d="M9.09847 8.59998C10.4553 8.59998 11.5652 9.73192 11.316 11.0657C10.7747 13.9626 9.48934 15.9999 7.98984 15.9999C6.09247 15.9999 4.53794 12.7379 4.3999 8.59998H9.09847Z"
                  fill="#34B2DA"
                />
                <path
                  d="M12.3859 5.25936C12.5844 6.55002 13.6301 7.59924 14.936 7.59924H15.9802C15.8153 4.25014 13.5909 1.44261 10.5469 0.416626C10.9064 0.870919 11.2063 1.39598 11.4476 1.93211C11.8733 2.87812 12.1942 4.01254 12.3859 5.25936Z"
                  fill="#34B2DA"
                />
                <path
                  d="M11.3563 5.1582C11.5832 6.48521 10.4781 7.59987 9.13181 7.59987H4.39453C4.48829 3.3675 6.06222 0 7.99003 0C9.52789 0 10.8405 2.14285 11.3563 5.1582Z"
                  fill="#34B2DA"
                />
                <path
                  d="M3.39431 7.59924C3.43975 5.43596 3.85245 3.44355 4.53261 1.93211C4.77385 1.39598 5.07376 0.870919 5.43336 0.416626C2.38936 1.44261 0.164915 4.25014 0 7.59924H3.39431Z"
                  fill="#34B2DA"
                />
                <path
                  d="M0.012207 8.59998C0.253963 11.8605 2.45003 14.5771 5.43323 15.5826C5.07363 15.1283 4.77372 14.6032 4.53248 14.0671C3.87333 12.6024 3.46538 10.6859 3.39944 8.59998H0.012207Z"
                  fill="#34B2DA"
                />
              </svg>
              Avenue
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-white hover:bg-[#333333] z-[999]"
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 backdrop-blur-sm"
              onClick={toggleSidebar}
            />
          )}

          {/* Mobile Drawer Menu */}
          <div
            className={`fixed bottom-3 left-0 right-0 w-[95%] mx-auto overflow-hidden bg-[#1A1A1A] z-50 transition-transform duration-300 ease-out rounded-lg
              ${isSidebarOpen ? "translate-y-0" : "translate-y-[110%]"}`}
          >
            {/* Drawer Handle */}
            <div className="flex justify-center p-3 bg-white/5">
              <div className="w-12 h-1.5 bg-neutral-500 rounded-full" />
            </div>

            <nav className="max-h-[70vh] overflow-y-auto flex-1 flex flex-col gap-3 p-3">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`menu-item group flex items-center text-sm hover:text-white font-medium gap-2 p-2 px-2.5 rounded-[10px] transition-colors ${
                    location.pathname === item.path
                      ? "selected bg-white/5 text-white"
                      : "text-white/50"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <button className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors mt-4 mb-6">
                Help
              </button>
            </nav>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div
          className={`hidden md:flex fixed top-0 left-0 h-screen w-64 bg-[#1A1A1A] text-white flex-col z-40 transition-transform duration-300 ease-in-out 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4">
            <Link
              to="/"
              className="text-base font-bold flex items-center gap-2.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M11.4476 14.0671C11.2063 14.6032 10.9064 15.1283 10.5469 15.5826C13.5301 14.5771 15.7261 11.8605 15.9679 8.59998H14.9059C13.61 8.59998 12.569 9.6344 12.3584 10.9131C12.1642 12.0918 11.8535 13.1651 11.4476 14.0671Z"
                  fill="#34B2DA"
                />
                <path
                  d="M9.09847 8.59998C10.4553 8.59998 11.5652 9.73192 11.316 11.0657C10.7747 13.9626 9.48934 15.9999 7.98984 15.9999C6.09247 15.9999 4.53794 12.7379 4.3999 8.59998H9.09847Z"
                  fill="#34B2DA"
                />
                <path
                  d="M12.3859 5.25936C12.5844 6.55002 13.6301 7.59924 14.936 7.59924H15.9802C15.8153 4.25014 13.5909 1.44261 10.5469 0.416626C10.9064 0.870919 11.2063 1.39598 11.4476 1.93211C11.8733 2.87812 12.1942 4.01254 12.3859 5.25936Z"
                  fill="#34B2DA"
                />
                <path
                  d="M11.3563 5.1582C11.5832 6.48521 10.4781 7.59987 9.13181 7.59987H4.39453C4.48829 3.3675 6.06222 0 7.99003 0C9.52789 0 10.8405 2.14285 11.3563 5.1582Z"
                  fill="#34B2DA"
                />
                <path
                  d="M3.39431 7.59924C3.43975 5.43596 3.85245 3.44355 4.53261 1.93211C4.77385 1.39598 5.07376 0.870919 5.43336 0.416626C2.38936 1.44261 0.164915 4.25014 0 7.59924H3.39431Z"
                  fill="#34B2DA"
                />
                <path
                  d="M0.012207 8.59998C0.253963 11.8605 2.45003 14.5771 5.43323 15.5826C5.07363 15.1283 4.77372 14.6032 4.53248 14.0671C3.87333 12.6024 3.46538 10.6859 3.39944 8.59998H0.012207Z"
                  fill="#34B2DA"
                />
              </svg>
              Avenue
            </Link>
          </div>

          <nav className="flex-1 flex flex-col gap-3 p-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                data-selected={
                  location.pathname === item.path ? "true" : "false"
                }
                className={`menu-item group flex items-center text-sm hover:text-white font-medium gap-2 p-2 px-2.5 rounded-[10px] transition-colors ${
                  location.pathname === item.path
                    ? "selected bg-white/5 text-white"
                    : "text-white/50"
                }`}
              >
                <div>{item.icon}</div>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <button className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Help
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 min-h-screen transition-all duration-300 ${
            isSidebarOpen ? "md:pl-64" : ""
          } pt-16 md:pt-0`}
        >
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default SidebarLayout;