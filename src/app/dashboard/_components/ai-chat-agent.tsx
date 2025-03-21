import { useCalender } from "@/api_hooks/use-calendar";
import useChatAgent, { ChatResponseType } from "@/api_hooks/use-chat-agent";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Brain, MessageSquare, Send } from "lucide-react";
import { ComponentProps, FC, useEffect, useRef, useState } from "react";
import { CircleLoader } from "react-spinners";

interface AiChatAgentProps extends ComponentProps<"div"> {}

const AiChatAgent: FC<AiChatAgentProps> = () => {
  const { getCalendarsQuery } = useCalender();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { text: string; role: "AGENT" | "USER" }[]
  >([
    {
      text: "Hi! I'm Google Calendar Agent. How can I help you today?",
      role: "AGENT",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { createChat } = useChatAgent();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { text: message, role: "USER" }]);
    setMessage("");
    sendMessageMutation.mutate(message);
    try {
    } catch (error) {}
  };

  const sendMessageMutation = useMutation({
    mutationFn: createChat,
    onSuccess: (data: ChatResponseType) => {
      setMessages((prev) => [
        ...prev,
        {
          text: data.text,
          role: "AGENT",
        },
      ]);

      getCalendarsQuery.refetch()
    },
    onError: (error: any) => {},
  }) as UseMutationResult<ChatResponseType, Error, string>;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI Agent</h2>
      </div>
      <div
        ref={chatContainerRef}
        className="bg-gray-50 rounded-xl p-4 h-[400px] overflow-y-auto mb-4"
      >
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role == "USER" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-xl ${
                  msg.role == "USER"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {sendMessageMutation.isPending && (
            <div
              className={`max-w-[80%] px-4 py-2 rounded-xl text-gray-700 flex items-center gap-2`}
            >
              <CircleLoader color="blue" size={20} /> Wait, some magic is
              happening! 🪄🪄🪄
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default AiChatAgent;
