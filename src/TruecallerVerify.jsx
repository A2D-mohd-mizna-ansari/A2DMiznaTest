import { useState, useRef } from "react";

const TruecallerVerify = () => {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f"; // YOUR PARTNER KEY
  const partnerName = "Test"; // Name shown in Truecaller UI
  const privacyUrl = "https://a2-d-mizna-test.vercel.app/privacy";
  const termsUrl = "https://a2-d-mizna-test.vercel.app/terms";
  const redirectUri = "https://a2-d-mizna-test.vercel.app/truecaller/callback"; // Must be exact and HTTPS

  const requestNonce = useRef("req_" + Date.now()); // generate once per session

  const addLog = (msg) => {
    const logEntry = `${new Date().toLocaleTimeString()} → ${msg}`;
    setLogs((prev) => [...prev, logEntry]);
    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 10);
  };

  const handleVerifyClick = () => {
    const nonce = requestNonce.current;
    setStatus("Attempting Truecaller verification...");
    addLog(`🔑 Nonce generated: ${nonce}`);

    const deepLink = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${encodeURIComponent(
      nonce
    )}&partnerKey=${encodeURIComponent(partnerKey)}&partnerName=${encodeURIComponent(
      partnerName
    )}&lang=en&privacyUrl=${encodeURIComponent(
      privacyUrl
    )}&termsUrl=${encodeURIComponent(
      termsUrl
    )}&loginPrefix=Verify%20with%20Truecaller&ctaPrefix=Continue%20with%20Truecaller&ctaColor=%231e88e5&ctaTextColor=%23ffffff&btnShape=round&skipOption=Use%20another%20method&ttl=60000`;

    const fallbackWebUrl = `https://api4.truecaller.com/v1/auth?requestNonce=${encodeURIComponent(
      nonce
    )}&partnerKey=${encodeURIComponent(
      partnerKey
    )}&redirectUri=${encodeURIComponent(redirectUri)}`;

    // Try opening Truecaller app
    window.location.href = deepLink;

    // Fallback after 2 seconds if app not opened
    setTimeout(() => {
      addLog("⚠️ App likely not installed, switching to web fallback.");
      setStatus("Fallback: Opening Truecaller Web UI...");
      window.location.href = fallbackWebUrl;
    }, 2000);
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
