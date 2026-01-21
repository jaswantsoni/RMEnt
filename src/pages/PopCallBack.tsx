import React, { useEffect } from "react";

const PopCallback: React.FC = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (window.opener) {
      if (token) window.opener.postMessage({ token }, window.location.origin);
      if (error) window.opener.postMessage({ error }, window.location.origin);

      window.close(); // close popup after sending message
    }
  }, []);

  return <p>Processing login...</p>;
};

export default PopCallback;
