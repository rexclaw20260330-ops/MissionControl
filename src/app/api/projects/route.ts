import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";

const PROJECTS_FILE = join(process.cwd(), "data", "projects.json");

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in_progress" | "review" | "done";
  progress: number;
  tasks: { total: number; completed: number };
  lastUpdated: string;
}

async function ensureDataDir() {
  const dataDir = join(process.cwd(), "data");
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

async function readProjects(): Promise<Project[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROJECTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeProjects(projects: Project[]) {
  await ensureDataDir();
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

// GET /api/projects - List all projects
export async function GET() {
  const projects = await readProjects();
  return NextResponse.json(projects);
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const projects = await readProjects();
    
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description: description || "",
      status: "planning",
      progress: 0,
      tasks: { total: 0, completed: 0 },
      lastUpdated: new Date().toLocaleDateString(),
    };

    projects.push(newProject);
    await writeProjects(projects);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects - Update a project
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const projects = await readProjects();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    projects[index] = {
      ...projects[index],
      ...updates,
      lastUpdated: new Date().toLocaleDateString(),
    };

    await writeProjects(projects);
    return NextResponse.json(projects[index]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects - Delete a project
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const projects = await readProjects();
    const filtered = projects.filter((p) => p.id !== id);

    if (filtered.length === projects.length) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    await writeProjects(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
