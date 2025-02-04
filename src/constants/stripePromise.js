import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe("pk_live_51QgJMCJ5DtaLPeLIx4N2b0pYgbPnv2TElyHxjnnCBtMdW5MQtnKVZ3FA7YjeI6cIHGUeHKqTApjSVlh5bmxLNocu00seuW8H1Y", {
    betas: ['partitioned_cookies_beta_1'],
    connectivityConfig: {
        cookies: {
            partitioned: true
        }
    }
});
