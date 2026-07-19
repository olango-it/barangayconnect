import React, { useState, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { MessageCircle, X, Minus, Send, Bot, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SESSION_ID = "session_" + Math.random().toString(36).substr(2, 9);

function useDraggable() {
  const [pos, setPos] = useState(null);
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  const onPointerDown = useCallback((e) => {
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    dragRef.current = { dragging: true, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current.dragging) return;
    const x = e.clientX - dragRef.current.offsetX;
    const y = e.clientY - dragRef.current.offsetY;
    const clampedX = Math.max(0, Math.min(x, window.innerWidth - 56));
    const clampedY = Math.max(0, Math.min(y, window.innerHeight - 56));
    setPos({ x: clampedX, y: clampedY });
  }, []);

  const onPointerUp = useCallback((e) => {
    dragRef.current.dragging = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  }, []);

  return { pos, onPointerDown, onPointerMove, onPointerUp };
}

const SYSTEM_PROMPT = `Ikaw si "VINCE" (Virtual Intelligence for the Community of San Vicente), ang opisyal nga virtual assistant sa Barangay San Vicente, Olango Island.

IMPORTANTE NGA MGA LAGDA:
1. KANUNAY mosulti SA CEBUANO/BISAYA lamang. Dili gayud mosulti og English.
2. Paghubad sa bisan unsang pangutana nga English ug tubagon sa Bisaya.
3. Gamita ang natural, makiguro nga Cebuano.
4. Sounda sama sa tinuod nga staff sa Barangay.
5. Gamita ang matinahoron ug propesyonal nga lengguahe.
6. Kung wala kay eksaktong tubag, isulti: "Pasayloa, wala pa koy eksaktong impormasyon bahin ana. Palihug kontaka ang Barangay San Vicente Office o adtoa ang Barangay Hall alang sa dugang tabang."

IMPORMASYON SA BARANGAY SAN VICENTE:
- Lokasyon: Olango Island, Cebu, Pilipinas
- Oras sa Opisina: Lunes hangtod Biyernes, 8:00 AM - 5:00 PM
- Emergency: 911

MGA SERBISYO:
- Barangay Clearance: Balido nga ID, mopirma sa pakigkita
- Sertipiko sa Pagpuyo: Prueba sa pagpuyo, balido nga ID
- Sertipiko sa Kawang: Prueba sa kahimtang sa kinabuhi, balido nga ID
- Business Clearance: Rehistro sa negosyo, balido nga ID
- Cedula: Balido nga ID, kita sa usa ka tuig

Paggamit sa impormasyon gikan sa FAQ ug Knowledge Base nga ihatag kanimo.`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Maayong adlaw! Ako si VINCE, ang Virtual Assistant sa Barangay San Vicente. Unsa akong ikatabang kanimo karon?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [kb, setKb] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const bottomRef = useRef(null);
  const { pos, onPointerDown, onPointerMove, onPointerUp } = useDraggable();

  const positionStyle = pos
    ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
    : {};

  const dragProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    style: { cursor: "grab", touchAction: "none" },
  };

  useEffect(() => {
    base44.entities.FAQ.filter({ is_active: true }).then(setFaqs).catch(() => {});
    base44.entities.KnowledgeBase.filter({ is_active: true }).then(setKb).catch(() => {});
    base44.entities.NewsArticle.filter({ is_published: true, category: "Announcement" }, "-created_date", 5).then(setAnnouncements).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildContext = () => {
    let ctx = "";
    if (faqs.length > 0) {
      ctx += "\n\nFAQ:\n" + faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
    }
    if (kb.length > 0) {
      ctx += "\n\nKnowledge Base:\n" + kb.map(k => `${k.title}: ${k.content}`).join("\n\n");
    }
    if (announcements.length > 0) {
      ctx += "\n\nMga Bag-ong Anunsyo:\n" + announcements.map(a => `${a.title}: ${a.excerpt || a.content?.substring(0, 200)}`).join("\n\n");
    }
    return ctx;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    const context = buildContext();
    const history = messages.map(m => `${m.role === "user" ? "Bisita" : "Assistant"}: ${m.text}`).join("\n");

    const prompt = `${SYSTEM_PROMPT}${context}

KASAYSAYAN SA PAKIGISTORYA:
${history}

Bisita: ${userMsg}

Assistant (tubaga sa Bisaya):`;

    const reply = await base44.integrations.Core.InvokeLLM({ prompt });

    setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    setLoading(false);

    // Save to chat history
    base44.entities.ChatHistory.create({
      session_id: SESSION_ID,
      question: userMsg,
      answer: reply,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent.substring(0, 100)
    }).catch(() => {});
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        {...dragProps}
        style={{ ...dragProps.style, ...positionStyle }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Open Chat"
      >
        <MessageCircle className="w-6 h-6" />
        <GripVertical className="absolute -top-1 -left-1 w-3 h-3 text-white/50" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col border border-border overflow-hidden transition-all ${minimized ? "h-14" : "h-[520px]"}`}
      style={positionStyle}
    >
      {/* Header */}
      <div
        {...dragProps}
        className="bg-primary text-white px-4 py-3 flex items-center justify-between shrink-0"
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-3 h-3 text-white/50" />
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">VINCE</p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <p className="text-xs text-white/80">Online ang Virtual Assistant</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={() => setMinimized(!minimized)} className="p-1 rounded hover:bg-white/20"><Minus className="w-4 h-4" /></button>
          <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center mr-2 shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-white text-gray-800 shadow-sm border rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center mr-2 shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border shadow-sm rounded-2xl rounded-bl-sm px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex gap-2 shrink-0">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Isulat ang imong pangutana..."
              className="flex-1 text-sm"
              disabled={loading}
            />
            <Button size="icon" onClick={sendMessage} disabled={loading || !input.trim()} className="shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}