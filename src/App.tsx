import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Home from './components/Home';
import Chat from './components/Chat';
import Camera from './components/Camera';
import Bingo from './components/Bingo';
import Loading from './components/Loading';
import Report from './components/Report';
import License from './components/License';
import Certificate from './components/Certificate';
import { diagnose, type Answer, type Diagnosis } from './utils/scoring';

export enum Step {
  HOME, CHAT, CAMERA, BINGO, LOADING, REPORT, LICENSE, CERTIFICATE
}

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleToast = (e: any) => {
      setToastMessage(e.detail);
      setTimeout(() => setToastMessage(null), 3000);
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const [step, setStep] = useState<Step>(Step.HOME);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  // 실제 측정 데이터
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [bingoSetIndex, setBingoSetIndex] = useState<number>(0);
  const [bingoSelected, setBingoSelected] = useState<number[]>([]);
  const [result, setResult] = useState<Diagnosis | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const nextStep = (next: Step) => {
    window.scrollTo(0, 0);
    setStep(next);
  };

  const restart = () => {
    setPhoto(null);
    setAnswers([]);
    setBingoSelected([]);
    setResult(null);
    nextStep(Step.HOME);
  };

  return (
    <div className="h-[100dvh] font-sans text-secondary bg-gray-100 flex justify-center dark:bg-[#0a0a0a] overflow-hidden">
      <div className="w-full max-w-[430px] h-full bg-surface relative shadow-2xl overflow-hidden flex flex-col">

        {step === Step.HOME && <Home onNext={() => nextStep(Step.CHAT)} />}

        {step === Step.CHAT && (
          <Chat
            onNext={(collected) => {
              setAnswers(collected);
              nextStep(Step.CAMERA);
            }}
          />
        )}

        {step === Step.CAMERA && <Camera onNext={() => nextStep(Step.BINGO)} setPhoto={setPhoto} />}

        {step === Step.BINGO && (
          <Bingo
            onNext={(setIndex, selected) => {
              setBingoSetIndex(setIndex);
              setBingoSelected(selected);
              nextStep(Step.LOADING);
            }}
            userName={userName}
            setUserName={setUserName}
          />
        )}

        {step === Step.LOADING && (
          <Loading
            onNext={() => {
              setResult(diagnose({ userName, answers, bingoSetIndex, bingoSelected }));
              nextStep(Step.REPORT);
            }}
          />
        )}

        {step === Step.REPORT && result && (
          <Report onNext={() => nextStep(Step.LICENSE)} photo={photo} userName={userName} result={result} />
        )}

        {step === Step.LICENSE && result && (
          <License onNext={() => nextStep(Step.CERTIFICATE)} photo={photo} userName={userName} result={result} />
        )}

        {step === Step.CERTIFICATE && result && (
          <Certificate onRestart={restart} photo={photo} userName={userName} result={result} />
        )}

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full text-xs md:text-sm font-bold shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-[100] whitespace-nowrap flex items-center gap-2 border border-white/10"
            >
              <span className="material-symbols-outlined text-primary text-base">notifications</span>
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
