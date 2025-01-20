import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import url from "../../constants/url";
import { Button, Modal, Space } from 'antd';
import { SelectOutlined } from "@ant-design/icons";
import { Spin } from 'antd';

const Checkout = () => {
  const location = useLocation();
  //const { selectedTicketPrice, count, eventId, selectedTicketId, selectedTicketName } = location.state || {};

  const [event, setEvent] = useState({});
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [organizerId, setOrganizerId] = useState(null);

  const [details, setDetails] = useState(false)
  const [basicModal, setBasicModal] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [promos, setPromos] = useState([]);

  const selectedTicketPrice = localStorage.getItem('selectedTicketPrice') || {};
  const count = localStorage.getItem('count') || {};
  const selectedTicketId = localStorage.getItem('selectedTicketId') || {};
  const selectedTicketName = localStorage.getItem('selectedTicketName') || {};
  const eventId = localStorage.getItem('user_event_id') || {};

  const stripe = useStripe();
  const elements = useElements();

  const [promoCode, setPromoCode] = useState('');
  const [amount, setAmount] = useState(null);
  const [type, setType] = useState('');

  const [loading, setLoading] = useState(false);


  const handleApply = () => {
    const matchedPromo = promos.find(promo => promo.code === promoCode);
    if (matchedPromo) {
      setAmount(matchedPromo.amount);
      setType(matchedPromo.type);
      console.log(`Promo code applied: ${promoCode}, Amount: ${matchedPromo.amount}, Type: ${matchedPromo.type}`);
    } else {
      alert("Promo code not valid")
      console.log('Promo code not valid');
      setAmount(null);
      setType('');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${url}/promo/get-promo/${eventId}`);
      const eventData = response.data;
      setPromos(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents()
  }, [eventId])

  useEffect(() => {
    if (userId) {
      axios
        .get(`${url}/auth/get-user-by-id/${userId}`)
        .then((response) => {
          const userData = response.data;
          setFormData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
          })
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
        });
    }
  }, [userId]);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${url}/event/get-event-by-id/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false)
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const ticket = event?.tickets?.find(ticket => ticket._id.toString() === selectedTicketId);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userID");
    const storedOrganizerId = localStorage.getItem("user_organizer_id");
    const userName = localStorage.getItem("userName")
    setUserId(storedUserId);
    setUserName(userName)
    setOrganizerId(storedOrganizerId);
    if (!userName) {
      setDetails(true);
    }
  }, []);

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

    return `${dayOfWeek}, ${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
  };

  const calculateTotal = () => {
    const subtotal = count * selectedTicketPrice;
    const taxValue = parseFloat(event.tax) || 0;
    const organizerTax = subtotal * (taxValue / 100);
    const platformFee = ((subtotal + organizerTax) * 0.09) + 0.89;
    let total = subtotal + platformFee;
    if (amount && type) {
      if (type === 'amount') {
        total -= parseFloat(amount) || 0;
      } else if (type === 'percentage') {
        const discount = (total * (parseFloat(amount) || 0)) / 100;
        total -= discount;
      }
    }
    return total.toFixed(2);
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setPaymentProcessing(true);
    setPaymentError(null);



    try {
      const response = await axios.post(`${url}/create-payment-intent`, {
        amount: Math.round(parseFloat(calculateTotal()) * 100),
        organizerId: organizerId,
        userId: userId,
        eventId: eventId,
        date: Date.now(),
        status: "pending",
        count: count,
        ticketId: selectedTicketId,
        tickets: ticket,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        tax: Number(event.tax) !== 0
      });

      const { clientSecret, paymentId } = response.data;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
          },
        },
      });

      if (result.error) {
        setPaymentError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        window.location.href = `/qr-ticket/${paymentId}`;
      }
    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleRSVPAdd = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/create-payment-intent-rsvp`, {
        amount: 0,
        organizerId: organizerId,
        userId: userId,
        eventId: eventId,
        date: Date.now(),
        status: "pending",
        count: count,
        ticketId: selectedTicketId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });
      if (response.data.success === true) {
        window.location.href = `/qr-ticket/${response.data.paymentId}`;
      }
    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setPaymentProcessing(false);
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#fff',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  // const fetchBook = async () => {
  //   try {
  //     const response = await axios.get(`${url}/get-qr-ticket-details/${id}`);
  //     setBook(response.data);
  //   } catch (error) {
  //     console.error('Error fetching events:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchBook();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinish = async () => {
    try {
      const basicInfoResponse = await axios.post(`${url}/auth/basic-info/${userId}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      if (basicInfoResponse.data.success) {
        localStorage.setItem('userName', formData.firstName);
        Modal.success({
          title: 'Successfully Updated Profile',
          content: 'continue with you booking',
          onOk: () => {
            setDetails(false);
            window.location.reload()
          },
          okButtonProps: {
            style: { backgroundColor: 'black', borderColor: 'black', color: 'white' },
          },
          cancelButtonProps: {
            style: { display: 'none' },
          },
          maskStyle: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          style: { color: 'white', backgroundColor: '#000', borderRadius: '8px', borderColor: '#ccc' },
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Error", "An error occurred. Please try again.");
    }
  }

  return (
    <>
      {
        loading ? (
          <>
            <div className='text-center mt-10'>
              <Spin size="large" />
            </div>
          </>
        ) : (
          <div className="p-4 bg-primary min-h-screen flex flex-col items-center">
            <div className="bg-black text-white p-4 rounded-lg w-full max-w-md flex items-center justify-between">
              <div className="flex-shrink-0">
                <img
                  src={event.flyer}
                  alt="Event"
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
              <div className="flex-grow mx-6">
                <h3 className="text-lg font-bold font-inter">{event.event_name}</h3>
                <p className="text-sm text-gray-400 font-inter">{formatDate(event.start_date)}</p>
                <p className="text-sm text-gray-400 font-inter">{event.venue_name}</p>
                <p className="text-md text-gray-400 font-inter">{selectedTicketName}</p>
              </div>
            </div>
            <div className="bg-black p-4 rounded-lg w-full max-w-md mt-4">
              <div className="flex justify-between mb-3">
                <span className="text-white font-inter">Tickets ({count}x)</span>
                <span className="text-white font-inter">${(count * selectedTicketPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-white font-inter">Platform Fee</span>
                {
                  event.tax !== 'undefined' && typeof event.tax === 'number' ? (
                    <>
                      <span className="text-white font-inter">
                        ${
                          ((((count * selectedTicketPrice) + ((count * selectedTicketPrice) * (event.tax / 100))) * 0.09) + 0.89).toFixed(2)
                        }
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-inter">
                        ${((count * selectedTicketPrice * 0.09) + 0.89).toFixed(2)}
                      </span>
                    </>
                  )
                }
              </div>
              <div className="border-t border-gray-600 my-3" />
              {
                type && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-white font-inter">Coupon</span>
                      <span className="text-white font-bold font-inter">
                        {
                          type === 'amount' ?
                            `$${amount}` : `${amount}%`
                        }
                      </span>
                    </div>
                  </>
                )
              }
              <div className="flex justify-between mt-2">
                <span className="text-white font-bold font-inter">Total</span>
                <span className="text-white font-bold font-inter">${calculateTotal()}</span>
              </div>
            </div>
            <div className="flex items-center mt-3 w-full max-w-md">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-grow p-2 rounded-l-md border border-gray-800 bg-black text-white focus:outline-none"
              />
              <button
                onClick={handleApply}
                className="bg-yellow-500 text-black font-semibold p-2 rounded-r-md hover:bg-yellow-400 transition duration-200"
              >
                Apply
              </button>
            </div>
            {
              event.event_type !== 'rsvp' && userName ? (
                <>
                  <form onSubmit={handlePayment} className="w-full max-w-md mt-4">
                    <div className="bg-black p-4 rounded-lg">
                      <label className="text-white block mb-2">
                        Card Details
                      </label>
                      <div className="bg-[#1a1a1a] p-3 rounded">
                        <CardElement options={cardElementOptions} />
                      </div>

                      {paymentError && (
                        <div className="text-red-500 mt-2 text-sm">
                          {paymentError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={!stripe || paymentProcessing}
                        className={`w-full mt-4 font-inter py-3 rounded-lg font-bold ${paymentProcessing
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-primary hover:bg-[#171717]'
                          } text-white`}
                      >
                        {paymentProcessing ? 'Processing...' : `Pay $${calculateTotal()}`}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <button onClick={handleRSVPAdd} className="mt-3 px-10 py-1 font-inter bg-gray-300 rounded-md">Book</button>
                </>
              )
            }
            <form className="w-full max-w-md mt-4">
              <div className="bg-black p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <label className="text-white block">Basic Info</label>
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-700 font-medium"
                    onClick={() => setBasicModal(true)}
                  >
                    Edit
                  </button>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-white">{formData.firstName}</span>
                </div>
              </div>
            </form>
            <div>
              {details && (
                <>
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-black w-full max-w-lg p-6 rounded-lg shadow-lg relative border border-gray-600">
                      <div>
                        <h2 className="text-xl font-bold mb-4 text-white">Please fill Basic Details</h2>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          className="border-b p-2 outline-none border-gray-800 bg-black w-full mb-4 text-white"
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          className="border-b p-2 outline-none border-gray-800 bg-black w-full mb-4 text-white"
                        />
                        <input
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email ID"
                          className="border-b p-2 outline-none border-gray-800 bg-black w-full mb-4 text-white"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={handleFinish}
                            className="bg-green-500 text-black font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => setDetails(false)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div>
              {basicModal && (
                <>
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-black w-full max-w-lg p-6 rounded-lg shadow-lg relative border border-gray-600">
                      <div>
                        <h2 className="text-xl font-bold mb-4 text-white">Basic Details</h2>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          className="border-b p-2 outline-none border-gray-800 bg-black w-full mb-4 text-white"
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          className="border-b p-2 outline-none border-gray-800 bg-black w-full mb-4 text-white"
                        />
                        <input
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email ID"
                          className="border-b p-2 outline-none border-gray-800 bg-black w-full mb-4 text-white"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={handleFinish}
                            className="bg-green-500 text-black font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => setBasicModal(false)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )
      }
    </>
  );
};

export default Checkout;