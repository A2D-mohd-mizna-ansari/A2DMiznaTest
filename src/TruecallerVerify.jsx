import { useState } from "react";

const TruecallerVerify = () => {
  const [status, setStatus] = useState("");

  const partnerKey = "NdYnR43e796fb8a024fa697e2bed406d6e82f";
  const partnerName = "MiznaTest";
  const privacyUrl = "https://a2-d-mizna-test.vercel.app/privacy";
  const termsUrl = "https://a2-d-mizna-test.vercel.app/terms";
  const callbackUrl = "https://a2dmiznatest.onrender.com/truecaller/callback";
  const requestNonce = "req_" + Date.now();

  const handleVerifyClick = () => {
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

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(fallbackTimer);
        setStatus("Truecaller app opened. Please complete verification.");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    window.location.href = truecallerDeepLink;

    const fallbackTimer = setTimeout(() => {
      if (!fallbackTriggered) {
        fallbackTriggered = true;
        setStatus("Truecaller app not detected. Redirecting to manual verification...");
        window.location.href = callbackUrl + "?fallback=true";
      }
    }, 1500);
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
    </div>
  );
};

export default TruecallerVerify;
