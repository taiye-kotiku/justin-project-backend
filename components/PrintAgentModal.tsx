import React, { useState, useEffect, useRef } from 'react';
import { GeneratedImage, ChatMessage, PrintOrderDetails } from '../types';

interface PrintAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: GeneratedImage[];
    onOrderRequest: (userInput: string) => Promise<{
        agentResponse: string;
        orderDetails?: PrintOrderDetails;
    }>;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="flex items-center justify-center gap-1.5">
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
    </div>
);

const initialMessage: ChatMessage = {
    id: 0,
    sender: 'agent',
    text: `Hi there! I'm Poppy, your personal print assistant. 🐾 I can help you turn your beautiful coloring pages into a real, 32-page book!\n\nTo get started, just tell me three things in your own words:\n1. Which image you'd like for the cover (e.g., 'the first one,' or 'image #5').\n2. What you want the title of your book to be.\n3. The full shipping address.`
};

export const PrintAgentModal: React.FC<PrintAgentModalProps> = ({ isOpen, onClose, images, onOrderRequest }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [orderDetailsToConfirm, setOrderDetailsToConfirm] = useState<PrintOrderDetails | null>(null);
    const [orderComplete, setOrderComplete] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const nextId = useRef(1);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { id: nextId.current++, sender: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);
        setMessages(prev => [...prev, { id: nextId.current++, sender: 'agent', type: 'loading' }]);
        
        const { agentResponse, orderDetails } = await onOrderRequest(userInput);

        // Remove loading indicator
        setMessages(prev => prev.filter(m => m.type !== 'loading'));
        
        if (agentResponse === 'confirmation' && orderDetails) {
            setOrderDetailsToConfirm(orderDetails);
            const confirmationMessage: ChatMessage = {
                id: nextId.current++,
                sender: 'agent',
                type: 'confirmation',
                orderDetails: orderDetails,
            };
            setMessages(prev => [...prev, confirmationMessage]);
        } else {
            const newAgentMessage: ChatMessage = { id: nextId.current++, sender: 'agent', text: agentResponse };
            setMessages(prev => [...prev, newAgentMessage]);
        }
        setIsLoading(false);
    };

    const handleConfirmation = (isConfirmed: boolean) => {
        if (isConfirmed) {
            setMessages(prev => [...prev, { id: nextId.current++, sender: 'user', text: "Yes, that's correct!" }]);
            // Simulate API call
            setTimeout(() => {
                setOrderComplete(true);
                const successMessage: ChatMessage = { id: nextId.current++, sender: 'agent', type: 'success' };
                setMessages(prev => [...prev, successMessage]);
            }, 1500);
        } else {
            setMessages(prev => [...prev, { id: nextId.current++, sender: 'user', text: "No, let me change something." }]);
            setMessages(prev => [...prev, { id: nextId.current++, sender: 'agent', text: "No problem! Just tell me what you'd like to change." }]);
        }
        setOrderDetailsToConfirm(null);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 md:p-4" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="relative bg-white sketch-border sketch-shadow max-w-5xl w-full h-full md:h-[90vh] flex flex-col animate-[slide-up_0.3s_ease-out]" 
                onClick={e => e.stopPropagation()}
            >
                <style>{`
                  @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                  }
                `}</style>
                <header className="flex-shrink-0 p-4 flex justify-between items-center border-b-4 border-slate-800 bg-amber-50">
                    <h2 className="text-2xl font-header text-colored-in">Chat with Poppy the Print Pup</h2>
                    <button onClick={onClose} className="bg-crayon-rose text-white rounded-full p-1 sketch-button interactive-wiggle-hover border-white" aria-label="Close">
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex-grow flex flex-col md:flex-row min-h-0">
                    {/* Chat Area */}
                    <div className="flex-grow flex flex-col p-4 bg-paper-texture">
                        <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'agent' && <div className="w-10 h-10 rounded-full bg-crayon-rose text-white flex items-center justify-center font-bold text-xl flex-shrink-0 mr-3 sketch-shadow-sm">P</div>}
                                    <div className={`max-w-md p-3 rounded-lg sketch-shadow-sm ${msg.sender === 'user' ? 'bg-crayon-sky-light text-slate-800' : 'bg-white text-slate-700'}`}>
                                        {msg.type === 'loading' && <LoadingSpinner />}
                                        {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                                        {msg.type === 'confirmation' && msg.orderDetails && (
                                            <div>
                                                <p className="font-bold mb-2">Okay, let's double-check! 🧐</p>
                                                <ul className="list-none space-y-2 text-sm bg-amber-50/50 p-3 rounded-md sketch-border">
                                                    <li><strong>Cover:</strong> Image #{msg.orderDetails.coverImageNumber}</li>
                                                    <li><strong>Title:</strong> "{msg.orderDetails.bookTitle}"</li>
                                                    <li><strong>Shipping to:</strong> {msg.orderDetails.shippingAddress}</li>
                                                </ul>
                                                <p className="font-bold mt-3">Does that look right?</p>
                                            </div>
                                        )}
                                        {msg.type === 'success' && (
                                            <div>
                                                <p className="font-bold text-emerald-700 text-lg">Success! ✨</p>
                                                <p>Your book is on its way. Your simulated order number is <span className="font-mono bg-emerald-100 px-1 rounded">#DOG-12345</span>.</p>
                                                <p className="mt-2 text-sm">You can now close this window.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {orderDetailsToConfirm && (
                                <div className="flex justify-start">
                                    <div className="w-10 flex-shrink-0 mr-3"></div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleConfirmation(true)} className="sketch-button bg-crayon-emerald px-4 py-2 font-header">Yes, Place Order!</button>
                                        <button onClick={() => handleConfirmation(false)} className="sketch-button bg-white px-4 py-2 font-header">No, change it</button>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <form onSubmit={handleSubmit} className="mt-4 flex-shrink-0 flex items-center gap-3">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type your message..."
                                disabled={isLoading || orderDetailsToConfirm !== null || orderComplete}
                                className="w-full px-4 py-3 bg-white sketch-input focus:ring-2 focus:ring-amber-400 outline-none disabled:bg-slate-100"
                            />
                            <button type="submit" disabled={!userInput.trim() || isLoading || orderDetailsToConfirm !== null || orderComplete} className="bg-crayon-teal p-3 sketch-button interactive-wiggle-hover disabled:bg-slate-300 disabled:cursor-not-allowed">
                                <SendIcon />
                            </button>
                        </form>
                    </div>

                    {/* Image Thumbnails */}
                    <div className="flex-shrink-0 w-full md:w-56 bg-amber-50 p-4 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-slate-400 overflow-y-auto">
                        <h3 className="font-header text-lg text-slate-700 mb-2">Your Pages:</h3>
                        <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative aspect-square group">
                                    <img 
                                        src={`data:${image.mimeType};base64,${image.base64}`} 
                                        alt={`Coloring page thumbnail ${index + 1}`} 
                                        className="w-full h-full object-contain bg-white rounded-sm border-2 border-slate-300"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold text-2xl font-header">#{index + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
