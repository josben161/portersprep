import Stripe from "stripe";
import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers.get("stripe-signature")!;
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    return new Response(`Webhook Error: ${e.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "customer.subscription.updated") {
    const obj: any = event.data.object;
    const clerkUserId = obj?.metadata?.clerkUserId;
    const tier = obj?.metadata?.tier || obj?.items?.data?.[0]?.plan?.nickname?.toLowerCase() || "plus";
    const customer = obj?.customer as string | undefined;

    if (clerkUserId) {
      const supabase = getAdminSupabase();
      await supabase.from("profiles").update({ subscription_tier: tier, stripe_customer_id: customer }).eq("clerk_user_id", clerkUserId);
    }
  }
  return new Response("ok");
} 