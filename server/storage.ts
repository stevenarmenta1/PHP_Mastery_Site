import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { 
  users, 
  questions, 
  challenges,
  type User, 
  type InsertUser,
  type Question,
  type InsertQuestion,
  type Challenge,
  type InsertChallenge
} from "@shared/schema";
import { eq } from "drizzle-orm";

const { Pool } = pg;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  deleteQuestion(id: number): Promise<void>;
  
  getAllChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  deleteChallenge(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllQuestions(): Promise<Question[]> {
    return await this.db.select().from(questions);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const result = await this.db.insert(questions).values(question).returning();
    return result[0];
  }

  async deleteQuestion(id: number): Promise<void> {
    await this.db.delete(questions).where(eq(questions.id, id));
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return await this.db.select().from(challenges);
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const result = await this.db.insert(challenges).values(challenge).returning();
    return result[0];
  }

  async deleteChallenge(id: number): Promise<void> {
    await this.db.delete(challenges).where(eq(challenges.id, id));
  }
}

export const storage = new DatabaseStorage();
