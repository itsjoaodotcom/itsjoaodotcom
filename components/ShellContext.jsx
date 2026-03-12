"use client";

import { createContext, useContext, useState, useRef } from "react";

const ShellContext = createContext();

export function ShellProvider({ children }) {
  const [activeView, setActiveView] = useState("assigned");
  const hasLoadedRef = useRef(false);

  return (
    <ShellContext.Provider value={{ activeView, setActiveView, hasLoadedRef }}>
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  return useContext(ShellContext);
}
