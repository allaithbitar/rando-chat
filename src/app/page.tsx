"use client";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import AlternativeButton from "@/components/UI/AlternativeButton";
import DefaultButton from "@/components/UI/DefaultButton";
import DefaultInput from "@/components/UI/DefaultInput";
import AppContainer from "@/components/AppContainer";
import MessagesContainer from "@/components/MessagesContainer";
import { TMessage } from "@/type/message";
import OverlayWithLoader from "@/components/OverlayWithLoader";

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [messages, setMessages] = useState<TMessage[]>([]);

  const [message, setMessage] = useState("");

  const [isEnqueued, setIsEnqueued] = useState(false);

  const [isConnected, setIsConnected] = useState(false);

  const [didOtherUserDisconnect, setDidOtherUserDisconnect] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const handleStart = () => {
    setDidOtherUserDisconnect(false);
    const s = io(process.env.HOST as string);

    s.on("connect", () => {
      console.log("connect");
    });

    s.on("message", (res) => {
      const date = new Date();
      setMessages((prev) => [
        ...prev,
        {
          date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`,
          data: res,
          isMe: false,
        },
      ]);
    });

    s.on("error", () => {
      console.log("error");
    });

    s.on("disconnect", (res) => {
      console.log("disconnect", res);
      setIsEnqueued(false);
      setIsConnected(false);
      setDidOtherUserDisconnect(true);
    });

    s.on("match-disconnected", (res) => {
      console.log("match-disconnected", res);
      setIsEnqueued(false);
      setIsConnected(false);
      setDidOtherUserDisconnect(true);
    });

    s.on("enqueue", () => {
      setIsEnqueued(true);
    });

    s.on("typing", () => {
      console.log("typing");
      setIsTyping(true);
    });

    s.on("connected", () => {
      setIsConnected(true);
      setIsEnqueued(false);
    });

    setSocket(s);
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
    }
    setDidOtherUserDisconnect(false);
    setIsConnected(false);
    setIsEnqueued(false);
    setIsTyping(false);
  };

  const handleSendMessage = () => {
    socket?.emit("message", message);

    const date = new Date();
    setMessages((prev) => [
      ...prev,
      {
        date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`,
        data: message,
        isMe: true,
      },
    ]);

    setMessage("");
  };

  useEffect(() => {
    let timeout: any;
    if (isTyping) {
      timeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isTyping]);

  return (
    <div className="container mx-auto antialiased">
      <AppContainer>
        {isEnqueued && <OverlayWithLoader message="Waiting for a user" />}
        <MessagesContainer messages={messages} />
        <small className="text-white text-sm">
          {isTyping && "Typing..."}
          {didOtherUserDisconnect && "The other user has disconnected"}
        </small>
        <div className="flex gap-2">
          <DefaultInput
            disabled={!isConnected}
            onKeyUp={(e) => {
              if (e.code === "Enter") {
                handleSendMessage();
              } else {
                socket?.emit("typing");
              }
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <AlternativeButton disabled={!message} onClick={handleSendMessage}>
            Send
          </AlternativeButton>

          <DefaultButton
            onClick={() => {
              if (isConnected || isEnqueued) {
                handleDisconnect();
              } else {
                handleStart();
              }
            }}
          >
            {isEnqueued && "Stop"}
            {!isEnqueued && !isConnected && "Start"}
            {isConnected && !isEnqueued && "Leave"}
          </DefaultButton>
        </div>
      </AppContainer>
    </div>
  );
}
