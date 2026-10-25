import * as React from 'react';
import { AlertOctagon, RotateCcw, Copy, Check } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    try {
      localStorage.clear(); // Clear local storage to fix any corrupted state
    } catch (e) {
      // Ignore
    }
    window.location.reload();
  };

  private handleGoHome = () => {
    // Attempt to refresh the page to return to clean main menu
    window.location.href = window.location.origin + window.location.pathname;
  };

  private handleCopyDiagnostic = () => {
    const { error, errorInfo } = this.state;
    const diagnosticText = `ORBI NEXUS SERPENT DIAGNOSTIC
Error: ${error?.message || 'Unknown Error'}
Stack: ${error?.stack || 'No Stack Trace'}
Component Stack: ${errorInfo?.componentStack || 'No Component Stack'}`;

    navigator.clipboard.writeText(diagnosticText).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }).catch(err => {
      console.warn("Failed to copy diagnostics:", err);
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 font-sans select-none overflow-auto">
          {/* Subtle cosmic background glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

          <div className="relative w-full max-w-lg bg-[#050b18]/90 border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.15)] z-10">
            
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>

            <span className="font-mono text-[10px] text-rose-400 font-bold uppercase tracking-widest bg-rose-950/30 px-3 py-1 border border-rose-500/10 rounded mb-4 inline-block">
              Alerta de Canalización Cósmica
            </span>

            <h2 className="font-sans font-black text-2xl text-white tracking-wide mb-3 uppercase">
              ORBI NEXUS SERPENT
            </h2>

            <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              ORBI NEXUS SERPENT detectó un error temporal en el flujo de datos. Puedes intentar volver al menú principal o reiniciar la demo local.
            </p>

            {/* Error detail placeholder */}
            <div className="bg-slate-950/80 border border-white/5 rounded-xl p-3 text-left font-mono text-[10px] text-rose-400/90 mb-6 max-h-[120px] overflow-auto">
              <span className="text-slate-500 block uppercase mb-1 font-bold">Detalle del Fallo:</span>
              <p className="whitespace-pre-wrap leading-relaxed">
                {this.state.error?.message || "Error desconocido durante la simulación de flujo vital."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center font-mono text-xs">
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 border border-slate-700/50 hover:bg-slate-800 text-slate-200 rounded-xl duration-150 cursor-pointer font-bold active:scale-95 transition-all"
              >
                VOLVER AL MENÚ
              </button>

              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl duration-150 font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> REINICIAR DEMO
              </button>

              <button
                onClick={this.handleCopyDiagnostic}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-950/50 border border-white/10 hover:border-white/20 hover:bg-slate-950 text-slate-400 hover:text-slate-300 rounded-xl duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                {this.state.copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    COPIADO
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    DIAGNÓSTICO
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
