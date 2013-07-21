/************************************************************
	Browser specific coding
************************************************************/

/** Saves options to localStorage. */
function bsDefaultSettings() {
	ignoreForDefaults = true;// ignore the image load method as it will reset myIcon in the radio button
	self.port.emit("resetPrefs");// method to communicate to main.js
}

function bsInit() {
	// prefsValue listner
	self.port.on("resetStatus", function(data) {
		bsFetchSettings();
		// Update status to let user know options were defaulted.
		show_message("Restored to defaults.");
	});
	
	self.port.on("saveStatus", function(data) {
		// Update status to let user know options were saved.
		show_message("Saved successfully. <a target='_blank' href='http://pratikabu.users.sourceforge.net/extensions/scrolltotop/release.html'>Preview your changes</a>.");
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