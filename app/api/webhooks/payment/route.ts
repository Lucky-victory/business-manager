import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  PaymentService,
  PaymentWebhookData,
} from "@/lib/payment/payment-service";
import { db } from "@/lib/db";
import { userSubscriptions, pricing } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Verify Paystack webhook signature
function verifyPaystackSignature(payload: string, signature: string): boolean {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("PAYSTACK_SECRET_KEY is not defined");
      return false;
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(payload)
      .digest("hex");

    return hash === signature;
  } catch (error) {
    console.error("Error verifying Paystack signature:", error);
    return false;
  }
}

// Verify Flutterwave webhook signature
function verifyFlutterwaveSignature(
  payload: string,
  signature: string
): boolean {
  try {
    const secret = process.env.FLUTTERWAVE_SECRET_HASH;
    if (!secret) {
      console.error("FLUTTERWAVE_SECRET_HASH is not defined");
      return false;
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(payload)
      .digest("hex");

    return hash === signature;
  } catch (error) {
    console.error("Error verifying Flutterwave signature:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw request body as a string
    const rawBody = await request.text();

    // Parse the body as JSON
    const body = JSON.parse(rawBody);

    // Determine the payment provider from the request headers or body
    const provider = request.headers.get("x-paystack-signature")
      ? "paystack"
      : request.headers.get("verif-hash")
      ? "flutterwave"
      : null;

    if (!provider) {
      return NextResponse.json(
        { error: "Unknown payment provider" },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let isVerified = false;

    if (provider === "paystack") {
      const signature = request.headers.get("x-paystack-signature") || "";
      isVerified = verifyPaystackSignature(rawBody, signature);
    } else if (provider === "flutterwave") {
      const signature = request.headers.get("verif-hash") || "";
      isVerified = verifyFlutterwaveSignature(rawBody, signature);
    }

    if (!isVerified && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Process the webhook based on the provider and event type
    const webhookData: PaymentWebhookData = {
      event: "",
      data: {},
      provider: provider as "paystack" | "flutterwave",
    };

    if (provider === "paystack") {
      // Handle Paystack webhook
      webhookData.event = body.event;
      webhookData.data = body.data;

      // Process different Paystack events
      switch (body.event) {
        case "charge.success":
          await handlePaystackChargeSuccess(webhookData.data);
          break;
        case "subscription.create":
          await handlePaystackSubscriptionCreate(webhookData.data);
          break;
        case "subscription.disable":
          await handlePaystackSubscriptionDisable(webhookData.data);
          break;
        case "invoice.payment_failed":
          await handlePaystackPaymentFailed(webhookData.data);
          break;
        default:
          console.log(`Unhandled Paystack event: ${body.event}`);
      }
    } else if (provider === "flutterwave") {
      // Handle Flutterwave webhook
      webhookData.event = body.event;
      webhookData.data = body.data;

      // Process different Flutterwave events
      switch (body.event) {
        case "charge.completed":
          await handleFlutterwaveChargeCompleted(webhookData.data);
          break;
        case "subscription.cancelled":
          await handleFlutterwaveSubscriptionCancelled(webhookData.data);
          break;
        case "transfer.failed":
          await handleFlutterwaveTransferFailed(webhookData.data);
          break;
        default:
          console.log(`Unhandled Flutterwave event: ${body.event}`);
      }
    }

    // Return a success response
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Handler functions for Paystack events
async function handlePaystackChargeSuccess(data: any) {
  try {
    // Extract metadata from the payment
    const metadata = data.metadata || {};
    const userId = metadata.userId;
    const pricingId = metadata.pricingId;
    const billingCycle = metadata.billingCycle || "monthly";

    if (!userId || !pricingId) {
      console.error("Missing userId or pricingId in payment metadata");
      return;
    }

    // Get pricing details
    const pricingDetails = await db.query.pricing.findFirst({
      where: eq(pricing.id, pricingId),
    });

    if (!pricingDetails) {
      console.error(`Pricing plan not found: ${pricingId}`);
      return;
    }

    // Process the successful payment
    await PaymentService.processSuccessfulPayment({
      userId,
      pricingId,
      billingCycle,
      amount: data.amount / 100, // Convert from kobo to naira
      currency: data.currency,
      paymentMethod: data.channel || "card",
      paymentProvider: "paystack",
      paymentProviderReference: data.reference,
      metadata: {
        paystackData: data,
        customerEmail: data.customer?.email,
      },
    });

    console.log(`Successfully processed Paystack payment for user ${userId}`);
  } catch (error) {
    console.error("Error handling Paystack charge success:", error);
  }
}

async function handlePaystackSubscriptionCreate(data: any) {
  try {
    // This event is triggered when a subscription is created
    console.log("Paystack subscription created:", data);

    // You might want to store the subscription ID for future reference
    const subscriptionCode = data.subscription_code;
    const customerEmail = data.customer?.email;

    // Find the user by email
    // This would require additional database queries to find the user by email

    console.log(
      `Paystack subscription created: ${subscriptionCode} for ${customerEmail}`
    );
  } catch (error) {
    console.error("Error handling Paystack subscription create:", error);
  }
}

async function handlePaystackSubscriptionDisable(data: any) {
  try {
    // This event is triggered when a subscription is disabled/cancelled
    console.log("Paystack subscription disabled:", data);

    const subscriptionCode = data.subscription_code;
    const customerEmail = data.customer?.email;

    // Find the user subscription by the Paystack subscription code
    // This would require additional database queries

    // Update the subscription status to cancelled
    // await PaymentService.cancelSubscription(subscriptionId);

    console.log(
      `Paystack subscription disabled: ${subscriptionCode} for ${customerEmail}`
    );
  } catch (error) {
    console.error("Error handling Paystack subscription disable:", error);
  }
}

async function handlePaystackPaymentFailed(data: any) {
  try {
    // This event is triggered when a payment fails
    console.log("Paystack payment failed:", data);

    const customerEmail = data.customer?.email;
    const amount = data.amount / 100; // Convert from kobo to naira

    // Find the user by email
    // This would require additional database queries

    // Record the failed payment
    // You would need to extract the userId and pricingId

    console.log(`Paystack payment failed: ${amount} for ${customerEmail}`);
  } catch (error) {
    console.error("Error handling Paystack payment failed:", error);
  }
}

// Handler functions for Flutterwave events
async function handleFlutterwaveChargeCompleted(data: any) {
  try {
    // Extract metadata from the payment
    const meta = data.meta || {};
    const userId = meta.userId;
    const pricingId = meta.pricingId;
    const billingCycle = meta.billingCycle || "monthly";

    if (!userId || !pricingId) {
      console.error("Missing userId or pricingId in payment metadata");
      return;
    }

    // Get pricing details
    const pricingDetails = await db.query.pricing.findFirst({
      where: eq(pricing.id, pricingId),
    });

    if (!pricingDetails) {
      console.error(`Pricing plan not found: ${pricingId}`);
      return;
    }

    // Check if the payment was successful
    if (data.status === "successful") {
      // Process the successful payment
      await PaymentService.processSuccessfulPayment({
        userId,
        pricingId,
        billingCycle,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.payment_type || "card",
        paymentProvider: "flutterwave",
        paymentProviderReference: data.flw_ref,
        metadata: {
          flutterwaveData: data,
          customerEmail: data.customer?.email,
        },
      });

      console.log(
        `Successfully processed Flutterwave payment for user ${userId}`
      );
    } else {
      // Handle failed payment
      await PaymentService.processFailedPayment({
        userId,
        pricingId,
        billingCycle,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.payment_type || "card",
        paymentProvider: "flutterwave",
        paymentProviderReference: data.flw_ref,
        failureReason: data.status,
        metadata: {
          flutterwaveData: data,
          customerEmail: data.customer?.email,
        },
      });

      console.log(`Recorded failed Flutterwave payment for user ${userId}`);
    }
  } catch (error) {
    console.error("Error handling Flutterwave charge completed:", error);
  }
}

async function handleFlutterwaveSubscriptionCancelled(data: any) {
  try {
    // This event is triggered when a subscription is cancelled
    console.log("Flutterwave subscription cancelled:", data);

    const subscriptionId = data.id;
    const customerEmail = data.customer?.email;

    // Find the user subscription by the Flutterwave subscription ID
    // This would require additional database queries

    // Update the subscription status to cancelled
    // await PaymentService.cancelSubscription(subscriptionId);

    console.log(
      `Flutterwave subscription cancelled: ${subscriptionId} for ${customerEmail}`
    );
  } catch (error) {
    console.error("Error handling Flutterwave subscription cancelled:", error);
  }
}

async function handleFlutterwaveTransferFailed(data: any) {
  try {
    // This event is triggered when a transfer fails
    console.log("Flutterwave transfer failed:", data);

    // This is more relevant for refunds or payouts, not subscriptions
    // But you might want to log it for audit purposes

    console.log(`Flutterwave transfer failed: ${data.id}`);
  } catch (error) {
    console.error("Error handling Flutterwave transfer failed:", error);
  }
}
