import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, BrainCircuit, Code2, List } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-accent/50 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-8 max-w-2xl z-10"
      >
        <div className="flex justify-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-white shadow-lg rotate-[-6deg] border border-border/50">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
          <div className="p-3 rounded-2xl bg-white shadow-lg rotate-[6deg] border border-border/50">
            <BrainCircuit className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground tracking-tight">
          PHP <span className="text-primary italic">Mastery</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-lg mx-auto leading-relaxed">
          Master the fundamentals of PHP through interactive flashcards. 
          From syntax to functions, reinforce your knowledge one card at a time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/practice">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-all hover:scale-105 cursor-pointer">
              <BookOpen className="mr-2 w-5 h-5" />
              Start Practicing
            </Button>
          </Link>
          
          <Link href="/questions">
            <Button variant="ghost" size="lg" className="h-14 px-8 text-lg rounded-full text-muted-foreground hover:bg-secondary/50 cursor-pointer">
              <List className="mr-2 w-5 h-5" />
              View Question List
            </Button>
          </Link>
        </div>
      </motion.div>

      <footer className="absolute bottom-8 text-sm text-muted-foreground/60 font-mono">
        Chapter 3 & 4 • Interactive Study Guide
      </footer>
    </div>
  );
}
