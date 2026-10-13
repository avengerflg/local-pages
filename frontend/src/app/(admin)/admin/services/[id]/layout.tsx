export async function generateStaticParams() {
  return [{ id: '1' }];
}

export default function AdminServiceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
