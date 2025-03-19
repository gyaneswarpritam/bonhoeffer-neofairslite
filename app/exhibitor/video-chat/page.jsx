"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import "./video-chat.css";
import { useRouter } from "next/navigation";
import { request } from "@/lib/axios";

function VideoChatComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (id) {
      setTopic(id);
      // Fetch name from localStorage or any other source
      const storedName = localStorage.getItem("name");
      setName(storedName || ""); // Set name to state
    }
  }, [id]);

  useEffect(() => {
    // Generate video URL with topic and name
    if (topic && name) {
      const url = `https://sample-video-eight.vercel.app/video?topic=${topic}&name=${name}`;
      setVideoUrl(url);
    }
  }, [topic, name]);

  const leave = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave the meeting?"
    );
    if (confirmed) {
      await request({
        url: `exhibitor/instant-meeting/${id}`,
        method: "put",
        data: { approve: false, completed: true, inProgress: false },
      });
      router.back();
    }
  };

  return (
    <div className="section-video">
      <iframe
        src={videoUrl}
        allow="camera; microphone; display-capture"
        width="100%"
        height="100%"
      ></iframe>
      <button onClick={leave} className="leave"></button>
    </div>
  );
}

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <VideoChatComponent />
      </Suspense>
    </div>
  );
};
export default Page;
