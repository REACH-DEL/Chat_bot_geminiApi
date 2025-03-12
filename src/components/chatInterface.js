import { useState, useEffect } from "react";
import {
  PaperAirplaneIcon,
  UserCircleIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize highlight.js and theme
  useEffect(() => {
    hljs.configure({
      languages: ["javascript", "html", "css", "python", "bash"],
      ignoreUnescapedHTML: true,
    });
    hljs.highlightAll();
  }, [messages]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Format code blocks in responses
  const formatContent = (content) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    return content.split("\n").map((line, index) => {
      if (line.match(codeBlockRegex)) {
        const code = line.replace(/```(\w+)?/, "").replace(/```$/, "");
        const language = line.match(/```(\w+)/)?.[1] || "plaintext";
        return (
          <pre key={index} className="rounded-lg overflow-hidden my-2">
            <code className={`language-${language}`}>{code}</code>
          </pre>
        );
      }
      return (
        <p key={index} className="my-1">
          {line}
        </p>
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`flex flex-col h-[90%] transition-colors duration-300 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              AI Assistant
            </h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <SunIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <MoonIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden max-w-4xl mx-auto w-full p-4 bg-gray-50 dark:bg-gray-900">
        <div className="h-full overflow-y-auto space-y-4 pb-24">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } items-start gap-3`}
            >
              {msg.role === "assistant" && (
                <div className="mt-1 p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-purple-600 text-black"
                    : "bg-purple-600 text-black  shadow-lg"
                }`}
              >
                <div className="text-sm leading-relaxed text-white prose dark:prose-dark">
                  {formatContent(msg.content)}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <UserCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <SparklesIcon className="w-6 h-6 text-green-600 dark:text-purple-400 animate-pulse" />
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-xl pl-4 pr-2 py-2 shadow-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
              >
                <PaperAirplaneIcon className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
