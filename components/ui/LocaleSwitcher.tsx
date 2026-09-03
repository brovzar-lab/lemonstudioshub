'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleLocaleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale as (typeof routing.locales)[number] });
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language switcher">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          disabled={locale === loc}
          aria-current={locale === loc ? 'true' : undefined}
          className={`rounded px-2 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${
            locale === loc
              ? 'bg-surface text-text-primary cursor-default'
              : 'text-text-secondary hover:bg-surface hover:text-text-primary'
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
