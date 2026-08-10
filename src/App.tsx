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
  const [grade, setGrade] = useState<string>('S-Class 주인공');
  const [symptom, setSymptom] = useState<string>('과몰입, 흑염룡 각성 대기');
  const [note, setNote] = useState<string>('오른팔 봉인 중 (접근 주의)');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const nextStep = (next: Step) => {
    window.scrollTo(0, 0);
    setStep(next);
  };

  return (
    <div className="h-[100dvh] font-sans text-secondary bg-gray-100 flex justify-center dark:bg-[#0a0a0a] overflow-hidden">
      <div className="w-full max-w-[430px] h-full bg-surface relative shadow-2xl overflow-hidden flex flex-col">

        {step === Step.HOME && <Home onNext={() => nextStep(Step.CHAT)} />}
        {step === Step.CHAT && <Chat onNext={() => nextStep(Step.CAMERA)} />}
        {step === Step.CAMERA && <Camera onNext={() => nextStep(Step.BINGO)} setPhoto={setPhoto} />}
        {step === Step.BINGO && <Bingo onNext={() => nextStep(Step.LOADING)} userName={userName} setUserName={setUserName} />}
        {step === Step.LOADING && <Loading onNext={(analysis) => {
          setGrade(analysis.grade);
          setSymptom(analysis.symptom);
          setNote(analysis.note);
          nextStep(Step.REPORT);
        }} />}
        {step === Step.REPORT && <Report onNext={() => nextStep(Step.LICENSE)} photo={photo} userName={userName} grade={grade} symptom={symptom} note={note} />}
        {step === Step.LICENSE && <License onNext={() => nextStep(Step.CERTIFICATE)} photo={photo} userName={userName} grade={grade} symptom={symptom} note={note} />}
        {step === Step.CERTIFICATE && <Certificate onRestart={() => nextStep(Step.HOME)} photo={photo} userName={userName} grade={grade} symptom={symptom} note={note} />}

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
