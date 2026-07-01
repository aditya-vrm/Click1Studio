import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTeamMembers, saveTeamMember, updateTeamMember } from "@/lib/db";

// Initial seed data for the 7 Team Members
const initialTeamMembers = [
  {
    name: "Guddu Sharma",
    role: "Owner / Founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    bio: "Visionary founder of Click1Studio. Guddu is a veteran photographer with over 12 years of experience capturing high-end weddings, editorial spreads, and monumental celebrations with an artistic eye.",
    order: 1,
  },
  {
    name: "Vishal Sharma",
    role: "Co-founder & Editor",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    bio: "Co-founder and chief creative editor. Vishal defines the post-production aesthetic of Click1Studio. He works tirelessly to craft cohesive visual tones and pacing for our signature collections.",
    order: 2,
  },
  {
    name: "Parmod Kumar",
    role: "Editor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
    bio: "Editor and detail perfectionist. Parmod compiles raw footage and photos into beautiful chronological stories, ensuring the rhythm matches the emotion of the event.",
    order: 3,
  },
  {
    name: "Sushant Kumar",
    role: "Cinematographer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    bio: "Lead cinematographer. Sushant is an expert in low-light camera operations and editorial framing. He captures the silent gestures and explosive celebrations with cinematic precision.",
    order: 4,
  },
  {
    name: "Prince",
    role: "Cinematographer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
    bio: "Cinematographer and aerial specialist. Prince oversees drone coverage and tracking shots, adding grand scales and breathtaking scenery to our destination stories.",
    order: 5,
  },
  {
    name: "Subham",
    role: "Photographer",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop",
    bio: "Candid photographer. Subham has a distinct talent for vanishing into the background to capture genuine, unposed moments and micro-interactions that others miss.",
    order: 6,
  },
  {
    name: "Rohit",
    role: "Photographer",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
    bio: "Portrait and lighting photographer. Rohit crafts the grand architectural poses and editorial portraits, working with natural light and strobes to sculpt timeless images.",
    order: 7,
  },
];

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated";
}

// GET all team members, seeding them if database is empty
export async function GET() {
  try {
    let items = await getTeamMembers();

    if (items.length === 0) {
      // Auto-seed team members
      for (const member of initialTeamMembers) {
        await saveTeamMember(member);
      }
      items = await getTeamMembers();
    }

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

// POST: Update a team member's details (Admin only)
export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, role, image, bio } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing team member ID" }, { status: 400 });
    }

    const updated = await updateTeamMember(id, { name, role, image, bio });
    if (!updated) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}
