/**
 * Payment System Test Helpers
 * Mock payment providers and utilities for testing payment functionality
 */

import { v4 as uuidv4 } from 'uuid';
import { getDbPool } from './database';

export interface MockPaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface MockInvoice {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  invoiceDate: Date;
  dueDate: Date;
  paidAt?: Date;
}

export interface MockSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Mock payment provider state
let mockPaymentMethods: Map<string, MockPaymentMethod> = new Map();
let mockInvoices: Map<string, MockInvoice> = new Map();
let mockSubscriptions: Map<string, MockSubscription> = new Map();
let mockWebhookEvents: any[] = [];

/**
 * Initialize mock payment provider
 */
export function mockPaymentProvider(): void {
  // Reset state
  mockPaymentMethods.clear();
  mockInvoices.clear();
  mockSubscriptions.clear();
  mockWebhookEvents = [];

  // Mock Stripe-like API
  global.mockStripe = {
    paymentMethods: {
      create: mockCreatePaymentMethod,
      retrieve: mockRetrievePaymentMethod,
      attach: mockAttachPaymentMethod,
      detach: mockDetachPaymentMethod,
    },
    subscriptions: {
      create: mockCreateSubscription,
      retrieve: mockRetrieveSubscription,
      update: mockUpdateSubscription,
      cancel: mockCancelSubscription,
    },
    invoices: {
      create: mockCreateInvoice,
      retrieve: mockRetrieveInvoice,
      pay: mockPayInvoice,
      list: mockListInvoices,
    },
    webhooks: {
      constructEvent: mockConstructWebhookEvent,
    },
    customers: {
      create: mockCreateCustomer,
      retrieve: mockRetrieveCustomer,
      update: mockUpdateCustomer,
    },
  };

  console.log('✅ Mock payment provider initialized');
}

/**
 * Create mock payment method
 */
async function mockCreatePaymentMethod(params: any): Promise<MockPaymentMethod> {
  const paymentMethod: MockPaymentMethod = {
    id: `pm_${uuidv4().replace(/-/g, '')}`,
    type: params.type || 'card',
    last4: params.card?.number?.slice(-4) || '4242',
    brand: params.card?.brand || 'visa',
    expiryMonth: params.card?.exp_month || 12,
    expiryYear: params.card?.exp_year || 2025,
  };

  mockPaymentMethods.set(paymentMethod.id, paymentMethod);
  return paymentMethod;
}

/**
 * Retrieve mock payment method
 */
async function mockRetrievePaymentMethod(id: string): Promise<MockPaymentMethod> {
  const paymentMethod = mockPaymentMethods.get(id);
  if (!paymentMethod) {
    throw new Error(`Payment method ${id} not found`);
  }
  return paymentMethod;
}

/**
 * Attach payment method to customer
 */
async function mockAttachPaymentMethod(id: string, params: any): Promise<MockPaymentMethod> {
  const paymentMethod = await mockRetrievePaymentMethod(id);
  // In real Stripe, this would attach to customer
  return paymentMethod;
}

/**
 * Detach payment method from customer
 */
async function mockDetachPaymentMethod(id: string): Promise<MockPaymentMethod> {
  const paymentMethod = await mockRetrievePaymentMethod(id);
  // In real Stripe, this would detach from customer
  return paymentMethod;
}

/**
 * Create mock subscription
 */
async function mockCreateSubscription(params: any): Promise<MockSubscription> {
  const subscription: MockSubscription = {
    id: `sub_${uuidv4().replace(/-/g, '')}`,
    userId: params.customer,
    planId: params.items[0].price,
    status: 'active',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    cancelAtPeriodEnd: false,
  };

  mockSubscriptions.set(subscription.id, subscription);

  // Create invoice for subscription
  await mockCreateInvoice({
    customer: params.customer,
    subscription: subscription.id,
    amount: getAmountForPlan(params.items[0].price),
    currency: 'usd',
    status: 'paid',
  });

  return subscription;
}

/**
 * Retrieve mock subscription
 */
async function mockRetrieveSubscription(id: string): Promise<MockSubscription> {
  const subscription = mockSubscriptions.get(id);
  if (!subscription) {
    throw new Error(`Subscription ${id} not found`);
  }
  return subscription;
}

/**
 * Update mock subscription
 */
async function mockUpdateSubscription(id: string, params: any): Promise<MockSubscription> {
  const subscription = await mockRetrieveSubscription(id);
  
  if (params.cancel_at_period_end !== undefined) {
    subscription.cancelAtPeriodEnd = params.cancel_at_period_end;
  }
  
  if (params.items) {
    subscription.planId = params.items[0].price;
  }

  mockSubscriptions.set(id, subscription);
  return subscription;
}

/**
 * Cancel mock subscription
 */
async function mockCancelSubscription(id: string): Promise<MockSubscription> {
  const subscription = await mockRetrieveSubscription(id);
  subscription.status = 'canceled';
  mockSubscriptions.set(id, subscription);
  return subscription;
}

/**
 * Create mock invoice
 */
async function mockCreateInvoice(params: any): Promise<MockInvoice> {
  const invoice: MockInvoice = {
    id: `in_${uuidv4().replace(/-/g, '')}`,
    userId: params.customer,
    subscriptionId: params.subscription,
    amount: params.amount || 0,
    currency: params.currency || 'usd',
    status: params.status || 'open',
    invoiceDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };

  if (params.status === 'paid') {
    invoice.paidAt = new Date();
  }

  mockInvoices.set(invoice.id, invoice);

  // Store in database for integration tests
  await storeInvoiceInDatabase(invoice);

  return invoice;
}

/**
 * Retrieve mock invoice
 */
async function mockRetrieveInvoice(id: string): Promise<MockInvoice> {
  const invoice = mockInvoices.get(id);
  if (!invoice) {
    throw new Error(`Invoice ${id} not found`);
  }
  return invoice;
}

/**
 * Pay mock invoice
 */
async function mockPayInvoice(id: string): Promise<MockInvoice> {
  const invoice = await mockRetrieveInvoice(id);
  invoice.status = 'paid';
  invoice.paidAt = new Date();
  mockInvoices.set(id, invoice);

  // Update database
  await updateInvoiceInDatabase(invoice);

  return invoice;
}

/**
 * List mock invoices
 */
async function mockListInvoices(params: any): Promise<{ data: MockInvoice[] }> {
  let invoices = Array.from(mockInvoices.values());
  
  if (params.customer) {
    invoices = invoices.filter(inv => inv.userId === params.customer);
  }
  
  if (params.subscription) {
    invoices = invoices.filter(inv => inv.subscriptionId === params.subscription);
  }

  // Sort by date (newest first)
  invoices.sort((a, b) => b.invoiceDate.getTime() - a.invoiceDate.getTime());

  // Apply limit
  if (params.limit) {
    invoices = invoices.slice(0, params.limit);
  }

  return { data: invoices };
}

/**
 * Create mock customer
 */
async function mockCreateCustomer(params: any): Promise<any> {
  return {
    id: `cus_${uuidv4().replace(/-/g, '')}`,
    email: params.email,
    name: params.name,
    created: Math.floor(Date.now() / 1000),
  };
}

/**
 * Retrieve mock customer
 */
async function mockRetrieveCustomer(id: string): Promise<any> {
  return {
    id,
    email: 'test@example.com',
    name: 'Test Customer',
    created: Math.floor(Date.now() / 1000),
  };
}

/**
 * Update mock customer
 */
async function mockUpdateCustomer(id: string, params: any): Promise<any> {
  return {
    id,
    email: params.email || 'test@example.com',
    name: params.name || 'Test Customer',
    created: Math.floor(Date.now() / 1000),
  };
}

/**
 * Construct mock webhook event
 */
function mockConstructWebhookEvent(payload: string, signature: string, secret: string): any {
  // In real implementation, this would verify the signature
  const event = JSON.parse(payload);
  mockWebhookEvents.push(event);
  return event;
}

/**
 * Get amount for subscription plan
 */
function getAmountForPlan(planId: string): number {
  const planAmounts: Record<string, number> = {
    'free': 0,
    'premium': 2999, // $29.99 in cents
    'enterprise': 9999, // $99.99 in cents
  };
  
  return planAmounts[planId] || 0;
}

/**
 * Store invoice in database for integration tests
 */
async function storeInvoiceInDatabase(invoice: MockInvoice): Promise<void> {
  const dbPool = getDbPool();
  const client = await dbPool.connect();

  try {
    await client.query(`
      INSERT INTO invoices (id, user_id, subscription_id, amount, currency, status, invoice_date, due_date, paid_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        paid_at = EXCLUDED.paid_at
    `, [
      invoice.id,
      invoice.userId,
      invoice.subscriptionId,
      invoice.amount / 100, // Convert cents to dollars
      invoice.currency,
      invoice.status,
      invoice.invoiceDate,
      invoice.dueDate,
      invoice.paidAt
    ]);
  } finally {
    client.release();
  }
}

/**
 * Update invoice in database
 */
async function updateInvoiceInDatabase(invoice: MockInvoice): Promise<void> {
  const dbPool = getDbPool();
  const client = await dbPool.connect();

  try {
    await client.query(`
      UPDATE invoices 
      SET status = $1, paid_at = $2
      WHERE id = $3
    `, [invoice.status, invoice.paidAt, invoice.id]);
  } finally {
    client.release();
  }
}

/**
 * Create test payment method
 */
export async function createTestPaymentMethod(
  type: 'card' | 'bank_account' = 'card'
): Promise<MockPaymentMethod> {
  const params = {
    type,
    card: type === 'card' ? {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123',
      brand: 'visa'
    } : undefined
  };

  return await mockCreatePaymentMethod(params);
}

/**
 * Create test subscription
 */
export async function createTestSubscription(
  userId: string,
  planId: string = 'premium'
): Promise<MockSubscription> {
  const params = {
    customer: userId,
    items: [{ price: planId }],
  };

  return await mockCreateSubscription(params);
}

/**
 * Simulate webhook event
 */
export function simulateWebhookEvent(eventType: string, data: any): any {
  const event = {
    id: `evt_${uuidv4().replace(/-/g, '')}`,
    type: eventType,
    data: { object: data },
    created: Math.floor(Date.now() / 1000),
  };

  mockWebhookEvents.push(event);
  return event;
}

/**
 * Get mock webhook events
 */
export function getMockWebhookEvents(): any[] {
  return [...mockWebhookEvents];
}

/**
 * Clear mock webhook events
 */
export function clearMockWebhookEvents(): void {
  mockWebhookEvents = [];
}

/**
 * Simulate payment failure
 */
export function simulatePaymentFailure(invoiceId: string): void {
  const invoice = mockInvoices.get(invoiceId);
  if (invoice) {
    invoice.status = 'uncollectible';
    mockInvoices.set(invoiceId, invoice);
  }
}

/**
 * Simulate subscription renewal
 */
export async function simulateSubscriptionRenewal(subscriptionId: string): Promise<void> {
  const subscription = mockSubscriptions.get(subscriptionId);
  if (subscription) {
    // Extend period
    subscription.currentPeriodStart = subscription.currentPeriodEnd;
    subscription.currentPeriodEnd = new Date(subscription.currentPeriodEnd.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Create new invoice
    await mockCreateInvoice({
      customer: subscription.userId,
      subscription: subscriptionId,
      amount: getAmountForPlan(subscription.planId),
      currency: 'usd',
      status: 'paid',
    });

    mockSubscriptions.set(subscriptionId, subscription);
  }
}

/**
 * Get mock payment provider state for debugging
 */
export function getMockPaymentState(): {
  paymentMethods: MockPaymentMethod[];
  subscriptions: MockSubscription[];
  invoices: MockInvoice[];
  webhookEvents: any[];
} {
  return {
    paymentMethods: Array.from(mockPaymentMethods.values()),
    subscriptions: Array.from(mockSubscriptions.values()),
    invoices: Array.from(mockInvoices.values()),
    webhookEvents: [...mockWebhookEvents],
  };
}
