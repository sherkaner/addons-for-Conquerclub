// ==UserScript==
// @name           Conquer Club Contrast Corrector (C4)
// @namespace      tag:516ender@gmail.com,2012:greasemonkey_scripts
// @description    Replaces the text-shadow on army_outline objects with two outlines (an inner black, and an outer white) for optimum contrast on all backgrounds
// @include        http://www.conquerclub.com/game.php?*
// @include        https://www.conquerclub.com/game.php?*
// @version        1.2
// ==/UserScript==

if (typeof GM_addStyle == 'undefined') {
  GM_addStyle = function(css) {
    var style = document.createElement('style');
    style.textContent = css;
    document.getElementsByTagName('head')[0].appendChild(style);
  };
}

GM_addStyle(".army_outline { text-shadow: black 0px -1px 0px, black 0px 1px 0px, black -1px 0px 0px, black 1px 0px 0px, white 0px -2px 0px, white 0px 2px 0px, white -2px 0px 0px, white 2px 0px 0px, white -1px -1px 0px, white 1px 1px 0px, white -1px 1px 0px, white 1px -1px 0px ! important}");
