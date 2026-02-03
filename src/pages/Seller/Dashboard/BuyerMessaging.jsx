import React, { useState, useRef, useEffect } from "react";
import { IoSearch, IoSend, IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowRoundBack } from 'react-icons/io';
import axios from "axios";
import config from "../../../config";
import io from "socket.io-client";
import { buyerMessagingTranslations } from "./translation/buyerMessagingTranslations";

const socket = io(config.baseUrl.replace("/api/v1", ""), {
  transports: ['polling']
});

// Avatar component
const Avatar = ({ initials, isOnline }) => {
  const colors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-purple-500",
  ];
  let hash = 0;
  for (let i = 0; i < initials.length; i++)
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  const color = colors[Math.abs(hash) % colors.length];
  return (
    <div
      className={`relative w-10 h-10 flex items-center justify-center rounded-full font-bold text-white text-sm ${color}`}
    >
      {initials}
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white" />
      )}
    </div>
  );
};

// Conversation Item
const ConversationItem = ({ conv, isActive, onClick }) => (
  <div
    onClick={() => onClick(conv._id)}
    className={`flex items-center p-4 cursor-pointer rounded-2xl transition-all duration-200 group ${isActive ? "bg-indigo-50" : "hover:bg-gray-50/80"
      }`}
  >
    <Avatar initials={conv.participants[1].name[0]} isOnline={conv.isOnline} />
    <div className="ml-4 flex-1 overflow-hidden">
      <div className="flex justify-between items-center mb-1">
        <p
          className={`text-sm font-bold truncate ${isActive ? "text-indigo-900" : "text-gray-900"
            }`}
        >
          {conv.participants[1].name}
        </p>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter shrink-0 ml-2">
          {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <p
        className={`text-xs truncate leading-relaxed ${isActive ? "text-indigo-600 font-bold" : "text-gray-500 font-medium"
          }`}
      >
        {conv.lastMessage || "No messages yet"}
      </p>
    </div>
  </div>
);

// Chat Message
const ChatMessage = ({ message, currentUserId }) => {
  const isBuyer = message.sender._id === currentUserId;
  const align = isBuyer ? "justify-end" : "justify-start";
  const bubble = isBuyer
    ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-lg shadow-indigo-100"
    : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm";

  return (
    <div className={`flex ${align} mb-6`}>
      {!isBuyer && (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-400 mr-2 self-end mb-4">
          {message.sender.name[0]}
        </div>
      )}
      <div className={`max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] flex flex-col`}>
        <div className={`p-4 ${bubble}`}>
          <p className="text-sm font-medium leading-relaxed break-words">{message.content}</p>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest mt-2 px-1 ${isBuyer ? "text-gray-400 text-right" : "text-gray-400"
            }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

// Main Component
const BuyerMessaging = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");

  // Translations based on localStorage
  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem("lang");
    return (
      buyerMessagingTranslations[storedLang] || buyerMessagingTranslations.fr
    );
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem("lang");
      setTranslations(
        buyerMessagingTranslations[storedLang] || buyerMessagingTranslations.fr
      );
    };
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    fetchChats();
    socket.on("receiveMessage", (msg) => {
      if (msg.chatId === activeConversationId)
        setMessages((prev) => [...prev, msg]);
      fetchChats();
    });
    return () => socket.off("receiveMessage");
  }, [activeConversationId]);

  useEffect(() => scrollToBottom(), [messages]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(
        `${config.baseUrl}/chat/user/${currentUserId}`
      );
      setConversations(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSingleChatMessage = async (chatId) => {
    setActiveConversationId(chatId);
    try {
      const res = await axios.get(`${config.baseUrl}/chat/messages/${chatId}`);
      setMessages(res.data.data);
      socket.emit("joinChat", chatId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const payload = {
        chatId: activeConversationId,
        sender: currentUserId,
        content: newMessage.trim(),
      };
      const res = await axios.post(`${config.baseUrl}/chat/send`, payload);
      socket.emit("sendMessage", res.data.data);
      setNewMessage("");
      fetchChats();
    } catch (err) {
      console.error(err);
    }
  };

  const activeConv = conversations.find(c => c._id === activeConversationId);

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[80vh] flex-col md:flex-row bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative">
      {/* Sidebar - Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col bg-white border-r border-gray-50 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-black text-gray-900 mb-6">Messagerie</h1>
          <div className="relative">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={translations.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 rounded-2xl text-sm font-medium transition outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-1 scrollbar-hide">
          {conversations.length > 0 ? conversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conv={conv}
              isActive={conv._id === activeConversationId}
              onClick={fetchSingleChatMessage}
            />
          )) : (
            <div className="px-6 py-10 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoSearch className="text-gray-300 text-2xl" />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Aucune conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-gray-50/50 ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        {activeConversationId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 md:p-6 bg-white border-b border-gray-50 flex items-center">
              <button
                onClick={() => setActiveConversationId(null)}
                className="md:hidden mr-4 p-2.5 bg-gray-50 text-gray-500 rounded-xl active:scale-95 transition"
              >
                <IoIosArrowRoundBack className="text-2xl" />
              </button>
              <Avatar
                initials={activeConv?.participants[1].name[0] || "?"}
                isOnline={activeConv?.isOnline}
              />
              <div className="ml-4">
                <h3 className="text-base font-bold text-gray-900 leading-none mb-1">
                  {activeConv?.participants[1].name}
                </h3>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                  {activeConv?.isOnline ? "Online" : "Away"}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="flex flex-col">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <ChatMessage
                      key={msg._id}
                      message={msg}
                      currentUserId={currentUserId}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 grayscale opacity-30">
                    <IoSend className="text-6xl text-gray-300 mb-6 rotate-[-45deg]" />
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{translations.noMessages}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-white">
              <form
                onSubmit={handleSendMessage}
                className="relative flex items-center gap-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={translations.typeMessage}
                  className="flex-1 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 py-4 px-6 pr-16 rounded-2xl text-sm font-medium transition outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-3.5 rounded-xl transition duration-200 active:scale-95 ${!newMessage.trim()
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700"
                    }`}
                >
                  <IoSend className="text-xl" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <IoSend className="text-3xl text-indigo-400 rotate-[-45deg]" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Sélectionner une conversation</h3>
            <p className="text-sm text-gray-500 font-medium max-w-[280px] leading-relaxed">
              {translations.selectConversation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerMessaging;
