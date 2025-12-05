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
import { randomUUID } from "crypto";

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

// Default questions for local development (no database needed)
const defaultQuestions: Question[] = [
  { id: 1, category: "PHP Basics", question: "What tag is used to invoke PHP to start interpreting program code? And what is the short form of the tag?", answer: "The tag used is <?php...?>. It can be shortened to <?...?>, but that is not recommended practice." },
  { id: 2, category: "PHP Basics", question: "What are the two types of comment tags?", answer: "You can use // for a single-line comment or /*...*/ to span multiple lines." },
  { id: 3, category: "PHP Syntax", question: "Which character must be placed at the end of every PHP statement?", answer: "All PHP statements must end with a semicolon (;)." },
  { id: 4, category: "Variables", question: "Which symbol is used to preface all PHP variables?", answer: "With the exception of constants, all PHP variables must begin with $." },
  { id: 5, category: "Variables", question: "What can a variable store?", answer: "A variable holds a value that can be a string, a number, or other data." },
  { id: 6, category: "Operators", question: "What is the difference between $variable = 1, $variable == 1, and $variable === 1?", answer: "$variable = 1 is an assignment. $variable == 1 checks equality (values equal). $variable === 1 checks identity (values and types equal)." },
  { id: 7, category: "Variables", question: "Why is an underscore allowed in variable names ($current_user), whereas hyphens are not ($current-user)?", answer: "The hyphen is reserved for subtraction, decrement, and negation operators. Using it in names would be ambiguous." },
  { id: 8, category: "Variables", question: "Are variable names case-sensitive?", answer: "Yes, variable names are case-sensitive. $This_Variable is not the same as $this_variable." },
  { id: 9, category: "Variables", question: "Can you use spaces in variable names?", answer: "No. Spaces would confuse the PHP parser. Use underscores (_) or camelCase instead." },
  { id: 10, category: "Data Types", question: "How do you convert one variable type to another (say, a string to a number)?", answer: "You can use type casting like $number = (int)$string, or rely on PHP's automatic type conversion." },
  { id: 11, category: "Operators", question: "What is the difference between ++$j and $j++?", answer: "++$j increments before the operation (pre-increment). $j++ performs the operation then increments (post-increment)." },
  { id: 12, category: "Operators", question: "Are the operators && and and interchangeable?", answer: "Generally yes, but && has higher precedence than 'and'." },
  { id: 13, category: "Syntax", question: "How can you create a multiline echo or assignment?", answer: "Use multiple lines within quotes or the HEREDOC syntax (<<<_END..._END;)." },
  { id: 14, category: "Constants", question: "Can you redefine a constant?", answer: "No. Once defined, constants retain their value until the program terminates." },
  { id: 15, category: "Syntax", question: "How do you escape a quotation mark?", answer: "Use a backslash: \\' or \\\"." },
  { id: 16, category: "Output", question: "What is the difference between the echo and print commands?", answer: "Print behaves like a function (returns 1, takes one arg). Echo is a construct, returns nothing, and can take multiple args." },
  { id: 17, category: "Functions", question: "What is the purpose of functions?", answer: "To separate discrete sections of code into self-contained, reusable blocks." },
  { id: 18, category: "Scope", question: "How can you make a variable accessible to all parts of a PHP program?", answer: "Declare it as 'global'. (Though often not recommended in production)." },
  { id: 19, category: "Functions", question: "If you generate data within a function, what are a couple of ways to convey the data to the rest of the program?", answer: "Return a value or modify a global variable/passed reference." },
  { id: 20, category: "Data Types", question: "What is the result of combining a string with a number?", answer: "The result is another string." },
  { id: 21, category: "Output", question: "When printing data that contains TRUE and FALSE constants, what's displayed instead of those two constants?", answer: "TRUE displays as '1'. FALSE displays as an empty string." },
  { id: 22, category: "Expressions", question: "What are the simplest two forms of expressions?", answer: "Literals (e.g., numbers, strings) and variables." },
  { id: 23, category: "Operators", question: "What is the difference between unary, binary, and ternary operators?", answer: "The number of operands required: one, two, and three respectively." },
  { id: 24, category: "Operators", question: "What is the best way to force your own operator precedence?", answer: "Use parentheses () around subexpressions." },
  { id: 25, category: "Operators", question: "What is meant by operator associativity?", answer: "The direction of processing (left-to-right or right-to-left)." },
  { id: 26, category: "Operators", question: "When would you use the === (identity) operator?", answer: "When you want to verify both value AND type, avoiding automatic type casting bugs." },
  { id: 27, category: "Control Flow", question: "Name the three conditional statement types.", answer: "if statements, switch statements, and the ternary operator (?:)." },
  { id: 28, category: "Loops", question: "What command can you use to skip the current iteration of a loop and move on to the next one?", answer: "The 'continue' statement." },
  { id: 29, category: "Loops", question: "What's the difference between the for loop and the while loop?", answer: "'for' loops support initialization, condition, and increment parameters in the definition. 'while' only checks a condition." },
  { id: 30, category: "Control Flow", question: "How do if and while statements interpret conditional expressions of different data types?", answer: "Non-zero numbers, non-empty strings, and TRUE evaluate to true. 0, NULL, and empty strings evaluate to false." }
];

const defaultChallenges: Challenge[] = [
  { id: 1, title: "Basic For Loop", description: "Write a standard for loop that starts with $i = 0 and runs while $i is less than 10, incrementing $i by 1 each time. Inside the loop, echo the variable $i.", initialCode: "<?php\n\n// Write your for loop below\n", solution: "for ($i = 0; $i < 10; $i++) {\n    echo $i;\n}", hint: "Remember the syntax: for (init; condition; increment) { ... }" },
  { id: 2, title: "While Loop", description: "Create a while loop that continues as long as the variable $counter is greater than 0. Inside the loop, decrement $counter.", initialCode: "<?php\n$counter = 10;\n\n// Write your while loop below\n", solution: "while ($counter > 0) {\n    $counter--;\n}", hint: "Use the > operator for the condition and -- for decrementing." },
  { id: 3, title: "Simple If Statement", description: "Write an if statement that checks if the variable $age is greater than or equal to 18. If true, echo 'Adult'.", initialCode: "<?php\n$age = 20;\n\n// Write your if statement below\n", solution: "if ($age >= 18) {\n    echo 'Adult';\n}", hint: "Use >= for greater than or equal to." },
  { id: 4, title: "Echo Short Tag", description: "Use the short echo tag syntax to print the variable $username.", initialCode: "<?=$username?>", solution: "<?=$username?>", hint: "The short echo tag starts with <?= and ends with ?>." }
];

/**
 * In-Memory Storage (for local development without PostgreSQL)
 * Data is stored in memory and pre-loaded with default questions/challenges
 */
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questionsData: Question[];
  private challengesData: Challenge[];
  private nextQuestionId: number;
  private nextChallengeId: number;

  constructor() {
    this.users = new Map();
    this.questionsData = [...defaultQuestions];
    this.challengesData = [...defaultChallenges];
    this.nextQuestionId = defaultQuestions.length + 1;
    this.nextChallengeId = defaultChallenges.length + 1;
    console.log("📦 Using in-memory storage (no database required)");
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.questionsData;
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const newQuestion: Question = { ...question, id: this.nextQuestionId++ };
    this.questionsData.push(newQuestion);
    return newQuestion;
  }

  async deleteQuestion(id: number): Promise<void> {
    this.questionsData = this.questionsData.filter(q => q.id !== id);
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return this.challengesData;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const newChallenge: Challenge = { ...challenge, id: this.nextChallengeId++ };
    this.challengesData.push(newChallenge);
    return newChallenge;
  }

  async deleteChallenge(id: number): Promise<void> {
    this.challengesData = this.challengesData.filter(c => c.id !== id);
  }
}

/**
 * Database Storage (for production with PostgreSQL)
 */
export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
    console.log("🗄️ Using PostgreSQL database");
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

// Automatically choose storage based on environment
// No DATABASE_URL? Use in-memory storage (perfect for local development)
export const storage: IStorage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();
