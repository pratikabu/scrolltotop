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
	if(!ss.storage.icon_library) {
		ss.storage.icon_library = "1";
	}
	if(!ss.storage.user_saved_icon) {
		ss.storage.user_saved_icon = "/9j/4AAQSkZJRgABAQEASABIAAD//gAUQ3JlYXRlZCB3aXRoIEdJTVAA/9sAQwACAQECAQECAgICAgICAgMFAwMDAwMGBAQDBQcGBwcHBgcHCAkLCQgICggHBwoNCgoLDAwMDAcJDg8NDA4LDAwM/9sAQwECAgIDAwMGAwMGDAgHCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAMAAwAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/J/TdPBK/LwRita10oEpxn5efypNItw5GAcg963bW33FcDGB1ps0KqaMrJgDOR1ol0vMpBUAEc10FtY7duMABc4/KmSaeefMJJ+gHGaQHJX2kgKTgcDnHWsbU7EBcYwxHFdpe2JizgFt2cE96wdWtwc8EGmmB1/wV8eJ8NPFUGo3Hhzwz4ssgR9o0zXLL7RbXKem5SskZ9GjcHpkMOD+wX7Nf7Mn7Ov7S3wQ8P8AjjRPhP4YtLPXIGd7WWJmksp43aOaFiGAYpIjgNgbgAwADAV+LGh3gRQZPlPy4+b72f8A69e8/B79ur4s/BPwRY+G/CvjG60TQtPeV7e0hsbR0RpJGlcsXiZnJZmPzE44AwAAEJo+4fip/wAEXbHxV8fm1fw9remaD4C1F99zpKQyJd6X+62lbUgMki+YA4DlNoJX5sZK/Cn/AIIvWHhT4/rrHiLWtM1/wHpsjSWmkPDI91qX7raq3TYVEAclyEL7toX5Qcji/wBjj/gsF4ou/H2leHvip/ZuqaVq1wlqNct7ZLO50+R2Cq8yRgRPCCRu2ojKCWy2Nhb+15/wWF8Tr481PQPhadN0nRtLne1/tye1S7utRdGKtJEkgMUcJIO3cjsww2UztALU+gf2mv2av2d/2aPgdr/jjW/hP4YvbXQ4VaO0iiZJL2eR1jhhVix275HUFsHau5sHbivx7+NPj5PiR4ruNRg8O+GfC1mW/caZoVj9ntrZc/d3MWkkPT5pHY9cbRxXrXxk/bk+K3xr8DXvhvxZ4yu9a0O/eOSe1msrRFLRuJEZWSJWQhlH3SM8g5BIPgmqEbTk7sE/jQNIqabcjK/y6Gug069UR7TnHAIzXFaZf7QM5xitux1IYzn8+lNoZ1dvqY2k8le/PPT0p0t/kcEjjj2rnk1XYCFbntTZdX6fMOfWkBe1C9Bz8xz9frWDql0DuwefrUl1qIAP5etYV/qe7crAAcYyRzVJAf/Z";
	}
	if (!ss.storage.toggle_pause) {
		ss.storage.toggle_pause = "false";
	}	
	if (!ss.storage.arrow_type) {
		ss.storage.arrow_type = "1";
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
	delete ss.storage.icon_library;
	delete ss.storage.user_saved_icon;
	delete ss.storage.toggle_pause;
	delete ss.storage.arrow_type;
	
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
				controlOption: ss.storage.control_options,
				iconLib: ss.storage.icon_library,
				userIcon: ss.storage.user_saved_icon,
				arrowType: ss.storage.arrow_type,
				togglePause: ss.storage.toggle_pause
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
			contentScriptFile: [data.url("jquery-1.8.2.pratikabu.js"), data.url("pratikabustt-slider.js"), data.url("options.js")]
		});
		
		tabWorker.port.on('getPrefs', function() {
			tabWorker.port.emit("prefsValue", {// send the image url, bottom preference and the left preference
				iconSize: ss.storage.icon_size,
				vLoc: ss.storage.vertical_location,
				hLoc: ss.storage.horizontal_location,
				scrSpeed: ss.storage.scrolling_speed,
				visibilityBehav: ss.storage.visibility_behavior,
				controlOption: ss.storage.control_options,
				iconLib: ss.storage.icon_library,
				userIcon: ss.storage.user_saved_icon,
				arrowType: ss.storage.arrow_type,
				togglePause: ss.storage.toggle_pause
			});
		});
		
		tabWorker.port.on('setPrefs', function(data) {
			ss.storage.icon_size = data.iconSize;
			ss.storage.vertical_location = data.vLoc;
			ss.storage.horizontal_location = data.hLoc;
			ss.storage.scrolling_speed = data.scrSpeed;
			ss.storage.visibility_behavior = data.visibilityBehav;
			ss.storage.control_options = data.controlOption;
			ss.storage.icon_library = data.iconLib;
			ss.storage.user_saved_icon = data.userIcon;
			ss.storage.arrow_type = data.arrowType;
			ss.storage.toggle_pause = data.togglePause;
			
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
var currentVersion = 4;// this variable should be incremented with every update so that, add-on update message can be shown
if(!ss.storage.versionInfo || currentVersion > ss.storage.versionInfo) {
	ss.storage.versionInfo = currentVersion;
	openOptioinPage("updated");
}