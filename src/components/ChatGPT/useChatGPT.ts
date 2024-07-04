import { useState, useEffect, useRef } from 'react';
import { ChatGPTProps, ChatMessage, ChatRole } from './interface';

export const useChatGPT = (props: ChatGPTProps) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const currentMessage = useRef<string>('');

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/events');

    eventSource.onmessage = (event) => {
      try {
        const newMessage: ChatMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const onSend = async (message: ChatMessage) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        currentMessage.current = '';
      } else {
        console.error('Error sending message:', await response.text());
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setMessages([]);
  };

  const onStop = () => {
    setDisabled(true);
    // Implement logic to stop the ongoing request if needed
  };

  return {
    loading,
    disabled,
    messages,
    currentMessage,
    onSend,
    onClear,
    onStop,
  };
};