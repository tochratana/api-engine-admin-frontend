"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Next.js PWA</h1>

      <nav className="mb-8">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-blue-500 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="text-blue-500 hover:underline">
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>

      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Features:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>PWA Support</li>
          <li>Redux Integration</li>
          <li>API Integration</li>
          <li>Responsive Design</li>
        </ul>
      </div>
    </div>
  );
}
