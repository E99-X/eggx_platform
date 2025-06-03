import { createContext, useContext, useState } from "react";

const HintContext = createContext();

export function HintProvider({ children }) {
  const [hint, setHint] = useState("Start filling data to see user hint.");
  const handleBlur = () => {
    setTimeout(() => {
      if (!document.activeElement.closest("form")) {
        setHint("Start filling data to see user hint");
      }
    }, 0);
  };
  return (
    <HintContext.Provider value={{ hint, setHint, handleBlur }}>
      {children}
    </HintContext.Provider>
  );
}

export function useHint() {
  return useContext(HintContext);
}
