import { useState, useRef } from "react";

const TruecallerVerify = () => {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);
  const requestNonce = useRef("req_" + Date.now());

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
  const redirectUri = "https://a2-d-mizna-test.vercel.app/truecaller/callback"; // must be registered
  const backendVerifyUrl = "https://a2dmiznatest.onrender.com/verify-status";

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} → ${msg}`]);
    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 10);
  };

  const checkVerificationStatus = async (nonce) => {
    try {
      addLog("📡 Checking verification status from backend...");
      const res = await fetch(`${backendVerifyUrl}?nonce=${encodeURIComponent(nonce)}`);
      if (!res.ok) {
        addLog(`❌ Backend responded with status: ${res.status}`);
        setStatus("❌ Verification failed.");
        return;
      }

      const data = await res.json();
      if (data.verified) {
        addLog(`✅ User verified: ${JSON.stringify(data.data)}`);
        setStatus("✅ Verified successfully!");
      } else {
        addLog("⏳ Not verified yet. User may have closed the flow.");
        setStatus("❌ Verification not completed.");
      }
    } catch (err) {
      addLog("❌ Error checking status: " + err.message);
      setStatus("⚠️ Failed to verify.");
    }
  };

  const handleVerifyClick = () => {
    const nonce = requestNonce.current;
    setStatus("Opening Truecaller Web UI...");
    addLog(`🔑 Nonce generated: ${nonce}`);

    const truecallerWebUrl = `https://api4.truecaller.com/v1/auth?requestNonce=${encodeURIComponent(
      nonce
    )}&partnerKey=${encodeURIComponent(partnerKey)}&redirectUri=${encodeURIComponent(redirectUri)}`;

    addLog(`🌐 Redirecting to Truecaller Web UI:\n${truecallerWebUrl}`);
    window.location.href = truecallerWebUrl;

    // Optional: check status after a delay (if user comes back to page)
    setTimeout(() => {
      addLog("⏳ Waiting 6s before checking backend status...");
      checkVerificationStatus(nonce);
    }, 6000);
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
          height: "300px",
          width: "100%",
          maxWidth: "450px",
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
