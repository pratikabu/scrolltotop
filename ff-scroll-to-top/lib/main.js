// Import the page-mod API
var pageMod = require("page-mod");
// Import the self API
var data = require("self").data;
// import the preferences
var sp = require("simple-prefs"); // to show the customize button
var tabs = require("tabs");// to open the options page
var ss = require("simple-storage"); // to store user specific settings

var checkForInitialize = function() {
	if(!ss.storage.icon_size) {
		ss.storage.icon_size = "48";
	}
	if(!ss.storage.vertical_location) {
		ss.storage.vertical_location = "bottom";
	}
	if(!ss.storage.horizontal_location) {
		ss.storage.horizontal_location = "right";
	}
	if(!ss.storage.scrolling_speed) {
		ss.storage.scrolling_speed = "1200";
	}
	if(!ss.storage.visibility_behavior) {
		ss.storage.visibility_behavior = "alwaysshow";
	}
	if(!ss.storage.control_options) {
		ss.storage.control_options = "pager";
	}
};

// initialize settings
checkForInitialize();

var forceInitializeSettings = function() {
	delete ss.storage.icon_size;
	delete ss.storage.vertical_location;
	delete ss.storage.horizontal_location;
	delete ss.storage.scrolling_speed;
	delete ss.storage.visibility_behavior;
	delete ss.storage.control_options;
	
	checkForInitialize();
};

// Create a page mod
// The script replaces the page contents with a message
pageMod.PageMod({
    include: "*", // for all pages, as it will give the scrolling for all pages
    contentStyleFile: data.url("pratikabu-stt.css"),
    contentScriptFile: [data.url("jquery-1.8.2.pratikabu.js"),
        data.url("pratikabustt-browser-impl.js"), data.url("pratikabu-stt.js")],
    onAttach: function onAttach(worker) {// attaching the worker so as to do the communication with contentscript file
		worker.port.on('getPrefs', function() {
			worker.port.emit("prefsValue", {// send the image url, bottom preference and the left preference
				iconSize: ss.storage.icon_size,
				vLoc: ss.storage.vertical_location,
				hLoc: ss.storage.horizontal_location,
				scrSpeed: ss.storage.scrolling_speed,
				visibilityBehav: ss.storage.visibility_behavior,
				controlOption: ss.storage.control_options
			});
		});
    }
});

var openOptioinPage = function(updated) {
	// don't open the option page if it is already open
	var optionPageUrl = data.url("options.html");
	for each (var openTab in tabs) {
		if(openTab.url.toLowerCase().indexOf(optionPageUrl.toLowerCase()) != -1) {
			// page is already open
			openTab.activate();
			return;
		}
	}
	
	if(updated) {
		updated = "?updated=true";
	} else {
		updated = "";
	}
    tabs.open({
		url: data.url("options.html" + updated),
		onReady: runScript
	});
	function runScript(tab) {
		tabWorker = tab.attach({
			contentScriptFile: [data.url("jquery-1.8.2.pratikabu.js"), data.url("options.js")]
		});
		
		tabWorker.port.on('getPrefs', function() {
			tabWorker.port.emit("prefsValue", {// send the image url, bottom preference and the left preference
				iconSize: ss.storage.icon_size,
				vLoc: ss.storage.vertical_location,
				hLoc: ss.storage.horizontal_location,
				scrSpeed: ss.storage.scrolling_speed,
				visibilityBehav: ss.storage.visibility_behavior,
				controlOption: ss.storage.control_options
			});
		});
		
		tabWorker.port.on('setPrefs', function(data) {
			ss.storage.icon_size = data.iconSize;
			ss.storage.vertical_location = data.vLoc;
			ss.storage.horizontal_location = data.hLoc;
			ss.storage.scrolling_speed = data.scrSpeed;
			ss.storage.visibility_behavior = data.visibilityBehav;
			ss.storage.control_options = data.controlOption;
			
			tabWorker.port.emit("saveStatus", {// send the status of the step
				status: "Saved perfectly."
			});
		});
		
		tabWorker.port.on('resetPrefs', function() {
			forceInitializeSettings();
			
			tabWorker.port.emit("resetStatus", {// send the status of the step
				status: "Saved perfectly."
			});
		});
	}
};

sp.on("myButtonPref", openOptioinPage);

// open option page on initial in this version
var currentVersion = 1;// this variable should be incremented with every update so that, add-on update message can be shown
if(!ss.storage.versionInfo || currentVersion > ss.storage.versionInfo) {
	ss.storage.versionInfo = currentVersion;
	openOptioinPage("updated");
}