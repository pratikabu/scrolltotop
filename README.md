# <img valign="middle" style="vertical-align: middle;" src="rdmd-res/pratikabu-stt-256.png" width="36px"> Scroll To Top

Scroll to top and vice versa in a desktop browser. A browser extension for Chrome, Firefox, Safari, Opera.

[Release Notes](https://github.com/pratikabu/scrolltotop/releases) | [@scrolltotop](https://twitter.com/scrolltotop) | [Discuss](https://github.com/pratikabu/scrolltotop/discussions)

## Download:

[link-chrome]: https://chrome.google.com/webstore/detail/scroll-to-top/hegiignepmecppikdlbohnnbfjdoaghj "Chrome Extension"
[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/scroll-to-top/ "Mozilla Add-on"
[link-chrome-review]: https://chrome.google.com/webstore/detail/scroll-to-top/hegiignepmecppikdlbohnnbfjdoaghj/reviews "Chrome Extension Review"
[link-opera-review]: https://addons.opera.com/en/extensions/details/scroll-to-top#feedback-container "Opera Extension Review"

- Download for [Google Chrome][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/hegiignepmecppikdlbohnnbfjdoaghj?label=%20">][link-chrome]
- Download for [Mozilla Firefox][link-firefox] [<img valign="middle" src="https://img.shields.io/amo/v/scroll-to-top?label=%20">][link-firefox]
- Download for [Opera](https://addons.opera.com/en/extensions/details/scroll-to-top)
- Download for [Apple Safari](http://pratikabu.users.sourceforge.net/extensions/scrolltotop/safaridownload.php) (Obsolete)

## Contribute:
- Spread the word by sharing this page.
- Rate the extension on [Chrome][link-chrome-review], [Firefox][link-firefox], [Opera][link-opera-review] galleries.
- Support development by [Donating](https://pratikabu.com/donate).
- Help me translate the addon.

## How to Build:
Currently the build system is based on Apache Ant.
- Load the ants/build.xml file in the Ant view.
- Execute the respective browser task.
- You can also run ant on ants/build.xml directly, in this case it will generate the deployment code for all browsers.
- This can then be used in respective browsers to load as a temporary extension.

<img width="250px" src="rdmd-res/generated-folder-structure.png">

## Bookmarklet
If someone does not like installing an extension. Then you can create this Bookmark in your bookmark toolbar.

This bookmarklet will scroll up or down based on the location of your screen.

**Bookmark Name:** ↑↓
```javascript
javascript:var pratikabuBodyXazd4n = document.body, pratikabuHtmlXazd4n = document.documentElement, pratikabuMaxYXazd4n = Math.max(pratikabuBodyXazd4n.scrollHeight, pratikabuBodyXazd4n.offsetHeight, pratikabuHtmlXazd4n.clientHeight, pratikabuHtmlXazd4n.scrollHeight, pratikabuHtmlXazd4n.offsetHeight) - window.innerHeight, pratikabuBreakPointXazd4n = 300; if(window.scrollY > pratikabuBreakPointXazd4n || pratikabuBreakPointXazd4n >= pratikabuMaxYXazd4n && window.scrollY != 0) window.scroll({top: 0, behavior: 'smooth'}); else window.scroll({top: pratikabuMaxYXazd4n, behavior: 'smooth'});
```

Read more about the [author](https://pratikabu.com).
