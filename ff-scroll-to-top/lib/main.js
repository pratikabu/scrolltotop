// Import the page-mod API
var pageMod = require("page-mod");
// Import the self API
var data = require("self").data;
// import the preferences
var sp = require("simple-prefs"); // to show the customize button
var tabs = require("tabs");// to open the options page
var ss = require("simple-storage"); // to store user specific settings

var checkForInitialize = function() {
	var valuesNotInitialized = false;
	if(!ss.storage.icon_size) {
		valuesNotInitialized = true;
		var imgSize = "48";
		if(sp.prefs.smallSizeButton && true == sp.prefs.smallSizeButton) {// copy older settings
			imgSize = "32";
		}
		ss.storage.icon_size = imgSize;
	}
	if(!ss.storage.vertical_location) {
		var vLoc = "bottom";
		if(sp.prefs.buttonAtBottom && false == sp.prefs.buttonAtBottom) {// copy older settings
			vLoc = "top";
		}
		ss.storage.vertical_location = vLoc;
	}
	if(!ss.storage.horizontal_location) {
		var hLoc = "right";
		if(sp.prefs.buttonAtBottom && true == sp.prefs.buttonAtLeft) {// copy older settings
			hLoc = "left";
		}
		ss.storage.horizontal_location = hLoc;
	}
	if(!ss.storage.showPager) {
		var showPageup = "true";
		if(sp.prefs.showPager && false == sp.prefs.showPager) {// copy older settings
			showPageup = "false";
		}
		ss.storage.showPager = showPageup;
	}
	
	return valuesNotInitialized;
};

// initialize settings
checkForInitialize();

var forceInitializeSettings = function() {
	delete ss.storage.icon_size;
	delete ss.storage.vertical_location;
	delete ss.storage.horizontal_location;
	delete ss.storage.showPager;
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
				showPageUp: ss.storage.showPager
			});
		});
    }
});

sp.on("myButtonPref", function() {
    tabs.open({
		url: data.url("options.html"),
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
				showPageUp: ss.storage.showPager
			});
		});
		
		tabWorker.port.on('setPrefs', function(data) {
			ss.storage.icon_size = data.iconSize;
			ss.storage.vertical_location = data.vLoc;
			ss.storage.horizontal_location = data.hLoc;
			ss.storage.showPager = data.showPager;
			
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
});