import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[500px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#1e1e2a] border border-[#70707d]/30 rounded-[12px] p-6 sm:p-8 text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-[12px] bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#ededf3]">
                {this.props.fallbackTitle || 'Terjadi Kendala Memuat Modul'}
              </h3>
              <p className="text-xs text-[#c3c3cc] leading-relaxed">
                Modul ini mengalami kendala rendering sementara. Sistem kami telah mengamankan data dan sesi Anda.
              </p>
              {this.state.error?.message && (
                <div className="text-[11px] font-mono text-rose-300/80 bg-[#171721] p-2.5 rounded-[8px] border border-rose-900/40 text-left overflow-x-auto max-h-24">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2 bg-[#5266eb] hover:bg-[#4355d6] text-white text-xs font-normal rounded-full transition flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = '/';
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#272735] hover:bg-[#323244] text-[#ededf3] text-xs font-normal rounded-full border border-[#70707d]/30 transition flex items-center justify-center space-x-1.5"
              >
                <Home className="w-3.5 h-3.5 text-[#c3c3cc]" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
