import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    default_locale: 'en',
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    permissions: ['storage', 'declarativeNetRequest'],
    declarative_net_request: {
      // Off by default: the background turns it on from the ad settings.
      rule_resources: [{ id: 'ads', enabled: false, path: 'rules/ads.json' }],
    },
  },
});
