import { Header } from "@/components/shared";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-screen overflow-y-auto flex flex-col">
      <div>
        <Header />
      </div>
      <div className="flex-grow">{children}</div>
    </main>
  );
}
