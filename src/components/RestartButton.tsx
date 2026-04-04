"use client";

import { useState, useEffect } from "react";
import { RefreshCw, AlertTriangle, Power, Activity, Server, Globe } from "lucide-react";

const RESTART_TOKEN = "mission-control-restart-2024";

export function RestartButton() {
  const [isRestarting, setIsRestarting] = useState(false);
  const [status, setStatus] = useState<"online" | "offline" | "checking">("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLocal, setIsLocal] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if running locally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocal(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }
  }, []);

  // Check server health every 30 seconds
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("/api/health", {
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          setStatus("online");
        } else {
          setStatus("offline");
        }
      } catch {
        setStatus("offline");
      }
      setLastCheck(new Date());
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRestart = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 5000);
      return;
    }

    setIsRestarting(true);
    setShowConfirm(false);
    setError(null);

    try {
      // Check if we're on Vercel
      if (!isLocal) {
        // Vercel: Trigger redeploy via API
        const vercelToken = process.env.NEXT_PUBLIC_VERCEL_TOKEN;
        
        if (!vercelToken) {
          throw new Error("Vercel token not configured. Please set NEXT_PUBLIC_VERCEL_TOKEN in environment variables.");
        }

        // Get project info from environment
        const projectId = process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID;
        const teamId = process.env.NEXT_PUBLIC_VERCEL_TEAM_ID;
        
        if (!projectId) {
          throw new Error("Vercel project ID not configured.");
        }

        const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}/deployments`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target: "production",
            source: "redeploy",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Failed to trigger redeploy");
        }

        const data = await response.json();
        
        // Show success and redirect to deployment URL
        setTimeout(() => {
          window.location.href = data.url || window.location.href;
        }, 3000);
        
      } else {
        // Local: Use the restart API
        const response = await fetch("/api/restart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: RESTART_TOKEN }),
        });

        const data = await response.json();

        if (data.success) {
          setTimeout(() => {
            window.location.reload();
          }, 6000);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsRestarting(false);
    }
  };

  const statusColor = {
    online: "bg-emerald-500",
    offline: "bg-red-500",
    checking: "bg-amber-500",
  }[status];

  return (
    <div className="bg-[#15151a] border border-[#0066ff]/20 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isLocal ? (
            <Server size={16} className="text-[#00ffff]" />
          ) : (
            <Globe size={16} className="text-[#00ffff]" />
          )}
          <span className="text-sm font-semibold text-white">
            {isLocal ? "Local Server" : "Vercel Deploy"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
          <span className="text-xs text-[#8a8a95] font-mono uppercase">
            {status === "checking" ? "CHECKING..." : status}
          </span>
        </div>
      </div>

      {/* Environment indicator */}
      <div className="mb-3 px-3 py-1.5 bg-[#1e1e24] rounded text-xs font-mono text-[#8a8a95] truncate">
        {isLocal ? "🖥️ localhost:3000" : "🌐 " + (typeof window !== 'undefined' ? window.location.hostname : 'vercel.app')}
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleRestart}
        disabled={isRestarting}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
          showConfirm
            ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
            : "bg-gradient-to-r from-[#0066ff]/20 to-[#00ffff]/20 text-[#00ffff] border border-[#0066ff]/30 hover:border-[#00ffff]/50 hover:shadow-[0_0_20px_rgba(0,102,255,0.3)]"
        } ${isRestarting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isRestarting ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            <span>{isLocal ? "Restarting..." : "Redeploying..."}</span>
          </>
        ) : showConfirm ? (
          <>
            <AlertTriangle size={16} />
            <span>Click again to confirm</span>
          </>
        ) : (
          <>
            <Power size={16} />
            <span>{isLocal ? "Restart Server" : "Redeploy to Vercel"}</span>
          </>
        )}
      </button>

      {lastCheck && (
        <p className="text-[10px] text-[#8a8a95] mt-2 text-center font-mono">
          Last check: {lastCheck.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
