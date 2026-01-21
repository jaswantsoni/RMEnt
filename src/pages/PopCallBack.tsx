import React, { useEffect } from "react";

const PopCallback: React.FC = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (window.opener) {
      if (token) {
        // Send token to main window
        window.opener.postMessage({ token }, window.location.origin);
      }
      if (error) {
        window.opener.postMessage({ error }, window.location.origin);
      }

      // Close the popup after a short delay to ensure message is sent
      setTimeout(() => {
        window.close();
      }, 100);
    } else {
      console.warn("No window.opener found. This page should be opened as a popup.");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">Processing login...</p>
    </div>
  );
};

export default PopCallback;
