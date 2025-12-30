"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, MessageSquare, X, ChevronDown } from "lucide-react";
import { sendMessageAction } from "@/app/chat-actions";
import { Message } from "@/lib/ai";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! I'm your CareerLift Coach. Need help with your resume?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput("");
        setLoading(true);

        try {
            // Optimistic update
            setMessages(prev => [...prev, { role: "user", content: userMsg }]);

            const newHistory = await sendMessageAction(messages, userMsg);
            setMessages(newHistory);
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Widget Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-slate-900 p-4 flex items-center justify-between text-white shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-600 rounded-lg">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">CareerLift Coach</h3>
                                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {/* <button className="p-1 hover:bg-slate-800 rounded">
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </button> */}
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`p-1.5 rounded-full shrink-0 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"}`}>
                                    {msg.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                </div>

                                <div className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-tr-none"
                                    : "bg-white text-slate-800 border rounded-tl-none"
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-start gap-2">
                                <div className="p-1.5 rounded-full shrink-0 bg-emerald-600 text-white">
                                    <Bot className="h-3 w-3" />
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border shadow-sm text-slate-500">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 shrink-0">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center pointer-events-auto border-4 border-slate-50"
                >
                    <MessageSquare className="h-7 w-7" />
                </button>
            )}
        </div>
    );
}
