import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getFilmItems, saveFilmItem, deleteFilmItem } from "@/lib/db";

// Initial seed data for Films
const initialFilmItems = [
  {
    title: "Aurelia & Julian",
    location: "Lake Como, Italy",
    duration: "04:22",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    videoUrl: "",
  },
  {
    title: "Evelyn & Thomas",
    location: "Paris, France",
    duration: "05:15",
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
    videoUrl: "",
  },
  {
    title: "Sophia & Marcus",
    location: "Dubai, UAE",
    duration: "03:45",
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop",
    videoUrl: "",
  },
];

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated";
}

// GET all films, seeding them if database is empty
export async function GET() {
  try {
    let items = await getFilmItems();

    if (items.length === 0) {
      // Auto-seed
      for (const item of initialFilmItems) {
        await saveFilmItem(item);
      }
      items = await getFilmItems();
    }

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch films" }, { status: 500 });
  }
}

// POST: Add a new film (Admin only)
export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { title, location, duration, coverImage, videoUrl } = body;

    if (!title || !location || !duration || !coverImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = await saveFilmItem({ title, location, duration, coverImage, videoUrl });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create film item" }, { status: 500 });
  }
}

// DELETE: Remove a film (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing film ID" }, { status: 400 });
    }

    const success = await deleteFilmItem(id);
    if (!success) {
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Film deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete film" }, { status: 500 });
  }
}
