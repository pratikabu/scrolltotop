/************************************************************
	Browser specific coding
************************************************************/

/** Saves options to localStorage. */
function bsDefaultSettings() {
	chrome.runtime.sendMessage({method: "resetSettings"}, function(status) {
		if("success" === status) {
			// Update status to let user know options were defaulted.
			bsFetchSettings(post_restore_success);

			bsResetToolbarIcon();
		}
	});
}

function bsInit() {
}

function bsFetchSettings(methodToExecute) {
	chrome.runtime.sendMessage({method: "fetchSettings"}, function(respSttData) {
		restore_options(respSttData);
		if(methodToExecute)
			methodToExecute();
	});
}

function bsSaveSettings(data) {
	chrome.runtime.sendMessage({method: "saveSettings", "sttData": data}, function(status) {
		if("success" === status) {
			// Update status to let user know options were saved.
			post_save_success();
		}
	});
}

function bsReviewPageUrl() {
	return "https://chrome.google.com/webstore/detail/scroll-to-top/hegiignepmecppikdlbohnnbfjdoaghj/reviews";
}

$( document ).ready(function() {
	psInitJavascriptFunctions();
});

function getExtensionVersion() {
	return chrome.runtime.getManifest().version;
}

function bsResetToolbarIcon() {
	chrome.runtime.sendMessage({method: "resetToolbarIcon"});
}
