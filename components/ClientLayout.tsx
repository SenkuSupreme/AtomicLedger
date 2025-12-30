'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import QuickNotes from './QuickNotes';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center text-gray-400 bg-black font-mono text-xs uppercase tracking-widest animate-pulse">Synchronizing Session...</div>;
  }

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-white/10">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className={`flex-1 flex flex-col h-screen overflow-y-auto scrollbar-hide transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[280px]'}`}>
        <Header />
        <main className="relative flex-1">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: "linear" }}
                    className="p-8 pb-24"
                >
                    {children}
                </motion.div>
        </main>
      </div>
      <QuickNotes />
      <Toaster position="top-right" theme="dark" richColors closeButton />
    </div>
  );
}
