import Link from 'next/link';

const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Pricing Rules', href: '/dashboard/pricing' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Billing', href: '/dashboard/billing' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white">
      <div className="px-6 py-5 text-lg font-semibold text-slate-900">
        Synix RMS
      </div>

      <nav className="px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
