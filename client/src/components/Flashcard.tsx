import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ question, answer, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div 
      className="relative w-full max-w-2xl aspect-[3/2] cursor-pointer group perspective-1000"
      onClick={onFlip}
      data-testid="flashcard-container"
    >
      <motion.div
        className="w-full h-full relative transform-style-3d transition-all duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front of Card (Question) */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden",
          "flex flex-col items-center justify-center p-8 text-center",
          "bg-white dark:bg-card shadow-xl border-2 border-border/50",
          "hover:border-primary/20 hover:shadow-2xl transition-all"
        )}>
          <CardContent className="flex flex-col items-center justify-center h-full space-y-6">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Question
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-medium text-foreground leading-relaxed">
              {question}
            </h2>
            <span className="text-xs text-muted-foreground mt-auto opacity-60">
              Click to reveal answer
            </span>
          </CardContent>
        </Card>

        {/* Back of Card (Answer) */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden rotate-y-180",
          "flex flex-col items-center justify-center p-8 text-center",
          "bg-white dark:bg-card shadow-xl border-2 border-primary/20",
          "bg-gradient-to-br from-white to-primary/5 dark:from-card dark:to-primary/10"
        )}>
          <CardContent className="flex flex-col items-center justify-center h-full space-y-6">
            <span className="text-sm font-bold text-primary uppercase tracking-widest">
              Answer
            </span>
            <p className="text-xl md:text-2xl font-serif text-foreground/90 leading-relaxed max-w-prose">
              {answer}
            </p>
            <span className="text-xs text-muted-foreground mt-auto opacity-60">
              Click to see question
            </span>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
