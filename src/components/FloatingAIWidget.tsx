import { useState } from 'react';
import { Bot, X, Sparkles, Send, MessageSquare } from 'lucide-react';

export default function FloatingAIWidget({ credits = 0, leadsCount = 0 }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: `Hi there! 👋 I'm Nexus, your AI Assistant. How can I help you extract better leads today?` }
    ]);
    const [input, setInput] = useState('');

    const getDynamicAdvice = () => {
        if (leadsCount === 0) return "💡 Tip: I notice you haven't extracted any leads yet! Try searching for roles like 'VP of Marketing' or 'CTO' in your target city to get started.";
        if (credits < 10) return "💡 Tip: Your credits are running low. Make sure to claim your Daily Reward on the Rewards page to keep building your pipeline!";
        return "💡 Tip: You've got leads in your pipeline! Try moving them through your Kanban board and using the AI-generated Icebreakers to start conversations today.";
    };

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const newMsgs = [...messages, { role: 'user', text: input }];
        setMessages(newMsgs);
        setInput('');

        // Simulate AI thinking and responding contextually
        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            let response = "I'm currently a specialized prototype specifically designed to help you navigate this Lead Generation Command Center. Try asking me for advice on your pipeline!";

            if (lowerInput.includes('help') || lowerInput.includes('advice') || lowerInput.includes('what to do')) {
                response = getDynamicAdvice();
            } else if (lowerInput.includes('credit') || lowerInput.includes('cost')) {
                response = "Extracting a batch of leads in Bulk Search is FREE! 🚀 You only pay 1 credit when you click 'Unlock' on a specific prospect to reveal their email, verify it, and generate AI icebreakers.";
            } else if (lowerInput.includes('bounc')) {
                response = "Don't worry! If an email bounces during our deep verification process, your 1 credit is automatically refunded to your balance. You only pay for valid data.";
            } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                response = "Hello! Ready to crush your sales quota? Let me know if you need help running your first search.";
            }

            setMessages([...newMsgs, { role: 'ai', text: response }]);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">

            {/* Expanded Chat Window */}
            {isOpen && (
                <div className="bg-slate-900 border border-indigo-500/30 w-80 sm:w-96 h-[500px] mb-4 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto origin-bottom-right transition-all animate-in fade-in zoom-in duration-200">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center blur-backdrop">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6 text-white" />
                            <h3 className="text-white font-bold leading-none">Nexus AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-slate-800 text-slate-200 border border-white/5 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Initial Suggestion Chips */}
                    {messages.length === 1 && (
                        <div className="p-3 bg-slate-950/50 flex gap-2 overflow-x-auto border-t border-white/5 no-scrollbar">
                            <button onClick={() => setInput('I need some advice')} className="flex-shrink-0 text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-slate-300 transition-colors whitespace-nowrap">
                                💡 Advice on What to Do Next
                            </button>
                            <button onClick={() => setInput('How do credits work?')} className="flex-shrink-0 text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-slate-300 transition-colors whitespace-nowrap">
                                💰 How Credits Work
                            </button>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900 border-t border-white/10">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Ask Nexus..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                className="w-full bg-black/50 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center p-4 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all transform hover:scale-105 pointer-events-auto ${isOpen ? 'bg-slate-800 text-slate-400 rotate-90 scale-90' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6 -rotate-90 transition-transform" /> : <MessageSquare className="w-6 h-6" />}

                {/* Ping animation when closed */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-slate-900"></span>
                    </span>
                )}
            </button>
        </div>
    );
}
