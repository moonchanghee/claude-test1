import { useEffect, useRef } from "react";

declare global {
  interface Window {
    naver?: any;
  }
}

function loadNaverMaps(clientId: string) {
  if (window.naver?.maps) return Promise.resolve();

  const loadScript = (paramName: "ncpKeyId" | "ncpClientId") =>
    new Promise<void>((resolve, reject) => {
      const oldScript = document.getElementById("naver-maps-sdk");
      if (oldScript) oldScript.remove();

      const waitUntilReady = () => {
        const startedAt = Date.now();
        const maxWaitMs = 10000;
        const timer = window.setInterval(() => {
          if (window.naver?.maps) {
            window.clearInterval(timer);
            resolve();
            return;
          }

          if (Date.now() - startedAt > maxWaitMs) {
            window.clearInterval(timer);
            reject(new Error("네이버 지도 SDK 초기화 실패"));
          }
        }, 50);
      };

      const script = document.createElement("script");
      script.id = "naver-maps-sdk";
      script.async = true;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?${paramName}=${clientId}`;
      script.onload = () => waitUntilReady();
      script.onerror = () => reject(new Error("네이버 지도 SDK 로딩 실패"));
      document.head.appendChild(script);
    });

  return loadScript("ncpKeyId").catch(() => loadScript("ncpClientId"));
}

function ensureMarkerStyle() {
  if (document.getElementById("custom-marker-style")) return;

  const style = document.createElement("style");
  style.id = "custom-marker-style";
  style.textContent = `
    .customMarker {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      justify-content: center;
      min-width: 96px;
      height: 42px;
      padding: 0 14px;
      border-radius: 999px;
      background: #53eb22;
      border: 5px solid #ffffff;
      transform: translate(-50%, -100%);
      box-sizing: border-box;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2);
    }

    .customMarker::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -14px;
      transform: translateX(-50%);
      border: 10px solid transparent;
      border-top-color: #53eb22;
      filter: drop-shadow(0 2px 2px rgba(15, 23, 42, 0.12));
    }

    .customMarkerLabel {
      font-size: 14px;
      line-height: 1;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export default function App() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID?.trim().replace(/^['"]|['"]$/g, "");

  useEffect(() => {
    if (!clientId || !mapContainerRef.current) return;

    let cancelled = false;
    const markerData = [
      {
        id: 1,
        name: "서울 동작구 남부순환로267길 24-1",
        label: "홍맹맹",
        lat: 37.478239,
        lng: 126.975151,
      },
    ];

    loadNaverMaps(clientId)
      .then(() => {
        if (cancelled || !mapContainerRef.current || !window.naver?.maps) return;

        ensureMarkerStyle();

        mapRef.current = new window.naver.maps.Map(mapContainerRef.current, {
          center: new window.naver.maps.LatLng(markerData[0].lat, markerData[0].lng),
          zoom: 16,
          minZoom: 7,
          maxZoom: 19,
          zoomControl: true,
        });

        markersRef.current = markerData.map((item) => {
          return new window.naver.maps.Marker({
            map: mapRef.current,
            position: new window.naver.maps.LatLng(item.lat, item.lng),
            title: item.name,
            icon: {
              content: `<div class="customMarker"><span class="customMarkerLabel">${escapeHtml(item.label)}</span></div>`,
              size: new window.naver.maps.Size(120, 56),
              anchor: new window.naver.maps.Point(60, 56),
            },
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [clientId]);

  if (!clientId) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", fontWeight: 600 }}>
        `VITE_NAVER_CLIENT_ID`가 비어 있습니다. `.env`에 값을 넣어주세요.
      </div>
    );
  }

  return <div ref={mapContainerRef} style={{ width: "100vw", height: "100vh" }} />;
}
