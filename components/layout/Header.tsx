'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-gray-300 bg-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            TicketHub
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className={`px-3 py-2 border-2 ${
                pathname === '/'
                  ? 'border-gray-900 bg-gray-100'
                  : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              Home
            </Link>
            <Link
              href="/account"
              className={`px-3 py-2 border-2 ${
                pathname.startsWith('/account')
                  ? 'border-gray-900 bg-gray-100'
                  : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              Account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
