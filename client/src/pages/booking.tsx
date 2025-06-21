import OnlineBookingForm from "@/components/online-booking-form";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Booking() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="py-12">
        <OnlineBookingForm />
      </main>
      <Footer />
    </div>
  );
}