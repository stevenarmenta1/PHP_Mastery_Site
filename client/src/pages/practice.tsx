import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Flashcard } from "@/components/Flashcard";
import { fetchQuestions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Home, Plus } from "lucide-react";

export default function Practice() {
  const { data: questionsData = [], isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState(questionsData);
  const [hasShuffled, setHasShuffled] = useState(false);

  useEffect(() => {
    if (questionsData.length > 0 && !hasShuffled) {
      setShuffledQuestions(questionsData);
    }
  }, [questionsData, hasShuffled]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading questions...</p>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h2 className="text-2xl font-serif font-bold mb-4">No Questions Yet</h2>
        <p className="text-muted-foreground mb-8">Add some questions to get started!</p>
        <Link href="/manage">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Questions
          </Button>
        </Link>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentIndex];
  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledQuestions.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + shuffledQuestions.length) % shuffledQuestions.length);
    }, 200);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...shuffledQuestions].sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffled);
      setCurrentIndex(0);
      setHasShuffled(true);
    }, 300);
  };

  const handleReset = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setShuffledQuestions(questionsData);
      setCurrentIndex(0);
      setHasShuffled(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " " || e.key === "Enter") setIsFlipped((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shuffledQuestions.length]);

  return (
    <div className="min-h-screen flex flex-col bg-background p-4 md:p-8">
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-transparent hover:text-primary">
            <Home className="w-4 h-4" />
            Home
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground font-mono">
            {currentIndex + 1} / {shuffledQuestions.length}
          </span>
          <div className="w-32 md:w-48">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center"
          >
            <Flashcard
              question={currentQuestion.question}
              answer={currentQuestion.answer}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 md:-translate-y-16">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            {currentQuestion.category}
          </span>
        </div>
      </main>

      <footer className="w-full max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex justify-center md:justify-start gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleShuffle}
            title="Shuffle Questions"
            className={hasShuffled ? "text-primary border-primary" : ""}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleReset}
            title="Reset Order"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-center items-center gap-4">
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={handlePrev}
            className="w-16 h-16 rounded-full shadow-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button 
            variant="default" 
            size="lg" 
            onClick={handleNext}
            className="w-16 h-16 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        <div className="text-center md:text-right text-xs text-muted-foreground hidden md:block">
          <p>Space to flip • Arrows to navigate</p>
        </div>
      </footer>
    </div>
  );
}
