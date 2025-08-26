export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
  type?: 'text' | 'escalation';
}

export interface EscalationForm {
  name: string;
  email: string;
  description: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  showEscalationForm: boolean;
}