import { useState, useEffect, useRef } from "react";

const TruecallerVerify = () => {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);
  const requestNonce = useRef("req_" + Date.now());
  const pollIntervalRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} → ${msg}`]);
    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 10);
  };

  // Override console to capture logs into UI
  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      addLog("LOG: " + args.join(" "));
      originalLog(...args);
    };
    console.warn = (...args) => {
      addLog("WARN: " + args.join(" "));
      originalWarn(...args);
    };
    console.error = (...args) => {
      addLog("ERROR: " + args.join(" "));
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
  const partnerName = "Test";
  const privacyUrl = "https://a2-d-mizna-test.vercel.app/privacy";
  const termsUrl = "https://a2-d-mizna-test.vercel.app/terms";
  const callbackUrl = "https://a2dmiznatest.onrender.com/truecaller/callback";

  let fallbackTriggered = false;

  // Event handlers for fallback detection
  const cancelFallback = () => {
    if (!fallbackTriggered) {
      fallbackTriggered = true;
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      addLog("⚠️ Fallback canceled, starting polling instead.");
      startPolling();
    }
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      addLog("📱 visibilitychange → Document hidden");
      cancelFallback();
    }
  };
  const onBlur = () => {
    addLog("📱 blur → Window lost focus.");
    cancelFallback();
  };
  const onPageHide = () => {
    addLog("📱 pagehide → Page hidden.");
    cancelFallback();
  };

  const startPolling = () => {
    addLog("🔄 startPolling() initiated");
    setStatus("Truecaller app opened. Starting polling...");
    addLog("ℹ️ Status set: Truecaller app opened. Starting polling...");

    let attempts = 0;
    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      const pollUrl = `https://a2dmiznatest.onrender.com/verify-status?nonce=${requestNonce.current}`;
      addLog(`📡 Polling attempt #${attempts} to ${pollUrl}`);

      try {
        const res = await fetch(pollUrl);
        const result = await res.json();
        addLog("📥 Poll response: " + JSON.stringify(result));

        if (result.verified) {
          clearInterval(pollIntervalRef.current);
          setStatus("✅ Number verified successfully!");
          addLog("✅ Verification successful with data: " + JSON.stringify(result.data));
        } else {
          addLog("❓ Not yet verified.");
          if (attempts >= 10) {
            clearInterval(pollIntervalRef.current);
            setStatus("❌ Timed out. Try again.");
            addLog("🛑 Polling stopped after 10 attempts.");
          }
        }
      } catch (err) {
        clearInterval(pollIntervalRef.current);
        setStatus("⚠️ Error while checking verification.");
        addLog("❌ Polling error: " + err.message);
      }
    }, 3000);
  };

  const callCallbackAPI = async (payload) => {
    addLog("⬆️ Sending POST to callback API: " + callbackUrl);
    addLog("📦 Payload: " + JSON.stringify(payload));

    try {
      const res = await fetch(callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      addLog("✅ Callback API response: " + JSON.stringify(result));
    } catch (err) {
      addLog("❌ Callback API error: " + err.message);
    }
  };

  const handleVerifyClick = () => {
    addLog("🔍 handleVerifyClick initiated");
    const nonce = requestNonce.current;
    addLog(`🔑 Generated nonce: ${nonce}`);

    setStatus("Starting Truecaller verification...");
    addLog("ℹ️ Status set to: Starting Truecaller verification...");

    // Construct Truecaller deep link with parameters
    const deepLink = `truecallersdk://truesdk/web_verify?partner_key=${partnerKey}&partner_name=${encodeURIComponent(
      partnerName
    )}&nonce=${nonce}&privacy_url=${encodeURIComponent(
      privacyUrl
    )}&terms_url=${encodeURIComponent(termsUrl)}&callback_url=${encodeURIComponent(callbackUrl)}`;

    addLog("🔗 Truecaller deep link: " + deepLink);

    // Setup fallback event listeners
    addLog("📎 Adding event listeners for fallback detection");
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("pagehide", onPageHide);

    // Launch Truecaller app
    addLog("🚀 Launching Truecaller via deep link...");
    window.location.href = deepLink;

    // We do NOT have phone number here yet. Truecaller will send callback POST on verification.

    // Setup fallback timer: if app doesn't open in 3 sec, redirect to fallback
    fallbackTimerRef.current = setTimeout(() => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        setStatus("Redirecting to fallback...");
        addLog("⏳ App not opened → Redirecting to fallback URL.");
        window.location.href = callbackUrl + "?fallback=true";
      }
    }, 3000);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>📲 Verify with Truecaller</h1>
      <button
        style={{
          backgroundColor: "#1e88e5",
          color: "white",
          border: "none",
          padding: "1rem 2rem",
          fontSize: "1.2rem",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={handleVerifyClick}
      >
        Verify My Number
      </button>

      <div style={{ marginTop: "1rem", fontWeight: "bold", minHeight: "1.5rem" }}>{status}</div>

      <div
        ref={logRef}
        style={{
          marginTop: "2rem",
          padding: "1rem",
          height: "300px",
          width: "100%",
          maxWidth: "600px",
          overflowY: "scroll",
          backgroundColor: "#111",
          color: "#eee",
          fontFamily: "monospace",
          fontSize: "12px",
          borderRadius: "8px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "left",
          userSelect: "text",
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
