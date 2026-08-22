import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TopBar, PrimaryButton } from './Shared';
import { QUESTIONS, type Answer } from '../utils/scoring';

type Msg = { sender: 'inspector' | 'doctor' | 'user'; text: string };

const ANSWER_LABELS = ['아니요', '조금요', '네'] as const;

export default function Chat({ onNext }: { onNext: (answers: Answer[]) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [messages, setMessages] = useState<Msg[]>([
    {
      sender: 'inspector',
      text: '국립 중2병 측정 연구소입니다.\n앉으십시오. 오래 걸리지 않습니다.',
    },
    {
      sender: 'inspector',
      text: '본 검사는 총 8문항이며,\n답변은 즉시 오라 센서에 기록됩니다.\n거짓은... 권하지 않습니다.',
    },
    { sender: 'doctor', text: QUESTIONS[0].text },
  ]);
  const [isFinished, setIsFinished] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleAnswer = (value: Answer) => {
    if (isTyping || isFinished) return;

    const q = QUESTIONS[qIndex];
    const nextAnswers = [...answers, value];
    setAnswers(nextAnswers);
    setMessages((m) => [...m, { sender: 'user', text: ANSWER_LABELS[value] }]);
    setIsTyping(true);

    // 감별사 리액션
    setTimeout(() => {
      setMessages((m) => [...m, { sender: 'inspector', text: q.reactions[value] }]);
    }, 450);

    // 다음 문항 or 종료
    setTimeout(() => {
      if (qIndex < QUESTIONS.length - 1) {
        setMessages((m) => [...m, { sender: 'doctor', text: QUESTIONS[qIndex + 1].text }]);
        setQIndex(qIndex + 1);
      } else {
        setMessages((m) => [
          ...m,
          {
            sender: 'inspector',
            text: '문진 종료. 수치가 예상 범위를 벗어났습니다.\n육안 확인이 필요합니다.',
          },
        ]);
        setIsFinished(true);
      }
      setIsTyping(false);
    }, 1150);
  };

  return (
    <div className="h-full flex flex-col flex-grow overflow-hidden bg-surface">
      <TopBar title="DIAGNOSTIC PROTOCOL" currentStep={1} />

      <div className="w-full max-w-2xl mx-auto px-6 py-4 z-10 bg-surface shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            Diagnostic Progress
          </span>
          <span className="text-[10px] text-primary font-bold">
            {Math.min(qIndex + 1, QUESTIONS.length)} / {QUESTIONS.length}
          </span>
        </div>
        <div className="w-full h-1 bg-gray-300">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((qIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 max-w-2xl mx-auto w-full relative">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 md:gap-4 mt-6 relative z-10 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender !== 'user' && (
                <div className="w-10 h-10 rounded-full border border-outline bg-white overflow-hidden shrink-0 flex items-center justify-center brutal-shadow z-10">
                  <span className="material-symbols-outlined text-secondary text-xl">
                    {msg.sender === 'inspector' ? 'local_police' : 'psychology'}
                  </span>
                </div>
              )}
              <div
                className={`flex flex-col max-w-[85%] md:max-w-[75%] ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {msg.sender !== 'user' && (
                  <span className="text-[10px] text-gray-500 font-bold mb-1 ml-1">
                    {msg.sender === 'inspector' ? '주임 감별사 K-9901' : '측정기 · 문항'}
                  </span>
                )}
                <div
                  className={`p-4 border border-outline brutal-shadow text-sm md:text-base leading-relaxed font-bold whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-t-xl rounded-bl-xl'
                      : 'bg-white text-secondary rounded-b-xl rounded-tr-xl'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex gap-3 mt-6">
            <div className="w-10 h-10 rounded-full border border-outline bg-white shrink-0 flex items-center justify-center brutal-shadow">
              <span className="material-symbols-outlined text-secondary text-xl">local_police</span>
            </div>
            <div className="bg-white border border-outline brutal-shadow rounded-b-xl rounded-tr-xl px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="bg-white border-t border-outline p-4 pb-8 w-full mt-auto z-20 shrink-0">
        <div className="max-w-2xl mx-auto">
          {!isFinished ? (
            <div className="grid grid-cols-3 gap-2">
              {([2, 1, 0] as Answer[]).map((v) => (
                <button
                  key={v}
                  onClick={() => handleAnswer(v)}
                  disabled={isTyping}
                  className="bg-white hover:bg-primary hover:text-white active:bg-primary active:text-white text-secondary font-bold py-3 px-2 tracking-wider transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,81,0,0.8)] active:scale-95 flex items-center justify-center rounded-2xl border border-outline hover:border-transparent text-sm md:text-base disabled:opacity-40 disabled:pointer-events-none"
                >
                  {ANSWER_LABELS[v]}
                </button>
              ))}
            </div>
          ) : (
            <PrimaryButton onClick={() => onNext(answers)} className="w-full">
              <span className="material-symbols-outlined">photo_camera</span> 육안 확인 진행
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}
