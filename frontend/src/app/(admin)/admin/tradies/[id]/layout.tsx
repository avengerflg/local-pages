export async function generateStaticParams() {
  return [{ id: '1' }];
}

export default function AdminTradieDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
