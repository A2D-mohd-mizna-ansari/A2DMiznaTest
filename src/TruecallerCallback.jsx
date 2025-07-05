import { useEffect } from "react";

const TruecallerCallback = () => {
  useEffect(() => {
    const hash = window.location.hash;
    const sdkData = new URLSearchParams(hash.replace("#", "")).get("sdk_data");

    if (sdkData) {
      fetch("https://a2dmiznatest.onrender.com/api/verify-sdk-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sdkData }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ Verified:", data);
        })
        .catch((err) => {
          console.error("❌ Error verifying:", err);
        });
    }
  }, []);

  return <h2>Verifying Truecaller data...</h2>;
};

export default TruecallerCallback;
