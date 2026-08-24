"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Ctx = {
  supported: boolean;
  setUnsupported: () => void;
};

const WebGLSupportContext = createContext<Ctx>({
  supported: true,
  setUnsupported: () => {},
});

export function WebGLSupportProvider({ children }: { children: ReactNode }) {
  const [supported, setSupported] = useState(true);
  return (
    <WebGLSupportContext.Provider
      value={{ supported, setUnsupported: () => setSupported(false) }}
    >
      {children}
    </WebGLSupportContext.Provider>
  );
}

export function useWebGLSupport() {
  return useContext(WebGLSupportContext);
}
