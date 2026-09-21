import type { Metadata, Viewport } from "next";
import { CareProvider } from "@/components/care-provider";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Be My Light",
    template: "%s | Be My Light",
  },
  description:
    "A calm community for people navigating health challenges and the people who support them.",
  applicationName: "Be My Light",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Be My Light",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f0e4",
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
