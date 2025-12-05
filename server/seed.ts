/**
 * DATABASE SEED SCRIPT
 * 
 * This script populates the database with initial flashcard questions and code challenges.
 * 
 * HOW TO RUN:
 *   npx tsx server/seed.ts
 * 
 * HOW TO ADD MORE CONTENT:
 * 1. Add new questions to the 'seedQuestions' array below
 * 2. Add new challenges to the 'seedChallenges' array below
 * 3. Run the seed script again
 * 
 * Note: The script checks for existing data to avoid duplicates.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { questions, challenges } from "@shared/schema";

const { Pool } = pg;

const seedQuestions = [
  // Chapter 3 Questions
  {
    category: "PHP Basics",
    question: "What tag is used to invoke PHP to start interpreting program code? And what is the short form of the tag?",
    answer: "The tag used is <?php...?>. It can be shortened to <?...?>, but that is not recommended practice."
  },
  {
    category: "PHP Basics",
    question: "What are the two types of comment tags?",
    answer: "You can use // for a single-line comment or /*...*/ to span multiple lines."
  },
  {
    category: "PHP Syntax",
    question: "Which character must be placed at the end of every PHP statement?",
    answer: "All PHP statements must end with a semicolon (;)."
  },
  {
    category: "Variables",
    question: "Which symbol is used to preface all PHP variables?",
    answer: "With the exception of constants, all PHP variables must begin with $."
  },
  {
    category: "Variables",
    question: "What can a variable store?",
    answer: "A variable holds a value that can be a string, a number, or other data."
  },
  {
    category: "Operators",
    question: "What is the difference between $variable = 1, $variable == 1, and $variable === 1?",
    answer: "$variable = 1 is an assignment. $variable == 1 checks equality (values equal). $variable === 1 checks identity (values and types equal)."
  },
  {
    category: "Variables",
    question: "Why is an underscore allowed in variable names ($current_user), whereas hyphens are not ($current-user)?",
    answer: "The hyphen is reserved for subtraction, decrement, and negation operators. Using it in names would be ambiguous."
  },
  {
    category: "Variables",
    question: "Are variable names case-sensitive?",
    answer: "Yes, variable names are case-sensitive. $This_Variable is not the same as $this_variable."
  },
  {
    category: "Variables",
    question: "Can you use spaces in variable names?",
    answer: "No. Spaces would confuse the PHP parser. Use underscores (_) or camelCase instead."
  },
  {
    category: "Data Types",
    question: "How do you convert one variable type to another (say, a string to a number)?",
    answer: "You can use type casting like $number = (int)$string, or rely on PHP's automatic type conversion."
  },
  {
    category: "Operators",
    question: "What is the difference between ++$j and $j++?",
    answer: "++$j increments before the operation (pre-increment). $j++ performs the operation then increments (post-increment)."
  },
  {
    category: "Operators",
    question: "Are the operators && and and interchangeable?",
    answer: "Generally yes, but && has higher precedence than 'and'."
  },
  {
    category: "Syntax",
    question: "How can you create a multiline echo or assignment?",
    answer: "Use multiple lines within quotes or the HEREDOC syntax (<<<_END..._END;)."
  },
  {
    category: "Constants",
    question: "Can you redefine a constant?",
    answer: "No. Once defined, constants retain their value until the program terminates."
  },
  {
    category: "Syntax",
    question: "How do you escape a quotation mark?",
    answer: "Use a backslash: \\' or \\\"."
  },
  {
    category: "Output",
    question: "What is the difference between the echo and print commands?",
    answer: "Print behaves like a function (returns 1, takes one arg). Echo is a construct, returns nothing, and can take multiple args."
  },
  {
    category: "Functions",
    question: "What is the purpose of functions?",
    answer: "To separate discrete sections of code into self-contained, reusable blocks."
  },
  {
    category: "Scope",
    question: "How can you make a variable accessible to all parts of a PHP program?",
    answer: "Declare it as 'global'. (Though often not recommended in production)."
  },
  {
    category: "Functions",
    question: "If you generate data within a function, what are a couple of ways to convey the data to the rest of the program?",
    answer: "Return a value or modify a global variable/passed reference."
  },
  {
    category: "Data Types",
    question: "What is the result of combining a string with a number?",
    answer: "The result is another string."
  },
  // Chapter 4 Questions
  {
    category: "Output",
    question: "When printing data that contains TRUE and FALSE constants, what's displayed instead of those two constants?",
    answer: "TRUE displays as '1'. FALSE displays as an empty string."
  },
  {
    category: "Expressions",
    question: "What are the simplest two forms of expressions?",
    answer: "Literals (e.g., numbers, strings) and variables."
  },
  {
    category: "Operators",
    question: "What is the difference between unary, binary, and ternary operators?",
    answer: "The number of operands required: one, two, and three respectively."
  },
  {
    category: "Operators",
    question: "What is the best way to force your own operator precedence?",
    answer: "Use parentheses () around subexpressions."
  },
  {
    category: "Operators",
    question: "What is meant by operator associativity?",
    answer: "The direction of processing (left-to-right or right-to-left)."
  },
  {
    category: "Operators",
    question: "When would you use the === (identity) operator?",
    answer: "When you want to verify both value AND type, avoiding automatic type casting bugs."
  },
  {
    category: "Control Flow",
    question: "Name the three conditional statement types.",
    answer: "if statements, switch statements, and the ternary operator (?:)."
  },
  {
    category: "Loops",
    question: "What command can you use to skip the current iteration of a loop and move on to the next one?",
    answer: "The 'continue' statement."
  },
  {
    category: "Loops",
    question: "What's the difference between the for loop and the while loop?",
    answer: "'for' loops support initialization, condition, and increment parameters in the definition. 'while' only checks a condition."
  },
  {
    category: "Control Flow",
    question: "How do if and while statements interpret conditional expressions of different data types?",
    answer: "Non-zero numbers, non-empty strings, and TRUE evaluate to true. 0, NULL, and empty strings evaluate to false."
  }
];

const seedChallenges = [
  {
    title: "Basic For Loop",
    description: "Write a standard for loop that starts with $i = 0 and runs while $i is less than 10, incrementing $i by 1 each time. Inside the loop, echo the variable $i.",
    initialCode: "<?php\n\n// Write your for loop below\n",
    solution: "for ($i = 0; $i < 10; $i++) {\n    echo $i;\n}",
    hint: "Remember the syntax: for (init; condition; increment) { ... }"
  },
  {
    title: "While Loop",
    description: "Create a while loop that continues as long as the variable $counter is greater than 0. Inside the loop, decrement $counter.",
    initialCode: "<?php\n$counter = 10;\n\n// Write your while loop below\n",
    solution: "while ($counter > 0) {\n    $counter--;\n}",
    hint: "Use the > operator for the condition and -- for decrementing."
  },
  {
    title: "Simple If Statement",
    description: "Write an if statement that checks if the variable $age is greater than or equal to 18. If true, echo 'Adult'.",
    initialCode: "<?php\n$age = 20;\n\n// Write your if statement below\n",
    solution: "if ($age >= 18) {\n    echo 'Adult';\n}",
    hint: "Use >= for greater than or equal to."
  },
  {
    title: "Echo Short Tag",
    description: "Use the short echo tag syntax to print the variable $username.",
    initialCode: "<?=$username?>",
    solution: "<?=$username?>",
    hint: "The short echo tag starts with <?= and ends with ?>."
  }
];

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool);

  console.log("🌱 Starting database seed...\n");

  // Check if questions already exist
  const existingQuestions = await db.select().from(questions);
  if (existingQuestions.length === 0) {
    console.log("📚 Adding flashcard questions...");
    await db.insert(questions).values(seedQuestions);
    console.log(`   ✅ Added ${seedQuestions.length} questions\n`);
  } else {
    console.log(`📚 Skipping questions (${existingQuestions.length} already exist)\n`);
  }

  // Check if challenges already exist
  const existingChallenges = await db.select().from(challenges);
  if (existingChallenges.length === 0) {
    console.log("💻 Adding code challenges...");
    await db.insert(challenges).values(seedChallenges);
    console.log(`   ✅ Added ${seedChallenges.length} challenges\n`);
  } else {
    console.log(`💻 Skipping challenges (${existingChallenges.length} already exist)\n`);
  }

  console.log("🎉 Seed completed successfully!");
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
