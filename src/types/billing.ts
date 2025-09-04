/**
 * Billing and Subscription Types
 * Type definitions for billing, subscriptions, and pricing
 */

// Subscription status enum
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  PAUSED = 'paused'
}

// Pricing tier enum
export enum PricingTier {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

// Billing period enum
export enum BillingPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

// Usage tracking types
export interface UsageRecord {
  id: string;
  userId: string;
  calculatorId: string;
  actionType: 'calculation' | 'export' | 'api_call' | 'preset_save';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UsageStats {
  calculationsThisMonth: number;
  exportsThisMonth: number;
  apiCallsThisMonth: number;
  presetsCreated: number;
  lastCalculation?: Date;
  mostUsedCalculator?: string;
}

export interface UsageLimits {
  calculationsPerMonth: number | 'unlimited';
  exportsPerMonth: number | 'unlimited';
  apiCallsPerMonth: number | 'unlimited';
  presetsLimit: number | 'unlimited';
  calculatorAccess: string[]; // Calculator IDs accessible
  features: string[]; // Feature flags
}

// Subscription interface
export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId?: string;
  planId: PricingTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  billingPeriod: BillingPeriod;
  priceId: string;
  quantity: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Payment interface
export interface Payment {
  id: string;
  userId: string;
  subscriptionId?: string;
  stripePaymentIntentId?: string;
  amount: number; // in cents
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'canceled' | 'refunded';
  description?: string;
  receiptUrl?: string;
  refundedAmount?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice interface
export interface Invoice {
  id: string;
  userId: string;
  subscriptionId?: string;
  stripeInvoiceId?: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  subtotal: number;
  tax?: number;
  total: number;
  currency: string;
  dueDate?: Date;
  paidAt?: Date;
  hostedInvoiceUrl?: string;
  invoicePdf?: string;
  lineItems: InvoiceLineItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  amount: number;
  period?: {
    start: Date;
    end: Date;
  };
}

// Pricing plan configuration
export interface PricingPlan {
  id: PricingTier;
  name: string;
  description: string;
  prices: {
    monthly: number;
    yearly: number;
  };
  stripePriceIds: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  limitations: string[];
  usageLimits: UsageLimits;
  popular?: boolean;
  trialDays: number;
  setupFee?: number;
}

// Feature gate interface
export interface FeatureGate {
  feature: string;
  requiredTier: PricingTier;
  description: string;
  upgradeMessage: string;
}

// Billing analytics interface
export interface BillingAnalytics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  churnRate: number;
  ltv: number; // Customer Lifetime Value
  cac: number; // Customer Acquisition Cost
  conversionRate: number;
  trialToPayConversion: number;
  revenueByTier: Record<PricingTier, number>;
  customersByTier: Record<PricingTier, number>;
  period: {
    start: Date;
    end: Date;
  };
}

// Webhook event types
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
    previous_attributes?: any;
  };
  created: number;
  livemode: boolean;
  pending_webhooks: number;
  request?: {
    id: string;
    idempotency_key?: string;
  };
}

// Payment method interface
export interface PaymentMethod {
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  type: 'card' | 'bank_account' | 'paypal';
  isDefault: boolean;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    country?: string;
  };
  bankAccount?: {
    bankName?: string;
    last4: string;
    accountType?: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Discount/Coupon interface
export interface Discount {
  id: string;
  stripeCouponId?: string;
  name: string;
  percentOff?: number;
  amountOff?: number;
  currency?: string;
  duration: 'once' | 'repeating' | 'forever';
  durationInMonths?: number;
  maxRedemptions?: number;
  timesRedeemed: number;
  validFrom?: Date;
  validUntil?: Date;
  active: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Customer billing profile
export interface BillingProfile {
  userId: string;
  stripeCustomerId?: string;
  email: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  taxId?: string;
  taxExempt?: 'none' | 'exempt' | 'reverse';
  defaultPaymentMethodId?: string;
  invoiceSettings?: {
    defaultPaymentMethod?: string;
    footer?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface SubscriptionResponse {
  subscription: Subscription;
  usage: UsageStats;
  limits: UsageLimits;
  nextBillingDate: Date;
  upcomingInvoice?: {
    amount: number;
    currency: string;
    date: Date;
  };
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface UsageResponse {
  current: UsageStats;
  limits: UsageLimits;
  percentUsed: {
    calculations: number;
    exports: number;
    apiCalls: number;
  };
  resetDate: Date;
}

// Error types
export interface BillingError {
  code: string;
  message: string;
  type: 'card_error' | 'invalid_request_error' | 'api_error' | 'authentication_error' | 'rate_limit_error';
  param?: string;
  decline_code?: string;
  charge?: string;
  payment_intent?: string;
  payment_method?: string;
  setup_intent?: string;
  source?: string;
}

// Plan change request
export interface PlanChangeRequest {
  newPlanId: PricingTier;
  billingPeriod: BillingPeriod;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
  effectiveDate?: Date;
}

// Subscription creation request
export interface CreateSubscriptionRequest {
  planId: PricingTier;
  billingPeriod: BillingPeriod;
  paymentMethodId: string;
  couponId?: string;
  trialDays?: number;
  metadata?: Record<string, any>;
}

export default {
  SubscriptionStatus,
  PricingTier,
  BillingPeriod
};
