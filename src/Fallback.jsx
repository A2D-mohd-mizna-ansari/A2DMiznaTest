import { useState } from "react";

const Fallback = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    if (!phone) {
      setStatus("Please enter your phone number.");
      return;
    }
    setStatus("Sending OTP...");
    // TODO: Call your backend API to send OTP
    // await fetch('/api/send-otp', { method: 'POST', body: JSON.stringify({ phone }) })
    setOtpSent(true);
    setStatus("OTP sent! Please check your phone.");
  };

  const verifyOtp = async () => {
    if (!otp) {
      setStatus("Please enter OTP.");
      return;
    }
    setStatus("Verifying OTP...");
    // TODO: Call your backend API to verify OTP
    // const res = await fetch('/api/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) })
    // if (res.ok) { setStatus("Phone verified!"); }
    setStatus("Phone verified!"); // Example success
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "auto", textAlign: "center" }}>
      <h2>Manual Phone Verification</h2>

      {!otpSent ? (
        <>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
          />
          <button onClick={sendOtp} style={{ padding: "0.75rem 1.5rem", cursor: "pointer" }}>
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
          />
          <button onClick={verifyOtp} style={{ padding: "0.75rem 1.5rem", cursor: "pointer" }}>
            Verify OTP
          </button>
        </>
      )}

      <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{status}</p>
    </div>
  );
};

export default Fallback;
