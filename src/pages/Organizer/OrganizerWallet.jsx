import SidebarLayout from "../../components/layouts/SidebarLayout";
import SidebarToggle from "../../components/layouts/SidebarToggle";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/Dialog";
import { useState } from "react";

const statusIcons = {
  completed: (
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
        d="M8.7998 15C10.6563 15 12.4368 14.2625 13.7496 12.9497C15.0623 11.637 15.7998 9.85652 15.7998 8C15.7998 6.14348 15.0623 4.36301 13.7496 3.05025C12.4368 1.7375 10.6563 1 8.7998 1C6.94329 1 5.16281 1.7375 3.85006 3.05025C2.5373 4.36301 1.7998 6.14348 1.7998 8C1.7998 9.85652 2.5373 11.637 3.85006 12.9497C5.16281 14.2625 6.94329 15 8.7998 15ZM12.6438 6.209C12.7655 6.05146 12.8197 5.85202 12.7944 5.65454C12.7691 5.45706 12.6663 5.27773 12.5088 5.156C12.3513 5.03427 12.1518 4.9801 11.9543 5.00542C11.7569 5.03073 11.5775 5.13346 11.4558 5.291L7.7558 10.081L6.1068 8.248C6.04155 8.17247 5.96187 8.11073 5.87245 8.06639C5.78302 8.02205 5.68565 7.99601 5.58603 7.98978C5.48641 7.98356 5.38655 7.99729 5.2923 8.03016C5.19806 8.06303 5.11132 8.11438 5.03717 8.1812C4.96303 8.24803 4.90297 8.32898 4.86051 8.41931C4.81806 8.50965 4.79406 8.60755 4.78993 8.70728C4.78579 8.807 4.80161 8.90656 4.83645 9.00009C4.87128 9.09363 4.92444 9.17927 4.9928 9.252L7.2428 11.752C7.31629 11.8335 7.40677 11.8979 7.50786 11.9406C7.60895 11.9833 7.71818 12.0034 7.82785 11.9993C7.93752 11.9952 8.04496 11.967 8.14257 11.9169C8.24019 11.8667 8.32561 11.7958 8.3928 11.709L12.6438 6.209Z"
        fill="#10B981"
      />
    </svg>
  ),
  processing: (
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
        d="M1.7998 8C1.7998 6.14348 2.5373 4.36301 3.85006 3.05025C5.16281 1.7375 6.94329 1 8.7998 1C10.6563 1 12.4368 1.7375 13.7496 3.05025C15.0623 4.36301 15.7998 6.14348 15.7998 8C15.7998 9.85652 15.0623 11.637 13.7496 12.9497C12.4368 14.2625 10.6563 15 8.7998 15C6.94329 15 5.16281 14.2625 3.85006 12.9497C2.5373 11.637 1.7998 9.85652 1.7998 8ZM9.5498 3.75C9.5498 3.55109 9.47079 3.36032 9.33013 3.21967C9.18948 3.07902 8.99872 3 8.7998 3C8.60089 3 8.41013 3.07902 8.26947 3.21967C8.12882 3.36032 8.0498 3.55109 8.0498 3.75V8C8.0498 8.414 8.3858 8.75 8.7998 8.75H12.0498C12.2487 8.75 12.4395 8.67098 12.5801 8.53033C12.7208 8.38968 12.7998 8.19891 12.7998 8C12.7998 7.80109 12.7208 7.61032 12.5801 7.46967C12.4395 7.32902 12.2487 7.25 12.0498 7.25H9.5498V3.75Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  ),
  failed: (
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
        d="M8.7998 15C10.6563 15 12.4368 14.2625 13.7496 12.9497C15.0623 11.637 15.7998 9.85652 15.7998 8C15.7998 6.14348 15.0623 4.36301 13.7496 3.05025C12.4368 1.7375 10.6563 1 8.7998 1C6.94329 1 5.16281 1.7375 3.85006 3.05025C2.5373 4.36301 1.7998 6.14348 1.7998 8C1.7998 9.85652 2.5373 11.637 3.85006 12.9497C5.16281 14.2625 6.94329 15 8.7998 15ZM11.5798 10.78C11.4392 10.9205 11.2486 10.9993 11.0498 10.9993C10.8511 10.9993 10.6604 10.9205 10.5198 10.78L8.7998 9.06L7.0798 10.78C7.01114 10.8537 6.92834 10.9128 6.83634 10.9538C6.74434 10.9948 6.64503 11.0168 6.54433 11.0186C6.44362 11.0204 6.3436 11.0018 6.25021 10.9641C6.15682 10.9264 6.07199 10.8703 6.00077 10.799C5.92955 10.7278 5.8734 10.643 5.83568 10.5496C5.79796 10.4562 5.77944 10.3562 5.78121 10.2555C5.78299 10.1548 5.80503 10.0555 5.84602 9.96346C5.88702 9.87146 5.94612 9.78866 6.0198 9.72L7.7398 8L6.0198 6.28C5.88732 6.13783 5.8152 5.94978 5.81863 5.75548C5.82206 5.56118 5.90077 5.37579 6.03818 5.23838C6.1756 5.10097 6.36098 5.02225 6.55528 5.01883C6.74958 5.0154 6.93763 5.08752 7.0798 5.22L8.7998 6.94L10.5198 5.22C10.5885 5.14631 10.6713 5.08721 10.7633 5.04622C10.8553 5.00523 10.9546 4.98319 11.0553 4.98141C11.156 4.97963 11.256 4.99816 11.3494 5.03588C11.4428 5.0736 11.5276 5.12974 11.5988 5.20096C11.6701 5.27218 11.7262 5.35701 11.7639 5.4504C11.8016 5.54379 11.8202 5.64382 11.8184 5.74452C11.8166 5.84523 11.7946 5.94454 11.7536 6.03654C11.7126 6.12854 11.6535 6.21134 11.5798 6.28L9.85981 8L11.5798 9.72C11.7203 9.86063 11.7991 10.0512 11.7991 10.25C11.7991 10.4488 11.7203 10.6394 11.5798 10.78Z"
        fill="#F43F5E"
      />
    </svg>
  ),
};

const cardIcons = {
  visa: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="8"
      viewBox="0 0 20 8"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.30011 7.16942H3.60385L2.33187 2.17399C2.27149 1.9442 2.1433 1.74106 1.95474 1.64531C1.48415 1.4047 0.965597 1.21321 0.399902 1.11663V0.924305H3.13244C3.50957 0.924305 3.79242 1.21321 3.83956 1.54873L4.49954 5.1521L6.19497 0.924305H7.84408L5.30011 7.16942ZM8.78691 7.16942H7.18494L8.50406 0.924305H10.106L8.78691 7.16942ZM12.1786 2.65439C12.2257 2.31803 12.5086 2.12571 12.8386 2.12571C13.3571 2.07742 13.922 2.174 14.3934 2.41378L14.6763 1.06918C14.2048 0.876852 13.6863 0.780273 13.2157 0.780273C11.6609 0.780273 10.5295 1.64531 10.5295 2.84588C10.5295 3.75921 11.3309 4.23877 11.8966 4.52767C12.5086 4.81574 12.7443 5.00807 12.6972 5.29614C12.6972 5.72824 12.2257 5.92057 11.7552 5.92057C11.1895 5.92057 10.6238 5.77653 10.106 5.53592L9.82319 6.88135C10.3889 7.12113 11.0009 7.21771 11.5666 7.21771C13.31 7.26517 14.3934 6.40096 14.3934 5.10381C14.3934 3.47031 12.1786 3.37456 12.1786 2.65439ZM19.9999 7.16942L18.7279 0.924305H17.3616C17.0788 0.924305 16.796 1.11663 16.7017 1.4047L14.3463 7.16942H15.9954L16.3245 6.25692H18.3508L18.5394 7.16942H19.9999ZM17.5974 2.6061L18.0679 4.95978H16.7488L17.5974 2.6061Z"
        fill="white"
      />
    </svg>
  ),
  mastercard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="12"
      viewBox="0 0 19 12"
      fill="none"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.19987 10.1996C8.22477 11.0215 6.9599 11.5177 5.57775 11.5177C2.49374 11.5177 -0.00634766 9.04738 -0.00634766 6.00007C-0.00634766 2.95276 2.49374 0.482422 5.57775 0.482422C6.9599 0.482422 8.22477 0.978597 9.19987 1.80052C10.175 0.978597 11.4398 0.482422 12.822 0.482422C15.906 0.482422 18.4061 2.95276 18.4061 6.00007C18.4061 9.04738 15.906 11.5177 12.822 11.5177C11.4398 11.5177 10.175 11.0215 9.19987 10.1996Z"
        fill="#ED0006"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.19995 10.1996C10.4006 9.18759 11.1619 7.68168 11.1619 6.00007C11.1619 4.31846 10.4006 2.81255 9.19995 1.80051C10.1751 0.978596 11.4399 0.482422 12.8221 0.482422C15.9061 0.482422 18.4062 2.95276 18.4062 6.00007C18.4062 9.04738 15.9061 11.5177 12.8221 11.5177C11.4399 11.5177 10.1751 11.0215 9.19995 10.1996Z"
        fill="#F9A000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.2 10.1999C10.4006 9.18782 11.162 7.68192 11.162 6.00032C11.162 4.31872 10.4006 2.81282 9.2 1.80078C7.99936 2.81282 7.23804 4.31872 7.23804 6.00032C7.23804 7.68192 7.99936 9.18782 9.2 10.1999Z"
        fill="#FF5E00"
      />
    </svg>
  ),
};

const payoutHistory = [
  {
    amount: 150,
    cardLast4: "4468",
    cardType: "visa",
    date: "Jan 22, 2024",
    reference: "#R291012",
    status: "processing",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "failed",
  },
  {
    amount: 340,
    cardLast4: "1234",
    cardType: "mastercard",
    date: "Jan 22, 2024",
    reference: "#R291013",
    status: "completed",
  },
];

export default function OrganizerWallet() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <SidebarLayout>
      <div className="m-4 mb-2 z-20">
        <SidebarToggle />
      </div>
      <div className="min-h-screen text-white p-6 max-w-5xl mx-auto @container">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Wallet</h1>
          <p className="text-white/70">Manage your earnings and transactions</p>

          {/* Balance Card */}
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-5 md:gap-2 justify-between items-center p-4">
              <div className="flex flex-col gap-3">
                <p className="text-sm text-white/70">Available balance</p>
                <span className="text-3xl font-bold mt-1">$10,110</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-sm border border-white/10 px-3 py-2 rounded-full flex items-center gap-2"
                >
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
                  <span>History</span>
                </button>
                <button className="text-sm bg-white text-black px-3 py-2 rounded-full flex items-center gap-2 font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M7.24985 10.2503C7.24985 10.4492 7.32886 10.64 7.46952 10.7806C7.61017 10.9213 7.80093 11.0003 7.99985 11.0003C8.19876 11.0003 8.38952 10.9213 8.53018 10.7806C8.67083 10.64 8.74985 10.4492 8.74985 10.2503V4.56032L10.9698 6.78032C11.0385 6.854 11.1213 6.91311 11.2133 6.9541C11.3053 6.99509 11.4046 7.01713 11.5053 7.01891C11.606 7.02068 11.7061 7.00216 11.7994 6.96444C11.8928 6.92672 11.9777 6.87057 12.0489 6.79936C12.1201 6.72814 12.1762 6.6433 12.214 6.54991C12.2517 6.45653 12.2702 6.3565 12.2684 6.25579C12.2667 6.15509 12.2446 6.05578 12.2036 5.96378C12.1626 5.87178 12.1035 5.78898 12.0298 5.72032L8.52985 2.22032C8.38922 2.07987 8.1986 2.00098 7.99985 2.00098C7.8011 2.00098 7.61047 2.07987 7.46985 2.22032L3.96985 5.72032C3.83737 5.86249 3.76524 6.05054 3.76867 6.24484C3.7721 6.43914 3.85081 6.62453 3.98822 6.76194C4.12564 6.89935 4.31102 6.97806 4.50532 6.98149C4.69963 6.98492 4.88767 6.9128 5.02985 6.78032L7.24985 4.56032V10.2503Z"
                      fill="#0A0A0A"
                    />
                    <path
                      d="M3.5 9.75C3.5 9.55109 3.42098 9.36032 3.28033 9.21967C3.13968 9.07902 2.94891 9 2.75 9C2.55109 9 2.36032 9.07902 2.21967 9.21967C2.07902 9.36032 2 9.55109 2 9.75V11.25C2 11.9793 2.28973 12.6788 2.80546 13.1945C3.32118 13.7103 4.02065 14 4.75 14H11.25C11.9793 14 12.6788 13.7103 13.1945 13.1945C13.7103 12.6788 14 11.9793 14 11.25V9.75C14 9.55109 13.921 9.36032 13.7803 9.21967C13.6397 9.07902 13.4489 9 13.25 9C13.0511 9 12.8603 9.07902 12.7197 9.21967C12.579 9.36032 12.5 9.55109 12.5 9.75V11.25C12.5 11.94 11.94 12.5 11.25 12.5H4.75C4.06 12.5 3.5 11.94 3.5 11.25V9.75Z"
                      fill="#0A0A0A"
                    />
                  </svg>
                  <span>Withdraw</span>
                </button>
              </div>
            </div>

            {/* Processing Payment Alert */}

            <div className="flex items-center bg-[#28180D] p-4 relative overflow-hidden before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-0.2rem)] before:h-[calc(100%-0.2rem)] before:border before:border-[#F97316]/20 before:z-0 before:rounded-b-lg">
              <div className="flex items-center gap-x-2 z-0">
                {[...Array(100)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 h-[calc(100%+1rem)] w-px bg-[#F97316]/10 rotate-[40deg]"
                    style={{ right: `${i * 15}px` }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-x-2 z-10">
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
                    fill="#F97316"
                  />
                </svg>
                <p className="text-[#F97316]">$2,340 is processing</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M2.5 3C2.10218 3 1.72064 3.15804 1.43934 3.43934C1.15804 3.72064 1 4.10218 1 4.5V5H15V4.5C15 4.10218 14.842 3.72064 14.5607 3.43934C14.2794 3.15804 13.8978 3 13.5 3H2.5Z"
                    fill="white"
                    fillOpacity="0.5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15 7H1V11.5C1 11.8978 1.15804 12.2794 1.43934 12.5607C1.72064 12.842 2.10218 13 2.5 13H13.5C13.8978 13 14.2794 12.842 14.5607 12.5607C14.842 12.2794 15 11.8978 15 11.5V7ZM3 10.25C3 10.0511 3.07902 9.86032 3.21967 9.71967C3.36032 9.57902 3.55109 9.5 3.75 9.5H4.25C4.44891 9.5 4.63968 9.57902 4.78033 9.71967C4.92098 9.86032 5 10.0511 5 10.25C5 10.4489 4.92098 10.6397 4.78033 10.7803C4.63968 10.921 4.44891 11 4.25 11H3.75C3.55109 11 3.36032 10.921 3.21967 10.7803C3.07902 10.6397 3 10.4489 3 10.25ZM6.75 9.5C6.55109 9.5 6.36032 9.57902 6.21967 9.71967C6.07902 9.86032 6 10.0511 6 10.25C6 10.4489 6.07902 10.6397 6.21967 10.7803C6.36032 10.921 6.55109 11 6.75 11H9.25C9.44891 11 9.63968 10.921 9.78033 10.7803C9.92098 10.6397 10 10.4489 10 10.25C10 10.0511 9.92098 9.86032 9.78033 9.71967C9.63968 9.57902 9.44891 9.5 9.25 9.5H6.75Z"
                    fill="white"
                    fillOpacity="0.5"
                  />
                </svg>
                <div className="flex items-center gap-x-2">
                  <p className="font-medium">Mastercard 4468</p>
                  <span className="text-xs font-semibold bg-white/5 rounded-full h-6 flex items-center px-2.5">
                    DEFAULT
                  </span>
                </div>
              </div>
              <button className="text-white/70 group h-6 w-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="opacity-50 group-hover:opacity-100"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.22007 4.22032C6.3607 4.07987 6.55132 4.00098 6.75007 4.00098C6.94882 4.00098 7.13945 4.07987 7.28007 4.22032L10.5301 7.47032C10.6705 7.61094 10.7494 7.80157 10.7494 8.00032C10.7494 8.19907 10.6705 8.38969 10.5301 8.53032L7.28007 11.7803C7.1379 11.9128 6.94985 11.9849 6.75555 11.9815C6.56125 11.9781 6.37586 11.8994 6.23845 11.7619C6.10104 11.6245 6.02233 11.4391 6.0189 11.2448C6.01547 11.0505 6.08759 10.8625 6.22007 10.7203L8.94007 8.00032L6.22007 5.28032C6.07962 5.13969 6.00073 4.94907 6.00073 4.75032C6.00073 4.55157 6.07962 4.36094 6.22007 4.22032Z"
                    fill="white"
                    fillOpacity="0.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/*revenue history */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 p-4">
              <p className="text-sm text-white/70">Total revenue this month</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-2xl font-bold">$12,450</span>
                <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded-full border border-[#10B981]/10">
                  +8%
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 p-4">
              <p className="text-sm text-white/70">Refunds this month</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-2xl font-bold">$340</span>
                <span className="text-xs text-[#F43F5E] bg-[#F43F5E]/10 px-1.5 py-0.5 rounded-full border border-[#F43F5E]/10">
                  -8%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add History Dialog */}
      <Dialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        className="!max-w-[1000px] border border-white/10 rounded-xl !p-0"
      >
        <DialogContent className="max-h-[90vh] !gap-0">
          <div className="flex flex-col gap-y-3 bg-white/[0.03] border-b border-white/10 p-6">
            <DialogTitle>Payment History</DialogTitle>
            <DialogDescription>
              This is a list of all the payments you have made this month.
            </DialogDescription>
          </div>

          <div className="border border-white/10 rounded-lg max-h-[80vh] overflow-y-auto m-6">
            <table className="w-full text-white text-sm">
              <thead className="bg-white/[0.03] border-b border-white/10">
                <tr className="text-left [&>th]:font-medium [&>th]:min-w-[180px]">
                  <th className="p-4 text-sm font-medium text-white/70">
                    Amount
                  </th>
                  <th className="p-4 text-sm font-medium text-white/70">
                    Card
                  </th>
                  <th className="p-4 text-sm font-medium text-white/70">
                    Date
                  </th>
                  <th className="p-4 text-sm font-medium text-white/70">
                    Reference
                  </th>
                  <th className="p-4 text-sm font-medium text-white/70">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payoutHistory.map((payout, index) => (
                  <tr key={index} className="hover:bg-white/[0.01]">
                    <td className="p-4">${payout.amount}</td>
                    <td className="p-4 flex items-center gap-2">
                      <div className="border border-white/10 rounded h-6 w-fit px-1 py-1 flex items-center justify-center">
                        {cardIcons[payout.cardType]}
                      </div>
                      •••• {payout.cardLast4}
                    </td>
                    <td className="p-4">{payout.date}</td>
                    <td className="p-4">{payout.reference}</td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium`}
                      >
                        {statusIcons[payout.status]}
                        {payout.status.charAt(0).toUpperCase() +
                          payout.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}
