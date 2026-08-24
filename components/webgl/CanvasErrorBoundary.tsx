"use client";

import { Component, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onError: () => void;
};

type State = { hasError: boolean };

/**
 * If the R3F canvas fails to get a WebGL context (or throws during setup),
 * this swallows the error, tells WebGLSupportContext, and renders nothing
 * further — the Hero section's static fallback (a placeholder macro loaf
 * via BakeryImage + CSS grain) takes over instead, per spec §7.
 */
export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[CanvasErrorBoundary] WebGL canvas failed:", error);
    }
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
