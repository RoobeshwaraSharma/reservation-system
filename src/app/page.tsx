import Link from "next/link";

export default function Home() {
  return (
    <div
      className="relative bg-black bg-cover bg-center h-dvh"
      suppressHydrationWarning
    >
      {/* Staff Sign-In Button in top-right corner */}
      <div className="absolute top-4 right-4">
        <Link
          href="/cico"
          className="text-sm sm:text-base px-4 py-2 bg-white text-black rounded-md shadow hover:bg-gray-200 transition"
        >
          Staff Sign In
        </Link>
      </div>

      <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-full">
        <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/80 w-4/5 sm:max-w-lg mx-auto text-white sm:text-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Welcome to Serenity Hotel
          </h1>
          <p className="text-base sm:text-xl">
            Experience comfort, luxury, and exceptional service in the heart of
            Dehiwala.
          </p>
          <address className="not-italic text-base sm:text-lg">
            123 Seaside Avenue, Dehiwala, Sri Lanka
          </address>
          <p>Open 24/7 – Reserve your stay today!</p>
          <Link
            href="tel:94751234567"
            className="hover:underline text-lg font-semibold"
          >
            +94-75-123-4567
          </Link>
          <Link
            href="/login"
            className="mt-4 inline-block text-white bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold text-lg"
          >
            Sign Up or Log In to Book a Room
          </Link>
        </div>
      </main>
    </div>
  );
}
