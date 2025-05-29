import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  content: string;
  type: "user" | "assistant";
}

const HARDCODED_API_KEY = "sk-df567858f3f047919b35bd78537f373f";

const modelConfig = {
  modelIdentifier: "qwen-turbo-latest",
  apiEndpoint: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
  temperature: 0.0,
  topP: 0.0,
};

async function fetchChatResponse(messages: Message[]): Promise<string> {
  const response = await fetch(modelConfig.apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HARDCODED_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelConfig.modelIdentifier,
      messages: messages.map(m => ({role: m.type, content: m.content})),
      temperature: modelConfig.temperature,
      top_p: modelConfig.topP,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: "user",
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const assistantResponse = await fetchChatResponse([...messages, userMessage]);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: assistantResponse,
      type: "assistant",
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>Chat Interface</div>
      <div style={styles.chatContainer}>
        {messages.length === 0 && (
          <div style={styles.prompt}>What can I help with?</div>
        )}
        {messages.map(msg => (
          <div key={msg.id} style={msg.type === "user" ? styles.userMsg : styles.assistantMsg}>
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          placeholder="Ask anything"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button style={styles.sendBtn} onClick={handleSend}>↑</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#121212",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    fontFamily: "sans-serif",
  },
  header: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  chatContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  prompt: {
    marginTop: "auto",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#888",
  },
  userMsg: {
    alignSelf: "flex-end",
    backgroundColor: "#333",
    borderRadius: "15px",
    padding: "8px 12px",
    maxWidth: "70%",
  },
  assistantMsg: {
    alignSelf: "flex-start",
    backgroundColor: "#444",
    borderRadius: "15px",
    padding: "8px 12px",
    maxWidth: "70%",
  },
  inputContainer: {
    display: "flex",
    marginTop: "10px",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: "20px",
    padding: "5px 15px",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    padding: "10px",
    fontSize: "16px",
  },
  sendBtn: {
    backgroundColor: "#555",
    border: "none",
    borderRadius: "50%",
    color: "#fff",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default ChatInterface;