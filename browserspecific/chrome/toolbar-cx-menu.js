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
