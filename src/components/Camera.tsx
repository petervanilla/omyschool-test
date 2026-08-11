import { useState, useRef, useEffect } from 'react';
import { TopBar, PrimaryButton, SecondaryButton } from './Shared';
import { motion, AnimatePresence } from 'motion/react';

export default function Camera({ onNext, setPhoto }: { onNext: () => void, setPhoto: (photo: string) => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    window.dispatchEvent(new CustomEvent("show-toast", { detail: "카메라를 준비 중입니다..." }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraOn(true);
      setHasPhoto(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("카메라 접근 권한이 필요합니다.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreviewUrl(dataUrl);
      setPhoto(dataUrl);
      setHasPhoto(true);
                        window.dispatchEvent(new CustomEvent("show-toast", { detail: "사진 스캔이 완료되었습니다." }));
      setIsCameraOn(false);
      stopCamera();
      
      // Start scanning animation
      setIsScanning(true);
      setTimeout(() => {
        onNext();
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden bg-surface flex flex-col">
      <TopBar title="DIAGNOSTIC PROTOCOL" currentStep={2} />
      
      <main className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-xl mx-auto relative">
        <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none"></div>

        <div className="text-center mb-8 z-10">
          <h2 className="text-[42px] font-black text-secondary mb-2 tracking-tighter">검사용 촬영</h2>
          <p className="text-gray-500 font-normal text-xl">중2병 뇌파 및 외형 측정</p>
          <div className="w-16 h-px bg-primary mx-auto mt-6"></div>
        </div>

        <div className="relative w-full aspect-[3/4] max-w-[320px] bg-white border border-outline flex items-center justify-center z-10 mb-8 p-4">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary -translate-x-1 -translate-y-1"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary translate-x-1 -translate-y-1"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary -translate-x-1 translate-y-1"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary translate-x-1 translate-y-1"></div>
          
          <div className="relative w-full h-full border-2 border-primary overflow-hidden flex items-center justify-center bg-gray-100">
            {/* Default Placeholder Image */}
            {!isCameraOn && !hasPhoto && (
              <img src="face.png" alt="Face" className="w-full h-full object-cover" />
            )}
            
            {/* Live Camera Video */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''} grayscale contrast-125`}
            />

            {/* Position Guide Overlay */}
            {isCameraOn && !hasPhoto && !isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-[85%] aspect-square rounded-full border-2 border-primary"></div>
                <div className="absolute w-32 h-20 flex flex-col items-center justify-center drop-shadow-md">
                  <span className="material-symbols-outlined text-white text-3xl mb-1">photo_camera</span>
                  <span className="text-[10px] font-bold text-white tracking-widest">FOCUS HERE</span>
                </div>
              </div>
            )}
            
            {/* Captured Photo Canvas */}
            <canvas 
              ref={canvasRef} 
              className="hidden"
            />
            
            {/* Captured Photo Preview */}
            {previewUrl && (
              <img src={previewUrl} alt="Captured" className="w-full h-full object-cover grayscale contrast-125" />
            )}
            
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_#ff5100] z-20"
                />
              )}
            </AnimatePresence>
          </div>
          
          <div className="absolute top-4 left-4 text-[10px] text-gray-500 font-mono font-bold">ISO 400 | f/2.8</div>
          <div className="absolute bottom-4 right-4 text-[10px] text-gray-500 font-mono font-bold">50mm LENS</div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs z-10">
          {!isCameraOn && !hasPhoto ? (
            <>
              <PrimaryButton onClick={startCamera} className="w-full text-sm py-3">
                <span className="material-symbols-outlined text-lg">camera</span> 검사하기
              </PrimaryButton>
              <label className="w-full bg-white text-secondary font-bold py-3 px-4 uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] active:scale-95 flex items-center justify-center gap-2 rounded-2xl border border-outline hover:border-gray-400 text-sm cursor-pointer">
                <span className="material-symbols-outlined text-lg">image</span> 갤러리
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      if (e.target?.result) {
                        const dataUrl = e.target.result as string;
                        setPreviewUrl(dataUrl);
                        setPhoto(dataUrl);
                        setHasPhoto(true);
                        setIsScanning(true);
                        setTimeout(() => onNext(), 3000);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }} />
              </label>
            </>
          ) : (
            <PrimaryButton onClick={takePhoto} className="w-full text-sm py-3" disabled={hasPhoto}>
              <span className="material-symbols-outlined text-lg">camera</span> 촬영하기
            </PrimaryButton>
          )}
        </div>

        {isScanning && (
          <div className="mt-6 text-primary font-mono font-bold text-sm animate-pulse z-10 text-center">
            외형 스캔 중...<br/>주인공 가능성 탐지
          </div>
        )}
      </main>
    </div>
  );
}
