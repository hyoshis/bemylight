import type { Metadata, Viewport } from "next";
import { CareProvider } from "@/components/care-provider";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CareTogether",
    template: "%s | CareTogether",
  },
  description:
    "A calm place for caregivers to connect, focus on what matters now, and remember to care for themselves.",
  applicationName: "CareTogether",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CareTogether",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f2ea",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CareProvider>{children}</CareProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
