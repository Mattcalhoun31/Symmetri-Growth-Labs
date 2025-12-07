import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Demo Requests table - captures leads from the landing page
export const demoRequests = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  teamSize: text("team_size"),
  message: text("message"),
  source: text("source").default("cta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDemoRequestSchema = createInsertSchema(demoRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
export type DemoRequest = typeof demoRequests.$inferSelect;

// Analytics Events table - tracks user interactions
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  eventData: jsonb("event_data"),
  sessionId: varchar("session_id", { length: 100 }),
  visitorId: varchar("visitor_id", { length: 100 }),
  pageUrl: text("page_url"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  experimentId: integer("experiment_id"),
  variantId: varchar("variant_id", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

// Experiments table - A/B testing configurations
export const experiments = pgTable("experiments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  variants: jsonb("variants").notNull().$type<{ id: string; name: string; weight: number; content: Record<string, string> }[]>(),
  targetElement: varchar("target_element", { length: 100 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertExperimentSchema = createInsertSchema(experiments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertExperiment = z.infer<typeof insertExperimentSchema>;
export type Experiment = typeof experiments.$inferSelect;

// Site Content table - editable content sections
export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  sectionId: varchar("section_id", { length: 50 }).notNull().unique(),
  title: text("title"),
  subtitle: text("subtitle"),
  content: jsonb("content").$type<Record<string, any>>(),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  updatedAt: true,
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

// Admin Users table - for dashboard access
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull().unique(),
  role: varchar("role", { length: 20 }).default("admin"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Relations
export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  experiment: one(experiments, {
    fields: [analyticsEvents.experimentId],
    references: [experiments.id],
  }),
}));

// Validation schemas for API requests (frontend-facing)
export const demoRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  teamSize: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
});

export const scriptScanSchema = z.object({
  script: z.string().min(10, "Script must be at least 10 characters"),
});

export type ScriptScanInput = z.infer<typeof scriptScanSchema>;

export interface ScriptScanResult {
  passed: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
  reframedScript?: string;
}

export const roiCalculatorSchema = z.object({
  teamSize: z.number().min(1).max(100),
  avgSalary: z.number().min(20000).max(500000),
  hoursPerWeek: z.number().min(1).max(60),
});

export type ROICalculatorInput = z.infer<typeof roiCalculatorSchema>;

export interface ROICalculatorResult {
  hoursRecoveredPerMonth: number;
  meetingsGained: number;
  costSavingsPercent: number;
  monthlySavings: number;
  annualSavings: number;
  currentMeetingsPerMonth: number;
  newMeetingsPerMonth: number;
}

export const analyticsEventSchema = z.object({
  eventType: z.string().min(1),
  eventData: z.record(z.any()).optional(),
  sessionId: z.string().optional(),
  visitorId: z.string().optional(),
  pageUrl: z.string().optional(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  experimentId: z.number().optional(),
  variantId: z.string().optional(),
});

export const adminLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

// Pipeline Demo schema - interactive outreach generator
export const pipelineDemoSchema = z.object({
  yourCompany: z.string().min(2, "Your company name is required"),
  yourProduct: z.string().min(5, "Describe what you sell"),
  targetPersona: z.string().min(2, "Target persona is required"),
  prospectCompany: z.string().min(2, "Prospect company is required"),
});

export type PipelineDemoInput = z.infer<typeof pipelineDemoSchema>;

export interface PipelineDemoResult {
  research: {
    companyOverview: string;
    keyTriggers: string[];
    painPoints: string[];
    competitiveInsights: string[];
    relevance: string;
  };
  linkedinMessage: string;
  email: {
    subject: string;
    body: string;
  };
  stealthScript: {
    opener: string;
    bridge: string;
    valueHook: string;
    closeQuestion: string;
    fullScript: string;
  };
  isDemo: boolean;
}
