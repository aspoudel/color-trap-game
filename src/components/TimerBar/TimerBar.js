import React, { useState, useEffect } from "react";
import "./TimerBar.css";

export default function TimerBar({ extraMarginRight }) {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWidth((prevWidth) => prevWidth - 0.14);
    }, 10);
    if (width <= 0) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  });

  return (
    <div
      className={extraMarginRight ? "timer-bar margin-right" : "timer-bar"}
      style={{ "--width": `${width}` }}
    ></div>
  );
}
