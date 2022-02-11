// import { injectGlobal } from '@mongodb-js/compass-components';

import { injectThemedGlobal } from './themed-global';

const resetCssString = `
/* From: http://meyerweb.com/eric/tools/css/reset/ */

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

*, *::after, *::before {
  box-sizing: border-box;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
}



html,
body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Akzidenz', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #494747;/* @gray1;*/
  background-color: #f5f6f7; /* @gray8;*/
  -webkit-font-smoothing: antialiased;
}

:root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Akzidenz', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #494747;/* @gray1;*/
  background-color: #f5f6f7; /* @gray8;*/
  -webkit-font-smoothing: antialiased;
  
}

`

export function globallyResetCss(): void {
  // injectGlobal(resetCssString);
  injectThemedGlobal(resetCssString);
}
