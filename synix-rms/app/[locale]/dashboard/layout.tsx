import { auth } from '@clerk/nextjs/server';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // 🚫 Not signed in - let Clerk middleware handle this
  if (!userId) {
    return null;
  }

  // Completely removed all subscription-related code to fix database errors
  // TODO: Re-add subscription logic once database schema is properly aligned

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          {children}

          {/* Temporary upgrade prompts - static for now */}
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            Upgrade to Pro to unlock Real-time Pricing 🚀
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
            Upgrade to Pro to unlock Advanced Analytics 📊
          </div>
        </main>
      </div>
    </div>
  );
}