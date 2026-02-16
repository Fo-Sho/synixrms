import Link from 'next/link';
import {Logo} from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-4 text-sm text-slate-600 max-w-xs">
              Synix RMS helps hospitality teams optimize pricing,
              increase conversions, and unlock new revenue streams.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Product
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#pricing">Pricing</Link></li>
              <li><Link href="/demo">Request Demo</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Company
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Legal
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Synix RMS. All rights reserved.</p>
          <p>Built for modern hospitality teams.</p>
        </div>
      </div>
    </footer>
  );
}
