import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import {
  userSubscriptions,
  subscriptionPayments,
  pricing,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateUUID } from "@/lib/utils";

export type PaymentProvider = "paystack" | "flutterwave";

export interface PaymentInitiateOptions {
  userId: string;
  pricingId: string;
  billingCycle: "monthly" | "yearly";
  email: string;
  name: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  callbackUrl?: string;
  provider?: PaymentProvider;
}

export interface PaymentVerifyOptions {
  reference: string;
  provider: PaymentProvider;
}

export interface PaymentWebhookData {
  event: string;
  data: Record<string, any>;
  provider: PaymentProvider;
}

export class PaymentService {
  /**
   * Initialize a payment with Paystack
   */
  static async initiatePaystackPayment(options: PaymentInitiateOptions) {
    const {
      userId,
      pricingId,
      billingCycle,
      email,
      name,
      amount,
      currency,
      metadata = {},
      callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    } = options;

    try {
      // Generate a unique reference
      const reference = `bm_${generateUUID()}`;

      // Prepare the request to Paystack
      const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
            currency,
            reference,
            callback_url: callbackUrl,
            metadata: {
              ...metadata,
              userId,
              pricingId,
              billingCycle,
              custom_fields: [
                {
                  display_name: "Name",
                  variable_name: "name",
                  value: name,
                },
                {
                  display_name: "Billing Cycle",
                  variable_name: "billing_cycle",
                  value: billingCycle,
                },
              ],
            },
          }),
        }
      );

      const data = await response.json();

      if (!data.status) {
        throw new Error(
          data.message || "Failed to initialize Paystack payment"
        );
      }

      return {
        success: true,
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference,
        accessCode: data.data.access_code,
      };
    } catch (error) {
      console.error("Paystack payment initialization error:", error);
      throw error;
    }
  }

  /**
   * Initialize a payment with Flutterwave
   */
  static async initiateFlutterwavePayment(options: PaymentInitiateOptions) {
    const {
      userId,
      pricingId,
      billingCycle,
      email,
      name,
      amount,
      currency,
      metadata = {},
      callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    } = options;

    try {
      // Generate a unique transaction reference
      const txRef = `bm_${generateUUID()}`;

      // Prepare the request to Flutterwave
      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: txRef,
          amount,
          currency,
          redirect_url: callbackUrl,
          customer: {
            email,
            name,
          },
          meta: {
            ...metadata,
            userId,
            pricingId,
            billingCycle,
          },
          customizations: {
            title: "Business Manager Subscription",
            description: `${
              billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)
            } subscription payment`,
            logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
          },
        }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(
          data.message || "Failed to initialize Flutterwave payment"
        );
      }

      return {
        success: true,
        authorizationUrl: data.data.link,
        reference: txRef,
      };
    } catch (error) {
      console.error("Flutterwave payment initialization error:", error);
      throw error;
    }
  }

  /**
   * Verify a Paystack payment
   */
  static async verifyPaystackPayment(reference: string) {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message || "Failed to verify Paystack payment");
      }

      return {
        success: true,
        data: data.data,
        verified: data.data.status === "success",
        metadata: data.data.metadata,
      };
    } catch (error) {
      console.error("Paystack payment verification error:", error);
      throw error;
    }
  }

  /**
   * Verify a Flutterwave payment
   */
  static async verifyFlutterwavePayment(transactionId: string) {
    try {
      const response = await fetch(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(data.message || "Failed to verify Flutterwave payment");
      }

      return {
        success: true,
        data: data.data,
        verified: data.data.status === "successful",
        metadata: data.data.meta,
      };
    } catch (error) {
      console.error("Flutterwave payment verification error:", error);
      throw error;
    }
  }

  /**
   * Process a successful payment and update subscription
   */
  static async processSuccessfulPayment({
    userId,
    pricingId,
    billingCycle,
    amount,
    currency,
    paymentMethod,
    paymentProvider,
    paymentProviderReference,
    metadata = {},
  }: {
    userId: string;
    pricingId: string;
    billingCycle: "monthly" | "yearly";
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentProvider: PaymentProvider;
    paymentProviderReference: string;
    metadata?: Record<string, any>;
  }) {
    try {
      // Get pricing details to calculate subscription period
      const pricingDetails = await db.query.pricing.findFirst({
        where: eq(pricing.id, pricingId),
      });

      if (!pricingDetails) {
        throw new Error("Pricing plan not found");
      }

      // Calculate subscription period
      const startDate = new Date();
      const endDate = new Date(startDate);

      if (billingCycle === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Calculate next billing date (same as end date for now)
      const nextBillingDate = new Date(endDate);

      return await db.transaction(async (tx) => {
        // Check if user already has a subscription
        const existingSubscription = await tx.query.userSubscriptions.findFirst(
          {
            where: eq(userSubscriptions.userId, userId),
          }
        );

        let subscriptionId;

        if (existingSubscription) {
          // Update existing subscription
          await tx
            .update(userSubscriptions)
            .set({
              pricingId,
              startDate,
              endDate,
              status: "active",
              billingCycle,
              autoRenew: true,
              lastPaymentDate: startDate,
              nextBillingDate,
              updatedAt: new Date(),
            })
            .where(eq(userSubscriptions.id, existingSubscription.id));

          subscriptionId = existingSubscription.id;
        } else {
          // Create new subscription
          const id = generateUUID();
          await tx.insert(userSubscriptions).values({
            id,
            userId,
            pricingId,
            startDate,
            endDate,
            status: "active",
            billingCycle,
            autoRenew: true,
            lastPaymentDate: startDate,
            nextBillingDate,
            trialUsed: true, // Mark trial as used even if they didn't use it
          });

          subscriptionId = id;
        }

        // Record the payment
        const paymentId = generateUUID();
        await tx.insert(subscriptionPayments).values({
          id: paymentId,
          subscriptionId,
          amount: amount.toString(),
          currency,
          status: "succeeded",
          paymentMethod,
          paymentProvider,
          paymentProviderSubscriptionId: paymentProviderReference,
          paymentDate: startDate,
          metadata: metadata as any,
        });

        // Return the updated subscription
        return await tx.query.userSubscriptions.findFirst({
          where: eq(userSubscriptions.id, subscriptionId),
          with: {
            pricing: {
              with: {
                plan: true,
              },
            },
          },
        });
      });
    } catch (error) {
      console.error("Error processing successful payment:", error);
      throw error;
    }
  }

  /**
   * Handle a failed payment
   */
  static async processFailedPayment({
    userId,
    pricingId,
    billingCycle,
    amount,
    currency,
    paymentMethod,
    paymentProvider,
    paymentProviderReference,
    failureReason,
    metadata = {},
  }: {
    userId: string;
    pricingId: string;
    billingCycle: "monthly" | "yearly";
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentProvider: PaymentProvider;
    paymentProviderReference: string;
    failureReason: string;
    metadata?: Record<string, any>;
  }) {
    try {
      // Check if user has a subscription
      const existingSubscription = await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.userId, userId),
      });

      if (!existingSubscription) {
        // No subscription to update, just record the failed payment
        const paymentId = generateUUID();
        await db.insert(subscriptionPayments).values({
          id: paymentId,
          subscriptionId: "none", // No subscription associated
          amount: amount.toString(),
          currency,
          status: "failed",
          paymentMethod,
          paymentProvider,
          paymentProviderSubscriptionId: paymentProviderReference,
          paymentDate: new Date(),
          metadata: {
            ...metadata,
            failureReason,
          } as any,
        });

        return null;
      }

      // Record the failed payment
      const paymentId = generateUUID();
      await db.insert(subscriptionPayments).values({
        id: paymentId,
        subscriptionId: existingSubscription.id,
        amount: amount.toString(),
        currency,
        status: "failed",
        paymentMethod,
        paymentProvider,
        paymentProviderSubscriptionId: paymentProviderReference,
        paymentDate: new Date(),
        metadata: {
          ...metadata,
          failureReason,
        } as any,
      });

      // If the subscription is active and this was a renewal payment, mark it as past_due
      if (existingSubscription.status === "active") {
        const now = new Date();
        const endDate = new Date(existingSubscription.endDate as Date);

        if (endDate < now) {
          // Subscription has expired, update status
          await db
            .update(userSubscriptions)
            .set({
              status: "past_due",
              updatedAt: new Date(),
            })
            .where(eq(userSubscriptions.id, existingSubscription.id));
        }
      }

      return await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.id, existingSubscription.id),
        with: {
          pricing: {
            with: {
              plan: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error processing failed payment:", error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string, reason?: string) {
    try {
      const subscription = await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.id, subscriptionId),
      });

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      // Update subscription status
      await db
        .update(userSubscriptions)
        .set({
          status: "canceled",
          canceledAt: new Date(),
          autoRenew: false,
          updatedAt: new Date(),
        })
        .where(eq(userSubscriptions.id, subscriptionId));

      return await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.id, subscriptionId),
        with: {
          pricing: {
            with: {
              plan: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }
}
