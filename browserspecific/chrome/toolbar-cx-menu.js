chrome.browserAction.onClicked.addListener(function(tab) {
	fetchSettings(function(data) {
		scrollToDirection(data.toolbarClickAction);
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
		scrollToDirection('top');
	} else if (info.menuItemId == "pratikabustt-cxm-bottom") {
		scrollToDirection('bottom');
	} else if (info.menuItemId == "pratikabustt-cxm-option") {
		chrome.runtime.openOptionsPage();
	}
});

function scrollToDirection(direction) {
	if(!direction)
		return;

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {pratikabusttaction: direction});
	});
}
