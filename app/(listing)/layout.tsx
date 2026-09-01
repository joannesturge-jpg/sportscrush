import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SportsCrush Listing Tool",
  description: "Add a product once — publish everywhere",
};

export default function ListingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <span className="text-xl font-bold text-brand">SportsCrush</span>
        <span className="text-gray-400 text-sm font-medium">Listing Tool</span>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
