import { exec } from "child_process";
import { promisify } from "util";
import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const execAsync = promisify(exec);

// Security: Only allow from localhost or with secret token
const SECRET_TOKEN = process.env.RESTART_TOKEN || "mission-control-restart-2024";

export async function POST(request: Request) {
  try {
    // Check authorization
    const authHeader = request.headers.get("authorization");
    const { token } = await request.json().catch(() => ({ token: null }));
    
    const providedToken = authHeader?.replace("Bearer ", "") || token;
    
    if (providedToken !== SECRET_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or missing token" },
        { status: 401 }
      );
    }

    // Get project directory
    const projectDir = join(process.cwd());

    // Check current server status
    let status = "unknown";
    try {
      await fetch("http://localhost:3000/api/health", { 
        signal: AbortSignal.timeout(2000) 
      });
      status = "running";
    } catch {
      status = "not_responding";
    }

    // Kill existing Node processes on port 3000 (Windows)
    const killCommand = process.platform === "win32" 
      ? `taskkill /F /IM node.exe 2>nul || echo "No node processes"`
      : `pkill -f "next dev" || echo "No next processes"`;
    
    try {
      await execAsync(killCommand);
    } catch {
      // Ignore errors if no processes to kill
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Restart the dev server
    const restartCommand = `cd "${projectDir}" && npm run dev`;
    
    // Spawn in background (fire and forget)
    const spawn = require("child_process").spawn;
    const child = spawn("cmd", ["/c", "start", "/min", restartCommand], {
      cwd: projectDir,
      detached: true,
      stdio: "ignore",
      windowsHide: true
    });
    
    child.unref();

    return NextResponse.json({
      success: true,
      message: "Server restart initiated",
      previousStatus: status,
      timestamp: new Date().toISOString(),
      note: "Server will be available at http://localhost:3000 in ~5 seconds"
    });

  } catch (error) {
    console.error("Restart error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to restart server",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf-8")
    );
    
    return NextResponse.json({
      status: "healthy",
      service: "mission-control",
      version: packageJson.version,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: String(error) },
      { status: 500 }
    );
  }
}
