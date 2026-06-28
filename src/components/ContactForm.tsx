"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send inquiry. Please try again later.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-lg border border-stone-850 shadow-xl max-w-xl mx-auto">
      {status === "success" ? (
        <div className="text-center py-8 flex flex-col items-center justify-center gap-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
          <h3 className="font-serif text-lg font-semibold text-stone-100">Message Sent Successfully</h3>
          <p className="text-xs text-stone-400 max-w-sm">
            Thank you for contacting us. A resort representative will get in touch with you shortly.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-xs text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="font-serif text-lg font-semibold text-stone-100 mb-2">Send us a Message</h3>
          
          {status === "error" && (
            <div className="bg-red-950/40 border border-red-900/50 rounded p-3 flex items-center gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-stone-900/60 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
              placeholder="John Doe"
              required
              disabled={status === "loading"}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-900/60 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
              placeholder="john@example.com"
              required
              disabled={status === "loading"}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-stone-900/60 border border-stone-850 rounded px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="Tell us about your trip details, event inquiry, or any special requests..."
              required
              disabled={status === "loading"}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-stone-50 font-medium text-xs tracking-wider uppercase py-2.5 rounded shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
