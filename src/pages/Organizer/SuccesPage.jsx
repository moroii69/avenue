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
  return (
    <div className="text-white">
      <Header />
      <div className="flex flex-col md:flex-row">
        <div className="w-full order-2 md:order-1 md:w-1/2 md:h-[calc(100vh-64px)] flex flex-col gap-8 items-center justify-center p-8 md:sticky top-16">
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48C0 21.4903 21.4903 0 48 0C74.5097 0 96 21.4903 96 48C96 74.5097 74.5097 96 48 96C21.4903 96 0 74.5097 0 48Z"
              fill="#10B981"
              fillOpacity="0.05"
            />
            <path
              d="M0.5 48C0.5 21.7665 21.7665 0.5 48 0.5C74.2335 0.5 95.5 21.7665 95.5 48C95.5 74.2335 74.2335 95.5 48 95.5C21.7665 95.5 0.5 74.2335 0.5 48Z"
              stroke="#10B981"
              strokeOpacity="0.05"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M48 63.75C56.6985 63.75 63.75 56.6985 63.75 48C63.75 39.3015 56.6985 32.25 48 32.25C39.3015 32.25 32.25 39.3015 32.25 48C32.25 56.6985 39.3015 63.75 48 63.75ZM56.6478 43.9693C57.2176 43.2319 57.0818 42.1721 56.3443 41.6022C55.6069 41.0323 54.5471 41.1682 53.9772 41.9057L45.6513 52.6803L41.9418 48.5586C41.3183 47.8659 40.2514 47.8097 39.5586 48.4332C38.8659 49.0567 38.8097 50.1236 39.4332 50.8164L44.4957 56.4414C44.8305 56.8134 45.3131 57.0176 45.8132 56.9988C46.3133 56.9801 46.7793 56.7403 47.0853 56.3443L56.6478 43.9693Z"
              fill="#10B981"
            />
            <path
              d="M12 48C12 28.1178 28.1178 12 48 12C67.8823 12 84 28.1178 84 48C84 67.8823 67.8823 84 48 84C28.1178 84 12 67.8823 12 48Z"
              fill="#10B981"
              fillOpacity="0.1"
            />
            <path
              d="M12.5 48C12.5 28.3939 28.3939 12.5 48 12.5C67.6061 12.5 83.5 28.3939 83.5 48C83.5 67.6061 67.6061 83.5 48 83.5C28.3939 83.5 12.5 67.6061 12.5 48Z"
              stroke="#10B981"
              strokeOpacity="0.1"
            />
            <path
              fillRule="evenodd"
              clip-Rule="evenodd"
              d="M48 59.8125C54.5239 59.8125 59.8125 54.5239 59.8125 48C59.8125 41.4761 54.5239 36.1875 48 36.1875C41.4761 36.1875 36.1875 41.4761 36.1875 48C36.1875 54.5239 41.4761 59.8125 48 59.8125ZM54.4858 44.977C54.9132 44.4239 54.8113 43.629 54.2582 43.2017C53.7051 42.7743 52.9103 42.8762 52.4829 43.4293L46.2385 51.5102L43.4564 48.419C42.9888 47.8994 42.1885 47.8573 41.669 48.3249C41.1494 48.7925 41.1073 49.5927 41.5749 50.1123L45.3718 54.331C45.6229 54.61 45.9848 54.7632 46.3599 54.7491C46.735 54.7351 47.0845 54.5552 47.314 54.2582L54.4858 44.977Z"
              fill="#10B981"
            />
            <path
              d="M24 48C24 34.7452 34.7452 24 48 24C61.2548 24 72 34.7452 72 48C72 61.2548 61.2548 72 48 72C34.7452 72 24 61.2548 24 48Z"
              fill="#10B981"
            />
            <path
              d="M56 42L45 53L40 48"
              stroke="#0F0F0F"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-2xl font-semibold">Your event is live</h2>
            <p className="text-white/60 text-sm">
              Your event is live now! You can check it out
            </p>
            <button className="bg-white text-black h-10 px-4 rounded-full font-semibold mt-2">
              Check it out
            </button>
          </div>
        </div>
        <div className="w-full order-1 md:order-2 md:w-1/2 md:h-[calc(100vh-64px)] bg-[#141414] flex items-center justify-center p-8 md:sticky top-16">
          <div className="bg-white/[0.03] mx-auto rounded-3xl grid grid-rows-[1fr_70px] p-2">
            <div className="bg-[#0F0F0F] rounded-2xl h-[350px] w-[350px] xl:h-[450px] xl:w-[450px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="96"
                height="96"
                viewBox="0 0 96 96"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 24C12 20.8174 13.2643 17.7652 15.5147 15.5147C17.7652 13.2643 20.8174 12 24 12H72C75.1826 12 78.2348 13.2643 80.4853 15.5147C82.7357 17.7652 84 20.8174 84 24V72C84 75.1826 82.7357 78.2348 80.4853 80.4853C78.2348 82.7357 75.1826 84 72 84H24C20.8174 84 17.7652 82.7357 15.5147 80.4853C13.2643 78.2348 12 75.1826 12 72V24Z"
                  fill="white"
                  fillOpacity="0.1"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span className="flex items-center">
                  {/* Placeholder for category icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="8"
                      fill="white"
                      fillOpacity="0.1"
                    />
                  </svg>
                </span>
                <span>Category</span>
              </div>
              <p className="text-white/60 text-sm">Date & Time</p>
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="flex flex-col gap-2">
                <p className="text-white/60 text-sm">Event Name</p>
                <p className="text-white/60 text-sm">Location</p>
              </div>
              <p className="text-white/60 text-2xl font-semibold">$0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
