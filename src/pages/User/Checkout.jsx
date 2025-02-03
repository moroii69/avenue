import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../../constants/stripePromise";

const appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "#0F0F0F",
    colorText: "#e0e0e0",
    colorIcon: "#e0e0e0",
    borderRadius: "25px",
    spacingUnit: "5px",
    fontFamily: "Arial, sans-serif",
  },
};

const CheckoutForm = ({ clientSecret, setStep }) => {
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

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      });

      console.log("Error:", error);
      console.log("Payment Intent:", paymentIntent);

      if (error) {
        setErrorMsg(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setSuccess(true);
        setStep(3);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex items-center justify-center bg-primary mt-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-primary rounded-lg shadow-lg text-white"
      >
        <div className="space-y-1">
          <PaymentElement />
        </div>
        {errorMsg && (
          <div className="mt-3 p-2 bg-red-600 text-white rounded-lg text-center font-inte">
            {errorMsg}
          </div>
        )}
        {success && (
          <div className="mt-3 p-2 bg-green-600 text-white rounded-lg text-center font-inter">
            ✅ Payment Successful!
          </div>
        )}
        <button
          disabled={!stripe || loading}
          type="submit"
          className={`mt-6 font-inter w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-200"
            } text-black font-semibold py-3 rounded-full shadow-md transition duration-200`}
        >
          {loading ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Checkout = ({ clientSecret, setStep }) => {
  if (!clientSecret)
    return (
      <div className="text-white text-center min-h-screen flex items-center justify-center">
        <p>Loading payment details...</p>
      </div>
    );
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm clientSecret={clientSecret} setStep={setStep} />
    </Elements>
  );
};

export default Checkout;
