import { useState } from "react";
import { publicApi } from "../api/axios";
import chatbox_ic from "../assets/chatbox.png"
import { IoIosClose } from "react-icons/io";
import { AiOutlineSend } from "react-icons/ai";
import { useRef, useLayoutEffect } from "react";

export default function ChatBox() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]); // lưu lịch sử chat
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // thêm tin nhắn user
        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await publicApi.post("/search/", { query: input });

            setMessages([
                ...newMessages,
                { sender: "bot", text: res.data.answer || "Không có phản hồi" },
            ]);
        } catch (err) {
            console.error(err);
            setMessages([
                ...newMessages,
                { sender: "bot", text: "❌ Lỗi kết nối server" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4">
            {/* Floating button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                // className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
                >
                    <img src={chatbox_ic} alt="Chat" className="w-14 h-14" />
                </button>
            )}

            {/* Chatbox */}
            {open && (
                <div className="w-80 h-96 bg-white border rounded-xl shadow-lg flex flex-col">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-xl">
                        <div className="flex items-center justify-center">
                            {/* <img src={chatbox_ic} alt="Chat" className="w-9 h-9 mr-2" /> */}
                            <span className="font-bold">VFriends ChatBot</span>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-white"><IoIosClose size={30} /></button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 flex flex-col">
                        {messages.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">💬 Hãy bắt đầu cuộc trò chuyện...</p>
                        ) : (
                            messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.sender === "user" ? (
                                        <span className="px-3 py-1 rounded-lg max-w-[70%] bg-blue-500 text-white">
                                            {msg.text}
                                        </span>
                                    ) : (
                                        <div className="flex">
                                            <img src={chatbox_ic} alt="Chat" className="w-9 h-9 mr-2" />
                                            <span className="px-3 py-1 rounded-lg max-w-[70%] bg-gray-200 text-black">
                                                {msg.text}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        {loading && <p className="text-gray-500 text-sm">Bot typing...</p>}

                        {/* scroll anchor */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t p-2 flex gap-2">
                        <input
                            className="flex-1 border rounded px-2 py-1 text-sm border-gray-500"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={sendMessage}
                        // className="bg-blue-600 text-white px-3 rounded"
                        >
                            <AiOutlineSend size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
