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

  const addLog = (m) => {
    setLogs((p) => [...p, `${new Date().toLocaleTimeString()} → ${m}`]);
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 10);
  };

  const handleVerifyClick = () => {
    const nonce = requestNonce.current;
    setStatus("Launching Truecaller…");
    addLog(`🔑 Nonce: ${nonce}`);

    const dl = [
      "truecallersdk://truesdk/web_verify?type=btmsheet",
      `&requestNonce=${nonce}`,
      `&partnerKey=${partnerKey}`,
      `&partnerName=${partnerName}`,
      `&lang=en`,
      `&privacyUrl=${encodeURIComponent(privacyUrl)}`,
      `&termsUrl=${encodeURIComponent(termsUrl)}`,
      `&loginPrefix=Verify%20with%20Truecaller`,
      `&ctaPrefix=Continue%20with%20Truecaller`,
      `&ctaColor=%231e88e5`,
      `&ctaTextColor=%23ffffff`,
      `&btnShape=round`,
      `&skipOption=Use%20another%20method`,
      `&ttl=60000`,
    ].join("");

    addLog(`🌐 Deep link: ${dl}`);
    window.location.href = dl;
  };

  return (
    <div style={{ textAlign: "center", padding: 24 }}>
      <h1>📲 Verify with Truecaller</h1>
      <button onClick={handleVerifyClick} style={{
        background: "#1e88e5", color: "#fff", padding: "1rem 2rem",
        fontSize: "1.2rem", border: "none", borderRadius: 8, cursor: "pointer"
      }}>
        Verify My Number
      </button>
      <div style={{ marginTop: 16, fontWeight: "bold" }}>{status}</div>
      <div ref={logRef} style={{
        marginTop: 24, padding: 16, height: 300, maxWidth: 450,
        overflowY: "auto", background: "#111", color: "#eee",
        fontFamily: "monospace", fontSize: "12px", borderRadius: 8,
        marginLeft: "auto", marginRight: "auto", textAlign: "left"
      }}>
        <strong>Debug Logs:</strong><br />
        {logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};

export default TruecallerVerify;
