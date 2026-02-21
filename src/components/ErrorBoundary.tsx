'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);

        // Attempt to log to our new API endpoint
        try {
            fetch('/api/admin/log-error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    errorType: 'CLIENT_EXCEPTION',
                    errorMessage: error.message,
                    errorStack: error.stack,
                    urlAffected: window.location.href,
                    userAgent: navigator.userAgent
                })
            });
        } catch (e) {
            console.error('Failed to log error to API', e);
        }
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
                    <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-6 rounded-xl max-w-md">
                        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                        <p className="text-sm opacity-80 mb-4">We've encountered an unexpected error on this page. Our team has been notified.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
