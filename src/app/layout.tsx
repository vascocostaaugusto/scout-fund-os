import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { LiveActivityToasts } from "@/components/layout/live-activity-toasts";
import { CommandPalette } from "@/components/layout/command-palette";
import { DealStoreProvider } from "@/lib/deal-store";
import { ScoutOnboardingProvider } from "@/lib/scout-onboarding-store";
import { CandidateStoreProvider } from "@/lib/candidate-store";
import { InboxStoreProvider } from "@/lib/inbox-store";

// Archivo — the closest Google-hosted match to the Shapers wordmark: a
// geometric grotesque with flat terminals and a straight-legged R. Used for
// both UI text and display, with weight and tracking doing the work.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scout Fund OS · Shapers",
  description:
    "Internal architecture console for the Shapers Scout Fund program — network, workflow, incentives, and performance in one system.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider delay={150}>
            <DealStoreProvider>
              <ScoutOnboardingProvider>
                <CandidateStoreProvider>
                  <InboxStoreProvider>
                    <AppShell>{children}</AppShell>
                    <LiveActivityToasts />
                  </InboxStoreProvider>
                </CandidateStoreProvider>
              </ScoutOnboardingProvider>
            </DealStoreProvider>
            <CommandPalette />
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
