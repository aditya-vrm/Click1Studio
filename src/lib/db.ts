import mongoose, { Schema, Document } from "mongoose";

const MONGODB_URI = process.env.MongoDB_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the MongoDB_URL environment variable inside .env");
}

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

// Mongoose interface extending Document
interface IBookingDocument extends Document {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  date: string;
  location: string;
  guests: string;
  budget: string;
  packageType: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Connection caching logic for Next.js hot-reload
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "click1studio",
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Define the Schema
const BookingSchema = new Schema<IBookingDocument>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    eventType: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    guests: { type: String, required: true },
    budget: { type: String, required: true },
    packageType: { type: String, required: true },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Define Model (retrieve if already exists to prevent rebuild errors in Next.js)
const BookingModel =
  mongoose.models.Booking || mongoose.model<IBookingDocument>("Booking", BookingSchema);

// Retrieve all bookings sorted by creation date descending
export async function getBookings(): Promise<Booking[]> {
  await dbConnect();
  try {
    const docs = await BookingModel.find({}).sort({ createdAt: -1 });
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      phone: doc.phone,
      email: doc.email,
      eventType: doc.eventType,
      date: doc.date,
      location: doc.location,
      guests: doc.guests,
      budget: doc.budget,
      packageType: doc.packageType,
      notes: doc.notes,
      createdAt: doc.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error retrieving bookings from MongoDB:", error);
    throw error;
  }
}

// Save a new booking
export async function saveBooking(
  bookingData: Omit<Booking, "id" | "createdAt">
): Promise<Booking> {
  await dbConnect();
  try {
    const doc = new BookingModel({
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email,
      eventType: bookingData.eventType,
      date: bookingData.date,
      location: bookingData.location,
      guests: bookingData.guests,
      budget: bookingData.budget,
      packageType: bookingData.packageType,
      notes: bookingData.notes || "",
    });

    const savedDoc = await doc.save();
    return {
      id: savedDoc._id.toString(),
      name: savedDoc.name,
      phone: savedDoc.phone,
      email: savedDoc.email,
      eventType: savedDoc.eventType,
      date: savedDoc.date,
      location: savedDoc.location,
      guests: savedDoc.guests,
      budget: savedDoc.budget,
      packageType: savedDoc.packageType,
      notes: savedDoc.notes,
      createdAt: savedDoc.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error saving booking to MongoDB:", error);
    throw error;
  }
}

// Portfolio & Film Types
export interface PortfolioItem {
  id: string;
  title: string;
  category:
    | "wedding"
    | "pre-wedding"
    | "engagement"
    | "birthday"
    | "drone-shots"
    | "lifestyle-portrait"
    | "events"
    | "branding";
  image: string;
  createdAt: string;
}

export interface FilmItem {
  id: string;
  title: string;
  location: string;
  duration: string;
  coverImage: string;
  videoUrl?: string;
  createdAt: string;
}

// Mongoose Document Interfaces
interface IPortfolioItemDocument extends Document {
  title: string;
  category: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IFilmItemDocument extends Document {
  title: string;
  location: string;
  duration: string;
  coverImage: string;
  videoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schemas
const PortfolioItemSchema = new Schema<IPortfolioItemDocument>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const FilmItemSchema = new Schema<IFilmItemDocument>(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    coverImage: { type: String, required: true },
    videoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Models
const PortfolioItemModel =
  mongoose.models.PortfolioItem || mongoose.model<IPortfolioItemDocument>("PortfolioItem", PortfolioItemSchema);

const FilmItemModel =
  mongoose.models.FilmItem || mongoose.model<IFilmItemDocument>("FilmItem", FilmItemSchema);

// Portfolio Database Helpers
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  await dbConnect();
  try {
    const docs = await PortfolioItemModel.find({}).sort({ createdAt: -1 });
    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      category: doc.category as any,
      image: doc.image,
      createdAt: doc.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error retrieving portfolio items from MongoDB:", error);
    throw error;
  }
}

export async function savePortfolioItem(
  data: Omit<PortfolioItem, "id" | "createdAt">
): Promise<PortfolioItem> {
  await dbConnect();
  try {
    const doc = new PortfolioItemModel({
      title: data.title,
      category: data.category,
      image: data.image,
    });
    const savedDoc = await doc.save();
    return {
      id: savedDoc._id.toString(),
      title: savedDoc.title,
      category: savedDoc.category as any,
      image: savedDoc.image,
      createdAt: savedDoc.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error saving portfolio item to MongoDB:", error);
    throw error;
  }
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  await dbConnect();
  try {
    const res = await PortfolioItemModel.findByIdAndDelete(id);
    return !!res;
  } catch (error) {
    console.error("Error deleting portfolio item from MongoDB:", error);
    throw error;
  }
}

// Film Database Helpers
export async function getFilmItems(): Promise<FilmItem[]> {
  await dbConnect();
  try {
    const docs = await FilmItemModel.find({}).sort({ createdAt: -1 });
    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      location: doc.location,
      duration: doc.duration,
      coverImage: doc.coverImage,
      videoUrl: doc.videoUrl,
      createdAt: doc.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error retrieving films from MongoDB:", error);
    throw error;
  }
}

export async function saveFilmItem(
  data: Omit<FilmItem, "id" | "createdAt">
): Promise<FilmItem> {
  await dbConnect();
  try {
    const doc = new FilmItemModel({
      title: data.title,
      location: data.location,
      duration: data.duration,
      coverImage: data.coverImage,
      videoUrl: data.videoUrl || "",
    });
    const savedDoc = await doc.save();
    return {
      id: savedDoc._id.toString(),
      title: savedDoc.title,
      location: savedDoc.location,
      duration: savedDoc.duration,
      coverImage: savedDoc.coverImage,
      videoUrl: savedDoc.videoUrl,
      createdAt: savedDoc.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error saving film to MongoDB:", error);
    throw error;
  }
}

export async function deleteFilmItem(id: string): Promise<boolean> {
  await dbConnect();
  try {
    const res = await FilmItemModel.findByIdAndDelete(id);
    return !!res;
  } catch (error) {
    console.error("Error deleting film from MongoDB:", error);
    throw error;
  }
}

