import { addHandled, adStatsItem, getAdStats, isAdHandledMessage } from '../lib/ads-stats';
import { requestLayerActive } from '../lib/ads-flags';
import { getSettings, watchSettings, type Settings } from '../lib/settings';

/** Id of the static ruleset declared in the manifest (see wxt.config.ts). */
const ADS_RULESET = 'ads';

async function syncRequestRules(settings: Settings) {
  const on = requestLayerActive(settings);
  await browser.declarativeNetRequest.updateEnabledRulesets(
    on ? { enableRulesetIds: [ADS_RULESET] } : { disableRulesetIds: [ADS_RULESET] },
  );
}

export default defineBackground(() => {
  // Layer 1 follows the settings; rulesets persist, so this also repairs drift after updates.
  void getSettings().then(syncRequestRules);
  watchSettings((settings) => void syncRequestRules(settings));

  // Counter writes are serialized here, so many tabs cannot overwrite each other.
  let queue: Promise<unknown> = Promise.resolve();
  browser.runtime.onMessage.addListener((message: unknown) => {
    if (!isAdHandledMessage(message)) return;
    queue = queue.then(async () =>
      adStatsItem.setValue(addHandled(await getAdStats(), message.layer)),
    );
  });
});
