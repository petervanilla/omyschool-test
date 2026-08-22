export const TopBar = ({ title, currentStep = 1, totalSteps = 5 }: { title: string, currentStep?: number, totalSteps?: number }) => (
  <header className="bg-surface top-0 sticky border-b border-outline w-full flex flex-col items-center justify-center px-4 py-3 z-50">
    <span className="font-black text-xl tracking-tighter uppercase mb-1">{title}</span>
    <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-500">
      <span className="mr-1">PROGRESS</span>
      {[...Array(totalSteps)].map((_, i) => (
        <div key={i} className="flex items-center">
          <span className={`w-5 h-5 flex items-center justify-center rounded-full border ${i + 1 === currentStep ? 'bg-primary text-white border-primary' : i + 1 < currentStep ? 'bg-gray-300 text-white border-gray-300' : 'bg-transparent text-gray-400 border-gray-300'}`}>
            {i + 1}
          </span>
          {i < totalSteps - 1 && <span className="w-2 h-px bg-gray-300 mx-1"></span>}
        </div>
      ))}
    </div>
  </header>
);

/** 신분증 ↔ 수료증 전환 탭 */
export const DocTabs = ({
  active,
  onSelect,
}: {
  active: 'license' | 'certificate';
  onSelect: (t: 'license' | 'certificate') => void;
}) => (
  <div className="shrink-0 w-full bg-surface border-b border-outline px-4 py-2.5 z-30">
    <div className="max-w-[280px] mx-auto grid grid-cols-2 border border-secondary rounded-xl overflow-hidden bg-white">
      {([
        ['license', '신분증', 'badge'],
        ['certificate', '수료증', 'workspace_premium'],
      ] as const).map(([key, label, icon]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-black tracking-wider transition-colors ${
            active === key
              ? 'bg-secondary text-white'
              : 'bg-white text-secondary hover:bg-gray-100'
          }`}
        >
          <span className="material-symbols-outlined text-base">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  </div>
);

export const PrimaryButton = ({ children, onClick, className = "", disabled = false }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`bg-primary text-white font-bold py-3 px-4 uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,81,0,0.8)] active:scale-95 flex items-center justify-center gap-2 rounded-2xl border border-transparent hover:border-orange-300 text-base md:text-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, onClick, className = "", disabled = false }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`bg-white text-secondary font-bold py-3 px-4 uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] active:scale-95 flex items-center justify-center gap-2 rounded-2xl border border-outline hover:border-gray-400 text-base md:text-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);
