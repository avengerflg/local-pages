export async function generateStaticParams() {
  return [
    { slug: 'plumber' },
    { slug: 'electrician' },
    { slug: 'cleaner' },
    { slug: 'painter' },
    { slug: 'concreting' },
    { slug: 'pest-control' },
    { slug: 'landscaping' }
  ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
