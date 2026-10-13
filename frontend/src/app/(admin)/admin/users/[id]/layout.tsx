export async function generateStaticParams() {
  return [{ id: '1' }];
}

export default function AdminUserDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
