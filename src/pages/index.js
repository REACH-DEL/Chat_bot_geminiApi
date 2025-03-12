// src/pages/index.js
import ChatInterface from "../components/chatInterface";

export default function Home() {
  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold p-4 bg-blue-500 text-white">
        Friendly Chat Bot
      </h1>
      <ChatInterface />
    </div>
  );
}
