import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function EventTypeSelection() {
  const [eventType, setEventType] = useState(null); // 'ticketed' or 'rsvp'
  const navigate = useNavigate();

  const handleEventTypeSelect = (type) => {
    setEventType(type);
  };

  const handleContinue = () => {
    if (eventType === "ticketed") {
      navigate("/organizer/create-ticket/ticketedevent");
    } else {
      navigate("/organizer/create-ticket/rsvp");
    }
  };

  const Header = () => (
    <div className="fixed top-0 left-0 right-0 bg-[#111111] border-b border-white/10 z-50">
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
          <span className="text-white font-semibold">Avenue</span>
        </Link>

        <button
          onClick={() => navigate("/")}
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

  return (
    <div className="min-h-screen bg-[#111111]">
      <Header />
      <div className="pt-16 min-h-screen max-w-2xl mx-auto flex items-center justify-center p-4">
        <div className="w-full flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">
              What kind of event are you creating?
            </h2>
            <p className="text-white/60 text-sm">
              Pick the type that best fits your event goals and ticket needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Ticketed Event Card */}
            <button
              onClick={() => handleEventTypeSelect("ticketed")}
              className={`flex flex-col gap-3 p-6 rounded-xl border ${
                eventType === "ticketed"
                  ? "border-[#34B2DA]"
                  : "border-white/10"
              } bg-[#1A1A1A] hover:bg-white/5 transition-colors text-left w-full group`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#34B2DA]/10 flex items-center justify-center">
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
                    fill="#89DBF0"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Ticketed event</h3>
                <p className="text-sm text-white/60">
                  Sell tickets with multiple pricing tiers, manage fees, and
                  track attendance
                </p>
              </div>
            </button>

            {/* RSVP Event Card */}
            <button
              onClick={() => handleEventTypeSelect("rsvp")}
              className={`flex flex-col gap-3 p-6 rounded-xl border ${
                eventType === "rsvp" ? "border-[#34B2DA]" : "border-white/10"
              } bg-[#1A1A1A] hover:bg-white/5 transition-colors text-left w-full group`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#34B2DA]/10 flex items-center justify-center">
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
                    d="M15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8ZM6 8C6.552 8 7 7.328 7 6.5C7 5.672 6.552 5 6 5C5.448 5 5 5.672 5 6.5C5 7.328 5.448 8 6 8ZM11 6.5C11 7.328 10.552 8 10 8C9.448 8 9 7.328 9 6.5C9 5.672 9.448 5 10 5C10.552 5 11 5.672 11 6.5ZM11.005 10.745C10.8644 10.6045 10.6738 10.5257 10.475 10.5257C10.2762 10.5257 10.0856 10.6045 9.945 10.745C9.68962 11.0005 9.38641 11.2032 9.05268 11.3415C8.71895 11.4797 8.36124 11.5509 8 11.5509C7.63876 11.5509 7.28105 11.4797 6.94732 11.3415C6.61359 11.2032 6.31038 11.0005 6.055 10.745C5.91282 10.6125 5.72478 10.5404 5.53048 10.5438C5.33618 10.5473 5.15079 10.626 5.01338 10.7634C4.87597 10.9008 4.79725 11.0862 4.79383 11.2805C4.7904 11.4748 4.86252 11.6628 4.995 11.805C5.79201 12.6019 6.87293 13.0496 8 13.0496C9.12707 13.0496 10.208 12.6019 11.005 11.805C11.1455 11.6644 11.2243 11.4738 11.2243 11.275C11.2243 11.0762 11.1455 10.8856 11.005 10.745Z"
                    fill="#DAB4FE"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">RSVP event</h3>
                <p className="text-sm text-white/60">
                  Create a free event and track attendance with simple guest
                  list
                </p>
              </div>
            </button>
          </div>

          {/* Continue Button - Only shows when an option is selected */}
          {eventType && (
            <button
              onClick={handleContinue}
              className="w-fit px-5 h-10 flex items-center justify-center rounded-full bg-white text-black font-semibold text-sm hover:ring-2 hover:ring-[#34B2DA] ring-offset-2 ring-offset-black"
            >
              Continue with {eventType === "ticketed" ? "Ticketed" : "RSVP"}{" "}
              Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
