import { Ellipsis } from "lucide-react";
import {
  DirectionAwareMenu,
  MenuTrigger,
  MenuItem,
  MenuSeparator,
} from "../../components/ui/DirectionAwareMenu";
import { Dialog, DialogContent } from "../../components/ui/Dialog";
import { useState } from "react";

import { Tabs, TabsList, TabTrigger } from "../../components/ui/Tabs";

const customers = [
  {
    id: 1,
    name: "Sarah Wilson",
    initial: "SW",
    tickets: 3,
    spent: 277,
    date: "Today 14:23",
    status: "pending",
    ticketDetails: [
      {
        type: "REGULAR PASS",
        quantity: 2,
        price: 39,
        description: "Standard admission after 11 PM",
        purchaseTime: "TODAY 14:23",
        status: "Pending check in",
      },
      {
        type: "VIP ACCESS",
        quantity: 1,
        price: 199,
        description: "Table service, priority entry, 4 person minimum",
        purchaseTime: "TODAY 13:30",
        status: null,
      },
    ],
  },
  {
    id: 2,
    name: "John Doe",
    initial: "JD",
    tickets: 1,
    spent: 99,
    date: "Today 12:30",
    status: "active",
    ticketDetails: [
      {
        type: "REGULAR PASS",
        quantity: 1,
        price: 99,
        description: "Standard admission",
        purchaseTime: "TODAY 12:30",
        status: null,
      },
    ],
  },
  {
    id: 3,
    name: "Mike Brown",
    initial: "MB",
    tickets: 0,
    spent: 0,
    date: "Yesterday",
    status: "active",
    ticketDetails: [],
  },
];

export default function CustomerTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 3000);
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      customer.name.toLowerCase().includes(searchLower) ||
      customer.initial.toLowerCase().includes(searchLower) ||
      customer.tickets.toString().includes(searchLower) ||
      customer.spent.toString().includes(searchLower) ||
      customer.date.toLowerCase().includes(searchLower) ||
      customer.status.toLowerCase().includes(searchLower);

    if (activeTab === "pending") {
      return matchesSearch && customer.status === "pending";
    }
    return matchesSearch;
  });

  const pendingCustomers = customers.filter(
    (customer) => customer.status === "pending"
  );

  return (
    <div className="@container grid gap-6 relative">
      <div className="grid @4xl:grid-cols-3 gap-4 h-fit">
        <div className="border border-white/10 p-4 rounded-xl h-full flex flex-col gap-y-3">
          <h2 className="font-medium text-white/70 text-sm">Total members</h2>
          <p className="text-2xl font-medium">12</p>
        </div>
        <div className="border border-white/10 p-4 rounded-xl h-full flex flex-col gap-y-3">
          <h2 className="font-medium text-white/70 text-sm">Active members</h2>
          <p className="text-2xl font-medium">10</p>
        </div>
        <div className="border border-white/10 p-4 rounded-xl h-full flex flex-col gap-y-3">
          <h2 className="font-medium text-white/70 text-sm">Door staff</h2>
          <p className="text-2xl font-medium">8</p>
        </div>
      </div>

      <div className="overflow-hidden">
        <Tabs>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col @4xl:flex-row gap-4 items-start @4xl:items-center justify-between">
              <TabsList className="md:bg-white/5 md:px-1 @4xl:rounded-full">
                <TabTrigger
                  value="all"
                  onClick={() => setActiveTab("all")}
                  className={`flex items-center gap-2 p-2 pl-3 pr-1 @4xl:rounded-full hover:bg-[#0F0F0F] ${
                    activeTab === "all" ? "bg-[#0F0F0F]" : ""
                  }`}
                >
                  All customers{" "}
                  <span className="bg-[#1B1B1B] border border-white/[0.03] h-6 w-fit px-2 rounded-full flex items-center justify-center">
                    {customers.length}
                  </span>
                </TabTrigger>
                <TabTrigger
                  value="pending"
                  onClick={() => setActiveTab("pending")}
                  className={`flex items-center gap-2 p-2 pl-3 pr-1 @4xl:rounded-full hover:bg-[#0F0F0F] ${
                    activeTab === "pending" ? "bg-[#0F0F0F]" : ""
                  }`}
                >
                  Pending{" "}
                  <span className="bg-[#1B1B1B] border border-white/[0.03] h-6 w-fit px-2 rounded-full flex items-center justify-center">
                    {pendingCustomers.length}
                  </span>
                </TabTrigger>
              </TabsList>
              <div className="relative w-full @4xl:w-fit">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    className="text-white/40"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-full pl-10 pr-4 py-2 @4xl:w-[300px] focus:outline-none focus:ring-2 focus:ring-white/10 text-sm w-full"
                />
              </div>
            </div>

            <div className="border rounded-xl border-white/10 overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:min-w-[220px] last:[&>th]:min-w-fit [&>th]:border-r [&>th]:border-white/10 last:[&>th]:border-r-0">
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">Total tickets</th>
                      <th className="text-left p-4">Total spent</th>
                      <th className="text-left p-4">Purchased</th>
                      <th className="py-4 px-4 sticky right-0 flex items-center justify-center">
                        {" "}
                        <div className="bg-white/5 sticky right-0 z-0 backdrop-blur-sm border-l border-white/5 h-10 w-10 flex items-center justify-center rounded-md">
                          <Ellipsis />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b last:border-b-0 border-white/10 hover:bg-white/[2.5%] cursor-pointer transition-colors [&>td]:border-r [&>td]:border-white/10 last:[&>td]:border-r-0"
                      >
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                              {customer.initial}
                            </div>
                            <span>{customer.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 w-full justify-between">
                            {customer.tickets} tickets
                            {customer.status === "pending" && (
                              <span className="border border-white/[0.03] bg-white/10 text-white/70 font-medium text-xs px-2 py-1 rounded-full flex items-center gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 7.5913 11.3679 9.11742 10.2426 10.2426C9.11742 11.3679 7.5913 12 6 12C4.4087 12 2.88258 11.3679 1.75736 10.2426C0.632141 9.11742 0 7.5913 0 6ZM6.64286 2.35714C6.64286 2.18665 6.57513 2.02313 6.45457 1.90257C6.33401 1.78202 6.1705 1.71429 6 1.71429C5.8295 1.71429 5.66599 1.78202 5.54543 1.90257C5.42487 2.02313 5.35714 2.18665 5.35714 2.35714V6C5.35714 6.35486 5.64514 6.64286 6 6.64286H8.78571C8.95621 6.64286 9.11972 6.57513 9.24028 6.45457C9.36084 6.33401 9.42857 6.1705 9.42857 6C9.42857 5.8295 9.36084 5.66599 9.24028 5.54543C9.11972 5.42487 8.95621 5.35714 8.78571 5.35714H6.64286V2.35714Z"
                                    fill="white"
                                    fillOpacity="0.5"
                                  />
                                </svg>
                                PENDING
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 pl-4">${customer.spent}</td>
                        <td className="py-4 pl-4">{customer.date}</td>
                        <td className="py-4 sticky right-0 flex items-center justify-center">
                          <div className="bg-white/5 sticky right-0 z-0 backdrop-blur-sm border-l border-white/5 h-10 w-10 flex items-center justify-center rounded-md">
                            <DirectionAwareMenu>
                              <MenuTrigger>
                                <Ellipsis />
                              </MenuTrigger>
                              <MenuItem
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setTicketDialogOpen(true);
                                }}
                              >
                                <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="10"
                                    viewBox="0 0 14 10"
                                    fill="none"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0H12.5C12.8978 0 13.2794 0.158035 13.5607 0.43934C13.842 0.720644 14 1.10218 14 1.5V2.5C14 2.776 13.773 2.994 13.505 3.062C13.0743 3.1718 12.6925 3.42192 12.4198 3.77286C12.1472 4.1238 11.9991 4.55557 11.9991 5C11.9991 5.44443 12.1472 5.8762 12.4198 6.22714C12.6925 6.57808 13.0743 6.8282 13.505 6.938C13.773 7.006 14 7.224 14 7.5V8.5C14 8.89782 13.842 9.27936 13.5607 9.56066C13.2794 9.84196 12.8978 10 12.5 10H1.5C1.10218 10 0.720644 9.84196 0.43934 9.56066C0.158035 9.27936 0 8.89782 0 8.5V7.5C0 7.224 0.227 7.006 0.495 6.938C0.925654 6.8282 1.30747 6.57808 1.58016 6.22714C1.85285 5.8762 2.00088 5.44443 2.00088 5C2.00088 4.55557 1.85285 4.1238 1.58016 3.77286C1.30747 3.42192 0.925654 3.1718 0.495 3.062C0.227 2.994 0 2.776 0 2.5V1.5ZM9 2.75C9 2.55109 9.07902 2.36032 9.21967 2.21967C9.36032 2.07902 9.55109 2 9.75 2C9.94891 2 10.1397 2.07902 10.2803 2.21967C10.421 2.36032 10.5 2.55109 10.5 2.75V3.75C10.5 3.94891 10.421 4.13968 10.2803 4.28033C10.1397 4.42098 9.94891 4.5 9.75 4.5C9.55109 4.5 9.36032 4.42098 9.21967 4.28033C9.07902 4.13968 9 3.94891 9 3.75V2.75ZM9.75 5.5C9.55109 5.5 9.36032 5.57902 9.21967 5.71967C9.07902 5.86032 9 6.05109 9 6.25V7.25C9 7.44891 9.07902 7.63968 9.21967 7.78033C9.36032 7.92098 9.55109 8 9.75 8C9.94891 8 10.1397 7.92098 10.2803 7.78033C10.421 7.63968 10.5 7.44891 10.5 7.25V6.25C10.5 6.05109 10.421 5.86032 10.2803 5.71967C10.1397 5.57902 9.94891 5.5 9.75 5.5Z"
                                      fill="white"
                                      fillOpacity="0.5"
                                    />
                                  </svg>
                                  <span>View Tickets</span>
                                </div>
                              </MenuItem>
                              <MenuSeparator />
                              <MenuItem
                                onClick={() =>
                                  handleCopy(customer.id.toString())
                                }
                              >
                                <div className="flex items-center gap-2 hover:bg-white/5 transition-colors w-full h-full p-2 rounded-md">
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
                                  Copy ID
                                </div>
                              </MenuItem>
                            </DirectionAwareMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-white/60"
                        >
                          {searchQuery
                            ? "No customers found matching your search"
                            : "No customers found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Tabs>
      </div>

      <Dialog
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
        className="!max-w-[400px] border border-white/10 rounded-xl !p-0 overflow-hidden"
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto hide-scrollbar !gap-0 ">
          <div className="flex flex-col p-6">
            <div className="flex flex-col gap-6">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-sm">
                {selectedCustomer?.initial}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-lg">
                  {selectedCustomer?.name}&apos;s tickets
                </h3>
                <p className="text-white/60">
                  {selectedCustomer?.tickets} tickets total
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4 pt-0">
            {selectedCustomer?.ticketDetails.length > 0 ? (
              <div className="flex flex-col gap-4">
                {selectedCustomer.ticketDetails.map((ticket, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-white/[0.03] border border-white/[0.03] rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between w-full gap-2 border-b-2 border-[#0F0F0F] border-dashed p-4">
                      <span className="text-xs text-white/60">
                        {ticket.type}
                      </span>
                      <span className="text-xs text-white/60">
                        {ticket.purchaseTime}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 p-6">
                      <div className="text-lg">
                        <span className="text-white/60">$</span> {ticket.price}{" "}
                        <span className="text-white/60">×</span>{" "}
                        {ticket.quantity}
                      </div>
                      <p className="text-sm text-white/60">
                        {ticket.description}
                      </p>
                    </div>
                    {ticket.status && (
                      <div className="bg-[#0F0F0F] border-t border-white/[0.03] p-2 px-3 flex items-center justify-start gap-2">
                        <span className="text-xs text-white/60 flex items-center gap-2">
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
                              d="M0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7ZM7.75 2.75C7.75 2.55109 7.67098 2.36032 7.53033 2.21967C7.38968 2.07902 7.19891 2 7 2C6.80109 2 6.61032 2.07902 6.46967 2.21967C6.32902 2.36032 6.25 2.55109 6.25 2.75V7C6.25 7.414 6.586 7.75 7 7.75H10.25C10.4489 7.75 10.6397 7.67098 10.7803 7.53033C10.921 7.38968 11 7.19891 11 7C11 6.80109 10.921 6.61032 10.7803 6.46967C10.6397 6.32902 10.4489 6.25 10.25 6.25H7.75V2.75Z"
                              fill="white"
                              fillOpacity="0.5"
                            />
                          </svg>
                          {ticket.status}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60 border-2 border-dashed border-white/5 text-sm rounded-lg p-4">
                No tickets found for this customer
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showCopyNotification && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 backdrop-blur-md text-white p-2 pl-3 rounded-lg flex items-center gap-2 border border-white/10 shadow-lg max-w-[400px] w-full justify-between">
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
                d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM11.844 6.209C11.9657 6.05146 12.0199 5.85202 11.9946 5.65454C11.9693 5.45706 11.8665 5.27773 11.709 5.156C11.5515 5.03427 11.352 4.9801 11.1545 5.00542C10.9571 5.03073 10.7777 5.13346 10.656 5.291L6.956 10.081L5.307 8.248C5.24174 8.17247 5.16207 8.11073 5.07264 8.06639C4.98322 8.02205 4.88584 7.99601 4.78622 7.98978C4.6866 7.98356 4.58674 7.99729 4.4925 8.03016C4.39825 8.06303 4.31151 8.11438 4.23737 8.1812C4.16322 8.24803 4.10316 8.32898 4.06071 8.41931C4.01825 8.50965 3.99425 8.60755 3.99012 8.70728C3.98599 8.807 4.00181 8.90656 4.03664 9.00009C4.07148 9.09363 4.12464 9.17927 4.193 9.252L6.443 11.752C6.51649 11.8335 6.60697 11.8979 6.70806 11.9406C6.80915 11.9833 6.91838 12.0034 7.02805 11.9993C7.13772 11.9952 7.24515 11.967 7.34277 11.9169C7.44038 11.8667 7.5258 11.7958 7.593 11.709L11.844 6.209Z"
                fill="#10B981"
              />
            </svg>
            <p className="text-sm">Event link copied</p>
          </div>
          <button
            onClick={() => setShowCopyNotification(false)}
            className="ml-2 text-white/60 hover:text-white flex items-center justify-center border border-white/10 rounded-full p-1 flex-shrink-0 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M5.28033 4.21967C4.98744 3.92678 4.51256 3.92678 4.21967 4.21967C3.92678 4.51256 3.92678 4.98744 4.21967 5.28033L6.93934 8L4.21967 10.7197C3.92678 11.0126 3.92678 11.4874 4.21967 11.7803C4.51256 12.0732 4.98744 12.0732 5.28033 11.7803L8 9.06066L10.7197 11.7803C11.0126 12.0732 11.4874 12.0732 11.7803 11.7803C12.0732 11.4874 12.0732 11.0126 11.7803 10.7197L9.06066 8L11.7803 5.28033C12.0732 4.98744 12.0732 4.51256 11.7803 4.21967C11.4874 3.92678 11.0126 3.92678 10.7197 4.21967L8 6.93934L5.28033 4.21967Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
