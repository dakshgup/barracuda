import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import { ThemeProvider } from './context/ThemeContext';
import { RedModeToggle } from './components/RedModeToggle';
import { useTheme } from './context/ThemeContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Front Desk",
  description: "Front Desk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <RedModeWrapper>
          {children}
        </RedModeWrapper>
      </ThemeProvider>
    </html>
  );
}

function RedModeWrapper({ children }: { children: React.ReactNode }) {
  const { isRedMode } = useTheme();
  
  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased ${
        isRedMode ? 'red' : ''
      }`}
    >
      <nav className="w-full p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Image 
            src="/v0.png"
            alt="Logo"
            width={40}
            height={40}
            priority
          />
          <RedModeToggle />
        </div>
      </nav>
      {children}
    </body>
  );
}
