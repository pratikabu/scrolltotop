/************************************************************
	Browser specific coding
************************************************************/

/** Saves options to localStorage. */
function bsDefaultSettings() {
	safari.self.tab.dispatchMessage("resetSettings");
}

function bsInit() {
	safari.self.addEventListener("message", function(theMessageEvent) {
		if("resetCompleted" === theMessageEvent.name) {
			bsFetchSettings();
			// Update status to let user know options were defaulted.
			post_restore_success();
		} else if("optionPagePreferences" === theMessageEvent.name) {
			restore_options(theMessageEvent.message);
		} else if("saveCompleted" === theMessageEvent.name) {
			// Update status to let user know options were saved.
			post_save_success();
		}
	}, false);
}

function bsFetchSettings() {
	safari.self.tab.dispatchMessage("requestSettings", true);
}

function bsSaveSettings(data) {
	safari.self.tab.dispatchMessage("saveSettings", data);
}

function bsReviewPageUrl() {
	return "https://blog.pratikabu.com/2013/02/scroll-to-top-review-from-safari-users.html";
}

document.addEventListener('DOMContentLoaded', function () {
	psInitJavascriptFunctions();
});