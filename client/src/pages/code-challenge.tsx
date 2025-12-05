import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, X, HelpCircle, Code2, RotateCcw, ChevronRight, Plus } from "lucide-react";
import { fetchChallenges } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function CodeChallenge() {
  const { data: challengesData = [], isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: fetchChallenges,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (challengesData.length > 0) {
      setUserCode(challengesData[currentIndex]?.initialCode || "");
    }
  }, [challengesData, currentIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading challenges...</p>
      </div>
    );
  }

  if (challengesData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h2 className="text-2xl font-serif font-bold mb-4">No Challenges Yet</h2>
        <p className="text-muted-foreground mb-8">Add some coding challenges to get started!</p>
        <Link href="/manage">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Challenges
          </Button>
        </Link>
      </div>
    );
  }

  const currentChallenge = challengesData[currentIndex];

  const normalizeCode = (code: string) => {
    return code
      .replace(/\/\/.*$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const checkAnswer = () => {
    const normalizedUser = normalizeCode(userCode);
    const normalizedSolution = normalizeCode(currentChallenge.solution);

    if (normalizedUser.includes(normalizedSolution) || normalizedUser === normalizedSolution) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  const handleNext = () => {
    if (currentIndex < challengesData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setStatus("idle");
      setShowHint(false);
    }
  };

  const handleReset = () => {
    setUserCode(currentChallenge.initialCode);
    setStatus("idle");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col">
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Code Lab</h1>
            <p className="text-sm text-muted-foreground">Challenge {currentIndex + 1} of {challengesData.length}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-2 border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-xl">
                <Code2 className="w-5 h-5 text-primary" />
                {currentChallenge.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-foreground/80 leading-relaxed">
                {currentChallenge.description}
              </p>
              
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-accent/50 p-4 rounded-lg border border-accent text-sm text-accent-foreground"
                >
                  <strong>Hint:</strong> {currentChallenge.hint}
                </motion.div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowHint(!showHint)}
                  className="text-muted-foreground"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {status === "success" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 p-6 rounded-xl flex flex-col items-center text-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Excellent!</h3>
                <p className="text-green-700 dark:text-green-400/80">Your code looks correct.</p>
              </div>
              {currentIndex < challengesData.length - 1 ? (
                <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Next Challenge <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <p className="text-sm font-medium text-green-600">You've completed all challenges!</p>
              )}
            </motion.div>
          )}

          {status === "error" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-4 rounded-xl flex items-start gap-3"
            >
              <X className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-300">Not quite right</h3>
                <p className="text-sm text-red-700 dark:text-red-400/80">Double check your syntax. Make sure you are using the correct variable names and operators.</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col gap-4 h-full min-h-[400px]">
          <div className="relative flex-1 rounded-xl border-2 border-muted bg-card overflow-hidden shadow-sm focus-within:border-primary/50 transition-colors">
            <div className="absolute top-0 left-0 right-0 h-8 bg-muted/50 border-b border-muted flex items-center px-4 text-xs font-mono text-muted-foreground">
              editor.php
            </div>
            <Textarea 
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-full pt-12 pb-4 px-4 font-mono text-base resize-none border-0 focus-visible:ring-0 bg-transparent leading-relaxed"
              spellCheck={false}
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleReset} disabled={status === "success"}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={checkAnswer} disabled={status === "success"}>
              Check Code
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
