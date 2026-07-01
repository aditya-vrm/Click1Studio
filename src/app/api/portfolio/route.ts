import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPortfolioItems, savePortfolioItem, deletePortfolioItem, setPortfolioItemCover } from "@/lib/db";

// Initial seed data for Portfolio
const initialPortfolioItems = [
  {
    title: "Eternal Promises",
    category: "wedding" as const,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Before the Vows",
    category: "pre-wedding" as const,
    image: "https://images.unsplash.com/photo-1460978812857-470ed1c78af3?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Golden Hour Rings",
    category: "engagement" as const,
    image: "https://images.unsplash.com/photo-1519225495810-7517c296517a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Midnight Toast",
    category: "birthday" as const,
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Aegean Solitude",
    category: "drone-shots" as const,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "The Editorial Muse",
    category: "lifestyle-portrait" as const,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Vanguards of Style",
    category: "branding" as const,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
  },
  {
    title: "Grand Ballroom Gala",
    category: "events" as const,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
  },
];

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated";
}

// GET all portfolio items, seeding them if database is empty
export async function GET() {
  try {
    let items = await getPortfolioItems();

    if (items.length === 0) {
      // Auto-seed
      for (const item of initialPortfolioItems) {
        await savePortfolioItem(item);
      }
      items = await getPortfolioItems();
    }

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 });
  }
}

// POST: Add a new portfolio item (Admin only)
export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, image } = body;

    if (!title || !category || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = await savePortfolioItem({ title, category, image });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 });
  }
}

// DELETE: Remove a portfolio item (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    const success = await deletePortfolioItem(id);
    if (!success) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Portfolio item deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
  }
}

// PUT: Update cover photo status (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    const success = await setPortfolioItemCover(id);
    if (!success) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    const updatedItems = await getPortfolioItems();
    return NextResponse.json(updatedItems);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update album cover" }, { status: 500 });
  }
}
