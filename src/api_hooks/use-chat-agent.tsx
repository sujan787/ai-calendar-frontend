import axios from "axios";

axios.defaults.withCredentials = true;

export type ChatResponseType = {
  text: string;
  role: "AGENT" |"USER";
};

const useChatAgent = () => {
  const apiEndPoint = process.env.NEXT_PUBLIC_BACKEND_API;

  const createChat = async (query: string): Promise<ChatResponseType> => {
    try {
      const response = await axios.post(
        `${apiEndPoint}/api/ai-agent-chat/create_chat`,
        { query }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }
  };

  return { createChat };
};

export default useChatAgent;
