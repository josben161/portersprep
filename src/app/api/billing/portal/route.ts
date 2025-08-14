import Stripe from "stripe";
import { requireAuthedProfile } from "@/lib/authz";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST() {
  const { profile } = await requireAuthedProfile();
  if (!profile.stripe_customer_id)
    return new Response("No customer", { status: 400 });
  const sess = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });
  return Response.json({ url: sess.url });
}
