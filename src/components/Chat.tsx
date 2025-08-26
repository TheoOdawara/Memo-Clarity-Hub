import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, ArrowLeft } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { ChatMessage, EscalationForm } from '@/types/chat';

const Chat: React.FC = () => {
  const { chatHistory, addChatMessage } = useAppContext();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEscalationForm, setShowEscalationForm] = useState(false);
  const [escalationForm, setEscalationForm] = useState<EscalationForm>({
    name: '',
    email: '',
    description: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (chatHistory.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: "Olá! Sou o Dr. IA Memo, seu assistente virtual. Como posso ajudar você hoje?",
        sender: 'bot',
        timestamp: Date.now()
      };
      addChatMessage(welcomeMessage);
    }
  }, []);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Sensitive keywords that trigger human escalation
    const sensitiveKeywords = ['entrega', 'compra', 'médico', 'prescrição', 'receita', 'efeito colateral'];
    if (sensitiveKeywords.some(keyword => lowerMessage.includes(keyword))) {
      setShowEscalationForm(true);
      return "Entendo que você precisa de ajuda especializada. Vou conectá-lo com nossa equipe de suporte humano. Por favor, preencha o formulário abaixo.";
    }

    // Dosage and usage questions
    if (lowerMessage.includes('como tomar') || lowerMessage.includes('dose') || lowerMessage.includes('quantidade')) {
      return "Para a dosagem correta, siga sempre as instruções do rótulo ou as orientações do seu profissional de saúde. Geralmente é recomendado tomar com água, de preferência no mesmo horário todos os dias.";
    }

    if (lowerMessage.includes('esqueci') || lowerMessage.includes('perdi')) {
      return "Se você esqueceu de tomar uma dose, tome assim que lembrar, exceto se já estiver próximo do horário da próxima dose. Nunca tome dose dupla para compensar.";
    }

    // Sleep tips
    if (lowerMessage.includes('sono') || lowerMessage.includes('dormir')) {
      return "Para melhorar o sono: mantenha horários regulares, evite telas 1h antes de dormir, crie um ambiente escuro e fresco. O check-in diário também ajuda a criar uma rotina saudável!";
    }

    // Focus and memory tips
    if (lowerMessage.includes('foco') || lowerMessage.includes('concentração')) {
      return "Para melhorar o foco: faça pausas regulares, pratique mindfulness, mantenha-se hidratado. Os jogos cognitivos do app são ótimos para treinar a concentração!";
    }

    if (lowerMessage.includes('memória') || lowerMessage.includes('lembrar')) {
      return "Para fortalecer a memória: pratique exercícios mentais, tenha uma boa qualidade de sono, mantenha-se ativo fisicamente. Continue jogando nossos jogos de memória para melhores resultados!";
    }

    // App usage
    if (lowerMessage.includes('app') || lowerMessage.includes('aplicativo') || lowerMessage.includes('como usar')) {
      return "No app você pode: fazer check-in diário, jogar exercícios cognitivos, ouvir frequências, participar dos rankings e sorteios. Cada atividade contribui para seu Score de Cognição!";
    }

    // Default response
    return "Obrigado por sua pergunta! Posso ajudar com dicas sobre o produto, sono, foco e memória. Para questões mais específicas, posso conectá-lo com nossa equipe especializada.";
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    addChatMessage(userMessage);
    setMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage.content);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: botResponse,
        sender: 'bot',
        timestamp: Date.now()
      };
      addChatMessage(botMessage);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleEscalationSubmit = () => {
    if (!escalationForm.name || !escalationForm.email || !escalationForm.description) {
      return;
    }

    const escalationMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      content: `Obrigado, ${escalationForm.name}! Sua solicitação foi enviada para nossa equipe de suporte. Você receberá uma resposta em até 24 horas no email ${escalationForm.email}.`,
      sender: 'bot',
      timestamp: Date.now(),
      type: 'escalation'
    };

    addChatMessage(escalationMessage);
    setShowEscalationForm(false);
    setEscalationForm({ name: '', email: '', description: '' });
  };

  if (showEscalationForm) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEscalationForm(false)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                Suporte Humano
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Preencha os dados abaixo para que nossa equipe possa ajudá-lo melhor:
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome completo</label>
                <Input
                  value={escalationForm.name}
                  onChange={(e) => setEscalationForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={escalationForm.email}
                  onChange={(e) => setEscalationForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Descreva sua dúvida</label>
                <Textarea
                  value={escalationForm.description}
                  onChange={(e) => setEscalationForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Explique detalhadamente sua questão..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleEscalationSubmit}
                className="w-full"
                disabled={!escalationForm.name || !escalationForm.email || !escalationForm.description}
              >
                Enviar Solicitação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-card h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            Dr. IA Memo - Assistente Virtual
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {msg.sender === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={!message.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;