import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import Header from "./Header";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import "./ChatPage.css";

function ChatPage({ user }) {
  const { farmerId } = useParams(); // Get farmer ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!user || !farmerId) return; // Prevents execution if user/farmerId is missing

    const chatRef = collection(db, "chats", farmerId, "messages");
    const q = query(chatRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [user, farmerId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "chats", farmerId, "messages"), {
        text: newMessage,
        sender: user.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <Header title="Chat with Farmer" />
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === user.uid ? "sent" : "received"}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatPage;
