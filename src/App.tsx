import { useEffect, useState } from "react";
import { usePwaInstall } from "./usePwaInstall";

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isInStandaloneMode() {
  // iOS: navigator.standalone, 기타: display-mode
  // @ts-expect-error iOS only
  return window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
}

export default function App() {
  const { canInstall, install } = usePwaInstall();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;

    // 첫 방문 2초 후 보여주기 (원하면 조건 더 걸어도 됨)
    const t = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!show || isInStandaloneMode()) return <div>메인 화면</div>;

  return (
    <div>
      <div style={{ position: "fixed", left: 12, right: 12, bottom: 12, padding: 12, borderRadius: 12, background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>홈 화면에 추가해서 앱처럼 써보자!</div>

        {canInstall ? (
          <button onClick={install} style={{ padding: "10px 12px" }}>
            앱 설치하기
          </button>
        ) : isIOS() ? (
          <div style={{ lineHeight: 1.4 }}>
            iPhone은 자동 설치 버튼이 없어.<br />
            아래 순서로 추가해줘 👉 <b>공유</b> → <b>홈 화면에 추가</b>
          </div>
        ) : (
          <div style={{ lineHeight: 1.4 }}>
            브라우저 메뉴에서 <b>“홈 화면에 추가”</b> 또는 <b>“앱 설치”</b>를 선택해줘.
          </div>
        )}

        <button onClick={() => setShow(false)} style={{ marginLeft: 8, padding: "10px 12px" }}>
          닫기
        </button>
      </div>

      <div>메인 화면</div>
    </div>
  );
}
