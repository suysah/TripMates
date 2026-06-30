import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useAuth from "../context/useAuth";
import Spinner from "../components/Spinner";
import { FaPaperPlane, FaArrowLeft, FaComments } from "react-icons/fa";

const ChatRoom = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const socketRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Fetch tour details to get the tour name
  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/tours/${tourId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setTour(data.data?.data);
        }
      } catch (err) {
        console.error("Failed to load tour details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTourDetails();
  }, [tourId, BASE_URL]);

  // Handle socket connections
  useEffect(() => {
    if (!user || !tourId) return;

    // Connect to Socket.io server (strips protocol if needed, uses base url)
    const socketUrl = BASE_URL.replace("/api/v1", "").replace(/\/$/, "");
    socketRef.current = io(socketUrl, {
      withCredentials: true,
    });

    // Join room
    socketRef.current.emit("join_tour", {
      tourId,
      userName: user.name,
    });

    // Listen for incoming messages
    socketRef.current.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [tourId, user, BASE_URL]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("send_message", {
      tourId,
      message: typedMessage.trim(),
      senderName: user.name,
      senderPhoto: user.photo || "default.jpg",
    });

    setTypedMessage("");
  };

  if (loading) return <Spinner />;

  if (!tour) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Tour details could not be loaded. Please return and try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 border rounded-2xl overflow-hidden shadow-md max-w-4xl mx-auto my-4">
      {/* Chat Room Header */}
      <div className="bg-teal-800 text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/account/bookings")}
            className="p-2 hover:bg-teal-700 rounded-full transition-colors"
            title="Back to Bookings"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h2 className="font-bold text-lg leading-tight flex items-center gap-2">
              <FaComments /> {tour.name}
            </h2>
            <p className="text-teal-200 text-xs">TripMates Group Chat</p>
          </div>
        </div>
        <span className="text-xs font-semibold bg-teal-700 px-3 py-1 rounded-full text-teal-100 border border-teal-600">
          {tour.duration} Days Tour
        </span>
      </div>

      {/* Messages list */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaComments className="w-12 h-12 text-gray-300 mb-2 animate-bounce" />
            <p className="font-medium text-sm">Welcome to your group chat!</p>
            <p className="text-xs text-gray-400 mt-1">Start chatting with your guide and trip mates.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            if (msg.system) {
              return (
                <div key={index} className="flex justify-center my-2">
                  <span className="bg-amber-100 border border-amber-200 text-amber-900 px-3.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {msg.message}
                  </span>
                </div>
              );
            }

            const isSelf = msg.senderName === user.name;
            const time = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <div
                key={index}
                className={`flex gap-3 max-w-[75%] ${isSelf ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <img
                  src={`${BASE_URL}/public/img/users/${msg.senderPhoto}`}
                  alt={msg.senderName}
                  onError={(e) => {
                    e.target.src = `${BASE_URL}/public/img/users/default.jpg`;
                  }}
                  className="w-9 h-9 object-cover rounded-full border shadow-sm self-end"
                />

                {/* Message Balloon */}
                <div className="flex flex-col">
                  {!isSelf && (
                    <span className="text-[10px] font-bold text-teal-800 ml-1.5 mb-0.5">
                      {msg.senderName}
                    </span>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl shadow-sm text-sm break-all ${
                      isSelf
                        ? "bg-teal-700 text-white rounded-br-none"
                        : "bg-white text-gray-800 border rounded-bl-none"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right font-medium ${
                        isSelf ? "text-teal-200" : "text-gray-400"
                      }`}
                    >
                      {time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSend} className="bg-white border-t p-4 flex gap-3 shadow-inner">
        <input
          type="text"
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          placeholder="Type your message to the group..."
          className="flex-grow border rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm bg-slate-50 transition-shadow"
        />
        <button
          type="submit"
          disabled={!typedMessage.trim()}
          className="flex items-center justify-center p-3 bg-teal-700 hover:bg-teal-800 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow"
        >
          <FaPaperPlane className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
