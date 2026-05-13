import { useCallback, useRef } from 'react';
import { getChatHubConnection } from '../signalr/chatHub';

const DEBOUNCE_MS = 1000;

/**
 * Hook for sending typing indicators via SignalR.
 *
 * Usage:
 *   const { emitTyping } = useTypingIndicator(chatId, receiverId);
 *   <input onChange={(e) => { ...; emitTyping(); }} />
 *
 * Sends isTyping=true on each call, then auto-sends false after 1s of inactivity.
 * Also exposes stopTyping() to call on message send.
 */
const useTypingIndicator = (chatId, receiverId) => {
    const timerRef = useRef(null);
    const isTypingRef = useRef(false);

    const send = useCallback(
        (isTyping) => {
            if (!chatId || !receiverId) return;
            const hub = getChatHubConnection();
            if (!hub || hub.state !== 'Connected') return;

            hub.invoke('SendTypingIndicator', {
                chatId,
                receiverId,
                isTyping,
            }).catch((err) => console.warn('[TypingIndicator]', err));
        },
        [chatId, receiverId]
    );

    const emitTyping = useCallback(() => {
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            send(true);
        }

        // Reset debounce timer
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            isTypingRef.current = false;
            send(false);
        }, DEBOUNCE_MS);
    }, [send]);

    const stopTyping = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (isTypingRef.current) {
            isTypingRef.current = false;
            send(false);
        }
    }, [send]);

    return { emitTyping, stopTyping };
};

export default useTypingIndicator;
