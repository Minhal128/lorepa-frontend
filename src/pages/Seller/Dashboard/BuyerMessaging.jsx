import React, { useState, useRef, useEffect } from "react";
import { IoSearch, IoSend, IoArrowBack, IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowRoundBack } from 'react-icons/io';
import axios from "axios";
import config from "../../../config";
import io from "socket.io-client";
import { buyerMessagingTranslations } from "./translation/buyerMessagingTranslations";

const socket = io(config.baseUrl.replace("/api/v1", ""), {
  transports: ['websocket']
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
const ConversationItem = ({ conv, currentUserId, activeConversationId, typingUsers, isActive, onClick, translations }) => {
  const otherParticipant = conv.participants.find(p => p._id !== currentUserId) || conv.participants[0];
  const isTyping = typingUsers[conv._id] && typingUsers[conv._id] !== currentUserId;
  // Calculate unread messages (assuming backend returns unreadCount or we calculate it safely if messages are populated)
  const unreadCount = conv.unreadCount || 0; // Replace with actual unread logic if passed from backend

  return (
    <div
      onClick={() => onClick(conv._id)}
      className={`flex items-center p-4 cursor-pointer rounded-2xl transition-all duration-200 group relative ${isActive ? "bg-indigo-50" : "hover:bg-gray-50/80"
        }`}
    >
      <div className="relative">
        <Avatar initials={otherParticipant?.name?.[0] || "?"} isOnline={conv.isOnline} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm ring-1 ring-red-100">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </div>

      <div className="ml-4 flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <p
            className={`text-sm font-bold truncate ${isActive ? "text-indigo-900" : "text-gray-900"
              }`}
          >
            {otherParticipant?.name || "User"}
          </p>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter shrink-0 ml-2">
            {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {isTyping ? (
          <p className="text-xs text-indigo-500 font-bold truncate animate-pulse">
            {translations.typing || "typing..."}
          </p>
        ) : (
          <p
            className={`text-xs truncate leading-relaxed ${isActive ? "text-indigo-600 font-bold" : "text-gray-500 font-medium"
              } ${unreadCount > 0 && !isActive ? "text-gray-900 font-bold" : ""}`}
          >
            {conv.lastMessage || translations.noMessagesYet}
          </p>
        )}
      </div>
    </div>
  );
};

// Chat Message
const ChatMessage = ({ message, currentUserId, otherUserId }) => {
  const isBuyer = message.sender._id === currentUserId;
  const align = isBuyer ? "justify-end" : "justify-start";
  const bubble = isBuyer
    ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-lg shadow-indigo-100"
    : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm";

  return (
    <div className={`flex ${align} mb-6`}>
      {!isBuyer && (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-400 mr-2 self-end mb-4">
          {message.sender?.name?.[0] || "?"}
        </div>
      )}
      <div className={`max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] flex flex-col`}>
        <div className={`p-4 ${bubble}`}>
          <p className="text-sm font-medium leading-relaxed break-words">{message.content}</p>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest mt-2 px-1 flex items-center gap-1 ${isBuyer ? "text-gray-400 justify-end" : "text-gray-400 justify-start"
            }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isBuyer && (
            <span>
              {message.readBy && message.readBy.includes(otherUserId) ? (
                <IoCheckmarkDone className="text-blue-500 text-sm" />
              ) : (
                <IoCheckmark className="text-gray-400 text-sm" />
              )}
            </span>
          )}
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
  const [typingUsers, setTypingUsers] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
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

    // Define handler separately to avoid anonymous function recreation references
    const handleReceiveMessage = (msg) => {
      if (String(msg.chatId) === String(activeConversationId)) {
        setMessages((prev) => {
          // Prevent duplicates securely by checking ID
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        if (msg.sender._id !== currentUserId) {
          socket.emit("markAsRead", { messageId: msg._id, chatId: msg.chatId, userId: currentUserId });
        }
      }
      fetchChats();
    };

    socket.on("receiveMessage", handleReceiveMessage);

    socket.on("userTyping", ({ chatId, userId }) => {
      setTypingUsers(prev => ({ ...prev, [String(chatId)]: userId }));
    });

    socket.on("userStoppedTyping", ({ chatId, userId }) => {
      setTypingUsers(prev => {
        const newTyping = { ...prev };
        delete newTyping[String(chatId)];
        return newTyping;
      });
    });

    socket.on("messageRead", (updatedMsg) => {
      setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
    });

    socket.on("chatRead", ({ chatId, userId }) => {
      if (String(chatId) === String(activeConversationId)) {
        setMessages(prev => prev.map(m => {
          if (m.sender._id !== userId && !m.readBy?.includes(userId)) {
            return { ...m, readBy: [...(m.readBy || []), userId] };
          }
          return m;
        }));
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("messageRead");
      socket.off("chatRead");
    }
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
      socket.emit("markChatAsRead", { chatId, userId: currentUserId });
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
      // Format the returned message specifically to look populated enough for local rendering instantly
      const savedMessage = res.data.data;
      if (typeof savedMessage.sender === 'string') {
        savedMessage.sender = { _id: currentUserId, name: [] };
      }

      socket.emit("broadcastMessage", savedMessage);

      setMessages((prev) => {
        if (prev.some(m => m._id === savedMessage._id)) return prev;
        return [...prev, savedMessage];
      });

      socket.emit("stopTyping", { chatId: activeConversationId, userId: currentUserId });
      setNewMessage("");
      fetchChats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (activeConversationId) {
      socket.emit("typing", { chatId: activeConversationId, userId: currentUserId });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { chatId: activeConversationId, userId: currentUserId });
      }, 1500);
    }
  };

  const activeConv = conversations.find(c => c._id === activeConversationId);

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[80vh] flex-col md:flex-row bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative">
      {/* Sidebar - Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col bg-white border-r border-gray-50 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-black text-gray-900 mb-6">{translations.messagingTitle}</h1>
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
              currentUserId={currentUserId}
              activeConversationId={activeConversationId}
              typingUsers={typingUsers}
              isActive={conv._id === activeConversationId}
              onClick={fetchSingleChatMessage}
              translations={translations}
            />
          )) : (
            <div className="px-6 py-10 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoSearch className="text-gray-300 text-2xl" />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{translations.noConversations}</p>
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
                initials={activeConv?.participants?.find(p => p._id !== currentUserId)?.name?.[0] || "?"}
                isOnline={activeConv?.isOnline}
              />
              <div className="ml-4">
                <h3 className="text-base font-bold text-gray-900 leading-none mb-1">
                  {activeConv?.participants?.find(p => p._id !== currentUserId)?.name || "User"}
                </h3>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                  {activeConv?.isOnline ? translations.online : translations.away}
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
                      otherUserId={activeConv?.participants?.find(p => p._id !== currentUserId)?._id}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 grayscale opacity-30">
                    <IoSend className="text-6xl text-gray-300 mb-6 rotate-[-45deg]" />
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{translations.noMessages}</p>
                  </div>
                )}

                {typingUsers[activeConversationId] && typingUsers[activeConversationId] !== currentUserId && (
                  <div className="flex justify-start mb-6 mt-2">
                    <div className="bg-white border border-gray-100 text-gray-400 rounded-2xl rounded-tl-none px-4 py-3 min-h-[44px] flex items-center justify-center shadow-sm w-fit gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
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
                  onChange={handleTyping}
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
            <h3 className="text-xl font-black text-gray-900 mb-2">{translations.selectConversationTitle}</h3>
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
