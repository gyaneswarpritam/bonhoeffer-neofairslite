"use client";
import VisitorChatModal from "@/components/VisitorChatModal";
import BlackFooter from "@/components/visitor/blackFooter";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [visitorId, setVisitorId] = useState(null);
  const [chatView, setChatView] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client
    const storedVisitorId = localStorage.getItem("id");
    const role = localStorage.getItem("role");

    if (role == "exhibitor") {
      router.push("/exhibitor");
    } else if (role == "admin") {
      router.push("/admin");
    } else {
      setVisitorId(storedVisitorId);
    }

    if (!storedVisitorId) {
      router.push("/visitor-login");
    }
  }, []);


  const handleClose = () => {
    setChatView(false);
  };

  // Prevent rendering until visitorId is fetched
  if (visitorId === null) {
    return null; // or a loading spinner
  }

  return (
    <div style={{ overflowX: "hidden" }}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <div className="custom-color-bg">{children}</div>
      <BlackFooter />
      {chatView && <VisitorChatModal handleClose={handleClose} />}
    </div>
  );
}
