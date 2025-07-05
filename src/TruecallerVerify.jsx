import { useState, useRef } from "react";

const TruecallerVerify = () => {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);
  const requestNonce = useRef("req_" + Date.now());

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
  const partnerName = "Test";
  const privacyUrl = "https://a2-d-mizna-test.vercel.app/privacy";
  const termsUrl = "https://a2-d-mizna-test.vercel.app/terms";

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
      const res = await fetch(
        `https://a2dmiznatest.onrender.com/verify-status?nonce=${encodeURIComponent(nonce)}`
      );
      if (!res.ok) {
        addLog(`❌ Backend responded with status: ${res.status}`);
        setStatus("❌ Verification failed. Please try again.");
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
      addLog("❌ Error fetching verification status: " + err.message);
      setStatus("⚠️ Failed to verify user.");
    }
  };

  const handleVerifyClick = () => {
    const nonce = requestNonce.current;
    setStatus("Redirecting to Truecaller...");
    addLog(`🔑 Nonce generated: ${nonce}`);

    const truecallerURL = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${encodeURIComponent(
      nonce
    )}&partnerKey=${encodeURIComponent(partnerKey)}&partnerName=${encodeURIComponent(
      partnerName
    )}&lang=en&privacyUrl=${encodeURIComponent(
      privacyUrl
    )}&termsUrl=${encodeURIComponent(
      termsUrl
    )}&loginPrefix=Verify%20with%20Truecaller&ctaPrefix=Continue%20with%20Truecaller&ctaColor=%231e88e5&ctaTextColor=%23ffffff&btnShape=round&skipOption=Use%20another%20method&ttl=60000`;

    addLog(`🌐 Opening Truecaller deep link: ${truecallerURL}`);
    window.location.href = truecallerURL;

    // Wait and check backend (user will return to site via redirect)
    setTimeout(() => {
      addLog("⏳ Waiting 5s before checking verification status...");
      checkVerificationStatus(nonce);
    }, 5000);
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
