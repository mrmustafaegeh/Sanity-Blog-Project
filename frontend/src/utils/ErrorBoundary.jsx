import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  handleRetry = () => {
    // Reload the page to retry
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="text-center">
            <p className="text-red-500 text-lg font-semibold mb-4">
              Something went wrong.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
