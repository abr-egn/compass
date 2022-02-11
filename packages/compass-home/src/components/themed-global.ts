import createCache from '@emotion/cache';
import { cache } from '@mongodb-js/compass-components';
import { serializeStyles } from '@emotion/serialize';

export const globalThemeCache = createCache({ key: 'global-theme' });

// TODO: types
export function injectThemedGlobal(...args: any[]) {
  const serialized = serializeStyles(args, cache.registered);

  if (!globalThemeCache.inserted[serialized.name]) {
    globalThemeCache.insert('', serialized, globalThemeCache.sheet, true);
  }
}

export function flushThemedGlobals() {
  globalThemeCache.sheet.flush();
  globalThemeCache.inserted = {};
  globalThemeCache.registered = {};
}
