import Stripe from "stripe";
import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err:any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const sb = getAdminSupabase();
  
  // Check idempotency
  const { data: existing } = await sb
    .from("stripe_event_log")
    .select("id")
    .eq("event_id", event.id)
    .single();
  
  if (existing) {
    return new Response("Event already processed", { status: 200 });
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const custId = sub.customer as string;
    const priceId = (sub.items.data[0]?.price?.id) || "";
    const plan = priceId === process.env.STRIPE_PRICE_PRO ? "pro"
               : priceId === process.env.STRIPE_PRICE_PLUS ? "plus"
               : "free";
    const { data: profiles } = await sb.from("profiles").select("id").eq("stripe_customer_id", custId).limit(1);
    if (profiles?.[0]) {
      await sb.from("profiles").update({ subscription_tier: plan }).eq("id", profiles[0].id);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const custId = sub.customer as string;
    const { data: profiles } = await sb.from("profiles").select("id").eq("stripe_customer_id", custId).limit(1);
    if (profiles?.[0]) await sb.from("profiles").update({ subscription_tier: "free" }).eq("id", profiles[0].id);
  }

  // Log the processed event
  await sb.from("stripe_event_log").insert({
    event_id: event.id,
    event_type: event.type,
    data: event.data
  });

  return new Response("ok");
} 