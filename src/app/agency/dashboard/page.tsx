import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users, agencies, creditsBalance } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export default async function AgencyDashboard() {
  const session = await auth();

  if (!session?.user || ((session.user as any).role !== 'agency_admin' && (session.user as any).role !== 'admin')) {
    redirect('/login');
  }

  const agencyId = session.user.agencyId;
  if (!agencyId) {
    return <div>No agency associated with this account.</div>;
  }

  // Fetch agency details
  const [agency] = await db.select().from(agencies).where(eq(agencies.id, agencyId)).limit(1);
  
  // Fetch sub-users count
  const [userCount] = await db.select({ value: count() }).from(users).where(eq(users.agencyId, agencyId));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agency Command Center</h1>
          <p className="text-slate-500">Managing {agency?.name}</p>
        </div>
        <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
          <span className="text-sm font-medium text-indigo-600 block">Total Sub-Users</span>
          <span className="text-2xl font-bold text-indigo-950">{userCount.value}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-2">Agency Branding</h3>
          <p className="text-sm text-slate-500 mb-4">Customize how your users see the platform.</p>
          <a href="/agency/settings" className="text-indigo-600 text-sm font-bold hover:underline">Edit Branding &rarr;</a>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-2">User Management</h3>
          <p className="text-sm text-slate-500 mb-4">Add, remove or update your team members.</p>
          <a href="/agency/users" className="text-indigo-600 text-sm font-bold hover:underline">Manage Users &rarr;</a>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-2">Credit Allocation</h3>
          <p className="text-sm text-slate-500 mb-4">Distribute credits to your sub-users.</p>
          <a href="/agency/credits" className="text-indigo-600 text-sm font-bold hover:underline">Manage Credits &rarr;</a>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 text-lg">Recent Sub-Users</h2>
          <button className="text-sm text-slate-400 font-medium hover:text-slate-600">View All</button>
        </div>
        <div className="p-6 text-center text-slate-400 py-12">
          Sub-user activity feed will appear here.
        </div>
      </div>
    </div>
  );
}
