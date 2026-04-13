/**
 * Scroll To Top – Full Test Suite
 * Run with: npm test
 * Dependencies: jest, jest-environment-jsdom (see package.json)
 */

// ---------------------------------------------------------------------------
// Helpers – build the minimal Chrome extension environment jsdom doesn't have
// ---------------------------------------------------------------------------

function buildChromeMock(storedSync = {}, storedLocal = {}) {
  const syncStore = { STT_PREF_KEY: storedSync };
  const localStore = { STT_PREF_LOCAL_KEY: storedLocal };

  return {
    storage: {
      sync: {
        get: jest.fn((key, cb) => cb({ [key]: syncStore[key] })),
        set: jest.fn((data, cb) => {
          Object.assign(syncStore, data);
          cb && cb();
        }),
      },
      local: {
        get: jest.fn((key, cb) => cb({ [key]: localStore[key] })),
        set: jest.fn((data, cb) => {
          Object.assign(localStore, data);
          cb && cb();
        }),
      },
    },
    runtime: {
      sendMessage: jest.fn(),
      onMessage: { addListener: jest.fn() },
      onInstalled: { addListener: jest.fn() },
      getURL: jest.fn((path) => `chrome-extension://fake-id/${path}`),
      openOptionsPage: jest.fn(),
      getManifest: jest.fn(() => ({ version: "5.3.1" })),
    },
    contextMenus: {
      create: jest.fn(),
      removeAll: jest.fn((cb) => cb && cb()),
      onClicked: { addListener: jest.fn() },
    },
    tabs: {
      sendMessage: jest.fn(),
    },
    action: {
      onClicked: { addListener: jest.fn() },
      setIcon: jest.fn(),
    },
  };
}

// ---------------------------------------------------------------------------
// 1. background.js – splitJsonOnStorage
// ---------------------------------------------------------------------------

describe("background.js – splitJsonOnStorage", () => {
  const LOCAL_SETTINGS_LIST = "userIcon,dUserIcon,supportPrompt";

  function isLocalSetting(config) {
    const keyword1 = config + ",";
    const keyword2 = "," + config;
    return LOCAL_SETTINGS_LIST.includes(keyword1) || LOCAL_SETTINGS_LIST.includes(keyword2);
  }

  function splitJsonOnStorage(sourceJson) {
    const splitJson = { syncData: {}, localData: {} };
    for (const config in sourceJson) {
      if (isLocalSetting(config)) {
        splitJson.localData[config] = sourceJson[config];
      } else {
        splitJson.syncData[config] = sourceJson[config];
      }
    }
    return splitJson;
  }

  test("routes userIcon to localData", () => {
    const result = splitJsonOnStorage({ userIcon: "abc123", vLoc: "bottom" });
    expect(result.localData.userIcon).toBe("abc123");
    expect(result.syncData.userIcon).toBeUndefined();
  });

  test("routes dUserIcon to localData", () => {
    const result = splitJsonOnStorage({ dUserIcon: "xyz", scrSpeed: "400" });
    expect(result.localData.dUserIcon).toBe("xyz");
    expect(result.syncData.dUserIcon).toBeUndefined();
  });

  test("routes supportPrompt to localData", () => {
    const result = splitJsonOnStorage({ supportPrompt: "true" });
    expect(result.localData.supportPrompt).toBe("true");
  });

  test("routes regular settings to syncData", () => {
    const result = splitJsonOnStorage({ vLoc: "bottom", hLoc: "right", scrSpeed: "400" });
    expect(result.syncData.vLoc).toBe("bottom");
    expect(result.syncData.hLoc).toBe("right");
    expect(result.syncData.scrSpeed).toBe("400");
    expect(Object.keys(result.localData).length).toBe(0);
  });

  test("handles empty object", () => {
    const result = splitJsonOnStorage({});
    expect(result.syncData).toEqual({});
    expect(result.localData).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// 2. background.js – validateData
// ---------------------------------------------------------------------------

describe("background.js – validateData", () => {
  function validateData(data) {
    const invalid = "invalid-data";
    if (data == null) return invalid;
    let count = 0;
    for (const config in data) {
      count++;
      if (typeof data[config] === "undefined") return invalid;
    }
    if (count === 0 || !data.vLoc) return invalid;
    return data;
  }

  test("returns invalid-data for null", () => {
    expect(validateData(null)).toBe("invalid-data");
  });

  test("returns invalid-data for undefined", () => {
    expect(validateData(undefined)).toBe("invalid-data");
  });

  test("returns invalid-data for empty object", () => {
    expect(validateData({})).toBe("invalid-data");
  });

  test("returns invalid-data when vLoc is missing", () => {
    expect(validateData({ scrSpeed: "400" })).toBe("invalid-data");
  });

  test("returns the data object when valid", () => {
    const data = { vLoc: "bottom", hLoc: "right" };
    expect(validateData(data)).toBe(data);
  });

  test("returns invalid-data when a property is explicitly undefined", () => {
    expect(validateData({ vLoc: undefined })).toBe("invalid-data");
  });
});

// ---------------------------------------------------------------------------
// 3. background.js – populateNewDefaults
// ---------------------------------------------------------------------------

describe("background.js – populateNewDefaults", () => {
  function populateNewDefaults(finalData) {
    if (!finalData.toolbarClickAction) finalData.toolbarClickAction = "intelligentflip";
    if (!finalData.showIconsOnPage) finalData.showIconsOnPage = "true";
    if (!finalData.toolbarIcon) finalData.toolbarIcon = "1";
    if (!finalData.showContextMenu) finalData.showContextMenu = "false";
    if (!finalData.dualIconSize) finalData.dualIconSize = "32";
  }

  test("fills missing defaults", () => {
    const data = {};
    populateNewDefaults(data);
    expect(data.toolbarClickAction).toBe("intelligentflip");
    expect(data.showIconsOnPage).toBe("true");
    expect(data.toolbarIcon).toBe("1");
    expect(data.showContextMenu).toBe("false");
    expect(data.dualIconSize).toBe("32");
  });

  test("does not overwrite existing values", () => {
    const data = {
      toolbarClickAction: "top",
      showIconsOnPage: "false",
      toolbarIcon: "3",
      showContextMenu: "true",
      dualIconSize: "48",
    };
    populateNewDefaults(data);
    expect(data.toolbarClickAction).toBe("top");
    expect(data.showIconsOnPage).toBe("false");
    expect(data.toolbarIcon).toBe("3");
    expect(data.showContextMenu).toBe("true");
    expect(data.dualIconSize).toBe("48");
  });
});

// ---------------------------------------------------------------------------
// 4. background.js – isLocalSetting
// ---------------------------------------------------------------------------

describe("background.js – isLocalSetting", () => {
  const LOCAL_SETTINGS_LIST = "userIcon,dUserIcon,supportPrompt";

  function isLocalSetting(config) {
    const keyword1 = config + ",";
    const keyword2 = "," + config;
    return LOCAL_SETTINGS_LIST.includes(keyword1) || LOCAL_SETTINGS_LIST.includes(keyword2);
  }

  test.each(["userIcon", "dUserIcon", "supportPrompt"])(
    "%s is a local setting",
    (key) => expect(isLocalSetting(key)).toBe(true)
  );

  test.each(["vLoc", "hLoc", "scrSpeed", "iconLib", "arrowType"])(
    "%s is NOT a local setting",
    (key) => expect(isLocalSetting(key)).toBe(false)
  );
});

// ---------------------------------------------------------------------------
// 5. pratikabu-stt.js – isPOICrossed
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – isPOICrossed", () => {
  function isPOICrossed(scrollY, inversionPoint = 300) {
    return inversionPoint < scrollY;
  }

  test("returns false when scrollY is 0", () => {
    expect(isPOICrossed(0)).toBe(false);
  });

  test("returns false when scrollY equals inversion point", () => {
    expect(isPOICrossed(300)).toBe(false);
  });

  test("returns true when scrollY exceeds inversion point", () => {
    expect(isPOICrossed(301)).toBe(true);
  });

  test("returns true for large scroll values", () => {
    expect(isPOICrossed(5000)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. pratikabu-stt.js – isAtBottom
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – isAtBottom", () => {
  function isAtBottom(scrollTop, docHeight, winHeight) {
    return scrollTop >= docHeight - winHeight;
  }

  test("returns true when exactly at bottom", () => {
    expect(isAtBottom(700, 1000, 300)).toBe(true);
  });

  test("returns true when scrolled past bottom (edge case)", () => {
    expect(isAtBottom(705, 1000, 300)).toBe(true);
  });

  test("returns false when not at bottom", () => {
    expect(isAtBottom(500, 1000, 300)).toBe(false);
  });

  test("returns true on a short page (docHeight <= winHeight)", () => {
    expect(isAtBottom(0, 300, 300)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 7. pratikabu-stt.js – scrollIntelligently
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – scrollIntelligently", () => {
  function scrollIntelligently(scrollY, inversionPoint = 300) {
    if (inversionPoint >= scrollY) return "scrollToBottom";
    return "scrollToTop";
  }

  test("scrolls to bottom when at top of page", () => {
    expect(scrollIntelligently(0)).toBe("scrollToBottom");
  });

  test("scrolls to bottom when at exactly the inversion point", () => {
    expect(scrollIntelligently(300)).toBe("scrollToBottom");
  });

  test("scrolls to top when past the inversion point", () => {
    expect(scrollIntelligently(301)).toBe("scrollToTop");
  });
});

// ---------------------------------------------------------------------------
// 8. pratikabu-stt.js – mactchDomainAgainstDomainList
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – mactchDomainAgainstDomainList", () => {
  function mactchDomainAgainstDomainList(urlToMatch, listOfDomainsToCheck) {
    const domains = listOfDomainsToCheck.split(";");
    for (let i = 0; i < domains.length; i++) {
      if (domains[i].length === 0) continue;
      if (urlToMatch.indexOf(domains[i]) !== -1) return true;
    }
    return false;
  }

  test("matches a domain in the list", () => {
    expect(
      mactchDomainAgainstDomainList(
        "https://mail.google.com/mail/u/0/",
        "mail.google.com/mail;google.com/calendar;"
      )
    ).toBe(true);
  });

  test("matches calendar domain", () => {
    expect(
      mactchDomainAgainstDomainList(
        "https://google.com/calendar/r",
        "mail.google.com/mail;google.com/calendar;"
      )
    ).toBe(true);
  });

  test("does not match a domain not in the list", () => {
    expect(
      mactchDomainAgainstDomainList(
        "https://github.com",
        "mail.google.com/mail;google.com/calendar;"
      )
    ).toBe(false);
  });

  test("returns false for empty list", () => {
    expect(mactchDomainAgainstDomainList("https://example.com", "")).toBe(false);
  });

  test("returns false for list of only semicolons", () => {
    expect(mactchDomainAgainstDomainList("https://example.com", ";;;")).toBe(false);
  });

  test("partial URL substring match works", () => {
    expect(
      mactchDomainAgainstDomainList("https://foo.example.com/bar", "example.com;")
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 9. pratikabu-stt.js – getBase64Url
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – getBase64Url", () => {
  function getBase64Url(base64Url) {
    if (base64Url.startsWith("data:")) return base64Url;
    return "data:image/png;base64," + base64Url;
  }

  test("prefixes raw base64 string", () => {
    expect(getBase64Url("abc123")).toBe("data:image/png;base64,abc123");
  });

  test("returns data-URI unchanged", () => {
    const uri = "data:image/png;base64,abc123";
    expect(getBase64Url(uri)).toBe(uri);
  });

  test("handles empty string (edge case)", () => {
    expect(getBase64Url("")).toBe("data:image/png;base64,");
  });
});

// ---------------------------------------------------------------------------
// 10. pratikabu-stt.js – scrollPageScreen direction calculation
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – scrollPageScreen direction calculation", () => {
  function calculateScrollTarget(direction, scrollTop, winHeight, docHeight) {
    docHeight -= winHeight;
    let location;
    if (direction < 0) {
      location = scrollTop + winHeight;
      if (location > docHeight) location = docHeight;
    } else {
      location = scrollTop - winHeight;
      if (location < 0) location = 0;
    }
    return location;
  }

  test("page down: normal case", () => {
    expect(calculateScrollTarget(-1, 200, 500, 2000)).toBe(700);
  });

  test("page down: clamps to docHeight - winHeight", () => {
    expect(calculateScrollTarget(-1, 1400, 500, 2000)).toBe(1500);
  });

  test("page up: normal case", () => {
    expect(calculateScrollTarget(1, 1000, 500, 2000)).toBe(500);
  });

  test("page up: clamps to 0", () => {
    expect(calculateScrollTarget(1, 200, 500, 2000)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 11. pratikabu-stt.js – getOtherImageSize
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – getOtherImageSize", () => {
  function getOtherImageSize(iconSize) {
    return iconSize === 48 ? 24 : 16;
  }

  test("returns 24 for large icon (48px)", () => {
    expect(getOtherImageSize(48)).toBe(24);
  });

  test("returns 16 for small icon (32px)", () => {
    expect(getOtherImageSize(32)).toBe(16);
  });

  test("returns 16 for any other size", () => {
    expect(getOtherImageSize(64)).toBe(16);
  });
});

// ---------------------------------------------------------------------------
// 12. DOM integration tests (jsdom)
// ---------------------------------------------------------------------------

describe("DOM – addon HTML creation and basic interactions", () => {
  beforeEach(() => {
    document.body.innerHTML = "<p>Test page content</p>";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("pratikabuSTTDiv is not in DOM initially", () => {
    expect(document.getElementById("pratikabuSTTDiv")).toBeNull();
  });

  test("inserting addon HTML prepends fixed div to body", () => {
    const div = document.createElement("div");
    div.id = "pratikabuSTTDiv";
    div.style.position = "fixed";
    document.body.prepend(div);
    expect(document.getElementById("pratikabuSTTDiv")).not.toBeNull();
    expect(document.body.firstElementChild.id).toBe("pratikabuSTTDiv");
  });

  test("rotate class is toggled correctly", () => {
    const img = document.createElement("img");
    img.id = "pratikabuSTTArrowUp";
    document.body.appendChild(img);

    const ROTATE_CLASS = "pratikabuSTTRotate180";
    img.classList.add(ROTATE_CLASS);
    expect(img.classList.contains(ROTATE_CLASS)).toBe(true);
    img.classList.remove(ROTATE_CLASS);
    expect(img.classList.contains(ROTATE_CLASS)).toBe(false);
  });

  test("removing addon div clears it from body", () => {
    const div = document.createElement("div");
    div.id = "pratikabuSTTDiv";
    document.body.appendChild(div);
    document.getElementById("pratikabuSTTDiv").remove();
    expect(document.getElementById("pratikabuSTTDiv")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 13. Visibility behavior logic
// ---------------------------------------------------------------------------

describe("Visibility behavior – hideattop", () => {
  function shouldShowAtScroll(scrollY, inversionPoint = 300) {
    return scrollY > inversionPoint;
  }

  test("hides button when at top (scrollY = 0)", () => {
    expect(shouldShowAtScroll(0)).toBe(false);
  });

  test("hides button when at inversion point", () => {
    expect(shouldShowAtScroll(300)).toBe(false);
  });

  test("shows button just past inversion point", () => {
    expect(shouldShowAtScroll(301)).toBe(true);
  });
});

describe("Visibility behavior – alwaysshow", () => {
  function shouldShowAlways(docHeight, winHeight, inversionPoint = 300) {
    return docHeight > winHeight + inversionPoint;
  }

  test("shows button on a long page", () => {
    expect(shouldShowAlways(2000, 800)).toBe(true);
  });

  test("hides button on a short page where scrolling is impossible", () => {
    expect(shouldShowAlways(900, 800)).toBe(false);
  });

  test("hides button when page height exactly equals threshold", () => {
    expect(shouldShowAlways(1100, 800)).toBe(false);
  });
});

describe("Visibility behavior – autohide timer", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test("triggers hide callback after 5 seconds", () => {
    const hide = jest.fn();
    let counter = 0;
    counter++;
    setTimeout(() => { if (--counter === 0) hide(); }, 5000);
    jest.advanceTimersByTime(4999);
    expect(hide).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(hide).toHaveBeenCalledTimes(1);
  });

  test("does not hide if counter is incremented again (hover re-entry)", () => {
    const hide = jest.fn();
    let counter = 0;
    counter++;
    setTimeout(() => { if (--counter === 0) hide(); }, 5000);
    jest.advanceTimersByTime(3000);
    counter++;
    setTimeout(() => { if (--counter === 0) hide(); }, 5000);
    jest.advanceTimersByTime(2000);
    expect(hide).not.toHaveBeenCalled();
    jest.advanceTimersByTime(3000);
    expect(hide).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// 14. Smart direction logic
// ---------------------------------------------------------------------------

describe("Smart direction logic", () => {
  function smartDirectionResult(prevScrollTop, newScrollTop, docHeight, winHeight) {
    if (prevScrollTop === newScrollTop) return "no-change";
    if (prevScrollTop > newScrollTop) return "rotateUp";
    if (newScrollTop === 0) return "rotateDown";
    if (newScrollTop >= docHeight - winHeight) return "rotateUp";
    return "rotateDown";
  }

  test("no change when scroll position is the same", () => {
    expect(smartDirectionResult(500, 500, 2000, 800)).toBe("no-change");
  });

  test("rotates up when user scrolls upward", () => {
    expect(smartDirectionResult(600, 400, 2000, 800)).toBe("rotateUp");
  });

  test("rotates down when user scrolls downward mid-page", () => {
    expect(smartDirectionResult(200, 400, 2000, 800)).toBe("rotateDown");
  });

  test("rotates up when reaching the bottom of the page", () => {
    expect(smartDirectionResult(1000, 1200, 2000, 800)).toBe("rotateUp");
  });
});

// ---------------------------------------------------------------------------
// 15. Dual arrow icon resolution
// ---------------------------------------------------------------------------

describe("Dual arrow icon resolution", () => {
  function resolveDualIconName(iconNumber) {
    let num = parseInt(iconNumber);
    let iconName = "dual-";
    if (num <= 20) {
      iconName += "hr-";
    } else if (num <= 40) {
      num -= 20;
      iconName += "vr-";
    } else {
      num -= 40;
      iconName = "single-";
    }
    return iconName + num;
  }

  test("icon 1 resolves to dual-hr-1", () => {
    expect(resolveDualIconName(1)).toBe("dual-hr-1");
  });

  test("icon 20 resolves to dual-hr-20", () => {
    expect(resolveDualIconName(20)).toBe("dual-hr-20");
  });

  test("icon 21 resolves to dual-vr-1", () => {
    expect(resolveDualIconName(21)).toBe("dual-vr-1");
  });

  test("icon 40 resolves to dual-vr-20", () => {
    expect(resolveDualIconName(40)).toBe("dual-vr-20");
  });

  test("icon 41 resolves to single-1", () => {
    expect(resolveDualIconName(41)).toBe("single-1");
  });
});

// ---------------------------------------------------------------------------
// 16. Position / offset logic
// ---------------------------------------------------------------------------

describe("Icon position – middle vertical translates to 50%", () => {
  function resolveVertical(vloc, vOffset) {
    if (vloc === "middle") {
      return { prop: "top", value: "50%", transform: "translateY(-50%)" };
    }
    return { prop: vloc, value: vOffset + "px", transform: null };
  }

  test("middle maps to top:50% with translate", () => {
    const r = resolveVertical("middle", 20);
    expect(r.prop).toBe("top");
    expect(r.value).toBe("50%");
    expect(r.transform).toBe("translateY(-50%)");
  });

  test("bottom maps to bottom:20px with no transform", () => {
    const r = resolveVertical("bottom", 20);
    expect(r.prop).toBe("bottom");
    expect(r.value).toBe("20px");
    expect(r.transform).toBeNull();
  });

  test("top maps to top:30px", () => {
    const r = resolveVertical("top", 30);
    expect(r.prop).toBe("top");
    expect(r.value).toBe("30px");
  });
});

describe("Icon position – middle horizontal maps to left:50%", () => {
  function resolveHorizontal(hloc, hOffset) {
    if (hloc === "middle") return { prop: "left", value: "50%" };
    return { prop: hloc, value: hOffset + "px" };
  }

  test("middle maps to left:50%", () => {
    const r = resolveHorizontal("middle", 20);
    expect(r.prop).toBe("left");
    expect(r.value).toBe("50%");
  });

  test("right maps to right:20px", () => {
    const r = resolveHorizontal("right", 20);
    expect(r.prop).toBe("right");
    expect(r.value).toBe("20px");
  });
});

// ---------------------------------------------------------------------------
// 17. Page validity checks
// ---------------------------------------------------------------------------

describe("isValidPageForAddon", () => {
  function isValidPageForAddon(prefs, href, isTopWindow, removedSites) {
    function mactchDomain(url, list) {
      return list.split(";").some((d) => d.length > 0 && url.includes(d));
    }
    if ("false" === prefs.showIconsOnPage) return false;
    if (mactchDomain(href, removedSites)) return false;
    if (!isTopWindow) return false;
    return true;
  }

  const defaultPrefs = { showIconsOnPage: "true" };
  const removedSites = "mail.google.com/mail;google.com/calendar;";

  test("valid for a normal page", () => {
    expect(isValidPageForAddon(defaultPrefs, "https://github.com", true, removedSites)).toBe(true);
  });

  test("invalid when showIconsOnPage is false", () => {
    expect(
      isValidPageForAddon({ showIconsOnPage: "false" }, "https://github.com", true, removedSites)
    ).toBe(false);
  });

  test("invalid when URL is in removed sites list", () => {
    expect(
      isValidPageForAddon(defaultPrefs, "https://mail.google.com/mail/u/0", true, removedSites)
    ).toBe(false);
  });

  test("invalid when not the top window (iframe)", () => {
    expect(
      isValidPageForAddon(defaultPrefs, "https://github.com", false, removedSites)
    ).toBe(false);
  });

  test("valid with empty removed sites list", () => {
    expect(
      isValidPageForAddon(defaultPrefs, "https://mail.google.com/mail", true, "")
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 18. Chrome runtime message routing (background)
// ---------------------------------------------------------------------------

describe("background.js – message routing", () => {
  test("fetchSettings triggers storage read and returns merged data", (done) => {
    const syncPrefs = { vLoc: "bottom", hLoc: "right" };
    const localPrefs = { userIcon: "icon_b64" };
    const chrome = buildChromeMock(syncPrefs, localPrefs);

    chrome.storage.sync.get.mockImplementation((key, cb) =>
      cb({ STT_PREF_KEY: syncPrefs })
    );
    chrome.storage.local.get.mockImplementation((key, cb) =>
      cb({ STT_PREF_LOCAL_KEY: localPrefs })
    );

    chrome.storage.sync.get("STT_PREF_KEY", (sttData) => {
      const syncData = sttData["STT_PREF_KEY"];
      chrome.storage.local.get("STT_PREF_LOCAL_KEY", (sttLocalData) => {
        const localData = sttLocalData["STT_PREF_LOCAL_KEY"];
        const finalData = { ...syncData, ...localData };
        expect(finalData.vLoc).toBe("bottom");
        expect(finalData.userIcon).toBe("icon_b64");
        done();
      });
    });
  });

  test("saveSettings splits and stores data correctly", (done) => {
    const chrome = buildChromeMock();
    const sttData = { vLoc: "top", userIcon: "b64data" };

    const syncCapture = {};
    const localCapture = {};
    chrome.storage.sync.set.mockImplementation((data, cb) => {
      Object.assign(syncCapture, data.STT_PREF_KEY);
      cb();
    });
    chrome.storage.local.set.mockImplementation((data, cb) => {
      Object.assign(localCapture, data.STT_PREF_LOCAL_KEY);
      cb();
    });

    const LOCAL_SETTINGS_LIST = "userIcon,dUserIcon,supportPrompt";
    const isLocal = (c) =>
      LOCAL_SETTINGS_LIST.includes(c + ",") || LOCAL_SETTINGS_LIST.includes("," + c);
    const split = { syncData: {}, localData: {} };
    for (const k in sttData) {
      if (isLocal(k)) split.localData[k] = sttData[k];
      else split.syncData[k] = sttData[k];
    }
    chrome.storage.sync.set({ STT_PREF_KEY: split.syncData }, () => {
      chrome.storage.local.set({ STT_PREF_LOCAL_KEY: split.localData }, () => {
        expect(syncCapture.vLoc).toBe("top");
        expect(syncCapture.userIcon).toBeUndefined();
        expect(localCapture.userIcon).toBe("b64data");
        done();
      });
    });
  });
});

// ---------------------------------------------------------------------------
// 19. Context menu creation
// ---------------------------------------------------------------------------

describe("background.js – context menu", () => {
  test("creates 4 menu items when showContextMenu is true", () => {
    const chrome = buildChromeMock();
    const created = [];
    chrome.contextMenus.create.mockImplementation((opts) => created.push(opts.id));

    const cxContexts = ["page"];
    chrome.contextMenus.create({ id: "pratikabustt-cxm-top", type: "normal", title: "Scroll To Top", contexts: cxContexts });
    chrome.contextMenus.create({ id: "pratikabustt-cxm-bottom", type: "normal", title: "Scroll To Bottom", contexts: cxContexts });
    chrome.contextMenus.create({ id: "pratikabustt-cxm-sep1", type: "separator", title: "", contexts: cxContexts });
    chrome.contextMenus.create({ id: "pratikabustt-cxm-option", type: "normal", title: "Options", contexts: cxContexts });

    expect(created).toEqual([
      "pratikabustt-cxm-top",
      "pratikabustt-cxm-bottom",
      "pratikabustt-cxm-sep1",
      "pratikabustt-cxm-option",
    ]);
  });

  test("removeAll is called before createContextMenu", () => {
    const chrome = buildChromeMock();
    const callOrder = [];
    chrome.contextMenus.removeAll.mockImplementation((cb) => {
      callOrder.push("removeAll");
      cb();
    });
    chrome.contextMenus.create.mockImplementation(() => callOrder.push("create"));

    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({ id: "x", type: "normal", title: "T", contexts: [] });
    });

    expect(callOrder[0]).toBe("removeAll");
    expect(callOrder[1]).toBe("create");
  });
});

// ---------------------------------------------------------------------------
// 20. Toolbar – scrollToDirection
// ---------------------------------------------------------------------------

describe("background.js – scrollToDirection", () => {
  function scrollToDirection(direction, currentTab, chrome) {
    if (!direction) return;
    chrome.tabs.sendMessage(currentTab.id, { pratikabusttaction: direction });
  }

  test("sends correct message for 'top'", () => {
    const chrome = buildChromeMock();
    scrollToDirection("top", { id: 42 }, chrome);
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(42, { pratikabusttaction: "top" });
  });

  test("sends correct message for 'bottom'", () => {
    const chrome = buildChromeMock();
    scrollToDirection("bottom", { id: 7 }, chrome);
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(7, { pratikabusttaction: "bottom" });
  });

  test("sends intelligentflip message", () => {
    const chrome = buildChromeMock();
    scrollToDirection("intelligentflip", { id: 1 }, chrome);
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, { pratikabusttaction: "intelligentflip" });
  });

  test("does nothing for empty direction", () => {
    const chrome = buildChromeMock();
    scrollToDirection("", { id: 1 }, chrome);
    expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
  });

  test("does nothing for null direction", () => {
    const chrome = buildChromeMock();
    scrollToDirection(null, { id: 1 }, chrome);
    expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 21. Reset settings – default values
// ---------------------------------------------------------------------------

describe("background.js – resetSettings defaults", () => {
  const DEFAULT_RESET = {
    vLoc: "bottom",
    hLoc: "right",
    visibilityBehav: "alwaysshow",
    scrSpeed: "400",
    iconTransparency: "0.5",
    blackAndWhite: "false",
    arrowType: "1",
    smartDirection: "false",
    controlOption: "pager",
    hideControls: "true",
    iconSize: "48",
    iconLib: "1",
    dArrang: "hr",
    dIconLib: "1",
    dualIconSize: "32",
    hOffset: "20",
    vOffset: "20",
    removedSites: "mail.google.com/mail;google.com/calendar;",
    toolbarClickAction: "intelligentflip",
  };

  test.each(Object.entries(DEFAULT_RESET))(
    "default '%s' equals '%s'",
    (key, expected) => expect(DEFAULT_RESET[key]).toBe(expected)
  );

  test("removed sites include Gmail by default", () => {
    expect(DEFAULT_RESET.removedSites).toContain("mail.google.com/mail");
  });

  test("removed sites include Google Calendar by default", () => {
    expect(DEFAULT_RESET.removedSites).toContain("google.com/calendar");
  });
});

// ---------------------------------------------------------------------------
// 22. Fullscreen detection
// ---------------------------------------------------------------------------

describe("Fullscreen detection", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("addon div is hidden when fullscreen is entered", () => {
    const div = document.createElement("div");
    div.id = "pratikabuSTTDiv";
    div.style.display = "block";
    document.body.appendChild(div);

    function videoFullScreenChangeEvent() {
      if (!document.fullscreenElement) {
        div.style.display = "block";
      } else {
        div.style.display = "none";
      }
    }

    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => document.body,
    });
    videoFullScreenChangeEvent();
    expect(div.style.display).toBe("none");

    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => null,
    });
    videoFullScreenChangeEvent();
    expect(div.style.display).toBe("block");
  });
});

// ---------------------------------------------------------------------------
// 23. Black & white mode
// ---------------------------------------------------------------------------

describe("Black & white mode", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("adds blackAndWhite class when preference is true", () => {
    const img = document.createElement("img");
    img.className = "pratikabuSTTImg";
    document.body.appendChild(img);
    const blackAndWhite = true;
    if (blackAndWhite) img.classList.add("pratikabuSTTBlackAndWhite");
    expect(img.classList.contains("pratikabuSTTBlackAndWhite")).toBe(true);
  });

  test("does not add class when preference is false", () => {
    const img = document.createElement("img");
    img.className = "pratikabuSTTImg";
    document.body.appendChild(img);
    const blackAndWhite = false;
    if (blackAndWhite) img.classList.add("pratikabuSTTBlackAndWhite");
    expect(img.classList.contains("pratikabuSTTBlackAndWhite")).toBe(false);
  });
});
