"use client";
import VisitorChatModal from "@/components/VisitorChatModal";
import BlackFooter from "@/components/visitor/blackFooter";
import { useState } from "react";

export default function RootLayout({ children }) {
  const name =
    typeof window !== "undefined" ? sessionStorage.getItem("name") : null;
  const [chatView, setChatView] = useState(false);

  const handleClose = () => {
    setChatView(false);
  };

  return (
    <>
      <div style={{ overflowX: "hidden" }}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <div className="custom-color-bg">{children}</div>
        <BlackFooter></BlackFooter>
        {chatView ? <VisitorChatModal handleClose={handleClose} /> : ""}
      </div>
    </>
  );
}
