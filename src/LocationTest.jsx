import React, { useState } from "react";

const LocationTest = () => {
  const [location, setLocation] = useState("Click button to get location.");
  const [debug, setDebug] = useState("");

  const handleGetLocation = () => {
    setDebug("User clicked the button.");

    if (!navigator.geolocation) {
      setLocation("Geolocation is not supported by your browser.");
      setDebug("navigator.geolocation is undefined.");
      return;
    }

    setDebug("navigator.geolocation is available. Requesting location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
        setDebug("Location received successfully.");
      },
      (err) => {
        let message = "Error getting location.";
        if (err.code === 1) {
          message = "Permission denied. Please enable location in settings.";
        } else if (err.code === 2) {
          message = "Position unavailable.";
        } else if (err.code === 3) {
          message = "Timeout getting location.";
        }

        setLocation(message);
        setDebug(`Error code: ${err.code}, Message: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Test iOS Location (React)</h2>
      <button onClick={handleGetLocation} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Get My Location
      </button>
      <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{location}</p>
      <p style={{ marginTop: "0.5rem", color: "gray" }}>{debug}</p>
    </div>
  );
};

export default LocationTest;

