import Link from "next/link";

export default function Home() {
  return (
    <div
      className="bg-black bg-home-img bg-cover bg-center"
      suppressHydrationWarning
    >
      <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh">
        <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/90 w-4/5 sm:max-w-96 mx-auto text-white sm:text-2xl ">
          <h1 className="text-4xl font-bold">
            Roobesh&apos;s Computer <br /> Repair Shop
          </h1>
          <address>
            No 1 Ranajayagama Road, Waidya Road <br />
            Dehiwala , Sri Lanka
          </address>
          <p>Open Daily: 9am to 5pm</p>
          <Link href="tel:94757773459" className="hover:underline">
            +94-75-777-3459
          </Link>
        </div>
      </main>
    </div>
  );
}
