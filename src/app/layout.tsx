import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar"; // IMPORTING THE NEW COMPONENT

export const metadata: Metadata = {
  title: "UBIT Hub",
  description: "The unofficial student hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#fffdf8] font-sans text-black selection:bg-black selection:text-yellow-400">
        
        {/* Our extracted Client Component */}
        <Navbar />

        {/* Page Content */}
        {children}

      </body>
    </html>
  );
}