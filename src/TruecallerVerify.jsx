import { useState, useEffect, useRef } from "react";

const TruecallerVerify = () => {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);
  const requestNonce = useRef("req_" + Date.now());

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} → ${msg}`]);
    setTimeout(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 10);
  };

  useEffect(() => {
    // Console patching for logs (optional)
    const origLog = console.log;
    console.log = (...args) => {
      addLog("LOG: " + args.join(" "));
      origLog(...args);
    };
    return () => {
      console.log = origLog;
    };
  }, []);

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
  const partnerName = "Test";
  const privacyUrl = "https://a2-d-mizna-test.vercel.app/privacy";
  const termsUrl = "https://a2-d-mizna-test.vercel.app/terms";
  const callbackUrl = "https://a2dmiznatest.onrender.com/truecaller/callback";

  const handleVerifyClick = () => {
    const nonce = requestNonce.current;
    setStatus("Starting Truecaller verification...");
    addLog(`🔑 Generated nonce: ${nonce}`);

    // Construct Truecaller deep link (or use SDK method if available)
    const deepLink = `truecallersdk://truesdk/web_verify?` +
      `type=btmsheet&requestNonce=${nonce}` +
      `&partnerKey=${partnerKey}` +
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

    addLog(`🔗 Truecaller deep link: ${deepLink}`);

    // Listen for page visibility to detect if app opened
    let fallbackTriggered = false;
    let pollInterval;

    const startPolling = () => {
      setStatus("Truecaller app opened. Polling verification status...");
      addLog("🔄 Polling started.");

      let attempts = 0;
      pollInterval = setInterval(async () => {
        attempts++;
        try {
          const res = await fetch(`${callbackUrl.replace("/truecaller/callback", "")}/verify-status?nonce=${nonce}`);
          const result = await res.json();
          addLog(`📥 Poll #${attempts}: ${JSON.stringify(result)}`);

          if (result.verified) {
            clearInterval(pollInterval);
            setStatus("✅ Number verified successfully!");
            addLog("✅ Verification success data: " + JSON.stringify(result.data));
          } else if (attempts >= 10) {
            clearInterval(pollInterval);
            setStatus("❌ Verification timed out.");
            addLog("⏰ Polling timeout after 10 attempts.");
          }
        } catch (e) {
          clearInterval(pollInterval);
          setStatus("⚠️ Error while polling verification.");
          addLog("❌ Polling error: " + e.message);
        }
      }, 3000);
    };

    const onVisibilityChange = () => {
      if (document.hidden && !fallbackTriggered) {
        fallbackTriggered = true;
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    // Redirect user to Truecaller app via deep link
    window.location.href = deepLink;

    // Cleanup listener after 30 seconds max
    setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (!fallbackTriggered) {
        setStatus("Redirecting to fallback...");
        addLog("⏳ Fallback triggered — redirecting.");
        window.location.href = callbackUrl + "?fallback=true";
      }
    }, 30000);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem", fontFamily: "Arial" }}>
      <h2>📲 Verify with Truecaller</h2>
      <button
        onClick={handleVerifyClick}
        style={{
          padding: "1rem 2rem",
          backgroundColor: "#1e88e5",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: "1.2rem",
        }}
      >
        Verify My Number
      </button>
      <p>{status}</p>

      <div
        ref={logRef}
        style={{
          marginTop: 20,
          height: 250,
          overflowY: "scroll",
          backgroundColor: "#111",
          color: "#eee",
          fontSize: 12,
          padding: 10,
          borderRadius: 6,
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
      >
        {logs.join("\n")}
      </div>
    </div>
  );
};

export default TruecallerVerify;
