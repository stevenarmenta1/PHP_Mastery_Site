import { Link } from "wouter";
import { questions } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

export default function QuestionsList() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm p-4 -mx-4 z-10 border-b border-border/50">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              All Questions
            </h1>
          </div>
          <Link href="/practice">
            <Button>Start Practice</Button>
          </Link>
        </header>

        <div className="grid gap-4">
          {questions.map((q) => (
            <Card key={q.id} className="bg-card/50 hover:bg-card transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                    #{q.id}
                  </span>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {q.category}
                  </span>
                </div>
                <h3 className="text-lg font-medium font-serif text-foreground">
                  {q.question}
                </h3>
                <div className="pl-4 border-l-2 border-primary/20">
                  <p className="text-muted-foreground leading-relaxed">
                    {q.answer}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
