import Stripe from 'stripe'
//same as the .env
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  //not sure what does here useful, but just make sure have something unique here.
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'Spotify Clone',
    version: '0.1.0',
  },
})

