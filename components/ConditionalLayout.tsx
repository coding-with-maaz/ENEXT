'use client';

import { usePathname } from 'next/navigation';
import AnimatedNavbar from '@/components/AnimatedNavbar';
import Footer from '@/components/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin pages have their own layout, don't show navbar/footer
    return <>{children}</>;
  }

  return (
    <>
      <AnimatedNavbar />
      <main className="pt-20" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

