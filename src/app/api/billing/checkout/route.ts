import Stripe from "stripe";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

export async function POST(req: Request) {
  const { profile } = await requireAuthedProfile();
  const { plan } = await req.json(); // "plus" | "pro"
  if (!["plus","pro"].includes(plan)) return new Response("Bad Request", { status: 400 });

  const sb = getAdminSupabase();
  let customerId = profile.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: profile.email, metadata: { profile_id: profile.id } });
    customerId = customer.id;
    await sb.from("profiles").update({ stripe_customer_id: customerId }).eq("id", profile.id);
  }

  const price = plan === "plus" ? process.env.STRIPE_PRICE_PLUS! : process.env.STRIPE_PRICE_PRO!;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
  });

  return Response.json({ url: session.url });
} 