import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import { cleanHtmlMessage } from "../../Utils/htmlTextUtils";
import { usePortal, PortalProvider } from "../../.MODULS/ONLINE_TUTORING/lib/store";
import { Icon } from "../../.MODULS/ONLINE_TUTORING/ui/Icon";
import api from "../../Redux/Axios/middleware";
import { decode } from "../../Utils/encodeDecode";

const formatMathAndMarkdown = (text: string) => {
    if (!text) return "";
    const cleaned = cleanHtmlMessage(text);
    return cleaned
        .replaceAll(String.raw`\(`, "$")
        .replaceAll(String.raw`\)`, "$")
        .replaceAll(String.raw`\[`, "$$")
        .replaceAll(String.raw`\]`, "$$");
};

export default function ChatPage() {
    return (
        <PortalProvider>
            <ChatPageInner />
        </PortalProvider>
    );
}

function ChatPageInner() {
    const { notWired } = usePortal();
    const [sessions, setSessions] = useState<any[]>([]);

    const details = React.useMemo(() => {
        try {
            const raw = sessionStorage.getItem("details");
            return raw ? decode(raw) : null;
        } catch (e) {
            console.error("Failed to decode details", e);
            return null;
        }
    }, []);
    const username = details?.username || "User";
    const [chatActive, setChatActive] = useState<string>("new");
    const [messages, setMessages] = useState<any[]>([]);
    const [chatTyping, setChatTyping] = useState<boolean>(false);
    const [draft, setDraft] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const elliotCapped = false;

    // Fetch chat history sessions on mount
    const fetchSessions = async () => {
        try {
            const res = await api.get("/api/ai/chat/history");
            if (res.data && res.data.data) {
                const recent = res.data.data.recent || [];
                const archived = res.data.data.archived || [];
                setSessions([...recent, ...archived]);
            }
        } catch (err) {
            console.error("Failed to fetch sessions history", err);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    // Fetch messages when active session changes
    useEffect(() => {
        if (chatActive === "new") {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            try {
                const res = await api.get(`/api/ai/chat/history/${chatActive}`);
                if (res.data && res.data.data) {
                    const mapped = res.data.data.flatMap((m: any) => [
                        { who: "u", text: m.user_input },
                        { who: "e", text: m.ai_output }
                    ]);
                    setMessages(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch messages for session", err);
            }
        };

        fetchMessages();
    }, [chatActive]);

    const formatRelativeTime = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const dDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffTime = dNow.getTime() - dDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return days[date.getDay()];
        }
        if (diffDays < 14) return "Last week";
        return date.toLocaleDateString();
    };

    const list = [
        { id: "new", title: "New chat", when: "" },
        ...sessions.map((s) => ({
            id: s.session_id,
            title: s.title || "Untitled Chat",
            when: s.created_at ? formatRelativeTime(s.created_at) : ""
        }))
    ];

    const empty = messages.length === 0;

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [messages.length, chatTyping, chatActive]);

    const send = async () => {
        const text = draft.trim();
        if (!text) return;

        setMessages((prev) => [...prev, { who: "u", text }]);
        setDraft("");
        setChatTyping(true);

        try {
            const payload: any = {
                application: "online_student",
                message: text,
                agent_id: null
            };
            if (chatActive !== "new") {
                payload.session_id = chatActive;
            }

            const res = await api.post("/api/ai/online-tutoring/chat", payload);
            if (res.data && res.data.data) {
                const botResponse = res.data.data.response;
                const newSessionId = res.data.data.session_id;

                if (chatActive === "new" && newSessionId) {
                    setChatActive(newSessionId);
                }

                setMessages((prev) => [
                    ...prev,
                    { who: "e", text: botResponse }
                ]);
                fetchSessions();
            }
        } catch (err) {
            console.error("Error sending message to Elliot", err);
            setMessages((prev) => [
                ...prev,
                { who: "e", text: "Ennala ipo reply panna mudiyala. Oru nimisham kalichu thirumba try pannunga." }
            ]);
        } finally {
            setChatTyping(false);
        }
    };

    const sendStarter = (text: string) => {
        if (chatTyping) return;
        setDraft(text);
        // Execute in next tick to allow draft state update
        setTimeout(() => {
            sendWithText(text);
        }, 50);
    };

    const sendWithText = async (text: string) => {
        setMessages((prev) => [...prev, { who: "u", text }]);
        setChatTyping(true);

        try {
            const payload: any = {
                application: "online_student",
                message: text,
                agent_id: null
            };
            if (chatActive !== "new") {
                payload.session_id = chatActive;
            }

            const res = await api.post("/api/ai/online-tutoring/chat", payload);
            if (res.data && res.data.data) {
                const botResponse = res.data.data.response;
                const newSessionId = res.data.data.session_id;

                if (chatActive === "new" && newSessionId) {
                    setChatActive(newSessionId);
                }

                setMessages((prev) => [
                    ...prev,
                    { who: "e", text: botResponse }
                ]);
                fetchSessions();
            }
        } catch (err) {
            console.error("Error sending message to Elliot", err);
            setMessages((prev) => [
                ...prev,
                { who: "e", text: "Ennala ipo reply panna mudiyala. Oru nimisham kalichu thirumba try pannunga." }
            ]);
        } finally {
            setChatTyping(false);
        }
    };

    return (
        <div className="ev-split" style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 16, height: "calc(100dvh - 210px)", minHeight: 440, animation: "evrise .5s cubic-bezier(.16,1,.3,1) backwards" }}>
            {/* thread list */}
            <div className="glass-card thin-scroll" style={{ padding: 14, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" }}>
                {list.map((c) => {
                    const on = chatActive === c.id;
                    return (
                        <button key={c.id} onClick={() => setChatActive(c.id)} aria-pressed={on} className="list-hover" style={{ display: "flex", width: "100%", textAlign: "left", alignItems: "center", gap: 9, padding: "10px 11px", borderRadius: 12, cursor: "pointer", background: on ? "rgba(0,157,255,.12)" : "transparent", border: "none", fontFamily: "inherit" }}>
                            <span className="thread-title-container" style={{ flex: 1, minWidth: 0 }}>
                                <span className="thread-title-text" style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: on ? "var(--brand-600)" : "var(--fg1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</span>
                                {c.when && <span className="thread-date-text" style={{ display: "block", fontSize: 10.5, color: "var(--fg4)" }}>{c.when}</span>}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* conversation */}
            <div className="glass-card chat-conversation-container" style={{ boxSizing: "border-box", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Gentle notice only when Elliot has hit the (invisible) daily allowance */}
                {elliotCapped && (
                    <div className="elliot-cap-notice" style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 18px", borderBottom: "1px solid rgba(0,32,63,.06)", background: "rgba(245,166,35,.08)" }}>
                        <Icon path="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5h-2v6l5 3 1-1.7-4-2.3V7Z" size={14} style={{ color: "var(--warn-700)", flex: "none" }} />
                        <span className="elliot-cap-text" style={{ fontSize: 12, fontWeight: 600, color: "#8A5B08" }}>Elliot has helped with a lot today and is taking a short break. Please try again later, or message a tutor if it is urgent.</span>
                    </div>
                )}
                <div ref={scrollRef} className="thin-scroll chat-messages-list" style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {empty && (
                        <div className="chat-empty-state" style={{ margin: "auto", textAlign: "center", maxWidth: 380 }}>
                            <div className="elliot-avatar-icon" style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent-blue-light),var(--accent-violet-light))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, margin: "0 auto 14px", boxShadow: "0 14px 30px -12px rgba(0,157,255,.55)" }}>E</div>
                            <div className="elliot-welcome-title" style={{ fontFamily: '"Montserrat", system-ui, sans-serif', fontSize: 19, fontWeight: 800, letterSpacing: -0.3 }}>Hi {username}, I&apos;m Elliot</div>
                            <div className="elliot-welcome-desc" style={{ fontSize: 13, color: "var(--fg3)", margin: "6px 0 16px", lineHeight: 1.5 }}>Ask me anything about your courses, worksheets or upcoming classes. I know where you&apos;re at.</div>
                            <div className="elliot-starters-container" style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                                <Starter className="elliot-starter-recommendations" onClick={() => sendStarter("Give me some practice recommendations")}>Practice recommendations</Starter>
                                <Starter className="elliot-starter-progress" onClick={() => sendStarter("Show my progress")}>Show my progress</Starter>
                                <Starter className="elliot-starter-concept" onClick={() => sendStarter("Explain a concept from my next class")}>Explain a concept</Starter>
                            </div>
                        </div>
                    )}
                    {messages.map((m: any, i: number) => {
                        const mine = m.who === "u";
                        const msgKey = m.id || `msg-${i}-${m.who}`;
                        return (
                            <div key={msgKey} className={mine ? "chat-message-row user" : "chat-message-row bot"} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                                <div className="chat-message-bubble" style={{ maxWidth: "72%", padding: "11px 15px", borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: mine ? "var(--brand-500)" : "rgba(255,255,255,.85)", color: mine ? "#fff" : "var(--fg1)", fontSize: 13, lineHeight: 1.55, boxShadow: mine ? "0 8px 20px -10px rgba(0,157,255,.5)" : "0 8px 20px -12px rgba(0,32,63,.2)", animation: "evdrop .25s ease-out" }}>
                                    {mine ? (
                                        m.text
                                    ) : (
                                        <Markdown
                                            className="chat-markdown-content"
                                            remarkPlugins={[remarkMath, remarkGfm]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                p: ({ children }: any) => <p style={{ margin: "0 0 6px 0" }}>{children}</p>,
                                                ul: ({ children }: any) => <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>{children}</ul>,
                                                ol: ({ children }: any) => <ol style={{ margin: "4px 0", paddingLeft: "20px" }}>{children}</ol>,
                                                li: ({ children }: any) => <li style={{ marginBottom: "2px" }}>{children}</li>,
                                            }}
                                        >
                                            {formatMathAndMarkdown(m.text)}
                                        </Markdown>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {chatTyping && (
                        <div className="chat-message-row bot typing" style={{ display: "flex", justifyContent: "flex-start" }}>
                            <div className="chat-message-bubble typing-dots" style={{ padding: "13px 16px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,.85)", boxShadow: "0 8px 20px -12px rgba(0,32,63,.2)", display: "flex", gap: 5, alignItems: "center" }}>
                                <span className="typing-dot dot-1" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--fg4)", animation: "evblink 1.2s infinite" }} />
                                <span className="typing-dot dot-2" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--fg4)", animation: "evblink 1.2s .2s infinite" }} />
                                <span className="typing-dot dot-3" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--fg4)", animation: "evblink 1.2s .4s infinite" }} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="elliot-chat-input-area" style={{ padding: "14px 16px", borderTop: "1px solid rgba(0,32,63,.07)" }}>
                    <div className="chat-input-wrapper" style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--glass-bg)", border: "1px solid rgba(0,32,63,.1)", borderRadius: 14, padding: "6px 8px 6px 14px" }}>
                        <input className="chat-text-input" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder={elliotCapped ? "Elliot is taking a short break - try again later" : "Ask Elliot about your homework"} disabled={elliotCapped} aria-label="Ask Elliot" style={{ flex: 1, border: "none", background: "transparent", fontFamily: "inherit", fontSize: 13, color: "var(--fg1)", minWidth: 0, opacity: elliotCapped ? 0.6 : 1 }} />
                        <button className="chat-attachment-btn list-hover" onClick={() => notWired("File attachments")} title="Attach a file" style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "transparent", color: "var(--fg3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon path="M16.5 6.5v9a4.5 4.5 0 0 1-9 0V5a3 3 0 0 1 6 0v9.5a1.5 1.5 0 0 1-3 0V6.5H9v8a3 3 0 0 0 6 0V5a4.5 4.5 0 0 0-9 0v10.5a6 6 0 0 0 12 0v-9h-1.5Z" size={16} />
                        </button>
                        <button className="chat-voice-btn list-hover" onClick={() => notWired("Voice input")} title="Voice input" style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "transparent", color: "var(--fg3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon path="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" size={16} />
                        </button>
                        <button className="chat-send-btn btn-primary" onClick={send} style={{ width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon path="M2 21 23 12 2 3v7l15 2-15 2v7Z" size={15} />
                        </button>
                    </div>
                    <div className="chat-disclaimer-text" style={{ fontSize: 10.5, color: "var(--fg4)", textAlign: "center", marginTop: 8 }}>Elliot can make mistakes. Check important answers with your tutor.</div>
                </div>
            </div>
        </div>
    );
}

function Starter({ children, onClick, className }: Readonly<{ children: React.ReactNode; onClick: () => void; className?: string }>) {
    return (
        <button onClick={onClick} className={`list-hover ${className || ""}`} style={{ height: 34, padding: "0 15px", borderRadius: 980, border: "1px solid rgba(0,157,255,.3)", background: "rgba(0,157,255,.08)", color: "var(--brand-600)", fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {children}
        </button>
    );
}

