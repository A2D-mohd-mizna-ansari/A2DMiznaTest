import { useState, useEffect } from "react";

const TruecallerVerify = () => {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);

  // Helper to add logs
  const addLog = (msg) => {
    setLogs((prev) => [...prev, msg]);
  };

  useEffect(() => {
    // Override console.log, warn, error to capture logs in our state

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

    // Clean up override on unmount
    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
  const partnerName = "MiznaTest";
  const privacyUrl = "https://a2-d-mizna-test.vercel.app/privacy";
  const termsUrl = "https://a2-d-mizna-test.vercel.app/terms";
  const callbackUrl = "https://a2dmiznatest.onrender.com/truecaller/callback";
  const requestNonce = "req_" + Date.now();

  const handleVerifyClick = () => {
    console.log("Starting Truecaller verification...");
    setStatus("Starting Truecaller verification...");

    const truecallerDeepLink =
      `truecallersdk://truesdk/web_verify?` +
      `type=btmsheet` +
      `&requestNonce=${encodeURIComponent(requestNonce)}` +
      `&partnerKey=${encodeURIComponent(partnerKey)}` +
      `&partnerName=${encodeURIComponent(partnerName)}` +
      `&lang=en` +
      `&privacyUrl=${encodeURIComponent(privacyUrl)}` +
      `&termsUrl=${encodeURIComponent(termsUrl)}` +
      `&loginPrefix=Verify%20with%20Truecaller` +
      `&ctaPrefix=Continue%20with%20Truecaller` +
      `&ctaColor=%231e88e5` +
      `&ctaTextColor=%23ffffff` +
      `&btnShape=round` +
      `&skipOption=Use%20another%20method` +
      `&ttl=60000`;

    let fallbackTriggered = false;

    const cancelFallback = () => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        clearTimeout(fallbackTimer);
        console.log("Truecaller app opened. Please complete verification.");
        setStatus("Truecaller app opened. Please complete verification.");
      }
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        console.log("Document hidden, assuming Truecaller opened.");
        cancelFallback();
      }
    });

    window.addEventListener("blur", () => {
      console.log("Window lost focus, assuming Truecaller opened.");
      cancelFallback();
    });
    window.addEventListener("pagehide", () => {
      console.log("Page hide event, assuming Truecaller opened.");
      cancelFallback();
    });

    console.log("Redirecting to Truecaller deep link:", truecallerDeepLink);
    window.location.href = truecallerDeepLink;

    const fallbackTimer = setTimeout(() => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        console.warn("Truecaller app not detected. Redirecting to manual verification...");
        setStatus("Truecaller app not detected. Redirecting to manual verification...");
        window.location.href = callbackUrl + "?fallback=true";
      }
    }, 3000);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Verify with Truecaller</h1>
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
      <div style={{ marginTop: "1.5rem", fontWeight: "bold" }}>{status}</div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          height: "200px",
          width: "100%",
          maxWidth: "400px",
          overflowY: "scroll",
          backgroundColor: "#222",
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
      </div>
    </div>
  );
};

export default TruecallerVerify;
