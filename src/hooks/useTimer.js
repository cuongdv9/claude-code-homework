import { useState, useEffect, useRef } from "react";

export function useTimer({ totalSeconds, active, resetKey, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [resetKey, totalSeconds]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setTimeout(() => onExpireRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, resetKey]);

  return timeLeft;
}
