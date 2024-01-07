# <img valign="middle" style="vertical-align: middle;" src="src/icons/pratikabu-stt-128.png" width="36px"> Scroll To Top

Scroll to top and vice versa in a desktop browser. A browser extension for Chrome, Firefox.

[Release Notes](https://github.com/pratikabu/scrolltotop/releases) | [@scrolltotop](https://twitter.com/scrolltotop) | [Discuss](https://github.com/pratikabu/scrolltotop/discussions)

## Download:

[link-chrome]: https://chrome.google.com/webstore/detail/scroll-to-top/hegiignepmecppikdlbohnnbfjdoaghj "Chrome Extension"
[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/scroll-to-top/ "Mozilla Add-on"
[link-chrome-review]: https://chrome.google.com/webstore/detail/scroll-to-top/hegiignepmecppikdlbohnnbfjdoaghj/reviews "Chrome Extension Review"
[link-opera-review]: https://addons.opera.com/en/extensions/details/scroll-to-top#feedback-container "Opera Extension Review"

- Download for [Google Chrome][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/hegiignepmecppikdlbohnnbfjdoaghj?label=%20">][link-chrome]
  - Can be used for other Chromium browsers as well. Like: _Microsoft Edge, Brave, Opera, etc_.
- Download for [Mozilla Firefox][link-firefox] [<img valign="middle" src="https://img.shields.io/amo/v/scroll-to-top?label=%20">][link-firefox]

## Contribute:
- Spread the word by sharing this page.
- Rate the extension on [Chrome][link-chrome-review], [Firefox][link-firefox] galleries.
- Support development by [Donating](https://pratikabu.com/donate).
- Help me translate the addon.

## How to Run:
- The `src` folder contains all the code to be used in any Chromium browsers to load as a temporary extension.
- To debug for Firefox, use the `firefox` folder in the `generated` folder.
  - You'll have to run `./build.sh` to generate the `generated` folder.

## Bookmarklet
If someone does not like installing an extension. Then you can create this Bookmark in your bookmark toolbar.

This bookmarklet will scroll up or down based on the location of your screen.

**Bookmark Name:** ↑↓
```javascript
javascript:(function () {var paBody = document.body, paHtml = document.documentElement, paMaxY = Math.max(paBody.scrollHeight, paBody.offsetHeight, paHtml.clientHeight, paHtml.scrollHeight, paHtml.offsetHeight) - window.innerHeight, paBreakPoint = 300; if(window.scrollY > paBreakPoint || paBreakPoint >= paMaxY && window.scrollY != 0) window.scroll({top: 0, behavior: 'smooth'}); else window.scroll({top: paMaxY, behavior: 'smooth'});})();
```

There is a no-permission version of this extension, if someone is concerned about the permissions that this extension requires.
https://github.com/pratikabu/scrolltotop-lite

Read more about the [author](https://pratikabu.com).
