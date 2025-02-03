import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../../constants/stripePromise";

// Configure the appearance for a dark (night) theme
const appearance = {
  theme: 'night', // Use "night" if supported; otherwise, custom variables override defaults.
  variables: {
    colorPrimary: "#ffffff", // primary text/icon color
    colorBackground: "#1F2937", // dark background (Tailwind gray-800)
    colorText: "#ffffff", // text color
    colorIcon: "#ffffff",
    fontFamily: "sans-serif",
    spacingUnit: "2px",
  },
  rules: {
    // Add any additional custom CSS rules if needed
  },
};

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (!stripe || !elements) {
      setErrorMsg("Stripe.js has not yet loaded. Please try again later.");
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://dev.d2v6xgiqdulhai.amplifyapp.com/",
      },
    });

    if (error) {
      setErrorMsg(error.message || "Payment failed. Please try again.");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-gray-800 text-white rounded shadow-md"
    >
      <PaymentElement />
      {errorMsg && <div className="text-red-400 mt-2">{errorMsg}</div>}
      {success && <div className="text-green-400 mt-2">Payment successful!</div>}
      <button
        disabled={!stripe || loading}
        type="submit"
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

const Checkout = ({ clientSecret }) => {
  if (!clientSecret)
    return <div className="text-white text-center">Loading payment details...</div>;
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
};

export default Checkout;
