import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Campus Hub",
  description: "The unofficial student hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f8f8f6] font-sans text-black selection:bg-black selection:text-yellow-400">
        
        {/* Global Navbar */}
        <nav className="flex items-center justify-between border-b-4 border-black bg-[#f8f8f6] px-8 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="rotate-[-6deg] bg-black px-2 py-1 text-xl font-black text-yellow-400">
              CH
            </div>
            <span className="text-2xl font-black tracking-tight uppercase">Campus Hub</span>
          </Link>
          <div className="hidden space-x-6 md:flex font-bold text-sm uppercase tracking-wider">
            <Link href="/" className="px-3 py-1 hover:underline decoration-2 underline-offset-4">Home</Link>
            <Link href="#" className="px-3 py-1 hover:underline decoration-2 underline-offset-4">Teachers</Link>
            <Link href="#" className="px-3 py-1 hover:underline decoration-2 underline-offset-4">Requests</Link>
            <Link href="#" className="px-3 py-1 hover:underline decoration-2 underline-offset-4">Notes</Link>
            <Link href="#" className="px-3 py-1 hover:underline decoration-2 underline-offset-4">Chat</Link>
            <Link href="#" className="px-3 py-1 hover:underline decoration-2 underline-offset-4">Map</Link>
          </div>
        </nav>

        {/* Page Content */}
        {children}

      </body>
    </html>
  );
}