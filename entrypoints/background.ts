export default defineBackground(() => {
  // The removed ad counter left `adStats` in local storage. Drop it once, on update.
  browser.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'update') void browser.storage.local.remove('adStats');
  });
});
