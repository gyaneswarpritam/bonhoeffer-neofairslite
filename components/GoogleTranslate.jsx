"use client";
// components/GoogleTranslate.js

import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    let script;

    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };

    // Check if google object exists before calling the initialization function
    if (typeof window !== "undefined" && !window.google) {
      script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      googleTranslateElementInit();
    }

    // Clean up function to remove the script
    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
