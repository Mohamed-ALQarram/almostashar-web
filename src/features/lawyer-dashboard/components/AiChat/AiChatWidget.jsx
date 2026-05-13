import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Bot,
    X,
    Send,
    Scale,
    BookOpen,
    ExternalLink,
    AlertTriangle,
    Info,
    Sparkles,
    ChevronLeft,
    MessageSquare,
} from 'lucide-react';
import api from '../../../../services/api/axios';
import './AiChatWidget.css';

/* ───────────────────────────── constants ───────────────────────────── */
const SUGGESTIONS = [
    { text: 'ما هي حقوقي كموظف في القطاع الخاص؟', icon: BookOpen },
    { text: 'كيف أرفع دعوى نفقة؟', icon: Scale },
    { text: 'ما إجراءات تأسيس شركة؟', icon: BookOpen },
    { text: 'ما عقوبة الشيك بدون رصيد؟', icon: Scale },
];

const CHAR_DELAY = 12;         // ms per character for typewriter
const CHUNK_SIZE = 3;         // characters per tick for faster feel

/* ───────────────────────── typewriter hook ─────────────────────────── */
function useTypewriter(text, active) {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!active || !text) {
            setDisplayed(text || '');
            setDone(true);
            return;
        }
        setDisplayed('');
        setDone(false);
        let i = 0;
        const id = setInterval(() => {
            i += CHUNK_SIZE;
            if (i >= text.length) {
                setDisplayed(text);
                setDone(true);
                clearInterval(id);
            } else {
                setDisplayed(text.slice(0, i));
            }
        }, CHAR_DELAY);
        return () => clearInterval(id);
    }, [text, active]);

    return { displayed, done };
}

/* ─────────────────── Thinking indicator component ─────────────────── */
const ThinkingBubble = () => (
    <div className="flex justify-start mb-4 ai-msg-enter" dir="rtl">
        <div className="flex items-start gap-2 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-4 h-4 text-gold" />
            </div>
            <div className="bg-white rounded-2xl rounded-tr-md px-5 py-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 h-5">
                    <span className="ai-thinking-dot" />
                    <span className="ai-thinking-dot" />
                    <span className="ai-thinking-dot" />
                </div>
            </div>
        </div>
    </div>
);

/* ─────────────────── Warning banner component ─────────────────────── */
const WarningBanner = ({ text }) => {
    if (!text) return null;
    return (
        <div className="ai-warning-shimmer flex items-start gap-2 rounded-xl px-3 py-2.5 mb-3 border border-amber-200/60 bg-amber-50/70 text-amber-800 text-xs leading-relaxed" dir="rtl">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
            <span>{text}</span>
        </div>
    );
};

/* ─────────────────── Source card component ─────────────────────────── */
const SourceCard = ({ source }) => (
    <a
        href={source.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="ai-source-card flex items-center gap-2 rounded-xl px-3 py-2 bg-gradient-to-l from-primary/[0.04] to-transparent border border-primary/10 hover:border-primary/25 cursor-pointer group"
        dir="rtl"
    >
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Scale className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-primary truncate">{source.title}</p>
            <p className="text-[10px] text-brand-muted truncate">{source.law_name}</p>
        </div>
        <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
    </a>
);

/* ─────────────────── AI Message with structured answer ────────────── */
const AiMessage = ({ message, isLatest }) => {
    const { answer_parts, sources, warning, answer_mode } = message;

    // Typewriter on the intro text of the latest message
    const { displayed: introText, done: introDone } = useTypewriter(
        answer_parts?.intro || message.final_answer || '',
        isLatest
    );

    // Show bullets sequentially after intro is done
    const [visibleBullets, setVisibleBullets] = useState(isLatest ? 0 : (answer_parts?.bullets?.length || 0));
    const [bulletTexts, setBulletTexts] = useState([]);

    useEffect(() => {
        if (!isLatest || !introDone || !answer_parts?.bullets?.length) return;
        let idx = 0;
        const id = setInterval(() => {
            idx++;
            setVisibleBullets(idx);
            if (idx >= answer_parts.bullets.length) clearInterval(id);
        }, 250);
        return () => clearInterval(id);
    }, [introDone, isLatest, answer_parts?.bullets?.length]);

    // Typewriter for each bullet
    useEffect(() => {
        if (!answer_parts?.bullets) return;
        if (!isLatest) {
            setBulletTexts(answer_parts.bullets);
            return;
        }
        setBulletTexts(prev => {
            const next = [...prev];
            for (let i = 0; i < visibleBullets; i++) {
                next[i] = answer_parts.bullets[i];
            }
            return next;
        });
    }, [visibleBullets, isLatest, answer_parts?.bullets]);

    const allDone = !isLatest || (introDone && visibleBullets >= (answer_parts?.bullets?.length || 0));

    const isGrounded = answer_mode === 'grounded';
    const isInsufficient = answer_mode === 'insufficient';
    const isExternal = answer_mode === 'external_assisted';

    return (
        <div className="flex justify-start mb-4 ai-msg-enter" dir="rtl">
            <div className="flex items-start gap-2 max-w-[90%]">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0 shadow-md mt-0.5">
                    <Bot className="w-4 h-4 text-gold" />
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl rounded-tr-md px-4 py-3 shadow-sm border border-gray-100 space-y-2.5 min-w-0">
                    {/* Mode Badge */}
                    {isGrounded && (
                        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            <Sparkles className="w-3 h-3" />
                            إجابة موثقة
                        </div>
                    )}
                    {isExternal && (
                        <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            <Info className="w-3 h-3" />
                            إجابة عامة
                        </div>
                    )}
                    {isInsufficient && (
                        <div className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            مصادر غير كافية
                        </div>
                    )}

                    {/* Warning */}
                    <WarningBanner text={warning} />

                    {/* Intro */}
                    <p className={`text-[13px] leading-relaxed text-gray-800 ${isLatest && !introDone ? 'ai-typing-cursor' : ''}`}>
                        {isLatest ? introText : (answer_parts?.intro || message.final_answer)}
                    </p>

                    {/* Section Title */}
                    {answer_parts?.section_title && introDone && (
                        <p className="text-[12px] font-bold text-primary mt-1 ai-msg-enter">{answer_parts.section_title}</p>
                    )}

                    {/* Bullets */}
                    {answer_parts?.bullets?.length > 0 && introDone && (
                        <ul className="space-y-1.5 text-[12px] text-gray-700 leading-relaxed pr-1">
                            {answer_parts.bullets.slice(0, isLatest ? visibleBullets : answer_parts.bullets.length).map((b, i) => (
                                <li key={i} className="flex items-start gap-2 ai-msg-enter">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                                    <span>{isLatest && i === visibleBullets - 1 ? (bulletTexts[i] || '') : b}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Legal Basis */}
                    {answer_parts?.legal_basis && allDone && (
                        <div className="flex items-start gap-2 bg-primary/[0.03] rounded-lg px-3 py-2 mt-1 ai-msg-enter">
                            <BookOpen className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] text-primary/80 leading-relaxed">{answer_parts.legal_basis}</p>
                        </div>
                    )}

                    {/* Note */}
                    {answer_parts?.note && allDone && (
                        <div className="flex items-start gap-2 bg-amber-50/60 rounded-lg px-3 py-2 mt-1 border border-amber-100/40 ai-msg-enter">
                            <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] text-amber-700 leading-relaxed">{answer_parts.note}</p>
                        </div>
                    )}

                    {/* Sources */}
                    {sources?.length > 0 && allDone && (
                        <div className="space-y-1.5 mt-1 ai-msg-enter">
                            <p className="text-[10px] font-semibold text-gray-400 tracking-wide">المصادر القانونية</p>
                            {sources.map((src, i) => (
                                <SourceCard key={i} source={src} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─────────────────── User message component ───────────────────────── */
const UserMessage = ({ text }) => (
    <div className="flex justify-end mb-4 ai-msg-enter" dir="rtl">
        <div className="bg-gradient-to-l from-primary to-primary-light text-white rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%] shadow-sm">
            <p className="text-[13px] leading-relaxed">{text}</p>
        </div>
    </div>
);

/* ════════════════════════════════════════════════════════════════════
   Main Widget
   ════════════════════════════════════════════════════════════════════ */
const AiChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);
    const [messages, setMessages] = useState([]); // { role:'user'|'ai', text?, ...apiResponse }
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    /* Auto-scroll */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, loading]);

    /* Focus input when opened */
    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 400);
        }
    }, [open]);

    /* Toggle */
    const handleToggle = useCallback(() => {
        if (open) {
            setClosing(true);
            setTimeout(() => {
                setOpen(false);
                setClosing(false);
            }, 250);
        } else {
            setOpen(true);
        }
    }, [open]);

    /* Send */
    const handleSend = useCallback(async (text) => {
        const query = (text || input).trim();
        if (!query || loading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: query }]);
        setLoading(true);

        try {
            const data = await api.post('/api/legal-ai/chat', { query });
            setMessages(prev => [...prev, { role: 'ai', ...data }]);
        } catch {
            setMessages(prev => [
                ...prev,
                {
                    role: 'ai',
                    answer_mode: 'insufficient',
                    final_answer: 'عذراً، حدث خطأ أثناء معالجة طلبك. حاول مرة أخرى.',
                    warning: null,
                    sources: [],
                    answer_parts: {
                        intro: 'عذراً، حدث خطأ أثناء معالجة طلبك. حاول مرة أخرى.',
                        section_title: null,
                        bullets: [],
                        legal_basis: null,
                        note: null,
                    },
                },
            ]);
        } finally {
            setLoading(false);
        }
    }, [input, loading]);

    /* Keyboard */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    /* Latest AI message index */
    const lastAiIdx = messages.reduce((acc, m, i) => (m.role === 'ai' ? i : acc), -1);

    return (
        <>
            {/* ── Floating Action Button ────────────────────────────── */}
            {!open && (
                <button
                    id="ai-assistant-fab"
                    onClick={handleToggle}
                    className="ai-fab-pulse fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[9998] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-lg shadow-gold/30 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 group"
                    title="المستشار الذكي"
                >
                    <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-primary drop-shadow" />
                </button>
            )}

            {/* ── Chat Window ───────────────────────────────────────── */}
            {open && (
                <div
                    id="ai-chat-window"
                    className={`fixed z-[9999] flex flex-col overflow-hidden shadow-2xl shadow-primary/20 border border-gray-200/60 inset-0 rounded-none sm:inset-auto sm:bottom-6 sm:left-6 sm:w-[400px] sm:max-h-[640px] sm:h-[80vh] sm:rounded-2xl ${closing ? 'ai-chat-window-exit' : 'ai-chat-window-enter'}`}
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-l from-primary via-primary to-primary-light px-4 py-3 flex items-center gap-3" dir="rtl">
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
                            <Bot className="w-5 h-5 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white text-sm font-bold">المستشار الذكي</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[11px] text-white/70">متصل الآن</span>
                            </div>
                        </div>
                        <button
                            onClick={handleToggle}
                            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4 text-white/80" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto ai-chat-scroll bg-[#FAFBFC] px-4 py-4"
                    >
                        {messages.length === 0 && !loading ? (
                            /* Welcome Screen */
                            <div className="flex flex-col items-center text-center pt-4 pb-2" dir="rtl">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4">
                                    <Bot className="w-8 h-8 text-gold" />
                                </div>
                                <h4 className="text-base font-bold text-primary mb-1">مرحباً بك في المستشار الذكي</h4>
                                <p className="text-xs text-gray-400 mb-5 leading-relaxed max-w-[260px]">
                                    مساعدك القانوني المدعوم بالذكاء الاصطناعي
                                </p>

                                {/* Suggestion Cards */}
                                <div className="w-full space-y-2">
                                    {SUGGESTIONS.map((s, i) => {
                                        const Icon = s.icon;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(s.text)}
                                                className="group ai-suggestion-card w-full flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white border border-gray-100 text-right cursor-pointer"
                                                dir="rtl"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-primary/5 group-hover:bg-white/15 flex items-center justify-center flex-shrink-0 transition-colors">
                                                    <Icon className="w-4 h-4 text-primary/60 group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="text-[12px] text-gray-700 group-hover:text-white flex-1 transition-colors">{s.text}</span>
                                                <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-white/70 flex-shrink-0 transition-colors" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, i) =>
                                    msg.role === 'user' ? (
                                        <UserMessage key={i} text={msg.text} />
                                    ) : (
                                        <AiMessage key={i} message={msg} isLatest={i === lastAiIdx} />
                                    )
                                )}
                                {loading && <ThinkingBubble />}
                            </>
                        )}
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-gold/[0.06] px-3 py-1.5 border-t border-gold/10" dir="rtl">
                        <div className="flex items-center gap-1.5 justify-center">
                            <Info className="w-3 h-3 text-gold/60" />
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                المعلومات المقدمة للإرشاد العام فقط ولا تُغني عن استشارة محامٍ متخصص.
                            </p>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="bg-white border-t border-gray-100 px-3 py-3" dir="rtl">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="اكتب سؤالك القانوني..."
                                disabled={loading}
                                className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-300 border border-gray-100 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 outline-none transition-all disabled:opacity-50"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || loading}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center disabled:opacity-30 hover:shadow-md hover:shadow-primary/20 transition-all cursor-pointer disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4 text-gold -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AiChatWidget;
