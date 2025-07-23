"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { CornerDownLeft, BotMessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// This will be expanded later with real data
const personas = [
  { value: "default", label: "Default" },
  { value: "software_architect", label: "Software Architect" },
  { value: "marketing_guru", label: "Marketing Guru" },
  { value: "legal_advisor", label: "Legal Advisor" },
];

export default function HomePage() {
  const [isChatView, setIsChatView] = useState(false);

  // Input states
  const [userPrompt, setUserPrompt] = useState("");
  const [persona, setPersona] = useState("default");

  // Output states
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEngineerPrompt = async () => {
    if (!userPrompt) return;
    setIsLoading(true);

    // This will trigger the animation to the chat view on the first submission
    if (!isChatView) {
      setIsChatView(true);
    }

    const newUserMessage = {
      id: Date.now(),
      type: "user",
      content: userPrompt,
    };

    // Add user message to history
    setChatHistory((prev) => [...prev, newUserMessage]);
    setUserPrompt(""); // Clear input field

    try {
      const response = await fetch("/api/engineer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: newUserMessage.content, persona }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong with the request.");
      }

      const engineerData = await response.json();
      const engineeredPrompt = engineerData.engineeredPrompt;

      // Immediately create the Dairo message with a placeholder explanation
      const dairoMessageId = Date.now() + 1;
      const newDairoMessage = {
        id: dairoMessageId,
        type: "dairo",
        engineered: engineeredPrompt,
        explanation: "Thinking...", // Placeholder while we fetch the explanation
      };
      setChatHistory((prev) => [...prev, newDairoMessage]);
      
      // Now, fetch the explanation
      const explainResponse = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPrompt: newUserMessage.content,
          engineeredPrompt,
        }),
      });

      if (!explainResponse.ok) {
        // If explanation fails, update the message with an error
        throw new Error("Failed to get explanation.");
      }
      
      const explainData = await explainResponse.json();
      
      // Update the message in the history with the real explanation
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === dairoMessageId
            ? { ...msg, explanation: explainData.explanation }
            : msg
        )
      );

    } catch (error) {
      console.error("Failed to process prompts:", error);
      // Update the last message with an error state if anything fails
      setChatHistory((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.type === "dairo") {
          return prev.map((msg) =>
            msg.id === lastMessage.id
              ? {
                  ...msg,
                  engineered: "Oops! Something went wrong.",
                  explanation:
                    "I couldn't process your request. Please check the console for errors and try again.",
                }
              : msg
          );
        }
        // If the error happened before the Dairo message was added, add a new error message
        return [
          ...prev,
          {
            id: Date.now() + 1,
            type: "dairo",
            engineered: "Oops! Something went wrong.",
            explanation: "I couldn't process your request. Please try again.",
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen flex-col items-center justify-between p-4">
      <AnimatePresence>
        {isChatView && (
          <motion.div
            className="flex-grow w-full max-w-4xl overflow-y-auto mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Chat History Area */}
            <div className="space-y-6 p-4">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.type === "dairo" && (
                    <div className="p-2 rounded-full bg-primary/10">
                      <BotMessageSquare className="w-6 h-6 text-primary" />
                    </div>
                  )}

                  {msg.type === "user" ? (
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-lg">
                      <p>{msg.content}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-lg">
                      <Card>
                        <CardHeader>
                          <CardTitle>Engineered Prompt</CardTitle>
                        </CardHeader>
                        <CardContent className="font-mono text-sm prose prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.engineered}
                          </ReactMarkdown>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Explanation</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground prose prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.explanation}
                          </ReactMarkdown>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                 <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y:0 }} className="flex items-start gap-4 justify-start">
                    <div className="p-2 rounded-full bg-primary/10">
                      <BotMessageSquare className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-4 max-w-lg w-full">
                       <div className="bg-muted p-3 rounded-lg animate-pulse h-24 w-full"></div>
                       <div className="bg-muted p-3 rounded-lg animate-pulse h-16 w-3/4"></div>
                    </div>
                 </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* This is the shared input form, which will animate */}
      <motion.div
        layout
        transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
        className={`w-full max-w-4xl p-4 bg-muted/50 rounded-lg border ${
          isChatView ? "mb-0" : "self-center my-auto"
        }`}
      >
        <div className="grid w-full gap-4">
          {!isChatView && (
            <div className="text-center">
              <h1 className="text-3xl font-bold">Dairo</h1>
              <p className="text-muted-foreground">
                Your intelligent co-pilot for prompt engineering.
              </p>
            </div>
          )}

          <div className="relative">
            <Textarea
              id="user-prompt"
              placeholder="e.g., Explain the theory of relativity in simple terms."
              className="min-h-[80px] pr-28"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleEngineerPrompt();
                }
              }}
            />
            <Button
              size="icon"
              className="absolute bottom-3 right-3"
              onClick={handleEngineerPrompt}
              disabled={isLoading || !userPrompt}
            >
              <CornerDownLeft className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <Label htmlFor="persona">Persona</Label>
              <Select onValueChange={setPersona} defaultValue={persona}>
                <SelectTrigger id="persona">
                  <SelectValue placeholder="Select Persona" />
                </SelectTrigger>
                <SelectContent>
                  {personas.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Placeholder for future controls like Output Length */}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
