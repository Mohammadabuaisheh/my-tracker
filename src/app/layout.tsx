import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/features/navigation/sidebar";
import { MobileNav } from "@/components/features/navigation/mobile-nav";
import { CommandPalette } from "@/components/features/search/command-palette";
import { getIssues } from "@/db/queries/issues";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Tracker",
  description: "Personal issue and task tracker",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const allIssues = await getIssues();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased flex h-screen overflow-hidden bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NuqsAdapter>
            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <MobileNav />

              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                {children}
              </main>
            </div>

            {modal}
            <CommandPalette issues={allIssues as any} />
            <Toaster position="bottom-right" richColors />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}