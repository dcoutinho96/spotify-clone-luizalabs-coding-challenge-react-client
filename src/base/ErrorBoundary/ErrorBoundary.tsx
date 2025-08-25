import React from "react";
import { Error404 } from "~/base/Error404";
import { Error500 } from "~/base/Error500";

type ErrorBoundaryProps = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, info);
    if (error.message.match(/Unauthorized/i)) {
      window.location.href = "/"; // redirect home
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.state.error?.message.match(/Unauthorized/i)) {
        return null; // handled by redirect
      }

      if (this.state.error?.message.match(/Not\s*Found/i)) {
        return <Error404 />;
      }

      return this.props.fallback ?? <Error500 />;
    }
    return this.props.children;
  }
}
