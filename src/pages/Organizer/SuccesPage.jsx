import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => (
  <div className="bg-[#111111] border-b border-white/10 z-50">
    <div className="h-16 px-4 md:px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
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
        </svg>
        <span className="text-white font-semibold">Avenue</span>
      </Link>

      <button
        onClick={() => navigate("/organizer/create-ticket")}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="white"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
);

export default function SuccesPage() {
  const navigate = useNavigate();
  return (
    <div className="text-white">
      <Header />
      <p className="text-white text-2xl font-bold">
        Successfully created ticket
      </p>
    </div>
  );
}
