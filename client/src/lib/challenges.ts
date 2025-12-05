export interface Challenge {
  id: number;
  title: string;
  description: string;
  initialCode: string;
  solution: string;
  hint: string;
}

/**
 * TO ADD NEW CHALLENGES:
 * 1. Copy the structure below and paste it into the 'challenges' array.
 * 2. Increment the 'id' field.
 * 3. Add your title, description, and challenge details.
 * 
 * Template:
 * {
 *   id: 5, // Increment this number
 *   title: "Challenge Title",
 *   description: "Instructions for the user...",
 *   initialCode: "<?php\n// Starter code here",
 *   solution: "The expected answer code",
 *   hint: "A helpful hint"
 * }
 */

export const challenges: Challenge[] = [
  {
    id: 1,
    title: "Basic For Loop",
    description: "Write a standard for loop that starts with $i = 0 and runs while $i is less than 10, incrementing $i by 1 each time. Inside the loop, echo the variable $i.",
    initialCode: "<?php\n\n// Write your for loop below\n",
    solution: "for ($i = 0; $i < 10; $i++) {\n    echo $i;\n}",
    hint: "Remember the syntax: for (init; condition; increment) { ... }"
  },
  {
    id: 2,
    title: "While Loop",
    description: "Create a while loop that continues as long as the variable $counter is greater than 0. Inside the loop, decrement $counter.",
    initialCode: "<?php\n$counter = 10;\n\n// Write your while loop below\n",
    solution: "while ($counter > 0) {\n    $counter--;\n}",
    hint: "Use the > operator for the condition and -- for decrementing."
  },
  {
    id: 3,
    title: "Simple If Statement",
    description: "Write an if statement that checks if the variable $age is greater than or equal to 18. If true, echo 'Adult'.",
    initialCode: "<?php\n$age = 20;\n\n// Write your if statement below\n",
    solution: "if ($age >= 18) {\n    echo 'Adult';\n}",
    hint: "Use >= for greater than or equal to."
  },
  {
    id: 4,
    title: "Echo Short Tag",
    description: "Use the short echo tag syntax to print the variable $username.",
    initialCode: "<?=$username?>", // This one might be tricky to validate if they type it differently, but let's try.
    solution: "<?=$username?>",
    hint: "The short echo tag starts with <?= and ends with ?>."
  }
];
