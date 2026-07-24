import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("ErrorBoundary caught a 3D canvas / component render failure:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 bg-gradient-to-br from-bg via-bg-card to-bg opacity-80 pointer-events-none"
        />
      );
    }

    return this.props.children;
  }
}
