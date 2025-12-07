import { 
  demoRequests, 
  analyticsEvents, 
  experiments, 
  siteContent,
  adminUsers,
  type DemoRequest, 
  type InsertDemoRequest,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type Experiment,
  type InsertExperiment,
  type SiteContent,
  type InsertSiteContent,
  type AdminUser,
  type InsertAdminUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Demo Requests
  createDemoRequest(request: InsertDemoRequest): Promise<DemoRequest>;
  getDemoRequests(limit?: number, offset?: number): Promise<DemoRequest[]>;
  getDemoRequestCount(): Promise<number>;
  
  // Analytics Events
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(filters?: { 
    eventType?: string; 
    startDate?: Date; 
    endDate?: Date; 
    limit?: number;
  }): Promise<AnalyticsEvent[]>;
  getEventCounts(eventType?: string): Promise<{ eventType: string; count: number }[]>;
  
  // Experiments (A/B Testing)
  createExperiment(experiment: InsertExperiment): Promise<Experiment>;
  getExperiment(id: number): Promise<Experiment | undefined>;
  getActiveExperiments(): Promise<Experiment[]>;
  updateExperiment(id: number, data: Partial<InsertExperiment>): Promise<Experiment | undefined>;
  
  // Site Content
  getSiteContent(sectionId: string): Promise<SiteContent | undefined>;
  getAllSiteContent(): Promise<SiteContent[]>;
  upsertSiteContent(content: InsertSiteContent): Promise<SiteContent>;
  
  // Admin Users
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminLastLogin(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Demo Requests
  async createDemoRequest(request: InsertDemoRequest): Promise<DemoRequest> {
    const [result] = await db.insert(demoRequests).values(request).returning();
    return result;
  }

  async getDemoRequests(limit = 50, offset = 0): Promise<DemoRequest[]> {
    return db.select()
      .from(demoRequests)
      .orderBy(desc(demoRequests.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getDemoRequestCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(demoRequests);
    return Number(result.count);
  }

  // Analytics Events
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [result] = await db.insert(analyticsEvents).values(event).returning();
    return result;
  }

  async getAnalyticsEvents(filters?: { 
    eventType?: string; 
    startDate?: Date; 
    endDate?: Date;
    limit?: number;
  }): Promise<AnalyticsEvent[]> {
    const conditions = [];
    
    if (filters?.eventType) {
      conditions.push(eq(analyticsEvents.eventType, filters.eventType));
    }
    if (filters?.startDate) {
      conditions.push(gte(analyticsEvents.createdAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(analyticsEvents.createdAt, filters.endDate));
    }

    const query = db.select()
      .from(analyticsEvents)
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(filters?.limit || 100);

    if (conditions.length > 0) {
      return query.where(and(...conditions));
    }
    return query;
  }

  async getEventCounts(eventType?: string): Promise<{ eventType: string; count: number }[]> {
    const query = db.select({
      eventType: analyticsEvents.eventType,
      count: sql<number>`count(*)`,
    })
    .from(analyticsEvents)
    .groupBy(analyticsEvents.eventType);

    if (eventType) {
      return query.where(eq(analyticsEvents.eventType, eventType));
    }
    return query;
  }

  // Experiments
  async createExperiment(experiment: InsertExperiment): Promise<Experiment> {
    const [result] = await db.insert(experiments).values(experiment as any).returning();
    return result;
  }

  async getExperiment(id: number): Promise<Experiment | undefined> {
    const [result] = await db.select().from(experiments).where(eq(experiments.id, id));
    return result;
  }

  async getActiveExperiments(): Promise<Experiment[]> {
    return db.select()
      .from(experiments)
      .where(eq(experiments.isActive, true))
      .orderBy(desc(experiments.createdAt));
  }

  async updateExperiment(id: number, data: Partial<InsertExperiment>): Promise<Experiment | undefined> {
    const [result] = await db
      .update(experiments)
      .set({ ...data, updatedAt: new Date() } as any)
      .where(eq(experiments.id, id))
      .returning();
    return result;
  }

  // Site Content
  async getSiteContent(sectionId: string): Promise<SiteContent | undefined> {
    const [result] = await db.select()
      .from(siteContent)
      .where(eq(siteContent.sectionId, sectionId));
    return result;
  }

  async getAllSiteContent(): Promise<SiteContent[]> {
    return db.select().from(siteContent).orderBy(siteContent.sectionId);
  }

  async upsertSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const [result] = await db
      .insert(siteContent)
      .values(content)
      .onConflictDoUpdate({
        target: siteContent.sectionId,
        set: {
          title: content.title,
          subtitle: content.subtitle,
          content: content.content,
          isActive: content.isActive,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  // Admin Users
  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [result] = await db.insert(adminUsers).values(user).returning();
    return result;
  }

  async updateAdminLastLogin(id: number): Promise<void> {
    await db.update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, id));
  }
}

export const storage = new DatabaseStorage();
