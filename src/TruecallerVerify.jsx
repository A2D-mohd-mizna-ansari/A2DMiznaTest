import { useState, useEffect, useRef } from "react";

const TruecallerVerify = () => {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);
  const requestNonce = useRef("req_" + Date.now());

  // Add logs into the debug box
  const addLog = (msg) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} → ${msg}`]);
    // Auto scroll to bottom
    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 10);
  };

  // Intercept console messages to also add them to logs div
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

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
  const partnerName = "Test";
  const privacyUrl = "https://a2-d-mizna-test.vercel.app/privacy";
  const termsUrl = "https://a2-d-mizna-test.vercel.app/terms";
  const callbackUrl = "https://a2dmiznatest.onrender.com/truecaller/callback";

  const handleVerifyClick = () => {
    const nonce = requestNonce.current;
    addLog(`🔑 Generated nonce: ${nonce}`);
    setStatus("Starting Truecaller verification...");

    const deepLink = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${encodeURIComponent(
      nonce
    )}&partnerKey=${encodeURIComponent(partnerKey)}&partnerName=${encodeURIComponent(
      partnerName
    )}&lang=en&privacyUrl=${encodeURIComponent(
      privacyUrl
    )}&termsUrl=${encodeURIComponent(
      termsUrl
    )}&loginPrefix=Verify%20with%20Truecaller&ctaPrefix=Continue%20with%20Truecaller&ctaColor=%231e88e5&ctaTextColor=%23ffffff&btnShape=round&skipOption=Use%20another%20method&ttl=60000`;

    addLog("LOG: Redirecting to Truecaller deep link: " + deepLink);

    let fallbackTriggered = false;

    const cancelFallback = () => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        clearTimeout(fallbackTimer);
        setStatus("Truecaller app opened. Please complete verification.");
        addLog("✅ App opened, starting polling...");

        // Start polling
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          addLog(`📡 Polling attempt #${attempts} for nonce: ${nonce}`);
          try {
            const res = await fetch(
              `https://a2dmiznatest.onrender.com/verify-status?nonce=${nonce}`
            );
            const result = await res.json();
            addLog("Poll response: " + JSON.stringify(result));

            if (result.verified) {
              clearInterval(poll);
              console.log("✅ Verification success:", result.data);
              setStatus("✅ Number verified successfully!");
              addLog("✅ Verification success: " + JSON.stringify(result.data));
            } else {
              addLog("❓ Still not verified.");
              if (attempts >= 10) {
                clearInterval(poll);
                setStatus("❌ Timed out. Try again.");
                addLog("❌ Polling ended after 10 attempts without success.");
              }
            }
          } catch (err) {
            clearInterval(poll);
            console.error("Error during polling:", err);
            setStatus("⚠️ Error while checking verification.");
            addLog("⚠️ Polling error: " + err.message);
          }
        }, 3000);
      }
    };

    // Detect if app was opened by listening to visibility and focus events
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        addLog("📱 visibilitychange → Document hidden, assuming app opened.");
        cancelFallback();
      }
    });
    window.addEventListener("blur", () => {
      addLog("📱 blur → Window lost focus.");
      cancelFallback();
    });
    window.addEventListener("pagehide", () => {
      addLog("📱 pagehide → Page hide event.");
      cancelFallback();
    });

    addLog("🚀 Redirecting to deep link...");
    window.location.href = deepLink;

    const fallbackTimer = setTimeout(() => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        addLog("⚠️ App not detected. Going to fallback.");
        setStatus("Redirecting to fallback...");
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
        <strong>Debug Logs1:</strong>
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
