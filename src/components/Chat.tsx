import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TopBar, PrimaryButton, SecondaryButton } from './Shared';

const QUESTIONS = [
  "첫 번째 질문입니다.\n검은색 옷에 집착하나요?",
  "두 번째 질문입니다.\n요즘 멍 때리는 시간이 많아졌나요?",
  "세 번째 질문입니다.\n손발이 오그라 드는 현상을 느끼나요?"
];

export default function Chat({ onNext }: { onNext: () => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [messages, setMessages] = useState([
    { sender: 'inspector', text: "긴장하지 마세요. 이 검사는 본인의 중2력을 측정하고,\n자신의 능력치를 평가받는 테스트입니다." },
    { sender: 'doctor', text: QUESTIONS[0] }
  ]);
  const [isFinished, setIsFinished] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAnswer = (ans: string) => {
    const newMsgs = [...messages, { sender: 'user', text: ans }];
    setMessages(newMsgs);

    setTimeout(() => {
      if (qIndex < QUESTIONS.length - 1) {
        setMessages(m => [...m, { sender: 'doctor', text: QUESTIONS[qIndex + 1] }]);
        setQIndex(qIndex + 1);
      } else {
        setMessages(m => [...m, { sender: 'inspector', text: "역시! 이상 반응이 나왔어요. 더 정확한 측정을 위해\n인물 스캔과 뇌파 검사를 시작하겠습니다." }]);
        setIsFinished(true);
      }
    }, 600);
  };

  return (
    <div className="h-full flex flex-col flex-grow overflow-hidden bg-surface">
      <TopBar title="DIAGNOSTIC PROTOCOL" currentStep={1} />
      
      <div className="w-full max-w-2xl mx-auto px-6 py-4 z-10 bg-surface">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Diagnostic Progress</span>
          <span className="text-[10px] text-primary font-bold">{qIndex + 1} / 3</span>
        </div>
        <div className="w-full h-1 bg-gray-300">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((qIndex + 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 max-w-2xl mx-auto w-full relative">
        <div className="absolute left-[43px] top-0 bottom-0 w-px bg-outline hidden md:block z-0 opacity-50"></div>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 md:gap-4 mt-6 relative z-10 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender !== 'user' && (
                <div className="w-10 h-10 rounded-full border border-outline bg-white overflow-hidden shrink-0 flex items-center justify-center brutal-shadow z-10">
                  <span className="material-symbols-outlined text-secondary text-xl">
                    {msg.sender === 'inspector' ? 'local_police' : 'psychology'}
                  </span>
                </div>
              )}
              <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.sender !== 'user' && (
                  <span className="text-[10px] text-gray-500 font-bold mb-1 ml-1">
                    {msg.sender === 'inspector' ? 'Senior Inspector' : 'Doctor'}
                  </span>
                )}
                <div className={`p-4 border border-outline brutal-shadow text-sm md:text-base leading-relaxed font-bold whitespace-pre-line ${msg.sender === 'user' ? 'bg-primary text-white rounded-t-xl rounded-bl-xl' : 'bg-white text-secondary rounded-b-xl rounded-tr-xl'}`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="bg-white border-t border-outline p-4 pb-8 w-full mt-auto z-20">
        <div className="max-w-2xl mx-auto">
          {!isFinished ? (
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => handleAnswer("네")} className="bg-white hover:bg-primary hover:text-white active:bg-primary active:text-white text-secondary font-bold py-3 px-4 uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,81,0,0.8)] active:scale-95 flex items-center justify-center gap-2 rounded-2xl border border-outline hover:border-transparent text-base md:text-lg">네</button>
              <button onClick={() => handleAnswer("조금요")} className="bg-white hover:bg-primary hover:text-white active:bg-primary active:text-white text-secondary font-bold py-3 px-4 uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,81,0,0.8)] active:scale-95 flex items-center justify-center gap-2 rounded-2xl border border-outline hover:border-transparent text-base md:text-lg">조금요</button>
              <button onClick={() => handleAnswer("아니요")} className="bg-white hover:bg-primary hover:text-white active:bg-primary active:text-white text-secondary font-bold py-3 px-4 uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,81,0,0.8)] active:scale-95 flex items-center justify-center gap-2 rounded-2xl border border-outline hover:border-transparent text-base md:text-lg">아니요</button>
            </div>
          ) : (
            <PrimaryButton onClick={onNext} className="w-full">
              <span className="material-symbols-outlined">photo_camera</span> 전투력 측정
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}
