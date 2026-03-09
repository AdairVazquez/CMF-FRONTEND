export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0A0D12" }}
    >
      {children}
    </div>
  );
}
