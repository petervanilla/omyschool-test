const fs = require('fs');
let code = fs.readFileSync('src/components/Bingo.tsx', 'utf8');
code = code.replace(
  'export default function Bingo({ onNext }: { onNext: () => void }) {',
  'export default function Bingo({ onNext, userName, setUserName }: { onNext: () => void, userName: string, setUserName: (name: string) => void }) {'
);

const inputHtml = `        <div className="w-full max-w-md mx-auto mb-2 flex flex-col items-center">
          <label className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">대상자 성명 입력 (필수)</label>
          <div className="relative w-full">
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              className="w-full bg-white border-2 border-primary brutal-shadow px-4 py-3 text-center text-lg font-black text-secondary outline-none placeholder:text-gray-300 focus:bg-orange-50 transition-colors"
              placeholder="이름을 입력하세요"
              autoFocus
            />
            {userName.length === 0 && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary animate-pulse pointer-events-none"></span>
            )}
          </div>
        </div>`;

code = code.replace(
  '        <div className="text-center mb-2 z-10 w-full">',
  inputHtml + '\n        <div className="text-center mb-2 z-10 w-full">'
);

fs.writeFileSync('src/components/Bingo.tsx', code);
