const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { AnimatePresence, motion } from 'motion/react';");

const appStart = code.indexOf('export default function App() {') + 31;
const toastState = `
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const handleToast = (e: any) => {
      setToastMessage(e.detail);
      setTimeout(() => setToastMessage(null), 3000);
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);
`;
code = code.substring(0, appStart) + toastState + code.substring(appStart);

const toastRender = `
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
`;
code = code.replace('      </div>\n    </div>', toastRender + '    </div>');

fs.writeFileSync('src/App.tsx', code);
