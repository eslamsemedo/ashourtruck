import Menu from "@/components/floating-action-menu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      <Menu />
    </div>
  );
}
