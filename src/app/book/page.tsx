"use client";

import Navbar from "@/components/ui/Navbar";
import BookingForm from "@/components/sections/BookingForm";
import Footer from "@/components/ui/Footer";

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 bg-[#0d0e0f]">
        <BookingForm />
      </main>
      <Footer />
    </>
  );
}
