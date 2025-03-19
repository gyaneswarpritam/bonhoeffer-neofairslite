// YouTubePlayer.js
"use client";
import React, { useState } from "react";
import YouTube from "react-youtube";

const YouTubePlayer = ({ videoId }) => {
  const [player, setPlayer] = useState(null);

  const onReady = (event) => {
    // access to player in all event handlers via event.target
    setPlayer(event.target);
  };

  const onPlayVideo = () => {
    player.playVideo();
  };

  const onPauseVideo = () => {
    player.pauseVideo();
  };

  return (
    <YouTube
      videoId={videoId}
      onReady={onReady}
      className="custom-youtube-player"
      opts={{ width: "100%", height: "100%" }}
    />
  );
};

export default YouTubePlayer;
