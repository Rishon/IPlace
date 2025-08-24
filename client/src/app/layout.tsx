import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "IPlace",
  description: "Collaborative, real-time pixel canvas layered over the Israeli map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="flex">
          {children}
        </main>
      </body>
    </html>
  );
}
