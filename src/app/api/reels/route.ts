import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getReelItems, saveReelItem, deleteReelItem } from "@/lib/db";

// Initial seed data for Reels (vertical clips)
const initialReelItems = [
  {
    title: "Vows in the Valleys",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-at-a-luxury-outdoor-wedding-41584-large.mp4",
  },
  {
    title: "Dancing Under Stars",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-couple-dancing-slowly-at-their-wedding-party-41595-large.mp4",
  },
  {
    title: "Cinematic Golden Hour",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bride-holding-her-veil-against-the-sunset-41598-large.mp4",
  },
];

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated";
}

// GET all reels, seeding if database is empty
export async function GET() {
  try {
    let items = await getReelItems();

    if (items.length === 0) {
      // Auto-seed
      for (const item of initialReelItems) {
        await saveReelItem(item);
      }
      items = await getReelItems();
    }

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reels" }, { status: 500 });
  }
}

// POST: Add a new reel (Admin only)
export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { title, videoUrl } = body;

    if (!title || !videoUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = await saveReelItem({ title, videoUrl });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create reel item" }, { status: 500 });
  }
}

// DELETE: Remove a reel (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing reel ID" }, { status: 400 });
    }

    const success = await deleteReelItem(id);
    if (!success) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Reel deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete reel" }, { status: 500 });
  }
}
