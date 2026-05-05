import { relations } from 'drizzle-orm';
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  uuid,
  serial,
  numeric,
  varchar,
  jsonb,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'), // New
  phone: text('phone'), // New
  isBanned: boolean('is_banned').default(false).notNull(), // Phase 8 Admin
  role: text('role').default('user').notNull(),
  referralCode: text('referral_code').unique(), // Restored column
  referredBy: text('referred_by'), // Restored column
  streakDays: integer('streak_days').default(0).notNull(), // Restored column
  lastLogin: timestamp('last_login'), // Restored column
  utmSource: text('utm_source'), // Phase 22 Ads Tracking
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  membershipType: text('membership_type').default('free').notNull(), // Phase 23: e.g., 'free', 'pro', 'LTD'
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const passwordResetTokens = pgTable(
  'passwordResetToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  planStatus: text('plan_status').notNull().default('inactive'),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const creditsBalance = pgTable('credits_balance', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  totalCredits: numeric('total_credits', { precision: 15, scale: 2 }).notNull().default('10'),
  creditsUsed: numeric('credits_used', { precision: 15, scale: 2 }).notNull().default('0'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usageLogs = pgTable('usage_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  action: text('action').notNull(),
  creditsDeducted: numeric('credits_deducted', { precision: 15, scale: 2 }).notNull().default('1'),
  details: text('details'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const lists = pgTable('lists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  listId: uuid('list_id')
    .references(() => lists.id, { onDelete: 'cascade' }),
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  linkedin: text('linkedin'),
  company: text('company'),
  role: text('role'),
  location: text('location'),
  icebreaker: text('icebreaker'),
  isOptedOut: boolean('is_opted_out').default(false).notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  linkedinValid: boolean('linkedin_valid').default(false).notNull(),
  status: text('status').notNull().default('New'),
  leadValue: integer('lead_value').notNull().default(0),
  buyScore: integer('buy_score').notNull().default(0),
  aiAnalysis: text('ai_analysis'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  action: text('action').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Phase 5: Partnership & Earnings Ledger ---

export const partnerships = pgTable('partnerships', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  referralCode: text('referral_code').notNull().unique(),
  totalEarned: numeric('total_earned', { precision: 15, scale: 2 }).default('0').notNull(),
  withdrawableBalance: numeric('withdrawable_balance', { precision: 15, scale: 2 }).default('0').notNull(),
  isEligible: boolean('is_eligible').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const referralStats = pgTable('referral_stats', {
  id: serial('id').primaryKey(),
  referrerId: text('referrer_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  referredUserId: text('referred_user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  purchaseCount: integer('purchase_count').default(0).notNull(),
  totalCommissionGenerated: numeric('total_commission_generated', { precision: 15, scale: 2 }).default('0').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const withdrawalRequests = pgTable('withdrawal_requests', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'), // pending, completed, rejected
  paymentDetails: text('payment_details').notNull(), // UPI ID or Bank Details JSON string
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
  processedAt: timestamp('processed_at'),
});

// --- Phase 8: Admin God-Eye Dashboard ---

export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: serial('id').primaryKey(),
  adminId: text('admin_id').references(() => users.id).notNull(),
  actionType: text('action_type').notNull(), // 'CREDIT_ADD', 'USER_BAN', 'PAYOUT_APPROVE'
  description: text('description'),
  targetId: text('target_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const allTransactions = pgTable('all_transactions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  creditsAdded: integer('credits_added').notNull(),
  gatewayTxnId: text('gateway_txn_id'),
  status: text('status').notNull().default('SUCCESS'), // 'SUCCESS', 'FAILED', 'REFUNDED'
  sourceCity: varchar('source_city', { length: 100 }), // Phase 14 Attribution
  sourceKeyword: varchar('source_keyword', { length: 100 }), // Phase 14 Attribution
  companyName: varchar('company_name', { length: 255 }), // Phase 22 GST
  gstNumber: varchar('gst_number', { length: 50 }),
  billingAddress: text('billing_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const broadcastMessages = pgTable('broadcast_messages', {
  id: serial('id').primaryKey(),
  message: text('message').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
});

export const emailLogs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  recipientEmail: text('recipient_email').notNull(),
  subject: text('subject').notNull(),
  status: text('status').default('sent').notNull(), // 'sent', 'failed'
  errorDetails: text('error_details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Dynamic Pricing Configuration ---

export const pricingPlans = pgTable('pricing_plans', {
  id: serial('id').primaryKey(),
  planName: text('plan_name').notNull().unique(), // e.g. 'Starter Pack', 'Growth Pack', 'Scale Pack'
  priceInINR: integer('price_in_inr').notNull(),
  creditsAwarded: integer('credits_awarded').notNull(),
  isPopular: boolean('is_popular').default(false).notNull(),
  stripePriceId: text('stripe_price_id'), // Optional, if using Stripe checkout links natively
  features: text('features').array(), // JSON or Array of features for the UI
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- Phase 11: Hyper-Local Dynamic SEO Engine ---

export const seoCities = pgTable('seo_cities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(), // e.g., "Noida"
  slug: text('slug').notNull().unique(), // e.g., "noida"
  state: text('state').notNull(),        // e.g., "Uttar Pradesh"
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const seoKeywords = pgTable('seo_keywords', {
  id: serial('id').primaryKey(),
  keyword: text('keyword').notNull().unique(), // e.g., "Lead Generation Company"
  slug: text('slug').notNull().unique(),       // e.g., "lead-generation-company"
  intentHeadline: text('intent_headline'),     // e.g., "The #1 B2B Lead Generation Company"
  contextParagraph: text('context_paragraph'), // Paragraph about this SEO specific topic
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Phase 13: Resilience & Search Dominance ---
export const systemHealthLogs = pgTable('system_health_logs', {
  id: serial('id').primaryKey(),
  errorType: varchar('error_type', { length: 100 }), // e.g., 'CLIENT_EXCEPTION', 'API_FAILURE'
  errorMessage: text('error_message'),
  urlAffected: text('url_affected'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Phase 14: Sales Velocity & Re-engagement Hub ---

export const leadMagnets = pgTable('lead_magnets', {
  id: serial('id').primaryKey(),
  userEmail: varchar('user_email', { length: 255 }),
  sourceCity: varchar('source_city', { length: 100 }),
  sourceKeyword: varchar('source_keyword', { length: 100 }),
  isConverted: boolean('is_converted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const automationLogs = pgTable('automation_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  channel: varchar('channel', { length: 20 }), // 'WHATSAPP', 'EMAIL'
  messageType: varchar('message_type', { length: 50 }), // 'WELCOME', 'LOW_CREDIT', 'ABANDONED_CART'
  sentAt: timestamp('sent_at').defaultNow().notNull(),
});

export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).unique().notNull(),
  scopes: jsonb('scopes').default('["read:leads"]').notNull(),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const seoTranslations = pgTable('seo_translations', {
  id: serial('id').primaryKey(),
  keywordId: integer('keyword_id').references(() => seoKeywords.id).notNull(),
  languageCode: varchar('language_code', { length: 10 }).notNull(), // e.g., 'hi', 'bn', 'mr'
  translatedTitle: varchar('translated_title', { length: 255 }).notNull(),
  translatedContent: text('translated_content').notNull(),
});

// --- Phase 23: AppSumo Automation & License Key Management ---

export const appsumoCodes = pgTable('appsumo_codes', {
  id: serial('id').primaryKey(),
  licenseKey: varchar('license_key', { length: 100 }).unique().notNull(), // Code provided by AppSumo
  tierLevel: integer('tier_level').notNull(), // e.g. 1, 2, 3
  isRedeemed: boolean('is_redeemed').default(false).notNull(),
  redeemedByUserId: text('redeemed_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  redeemedAt: timestamp('redeemed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Phase 25: Ads Landing Page Lead Form Integration ---

export const adsLeads = pgTable('ads_leads', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  sourceCity: varchar('source_city', { length: 100 }),
  sourceKeyword: varchar('source_keyword', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
