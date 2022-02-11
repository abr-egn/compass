
// import { injectGlobal } from '@mongodb-js/compass-components';
import { css } from '@mongodb-js/compass-components';

import { injectThemedGlobal } from './themed-global';

export function globallyApplyBootstrap(): void {
  // injectGlobal(bootstrapStyles);
  // import bootstrapStyles from './test.less';

  // injectThemedGlobal(bootstrapStyles);
  // injectThemedGlobal(await import('./test.less'))
  const bootstraps = css(require('./test.less'));
  console.log('bootstraps', bootstraps);
  // const bootstraps = require('./test.less');
  // injectThemedGlobal(bootstraps);
}
