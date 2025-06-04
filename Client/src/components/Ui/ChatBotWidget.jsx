import React, { useEffect } from "react";

const ChatBotWidget = () => {
  useEffect(() => {
    if (!document.querySelector("df-messenger")) {
      const dfMessenger = document.createElement("df-messenger");
      dfMessenger.setAttribute("intent", "WELCOME");
      dfMessenger.setAttribute("chat-title", "toura-chatbot");
      dfMessenger.setAttribute(
        "agent-id",
        `${import.meta.env.VITE_CHATBOT_AGENT_ID}`
      ); // Replace with your agent ID
      dfMessenger.setAttribute("language-code", "en");
      dfMessenger.style.width = "360px";
      dfMessenger.style.height = "500px";

      document.getElementById("chatbot-container")?.appendChild(dfMessenger);
    }
  }, []);

  return (
    <div>
      <div id="chatbot-container" className="h-full w-full"></div>
    </div>
  );
};

export default ChatBotWidget;
