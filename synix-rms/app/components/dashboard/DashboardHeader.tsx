'use client';

import { UserButton } from '@clerk/nextjs';

export default function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <span className="text-sm text-slate-600">Dashboard</span>

      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-8 w-8"
          }
        }}
      />
    </header>
  );
}