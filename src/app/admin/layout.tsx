import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin Panel | Jisub Kim",
  description: "Admin dashboard for kimjisub.com",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-[#0F172A] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
