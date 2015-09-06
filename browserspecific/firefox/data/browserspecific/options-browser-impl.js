/************************************************************
	Browser specific coding
************************************************************/

/** Saves options to localStorage. */
function bsDefaultSettings() {
	self.port.emit("resetPrefs");// method to communicate to main.js
}

function bsInit() {
	// prefsValue listener
	self.port.on("resetStatus", function(data) {
		bsFetchSettings();
		// Update status to let user know options were defaulted.
		post_restore_success();
	});
	
	self.port.on("saveStatus", function(data) {
		// Update status to let user know options were saved.
		post_save_success();
	});
	
	self.port.on("prefsValue", function(data) {
		restore_options(data);
	});
}

function bsFetchSettings() {
	self.port.emit("getPrefs");// method to communicate to main.js
}

function bsSaveSettings(data) {
	self.port.emit("setPrefs", data);// method to communicate to main.js
}

function bsReviewPageUrl() {
	return "https://addons.mozilla.org/en-us/firefox/addon/scroll-to-top/reviews/add";
}

self.port.on("loadJavascriptFunctions", function(data) {
	psInitJavascriptFunctions();
});