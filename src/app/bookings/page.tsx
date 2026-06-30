import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getBookings } from "@/lib/db";
import BookingsDashboard from "@/components/sections/BookingsDashboard";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default async function BookingsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "authenticated") {
    redirect("/");
  }

  // Fetch bookings from MongoDB
  const bookings = await getBookings();

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-tertiary/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />

      <Navbar />
      <div className="pt-24 relative z-10">
        <BookingsDashboard initialBookings={bookings} />
      </div>
      <Footer />
    </main>
  );
}
