import { AppShell } from "@/components/app-shell";

export default function CareAppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
