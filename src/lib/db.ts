import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  date: string;
  location: string;
  guests: string;
  budget: string;
  packageType: string;
  notes?: string;
  createdAt: string;
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function getBookings(): Promise<Booking[]> {
  ensureDataFile();
  try {
    const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading bookings from database file:", error);
    return [];
  }
}

export async function saveBooking(bookingData: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
  ensureDataFile();
  try {
    const bookings = await getBookings();
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), "utf-8");
    return newBooking;
  } catch (error) {
    console.error("Error saving booking to database file:", error);
    throw new Error("Database write error");
  }
}
