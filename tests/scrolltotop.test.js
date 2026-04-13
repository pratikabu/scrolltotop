/**
 * Scroll To Top – Full Refactored Test Suite
 * This suite tests the ACTUAL source files via module.exports.
 */

// ---------------------------------------------------------------------------
// 1. Setup Mocks BEFORE requiring source files
// ---------------------------------------------------------------------------

global.chrome = {
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn(),
    },
    local: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  runtime: {
    sendMessage: jest.fn(),
    onMessage: { addListener: jest.fn() },
    onInstalled: { addListener: jest.fn() },
    getURL: jest.fn((path) => `chrome-extension://fake-id/${path}`),
    openOptionsPage: jest.fn(),
    getManifest: jest.fn(() => ({ version: "5.3.1" })),
    OnInstalledReason: { INSTALL: 'install', UPDATE: 'update' }
  },
  contextMenus: {
    create: jest.fn(),
    removeAll: jest.fn((cb) => cb && cb()),
    onClicked: { addListener: jest.fn() },
  },
  tabs: {
    sendMessage: jest.fn(),
    create: jest.fn(),
  },
  action: {
    onClicked: { addListener: jest.fn() },
    setIcon: jest.fn(),
  },
};

global.pratikabustt_browser_impl = {
    getFixedLocation: jest.fn(),
    fetchPreferences: jest.fn(),
    getBrowserSpecificUrl: jest.fn(),
    openOptionPage: jest.fn(),
    setImageForId: jest.fn(),
    removeCompleteAddOnCode: jest.fn(),
};

const mockJQueryObj = {
    attr: jest.fn().mockReturnThis(),
    css: jest.fn().mockImplementation((prop) => {
        if (prop === 'position') return 'fixed';
        return mockJQueryObj;
    }),
    hover: jest.fn().mockReturnThis(),
    click: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    fadeTo: jest.fn((speed, opacity, cb) => {
      if (cb) cb();
      return mockJQueryObj;
    }),
    remove: jest.fn().mockReturnThis(),
    addClass: jest.fn().mockReturnThis(),
    removeClass: jest.fn().mockReturnThis(),
    scrollTop: jest.fn().mockReturnValue(0),
    height: jest.fn().mockReturnValue(1000),
    prepend: jest.fn().mockReturnThis(),
    before: jest.fn().mockReturnThis(),
    hide: jest.fn().mockReturnThis(),
    show: jest.fn().mockReturnThis(),
    unbind: jest.fn().mockReturnThis(),
    scroll: jest.fn().mockReturnThis(),
    resize: jest.fn().mockReturnThis(),
    animate: jest.fn((props, speed, cb) => {
      if (cb) cb();
      return mockJQueryObj;
    }),
    length: 1,
    0: { id: 'some-id' },
    last: jest.fn().mockReturnThis(),
    first: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    toggle: jest.fn().mockReturnThis(),
    appendTo: jest.fn().mockReturnThis(),
    val: jest.fn().mockReturnThis(),
};

global.$ = jest.fn((selector) => mockJQueryObj);
global.jQuery = global.$;

// Mock window/document
global.window.innerHeight = 800;
global.document.addEventListener = jest.fn();
global.document.height = jest.fn().mockReturnValue(1000);
global.document.scrollTop = jest.fn().mockReturnValue(0);
global.document.fullscreenElement = null;

// Use Object.defineProperty for location and top
Object.defineProperty(global.window, 'location', {
    value: { href: 'https://example.com' },
    writable: true,
    configurable: true
});

try {
    Object.defineProperty(global.window, 'top', {
        value: global.window,
        writable: true,
        configurable: true
    });
} catch (e) {}

// Import the actual files
const background = require('../src/background.js');
const stt = require('../src/pratikabu-stt.js');

// ---------------------------------------------------------------------------
// Helper: Reset STT state for each test
// ---------------------------------------------------------------------------

function resetSTT() {
    stt.pratikabu_stt_prefs = {
        vLoc: "bottom",
        hLoc: "right",
        visibilityBehav: "alwaysshow",
        scrSpeed: "400",
        iconSize: "48",
        iconLib: "1",
        arrowType: "1",
        smartDirection: "false",
        hideControls: "true",
        removedSites: "",
        toolbarClickAction: "intelligentflip",
        showIconsOnPage: "true",
        blackAndWhite: "false"
    };
    stt.pratikabu_stt_bVisibility = false;
    stt.pratikabu_stt_dualArrow = false;
    
    // Reset JQuery mocks
    jest.clearAllMocks();
    
    // Reset window.top to self
    global.window.top = global.window;
}

// ---------------------------------------------------------------------------
// 2. background.js – splitJsonOnStorage
// ---------------------------------------------------------------------------

describe("background.js – splitJsonOnStorage", () => {
  test("routes userIcon to localData", () => {
    const result = background.splitJsonOnStorage({ userIcon: "abc123", vLoc: "bottom" });
    expect(result.localData.userIcon).toBe("abc123");
    expect(result.syncData.userIcon).toBeUndefined();
  });

  test("routes regular settings to syncData", () => {
    const result = background.splitJsonOnStorage({ vLoc: "bottom", hLoc: "right" });
    expect(result.syncData.vLoc).toBe("bottom");
    expect(Object.keys(result.localData).length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 3. background.js – validateData
// ---------------------------------------------------------------------------

describe("background.js – validateData", () => {
  test("returns invalid-data for null", () => {
    expect(background.validateData(null)).toBe("invalid-data");
  });

  test("returns invalid-data for empty object", () => {
    expect(background.validateData({})).toBe("invalid-data");
  });

  test("returns the data object when valid", () => {
    const data = { vLoc: "bottom", hLoc: "right" };
    expect(background.validateData(data)).toBe(data);
  });
});

// ---------------------------------------------------------------------------
// 4. background.js – populateNewDefaults
// ---------------------------------------------------------------------------

describe("background.js – populateNewDefaults", () => {
  test("fills missing defaults", () => {
    const data = {};
    background.populateNewDefaults(data);
    expect(data.toolbarClickAction).toBe("intelligentflip");
    expect(data.showIconsOnPage).toBe("true");
  });
});

// ---------------------------------------------------------------------------
// 5. pratikabu-stt.js – isPOICrossed
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – isPOICrossed", () => {
  test("returns false when scrollY is 0", () => {
    mockJQueryObj.scrollTop.mockReturnValue(0);
    expect(stt.pratikabustt.isPOICrossed()).toBe(false);
  });

  test("returns true when scrollY exceeds inversion point", () => {
    mockJQueryObj.scrollTop.mockReturnValue(301);
    expect(stt.pratikabustt.isPOICrossed()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. pratikabu-stt.js – isAtBottom
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – isAtBottom", () => {
  test("returns true when exactly at bottom", () => {
    mockJQueryObj.scrollTop.mockReturnValue(200);
    mockJQueryObj.height.mockReturnValue(1000);
    global.window.innerHeight = 800;
    expect(stt.pratikabustt.isAtBottom()).toBe(true);
  });

  test("returns false when not at bottom", () => {
    mockJQueryObj.scrollTop.mockReturnValue(100);
    mockJQueryObj.height.mockReturnValue(1000);
    global.window.innerHeight = 800;
    expect(stt.pratikabustt.isAtBottom()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 7. pratikabu-stt.js – scrollIntelligently
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – scrollIntelligently", () => {
  test("scrolls to bottom if NOT past POI", () => {
    resetSTT();
    mockJQueryObj.scrollTop.mockReturnValue(0);
    const spy = jest.spyOn(stt.pratikabustt, 'scrollToBottom');
    stt.pratikabustt.scrollIntelligently();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("scrolls to top if past POI", () => {
    resetSTT();
    mockJQueryObj.scrollTop.mockReturnValue(400);
    const spy = jest.spyOn(stt.pratikabustt, 'scrollToTop');
    stt.pratikabustt.scrollIntelligently();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 8. pratikabu-stt.js – mactchDomainAgainstDomainList
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – mactchDomainAgainstDomainList", () => {
  test("matches Gmail in the list", () => {
    expect(
      stt.pratikabustt.mactchDomainAgainstDomainList(
        "https://mail.google.com/mail/u/0/",
        "mail.google.com/mail;google.com/calendar;"
      )
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 9. pratikabu-stt.js – scrollPageScreen
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – scrollPageScreen", () => {
  test("page down: scroll to next screen", () => {
    resetSTT();
    mockJQueryObj.scrollTop.mockReturnValue(100);
    mockJQueryObj.height.mockReturnValue(2000);
    global.window.innerHeight = 800;
    
    const spy = jest.spyOn(stt.pratikabustt, 'scrollPageTo');
    stt.pratikabustt.scrollPageScreen(-1);
    expect(spy).toHaveBeenCalledWith(344, 900, true);
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 10. pratikabu-stt.js – isValidPageForAddon
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – isValidPageForAddon", () => {
  beforeEach(() => {
    resetSTT();
    global.window.location.href = "https://example.com";
  });

  test("returns true for normal page", () => {
    expect(stt.pratikabustt.isValidPageForAddon()).toBe(true);
  });

  test("returns false if showIconsOnPage is false", () => {
    stt.pratikabu_stt_prefs.showIconsOnPage = "false";
    expect(stt.pratikabustt.isValidPageForAddon()).toBe(false);
  });

  test("returns false if URL in removedSites", () => {
    stt.pratikabu_stt_prefs.removedSites = "example.com;";
    expect(stt.pratikabustt.isValidPageForAddon()).toBe(false);
  });

  test("returns false for iframe", () => {
    global.window.top = {}; 
    expect(stt.pratikabustt.isValidPageForAddon()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 11. Fullscreen detection
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – videoFullScreenChangeEvent", () => {
    test("hides addon on fullscreen, shows on exit", () => {
        // Fullscreen active
        Object.defineProperty(global.document, 'fullscreenElement', {
            get: () => ({}),
            configurable: true
        });
        stt.pratikabustt.videoFullScreenChangeEvent();
        expect(mockJQueryObj.hide).toHaveBeenCalled();
        
        // Fullscreen inactive
        Object.defineProperty(global.document, 'fullscreenElement', {
            get: () => null,
            configurable: true
        });
        stt.pratikabustt.videoFullScreenChangeEvent();
        expect(mockJQueryObj.show).toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// 12. Black & white mode
// ---------------------------------------------------------------------------

describe("pratikabu-stt.js – BW mode", () => {
    test("adds BW class if enabled", () => {
        resetSTT();
        stt.pratikabu_stt_prefs.blackAndWhite = "true";
        // Need to run loadFromResponse to normalize the boolean
        stt.pratikabustt.loadFromResponse(stt.pratikabu_stt_prefs);
        stt.pratikabustt.createAddonHtml();
        
        // Find if any call to $ was for .pratikabuSTTImg
        const imgCall = global.$.mock.calls.find(call => call[0] === ".pratikabuSTTImg");
        expect(imgCall).toBeDefined();
        expect(mockJQueryObj.addClass).toHaveBeenCalledWith(expect.stringContaining("pratikabuSTTBlackAndWhite"));
    });
});
