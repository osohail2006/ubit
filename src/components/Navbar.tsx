'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

// Array holding all tab data to keep the code clean
const navLinks = [
  { name: 'Teachers', href: '/teachers', color: 'bg-blue-400', hoverColor: 'hover:bg-blue-400' },
  { name: 'Requests', href: '/requests', color: 'bg-[#ff5733]', hoverColor: 'hover:bg-[#ff5733]' },
  { name: 'Notes', href: '/notes', color: 'bg-emerald-400', hoverColor: 'hover:bg-emerald-400' },
  { name: 'Chat', href: '/chat', color: 'bg-purple-400', hoverColor: 'hover:bg-purple-400' },
  { name: 'Map', href: '/map', color: 'bg-yellow-400', hoverColor: 'hover:bg-yellow-400' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    // Changed the background from #fffdf8 to a dusky cream: #e6ddc5
    <nav className="flex items-center justify-between border-b-4 border-black bg-[#e6ddc5] px-6 py-4 md:px-12">
      
      {/* Logo Section */}
      <Link href="/" className="group flex items-center gap-4">
        <div className="border-4 border-black bg-blue-500 px-3 py-2 text-2xl font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          UB
        </div>
        <span className="text-3xl font-black uppercase tracking-tighter text-black">UBIT Hub</span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden items-center space-x-5 font-black text-sm uppercase tracking-widest md:flex">
        {navLinks.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          
          return (
            <Link 
              key={link.name}
              href={link.href} 
              className={`border-4 border-black px-4 py-2 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                isActive 
                  ? `${link.color} translate-y-0` 
                  : `bg-[#fffdf8] ${link.hoverColor}` // Keeps the inactive buttons slightly lighter to contrast with the dusky navbar
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

    </nav>
  );
}