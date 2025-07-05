import { useRef, useState } from "react";

const TruecallerVerify = () => {
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);
  const requestNonce = useRef("req_" + Date.now());

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
  const redirectUri = "https://a2dmiznatest.onrender.com/truecaller/callback";

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${time} → ${msg}`]);
  };

  const handleVerifyClick = () => {
    const nonce = requestNonce.current;

    const url = `https://api4.truecaller.com/v1/web_verify?requestNonce=${nonce}&partnerKey=${partnerKey}&redirectUri=${encodeURIComponent(redirectUri)}`;

    setStatus("Redirecting to Truecaller...");
    addLog("🔗 Redirecting to: " + url);

    window.location.href = url;
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
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#111",
          color: "#eee",
          fontFamily: "monospace",
          fontSize: "12px",
          maxWidth: "400px",
          margin: "auto",
          borderRadius: "8px",
        }}
      >
        <strong>Logs:</strong>
        <br />
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default TruecallerVerify;
