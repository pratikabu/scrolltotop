chrome.browserAction.onClicked.addListener(function(tab) {
	fetchSettings(function(data) {
		scrollToDirection(data.toolbarClickAction, tab);
	});
});

function resetContextMenuAndToolbarIcon() {
	fetchSettings(function(settings) {
		resetContextMenu("true" == settings.showContextMenu);
		setToolbarIcon(settings.toolbarIcon);
	});
}

function resetContextMenu(showContextMenu) {
	chrome.contextMenus.removeAll(function() {
		if(showContextMenu) {
			createContextMenu();// create only if required
		}
	});
}

function createContextMenu() {
	var cxContexts = ["page", "frame", "selection", "link", "editable", "image", "video", "audio"];
	var cxTypeNormal = "normal";

	createContextMenuItem("pratikabustt-cxm-top", cxTypeNormal, "Scroll To Top", cxContexts);
	createContextMenuItem("pratikabustt-cxm-bottom", cxTypeNormal, "Scroll To Bottom", cxContexts);
	createContextMenuItem("pratikabustt-cxm-sep1", "separator", "", cxContexts);

	if("firefox" == BROWSER_KEY) {
		// since firefox doesn't show the "Options" menu when someone right click on the toolbar icon
		cxContexts.push("browser_action");
	}
	createContextMenuItem("pratikabustt-cxm-option", cxTypeNormal, "Options", cxContexts);
}

function createContextMenuItem(cxId, cxType, cxTitle, cxContexts) {
	chrome.contextMenus.create({ id: cxId, type: cxType, title: cxTitle, contexts: cxContexts });
}

resetContextMenuAndToolbarIcon();

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
	} else if ("resetContextMenu" === request.method) {
		resetContextMenu(request.showContextMenu);
	}
});
