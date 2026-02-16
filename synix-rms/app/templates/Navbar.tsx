'use client';

import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Link } from '@/libs/i18nNavigation';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' }
];

// Create a separate component for Clerk-dependent parts
function ClerkAuthSection() {
  const [mounted, setMounted] = useState(false);
  const [ClerkComponents, setClerkComponents] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Clerk components after mount
    const loadClerk = async () => {
      try {
        const clerk = await import('@clerk/nextjs');
        setClerkComponents(clerk);
        setMounted(true);
      } catch (error) {
        console.error('Failed to load Clerk components:', error);
        setMounted(true); // Still set mounted to show fallback
      }
    };

    loadClerk();
  }, []);

  if (!mounted || !ClerkComponents) {
    return (
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/sign-in"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Sign Up
        </Link>
        <Link
          href="/demo"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Request Demo
        </Link>
      </div>
    );
  }

  const { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } = ClerkComponents;

  return (
    <div className="hidden md:flex items-center gap-4">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Sign Up
          </button>
        </SignUpButton>
        <Link
          href="/demo"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Request Demo
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Dashboard
        </Link>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}

function ClerkMobileAuthSection({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [ClerkComponents, setClerkComponents] = useState<any>(null);

  useEffect(() => {
    const loadClerk = async () => {
      try {
        const clerk = await import('@clerk/nextjs');
        setClerkComponents(clerk);
        setMounted(true);
      } catch (error) {
        console.error('Failed to load Clerk components:', error);
        setMounted(true);
      }
    };

    loadClerk();
  }, []);

  if (!mounted || !ClerkComponents) {
    return (
      <div className="pt-4 border-t border-slate-200">
        <Link
          href="/sign-in"
          className="block text-sm font-medium text-slate-700"
          onClick={() => onClose()}
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="mt-2 block text-sm font-medium text-slate-700"
          onClick={() => onClose()}
        >
          Sign Up
        </Link>
        <Link
          href="/demo"
          className="mt-3 block rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white"
          onClick={() => onClose()}
        >
          Request Demo
        </Link>
      </div>
    );
  }

  const { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } = ClerkComponents;

  return (
    <div className="pt-4 border-t border-slate-200">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="block text-sm font-medium text-slate-700">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="mt-2 block text-sm font-medium text-slate-700">
            Sign Up
          </button>
        </SignUpButton>
        <Link
          href="/demo"
          className="mt-3 block rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white"
          onClick={() => onClose()}
        >
          Request Demo
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/dashboard"
          className="block text-sm font-medium text-slate-700"
          onClick={() => onClose()}
        >
          Dashboard
        </Link>
        <div className="mt-3">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <ClerkAuthSection />

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-md p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {open ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="space-y-4 px-6 py-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block text-sm font-medium text-slate-700"
              >
                {item.label}
              </a>
            ))}

            <ClerkMobileAuthSection onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}