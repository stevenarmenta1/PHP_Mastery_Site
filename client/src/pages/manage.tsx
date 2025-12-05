import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, BookOpen, Code2 } from "lucide-react";
import { fetchQuestions, createQuestion, deleteQuestion, fetchChallenges, createChallenge, deleteChallenge } from "@/lib/api";
import { toast } from "sonner";
import type { InsertQuestion, InsertChallenge } from "@shared/schema";

export default function Manage() {
  const queryClient = useQueryClient();

  const { data: questions = [] } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
  });

  const [newQuestion, setNewQuestion] = useState<InsertQuestion>({
    category: "",
    question: "",
    answer: "",
  });

  const [newChallenge, setNewChallenge] = useState<InsertChallenge>({
    title: "",
    description: "",
    initialCode: "<?php\n\n// Write your code here\n",
    solution: "",
    hint: "",
  });

  const createQuestionMutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      setNewQuestion({ category: "", question: "", answer: "" });
      toast.success("Question added successfully!");
    },
    onError: () => {
      toast.error("Failed to add question");
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question deleted");
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });

  const createChallengeMutation = useMutation({
    mutationFn: createChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      setNewChallenge({
        title: "",
        description: "",
        initialCode: "<?php\n\n// Write your code here\n",
        solution: "",
        hint: "",
      });
      toast.success("Challenge added successfully!");
    },
    onError: () => {
      toast.error("Failed to add challenge");
    },
  });

  const deleteChallengeMutation = useMutation({
    mutationFn: deleteChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast.success("Challenge deleted");
    },
    onError: () => {
      toast.error("Failed to delete challenge");
    },
  });

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.category || !newQuestion.question || !newQuestion.answer) {
      toast.error("Please fill in all fields");
      return;
    }
    createQuestionMutation.mutate(newQuestion);
  };

  const handleAddChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallenge.title || !newChallenge.description || !newChallenge.solution) {
      toast.error("Please fill in all required fields");
      return;
    }
    createChallengeMutation.mutate(newChallenge);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-foreground">Manage Content</h1>
          </div>
        </header>

        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="questions" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="challenges" className="gap-2">
              <Code2 className="w-4 h-4" />
              Code Lab
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Flashcard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                      placeholder="e.g., PHP Basics, Variables, Loops"
                      data-testid="input-category"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      placeholder="Enter your question..."
                      rows={3}
                      data-testid="input-question"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea
                      id="answer"
                      value={newQuestion.answer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                      placeholder="Enter the answer..."
                      rows={4}
                      data-testid="input-answer"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-add-question">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Flashcard
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-semibold">All Flashcards ({questions.length})</h2>
              <div className="grid gap-4">
                {questions.map((q) => (
                  <Card key={q.id} className="bg-card/50">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-xs font-bold text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                          {q.category}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteQuestionMutation.mutate(q.id)}
                          data-testid={`button-delete-question-${q.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <h3 className="text-lg font-medium font-serif text-foreground">{q.question}</h3>
                      <div className="pl-4 border-l-2 border-primary/20">
                        <p className="text-muted-foreground leading-relaxed">{q.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Code Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddChallenge} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newChallenge.title}
                      onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                      placeholder="e.g., Basic For Loop"
                      data-testid="input-challenge-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newChallenge.description}
                      onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                      placeholder="Describe what the user needs to do..."
                      rows={3}
                      data-testid="input-challenge-description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initialCode">Initial Code</Label>
                    <Textarea
                      id="initialCode"
                      value={newChallenge.initialCode}
                      onChange={(e) => setNewChallenge({ ...newChallenge, initialCode: e.target.value })}
                      placeholder="<?php\n\n// Starting code for the user"
                      rows={4}
                      className="font-mono text-sm"
                      data-testid="input-challenge-initial"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="solution">Solution</Label>
                    <Textarea
                      id="solution"
                      value={newChallenge.solution}
                      onChange={(e) => setNewChallenge({ ...newChallenge, solution: e.target.value })}
                      placeholder="The correct answer code..."
                      rows={4}
                      className="font-mono text-sm"
                      data-testid="input-challenge-solution"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hint">Hint</Label>
                    <Input
                      id="hint"
                      value={newChallenge.hint}
                      onChange={(e) => setNewChallenge({ ...newChallenge, hint: e.target.value })}
                      placeholder="A helpful hint for the user..."
                      data-testid="input-challenge-hint"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-add-challenge">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Challenge
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-semibold">All Challenges ({challenges.length})</h2>
              <div className="grid gap-4">
                {challenges.map((c) => (
                  <Card key={c.id} className="bg-card/50">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold font-serif text-foreground">{c.title}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteChallengeMutation.mutate(c.id)}
                          data-testid={`button-delete-challenge-${c.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground">{c.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="font-semibold text-xs text-muted-foreground uppercase">Initial Code:</span>
                          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">{c.initialCode}</pre>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-xs text-muted-foreground uppercase">Solution:</span>
                          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">{c.solution}</pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
