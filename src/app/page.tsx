import Link from "next/link";
import Image from "next/image";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Users, Wifi, Car, Utensils } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navigation */}
      <div className="overflow-hidden">
        <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b z-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Serenity Hotel
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button asChild variant="outline" size="sm">
                  <LoginLink postLoginRedirectURL="/reservations">
                    Sign In
                  </LoginLink>
                </Button>
                <Button asChild size="sm">
                  <RegisterLink postLoginRedirectURL="/reservations">
                    Sign Up
                  </RegisterLink>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen bg-gradient-to-r from-blue-900 to-indigo-900">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: "url('/images/hero-bg.jpg')",
              backgroundPosition: "center 20%",
            }}
          ></div>

          <div className="relative z-20 flex items-center justify-center h-full pt-16">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Experience Luxury
                <span className="block text-blue-300">Like Never Before</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
                Discover comfort, elegance, and exceptional service in the heart
                of Dehiwala. Your perfect stay starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-3">
                  <RegisterLink postLoginRedirectURL="/reservations">
                    Book Your Stay
                  </RegisterLink>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-gray-900"
                >
                  <Link href="#rooms">View Rooms</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Serenity Hotel?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We provide everything you need for a memorable stay
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Free WiFi
                </h3>
                <p className="text-gray-600">
                  High-speed internet throughout the hotel
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Free Parking
                </h3>
                <p className="text-gray-600">
                  Secure parking available for all guests
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Restaurant
                </h3>
                <p className="text-gray-600">
                  Fine dining with local and international cuisine
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  24/7 Service
                </h3>
                <p className="text-gray-600">
                  Round-the-clock front desk and room service
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Room Types Section */}
        <section id="rooms" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Room Types
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from our variety of comfortable and luxurious
                accommodations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Standard Room */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-cover bg-center relative">
                  <Image
                    src="/images/standard-room.jpg"
                    alt="Standard Room"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Standard Room
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comfortable accommodation with modern amenities
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      $200
                    </span>
                    <span className="text-gray-500">per night</span>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Up to 2 guests</span>
                  </div>
                </div>
              </div>

              {/* Deluxe Room */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-cover bg-center relative">
                  <Image
                    src="/images/deluxe-room.jpg"
                    alt="Deluxe Room"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Deluxe Room
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Spacious room with premium amenities and city view
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      $300
                    </span>
                    <span className="text-gray-500">per night</span>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Up to 4 guests</span>
                  </div>
                </div>
              </div>

              {/* Suite */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-cover bg-center relative">
                  <Image
                    src="/images/suite-room.jpg"
                    alt="Luxury Suite"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Luxury Suite
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Ultimate luxury with separate living area and premium
                    services
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">
                      $500
                    </span>
                    <span className="text-gray-500">per night</span>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Up to 6 guests</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Hotel Amenities
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Enjoy our world-class facilities and services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-cover bg-center relative">
                  <Image
                    src="/images/restaurant.jpg"
                    alt="Restaurant"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">Fine Dining</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-cover bg-center relative">
                  <Image
                    src="/images/pool.jpg"
                    alt="Swimming Pool"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">Swimming Pool</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-cover bg-center relative">
                  <Image
                    src="/images/gym.jpg"
                    alt="Fitness Center"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">Fitness Center</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-cover bg-center relative">
                  <Image
                    src="/images/conference-room.jpg"
                    alt="Conference Room"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">Conference Room</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location & Contact Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Visit Us in Dehiwala
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Located in the heart of Dehiwala, we&apos;re just minutes away
                  from the beach, shopping centers, and major attractions.
                  Experience the perfect blend of convenience and tranquility.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-blue-400 mr-3" />
                    <span className="text-lg">
                      123 Seaside Avenue, Dehiwala, Sri Lanka
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 text-blue-400 mr-3" />
                    <Link
                      href="tel:94751234567"
                      className="text-lg hover:text-blue-400 transition"
                    >
                      +94-75-123-4567
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6">Ready to Book?</h3>
                <p className="text-gray-300 mb-6">
                  Create an account or sign in to start your reservation
                  process. Our team is ready to assist you with any questions.
                </p>
                <div className="space-y-4">
                  <Button asChild className="w-full text-lg py-3">
                    <RegisterLink postLoginRedirectURL="/reservations">
                      Create Account & Book Now
                    </RegisterLink>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full text-lg py-3 border-white text-white hover:bg-white hover:text-gray-900"
                  >
                    <LoginLink postLoginRedirectURL="/reservations">
                      Sign In to My Account
                    </LoginLink>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Serenity Hotel</h3>
              <p className="text-gray-300 mb-4">
                Experience luxury and comfort in the heart of Dehiwala
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-400">
                <span>© 2024 Serenity Hotel. All rights reserved.</span>
                <span>•</span>
                <span>Privacy Policy</span>
                <span>•</span>
                <span>Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
