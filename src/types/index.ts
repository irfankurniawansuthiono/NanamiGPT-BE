export type ChatSessionType = {
  message: {
    text: string;
    images: string[];
  };
  reply: string;
  timestamp: string;
};
