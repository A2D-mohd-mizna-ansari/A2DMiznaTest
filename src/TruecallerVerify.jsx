import { useState, useEffect, useRef } from "react";

const TruecallerVerify = () => {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);
  const requestNonce = useRef("req_" + Date.now());
  const fallbackTimer = useRef(null);
  const pollInterval = useRef(null);

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
  const partnerName = "Test";
  const privacyUrl = "https://a2-d-mizna-test.vercel.app/privacy";
  const termsUrl = "https://a2-d-mizna-test.vercel.app/terms";
  const callbackUrl = "https://a2dmiznatest.onrender.com/truecaller/callback";

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} → ${msg}`]);
    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 10);
  };

  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      addLog("LOG: " + args.map(String).join(" "));
      originalLog(...args);
    };
    console.warn = (...args) => {
      addLog("WARN: " + args.map(String).join(" "));
      originalWarn(...args);
    };
    console.error = (...args) => {
      addLog("ERROR: " + args.map(String).join(" "));
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pagehide", onPageHide);
      if (pollInterval.current) clearInterval(pollInterval.current);
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, []);

  const handleVerifyClick = async () => {
    const nonce = requestNonce.current;
    setStatus("Starting Truecaller verification...");
    addLog(`🔑 Nonce: ${nonce}`);

    const deepLink = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${encodeURIComponent(
      nonce
    )}&partnerKey=${encodeURIComponent(partnerKey)}&partnerName=${encodeURIComponent(
      partnerName
    )}&lang=en&privacyUrl=${encodeURIComponent(
      privacyUrl
    )}&termsUrl=${encodeURIComponent(
      termsUrl
    )}&loginPrefix=Verify%20with%20Truecaller&ctaPrefix=Continue%20with%20Truecaller&ctaColor=%231e88e5&ctaTextColor=%23ffffff&btnShape=round&skipOption=Use%20another%20method&ttl=60000`;

    let fallbackTriggered = false;

    const startPolling = () => {
      setStatus("Truecaller app opened. Polling...");
      let attempts = 0;

      pollInterval.current = setInterval(async () => {
        attempts++;
        addLog(`📡 Poll attempt #${attempts}`);

        try {
          const res = await fetch(
            `https://a2dmiznatest.onrender.com/verify-status?nonce=${nonce}`
          );
          const result = await res.json();

          if (result.verified) {
            clearInterval(pollInterval.current);
            setStatus("✅ Verified!");
            addLog("✅ Verified data: " + JSON.stringify(result.data));
          } else {
            addLog("⏳ Not verified yet...");
            if (attempts >= 10) {
              clearInterval(pollInterval.current);
              setStatus("❌ Timeout. Try again.");
            }
          }
        } catch (err) {
          clearInterval(pollInterval.current);
          setStatus("⚠️ Polling error.");
          addLog("❌ Polling error: " + err.message);
        }
      }, 3000);
    };

    const cancelFallback = () => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
        startPolling();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        addLog("📱 Document hidden → app opened.");
        cancelFallback();
      }
    };
    const onBlur = () => {
      addLog("📱 Window blur → app likely opened.");
      cancelFallback();
    };
    const onPageHide = () => {
      addLog("📱 Page hide → assume app switch.");
      cancelFallback();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("pagehide", onPageHide);

    addLog("🚀 Opening Truecaller deep link...");
    window.location.href = deepLink;

    fallbackTimer.current = setTimeout(() => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        addLog("⚠️ App not detected. Redirecting to fallback.");
        setStatus("Redirecting to fallback...");
        window.location.href = callbackUrl + "?fallback=true";
      }
    }, 3000);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>📲 Verify with Truecaller</h1>
      <button
        onClick={handleVerifyClick}
        style={{
          backgroundColor: "#1e88e5",
          color: "white",
          padding: "1rem 2rem",
          fontSize: "1.2rem",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Verify My Number
      </button>
      <div style={{ marginTop: "1rem", fontWeight: "bold" }}>{status}</div>

      <div
        ref={logRef}
        style={{
          marginTop: "2rem",
          padding: "1rem",
          height: "250px",
          width: "100%",
          maxWidth: "400px",
          overflowY: "scroll",
          backgroundColor: "#111",
          color: "#eee",
          fontFamily: "monospace",
          fontSize: "12px",
          borderRadius: "8px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "left",
        }}
      >
        <strong>Debug Logs:</strong>
        <br />
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
        <button
          onClick={() => {
            navigator.clipboard.writeText(logs.join("\n")).then(() => {
              alert("✅ Logs copied to clipboard!");
            });
          }}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          📋 Copy Logs
        </button>
      </div>
    </div>
  );
};

export default TruecallerVerify;
