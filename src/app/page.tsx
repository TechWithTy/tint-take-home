"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [readme, setReadme] = useState<string>("Loading README...");

  useEffect(() => {
    fetch("/UpdatedREADME.md")
      .then((res) => {
        if (!res.ok) throw new Error("Local README fetch failed");
        return res.text();
      })
      .then((text) => setReadme(text))
      .catch(() => setReadme("Failed to load README."));
  }, []);


  return (
    <main className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      {/* Top Right Login Button */}


      {/* Centered Image */}
      <div className="mt-20">
        <Image
          src="/heytint_logo.jpg"
          alt="Next.js Logo"
          width={75}
          height={75}
          priority
        />
      </div>

      {/* Scrollable Markdown Container */}
      <div className="mt-10 w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">📖 GitHub README</h2>
        <div className="h-60 overflow-y-auto p-4 bg-gray-100 rounded-lg border border-gray-300">
          <ReactMarkdown >{readme}</ReactMarkdown>
        </div>
      </div>
    </main>
  );
}
