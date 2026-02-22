"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Settings, ArrowLeft } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-primary font-semibold text-lg hover:opacity-80 transition-opacity">
            <Flame className="h-5 w-5" />
            FIRE
          </Link>
          {!isHome && (
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          )}
        </div>
        <Link
          href="/settings"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
