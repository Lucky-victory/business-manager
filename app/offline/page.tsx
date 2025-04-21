import React from "react";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <WifiOff className="h-24 w-24 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          You're offline
        </h1>
        <p className="text-gray-600 mb-8">
          It seems you're not connected to the internet. Some features of Biz
          Manager may not be available while you're offline.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold text-gray-800 mb-2">
              What you can do:
            </h2>
            <ul className="text-gray-600 text-left space-y-2">
              <li>• Check your internet connection</li>
              <li>• Try again later</li>
              <li>• Some cached data may still be available</li>
            </ul>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3 px-4 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Try again
          </Link>
        </div>
      </div>
    </div>
  );
}
