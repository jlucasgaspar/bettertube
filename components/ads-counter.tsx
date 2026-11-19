import { useEffect, useState } from 'react';
import { useApp } from '../lib/app-context';
import {
  EMPTY_AD_STATS,
  getAdStats,
  resetAdStats,
  totalHandled,
  watchAdStats,
  type AdStats,
} from '../lib/ads-stats';

/** How many ads BetterTube handled, with a reset. Lives in the options Ads section. */
export function AdsCounter() {
  const { t } = useApp();
  const [stats, setStats] = useState<AdStats>(EMPTY_AD_STATS);

  useEffect(() => {
    let active = true;
    void getAdStats().then((value) => active && setStats(value));
    const unwatch = watchAdStats((value) => active && setStats(value));
    return () => {
      active = false;
      unwatch();
    };
  }, []);

  return (
    <div className="flex items-start gap-4 border-b border-line py-4">
      <div className="min-w-0 flex-1">
        <div className="text-base font-medium">{t('ads.stats.title')}</div>
        <div className="mt-0.5 text-sm text-muted">
          {t('ads.stats.desc', {
            count: totalHandled(stats),
            stripped: stats.stripped,
            skipped: stats.skipped,
          })}
        </div>
      </div>
      <button
        type="button"
        className="btn self-center"
        disabled={totalHandled(stats) === 0}
        onClick={() => void resetAdStats()}
      >
        {t('ads.stats.reset')}
      </button>
    </div>
  );
}
