const fs = require('fs');
let cameraCode = fs.readFileSync('src/components/Camera.tsx', 'utf8');
cameraCode = cameraCode.replace(
  'setHasPhoto(true);',
  'setHasPhoto(true);\n                        window.dispatchEvent(new CustomEvent("show-toast", { detail: "사진 스캔이 완료되었습니다." }));'
);
cameraCode = cameraCode.replace(
  'const startCamera = async () => {',
  'const startCamera = async () => {\n    window.dispatchEvent(new CustomEvent("show-toast", { detail: "카메라를 준비 중입니다..." }));'
);
fs.writeFileSync('src/components/Camera.tsx', cameraCode);

let reportCode = fs.readFileSync('src/components/Report.tsx', 'utf8');
reportCode = reportCode.replace(
  '<PrimaryButton onClick={onNext} className="w-full max-w-md mx-auto text-base py-3">',
  '<PrimaryButton onClick={() => { window.dispatchEvent(new CustomEvent("show-toast", { detail: "라이선스가 발급되었습니다." })); onNext(); }} className="w-full max-w-md mx-auto text-base py-3">'
);
fs.writeFileSync('src/components/Report.tsx', reportCode);

