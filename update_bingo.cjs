const fs = require('fs');
let code = fs.readFileSync('src/components/Bingo.tsx', 'utf8');

const inputHtml = `        <div className="w-full max-w-md mx-auto mb-2 flex flex-col items-center">
          <label className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">대상자 성명 입력 (필수)</label>
          <div className="relative w-full flex justify-center">
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              className="w-full max-w-[200px] bg-white border-2 border-secondary brutal-shadow px-2 py-2 text-center text-lg font-black text-secondary outline-none placeholder:text-transparent focus:bg-gray-50 transition-colors"
              autoFocus
            />
            {userName.length === 0 && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary animate-pulse pointer-events-none"></span>
            )}
          </div>
        </div>`;

code = code.replace(inputHtml, '');
code = code.replace(
  '        <PrimaryButton onClick={onNext} disabled={userName.trim() === ""} className="w-full max-w-md mx-auto mt-4 text-sm md:text-base">',
  `        <div className="w-full max-w-md mx-auto mt-4 flex flex-col items-center gap-4">
          <div className="w-full flex flex-col items-center">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">이름따위 (안남기겠지만)</label>
            <div className="relative w-full flex justify-center">
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="w-full max-w-[200px] bg-white border-2 border-secondary brutal-shadow px-2 py-2 text-center text-lg font-black text-secondary outline-none placeholder:text-transparent focus:bg-gray-50 transition-colors"
              />
              {userName.length === 0 && (
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary animate-pulse pointer-events-none"></span>
              )}
            </div>
          </div>
          <PrimaryButton onClick={onNext} disabled={userName.trim() === ""} className="w-full text-sm md:text-base">`
);
code = code.replace('        </PrimaryButton>', '          </PrimaryButton>\n        </div>');

fs.writeFileSync('src/components/Bingo.tsx', code);
