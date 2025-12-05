import type { Question, InsertQuestion, Challenge, InsertChallenge } from "@shared/schema";

export async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch("/api/questions");
  if (!response.ok) throw new Error("Failed to fetch questions");
  return response.json();
}

export async function createQuestion(question: InsertQuestion): Promise<Question> {
  const response = await fetch("/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  });
  if (!response.ok) throw new Error("Failed to create question");
  return response.json();
}

export async function deleteQuestion(id: number): Promise<void> {
  const response = await fetch(`/api/questions/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete question");
}

export async function fetchChallenges(): Promise<Challenge[]> {
  const response = await fetch("/api/challenges");
  if (!response.ok) throw new Error("Failed to fetch challenges");
  return response.json();
}

export async function createChallenge(challenge: InsertChallenge): Promise<Challenge> {
  const response = await fetch("/api/challenges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(challenge),
  });
  if (!response.ok) throw new Error("Failed to create challenge");
  return response.json();
}

export async function deleteChallenge(id: number): Promise<void> {
  const response = await fetch(`/api/challenges/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete challenge");
}
