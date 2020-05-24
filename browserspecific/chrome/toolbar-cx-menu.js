chrome.browserAction.onClicked.addListener(function(tab) {
	fetchSettings(function(data) {
		scrollToDirection(data.toolbarClickAction, tab);
	});
});

chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		id: "pratikabustt-cxm-top",
		title: "Scroll To Top",
		contexts:["page"]
	});

	chrome.contextMenus.create({
		id: "pratikabustt-cxm-bottom",
		title: "Scroll To Bottom",
		contexts:["page"]
	});

	chrome.contextMenus.create({
		id: "pratikabustt-cxm-sep1",
		type: "separator",
		contexts:["page"]
	});

	chrome.contextMenus.create({
		id: "pratikabustt-cxm-option",
		title: "Options",
		contexts:["page"
			, "browser_action"
			]
	});

	resetToolbarIcon();
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId == "pratikabustt-cxm-top") {
		scrollToDirection('top', tab);
	} else if (info.menuItemId == "pratikabustt-cxm-bottom") {
		scrollToDirection('bottom', tab);
	} else if (info.menuItemId == "pratikabustt-cxm-option") {
		chrome.runtime.openOptionsPage();
	}
});

function scrollToDirection(direction, currentTab) {
	if(!direction)
		return;
	chrome.tabs.sendMessage(currentTab.id, {pratikabusttaction: direction});
}

function setToolbarIcon(selectedIconId) {
	iconData = {
		32: "icons/pratikabu-stt-32-" + selectedIconId + ".png",
		48: "icons/pratikabu-stt-48-" + selectedIconId + ".png"
	}
	chrome.browserAction.setIcon({path : iconData});
}

function resetToolbarIcon() {
	// set toolbar icon from settings
	fetchSettings(function(data) {
		setToolbarIcon(data.toolbarIcon);
	});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponseFunction) {
	if ("resetToolbarIcon" === request.method) {
		resetToolbarIcon();
	}
});
