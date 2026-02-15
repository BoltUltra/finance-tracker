import { useState, useEffect } from "react";

type HapticType =
  | "success"
  | "warning"
  | "error"
  | "light"
  | "medium"
  | "heavy"
  | "selection";

export function useHaptic() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("hapticEnabled");
    if (stored !== null) {
      setIsEnabled(JSON.parse(stored));
    } else {
      setIsEnabled(true); // Default to on
    }
  }, []);

  const toggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem("hapticEnabled", JSON.stringify(newValue));
    if (newValue) {
      trigger("success");
    }
  };

  const trigger = (type: HapticType) => {
    if (!isEnabled || typeof navigator === "undefined" || !navigator.vibrate)
      return;

    switch (type) {
      case "success":
        navigator.vibrate([10, 30, 10]);
        break;
      case "warning":
        navigator.vibrate([30, 50, 10]);
        break;
      case "error":
        navigator.vibrate([50, 100, 50]);
        break;
      case "light":
        navigator.vibrate(5);
        break;
      case "medium":
        navigator.vibrate(10);
        break;
      case "heavy":
        navigator.vibrate(20);
        break;
      case "selection":
        navigator.vibrate(2);
        break;
      default:
        break;
    }
  };

  return { isEnabled, toggle, trigger };
}
