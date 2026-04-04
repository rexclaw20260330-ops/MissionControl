import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return { tasks: [], projects: [], stats: {}, activities: [], lastUpdated: new Date().toISOString() };
  }
}

async function writeDB(data: any) {
  data.lastUpdated = new Date().toISOString();
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// GET /api/data - 讀取所有資料
export async function GET() {
  const data = await readDB();
  return NextResponse.json(data);
}

// POST /api/data - 更新資料
export async function POST(request: Request) {
  try {
    const updates = await request.json();
    const data = await readDB();
    
    // 合併更新
    const updated = { ...data, ...updates };
    await writeDB(updated);
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
