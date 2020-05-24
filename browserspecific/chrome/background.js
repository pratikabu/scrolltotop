var STT_PREF_KEY = "STT_PREF_KEY";
var STT_PREF_LOCAL_KEY = "STT_PREF_LOCAL_KEY";
var BROWSER_KEY = "chrome";
var LOCAL_SETTINGS_LIST = "userIcon,dUserIcon,supportPrompt";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponseFunction) {
	if ("fetchSettings" === request.method) {
		fetchSettings(sendResponseFunction);
		return true;// the message passing will wait until the storage has responded
	} else if ("openOptionPage" === request.method) {
		chrome.runtime.openOptionsPage();
	} else if ("resetSettings" === request.method) {
		resetSettings(sendResponseFunction);
		return true;
	} else if("saveSettings" === request.method) {
		saveSettings(request.sttData, sendResponseFunction);
		return true;
	}
});

function getMainStorage() {
	var syncTrue = true;
	if(syncTrue) {
		return getSyncStorage();
	} else {
		return getLocalStorage();
	}
}

/**
 * This storage will be synced to all the instances if the user is logged in.
 * @returns
 */
function getSyncStorage() {
	return chrome.storage.sync;
}

/**
 * This storage will be used for any local settings.
 * Also, it will be used to store any thing which will expand in size. Like: base64 string
 * @returns
 */
function getLocalStorage() {
	return chrome.storage.local;
}

/**
 * This method saves the settings passed and calls the response function.
 * @param sttData
 * @param sendResponseFunction
 * @returns
 */
function saveSettings(sttData, sendResponseFunction) {
	var splitJsonData = splitJsonOnStorage(sttData);
	getMainStorage().set({STT_PREF_KEY: splitJsonData.syncData}, function() {
		getLocalStorage().set({STT_PREF_LOCAL_KEY: splitJsonData.localData}, function() {
			if(sendResponseFunction)
				sendResponseFunction("success");
		});
	});
}

function splitJsonOnStorage(sourceJson) {
	var splitJson = {
		syncData: {},
		localData: {}
	};
	
	for(var config in sourceJson) {
		var isLclSetting = isLocalSetting(config);
		if(isLclSetting) {
			splitJson.localData[config] = sourceJson[config];
		} else {
			splitJson.syncData[config] = sourceJson[config];
		}
	}
	
	return splitJson;
}

function isLocalSetting(config) {
	var keyword1 = config + ",";
	var keyword2 = "," + config;
	return LOCAL_SETTINGS_LIST.includes(keyword1) || LOCAL_SETTINGS_LIST.includes(keyword2);
}

/**
 * Fetch both sync and local settings and merge them
 * @param sendResponseFunction
 * @returns
 */
function fetchSettings(sendResponseFunction) {
	getMainStorage().get(STT_PREF_KEY, function(sttData) {
		var syncData = sttData[STT_PREF_KEY];
		getLocalStorage().get(STT_PREF_LOCAL_KEY, function(sttLocalData) {
			var localData = sttLocalData[STT_PREF_LOCAL_KEY];
			
			// merge result
			var finalData = {};
			populateJson(syncData, finalData);
			populateJson(localData, finalData);

			populateNewDefaults(finalData);
			
			sendResponseFunction(finalData);
		});
	});
}

function populateNewDefaults(finalData) {
	if(!finalData.toolbarClickAction) {
		finalData.toolbarClickAction = 'top';
	}

	if(!finalData.showIconsOnPage) {
		finalData.showIconsOnPage = 'true';
	}

	if(!finalData.toolbarIcon) {
		finalData.toolbarIcon = "1";
	}
}

function populateJson(sourceJson, targetJson) {
	for(var config in sourceJson) {
		targetJson[config] = sourceJson[config];
	}
}

/**
 * This method will reset the settings to factory default.
 * @param sendResponseFunction
 * @returns
 */
function resetSettings(sendResponseFunction) {
	// reset the data
	var data = {
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
			
			hOffset: "20",
			vOffset: "20",
			removedSites: "mail.google.com/mail;google.com/calendar;",

			toolbarClickAction: "top"
		};
	
	addLocalSettingsWithResetValue(data);
	
	saveSettings(data, sendResponseFunction);
}

/**
 * This method will add the reset value for local settings
 * @param data
 * @returns
 */
function addLocalSettingsWithResetValue(data) {
	var DEF_USR_ICON = "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";
	data.userIcon = DEF_USR_ICON;
	data.dUserIcon = DEF_USR_ICON;
//	data.supportPrompt = "true";// this will be populated by user on options page
}

function openReleaseNotes(process)
{
	// open the release notes
	chrome.tabs.create({url: "https://scrolltotop.pratikabu.com/release?process=" + process
		+ "&v=" + chrome.runtime.getManifest().version});
}

/**
 * Method which will be called once the update is completed.
 * Open options page, with updated as true.
 * @returns
 */
function postUpdateAction(isError) {
	openReleaseNotes("Update");
}

/**
 * Method called once install is completed.
 * @returns
 */
function postInstallAction(isError) {
	openReleaseNotes("Install");
}

// process the first time installs and updates to the extension
chrome.runtime.onInstalled.addListener(function(details) {
	if(chrome.runtime.OnInstalledReason.INSTALL == details.reason) {
		checkSycnSettingsOrResetOnInstall();
	} else if(chrome.runtime.OnInstalledReason.UPDATE == details.reason) {
		postUpdateAction();
	}
});

function checkSycnSettingsOrResetOnInstall() {
	fetchSettings(function processSyncData(syncData) {
		syncData = validateData(syncData);
		if("invalid-data" != syncData) {
			// settings already available via sync, use them instead of resetting
			// add local settings with reset value
			addLocalSettingsWithResetValue(syncData);
			
			// save this as the local settings needs to be saved
			saveSettings(syncData, function onSave() {
				postInstallAction();
			});
		} else {
			// initialize the settings and open the update page
			resetSettings(function openUpdatePage() {
				postInstallAction();
			});
		}
	});
}

/**
 * This function will validate the data.
 * If it finds the data is not consistent then it returns with string.
 * @param data
 * @returns the passed data object or "invalid-data" string
 */
function validateData(data) {
	var invalid = "invalid-data";
	
	// check null case for fresh installation validation
	if(null == data) {
		return invalid;
	}
	
	var count = 0;
	for(var config in data) {
		count++;
		if(typeof data[config] == 'undefined') {
			return invalid;
		}
	}
	
	// adding extra checks for fresh install case
	// user settings will be restored and we want to validate if everything is looking good
	if(0 == count || !data.vLoc) {
		return invalid;
	}
	
	// if everything is good then return the data object
	return data;
}

// set uninstall page
chrome.runtime.setUninstallURL("https://scrolltotop.pratikabu.com/uninstall");
