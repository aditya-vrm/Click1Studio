import { NextResponse } from "next/server";
import { saveBooking, getBookings } from "@/lib/db";

export async function GET() {
  try {
    const bookings = await getBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET bookings error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve bookings." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple validation
    const { name, phone, email, eventType, date, location, guests, budget, packageType, notes } = body;
    
    if (!name || !phone || !email || !eventType || !date || !location || !guests || !budget || !packageType) {
      return NextResponse.json(
        { error: "Missing required fields in booking inquiry." },
        { status: 400 }
      );
    }

    const saved = await saveBooking({
      name,
      phone,
      email,
      eventType,
      date,
      location,
      guests,
      budget,
      packageType,
      notes: notes || "",
    });

    return NextResponse.json({ success: true, booking: saved });
  } catch (error) {
    console.error("POST bookings error:", error);
    return NextResponse.json(
      { error: "Failed to save booking inquiry." },
      { status: 500 }
    );
  }
}
