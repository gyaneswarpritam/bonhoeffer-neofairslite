import React from "react";
import { useEffect, useState } from "react";

const Timer = ({ stateChanger }) => {
  const [seconds, setSeconds] = useState(30);
  const [secondsString, setSecondsString] = useState("30");

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        let twoDigitString = seconds < 10 ? "0" + seconds : seconds.toString();
        setSecondsString(twoDigitString);
        setSeconds(Number(twoDigitString) - 1);
      }

      if (seconds === 0) {
        clearInterval(interval);
        stateChanger(false);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);
  return (
    <div className=" text-black font-lato font-semibold text-base">
      00:{secondsString}
    </div>
  );
};

export default Timer;
