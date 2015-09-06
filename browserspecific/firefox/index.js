// Import the page-mod API
var sdkPageMod = require("sdk/page-mod");
// Import the self API
var sdkData = require("sdk/self").data;
// import the preferences
var sdkSP = require("sdk/simple-prefs"); // to show the customize button
var sdkTabs = require("sdk/tabs");// to open the options page
var sdkSS = require("sdk/simple-storage"); // to store user specific settings

var checkForInitialize = function() {
	if(!sdkSS.storage.sttArray) {
		var sttData = {};// create an empty array
		checkSingleForInitialize(sttData);
		sttData.default_setting = true;
		sttData.profile_name = "Default";
		sdkSS.storage.sttArray = [sttData];
	} else {
		for(var i = 0; i < sdkSS.storage.sttArray.length; i++) {
		    var sttData = sdkSS.storage.sttArray[i];
			checkSingleForInitialize(sttData);
		}
	}
};

var checkSingleForInitialize = function(sttData) {
	if(!sttData.vLoc) {
		sttData.vLoc = "bottom";
	}
	if(!sttData.hLoc) {
		sttData.hLoc = "right";
	}
	if(!sttData.scrSpeed && 0 != sttData.scrSpeed) {
		sttData.scrSpeed = "1200";
	}
	if(!sttData.visibilityBehav) {
		sttData.visibilityBehav = "alwaysshow";
	}
	if (!sttData.iconTransparency) {
		sttData.iconTransparency = "0.5";
	}
	if (!sttData.blackAndWhite) {
		sttData.blackAndWhite = "false";
	}
	
	if (!sttData.arrowType) {
		sttData.arrowType = "1";
	}
	
	if (!sttData.smartDirection) {
		sttData.smartDirection = "false";
	}
	if(!sttData.controlOption) {
		sttData.controlOption = "pager";
	}
	if (!sttData.hideControls) {
		sttData.hideControls = "true";
	}
	if(!sttData.iconSize) {
		sttData.iconSize = "48";
	}
	if(!sttData.iconLib) {
		sttData.iconLib = "1";
	}
	if(!sttData.userIcon) {
		sttData.userIcon = "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";
	}
	
	if(!sttData.dArrang) {
		sttData.dArrang = "hr";
	}
	if (!sttData.dIconLib) {
		sttData.dIconLib = "1";
	}
	if (!sttData.dUserIcon) {
		sttData.dUserIcon = "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";
	}
	
	if (!sttData.hOffset) {
		sttData.hOffset = "20";
	}
	if (!sttData.vOffset) {
		sttData.vOffset = "20";
	}
	if (!sttData.removedSites) {
		sttData.removedSites = "mail.google.com/mail;google.com/calendar;";
	}
};

// initialize settings
checkForInitialize();

var forceInitializeSettings = function() {
	delete sdkSS.storage.sttArray;
	checkForInitialize();
};

//send the image url, bottom preference and the left preference
var getDataJson = function() {
	var dataJson = {};
	dataJson.iconFolderLocation = sdkData.url("icons");
	dataJson.supportPrompt = sdkSS.storage.supportPrompt;
	dataJson.sttArray = [];
	for(var i = 0; i < sdkSS.storage.sttArray.length; i++) {
	    var sttData = sdkSS.storage.sttArray[i];
		var data = {
			vLoc: sttData.vLoc,
			hLoc: sttData.hLoc,
			scrSpeed: sttData.scrSpeed,
			visibilityBehav: sttData.visibilityBehav,
			iconTransparency: sttData.iconTransparency,
			blackAndWhite: sttData.blackAndWhite,
			
			arrowType: sttData.arrowType,
			
			smartDirection: sttData.smartDirection,
			controlOption: sttData.controlOption,
			hideControls: sttData.hideControls,
			iconSize: sttData.iconSize,
			iconLib: sttData.iconLib,
			userIcon: sttData.userIcon,
			
			dArrang: sttData.dArrang,
			dUserIcon: sttData.dUserIcon,
			dIconLib: sttData.dIconLib,
			
			hOffset: sttData.hOffset,
			vOffset: sttData.vOffset,
			removedSites: sttData.removedSites,
			
			default_setting: sttData.default_setting,
			profile_name: sttData.profile_name,
			profile_url_pattern: sttData.profile_url_pattern
		};
		dataJson.sttArray.push(data);
	}
	return dataJson;
};

// Create a page mod
// The script replaces the page contents with a message
sdkPageMod.PageMod({
    include: "*", // for all pages, as it will give the scrolling for all pages
	attachTo: ["existing", "top"],
    contentStyleFile: sdkData.url("pratikabu-stt.css"),
    contentScriptFile: [sdkData.url("thirdparty/pratikabu-jquery.js"), sdkData.url("thirdparty/pratikabu-jquery-rotate.js"),
        sdkData.url("browserspecific/pratikabu-stt-impl.js"), sdkData.url("pratikabu-stt.js")],
	contentScriptWhen: "ready",
    onAttach: function onAttach(worker) {// attaching the worker so as to do the communication with contentscript file
		worker.port.on('getPrefs', function() {
			worker.port.emit("prefsValue", getDataJson());
		});
		
		worker.port.on('optionPage', function() {
			openOptioinPage();
		});
    }
});

var openOptioinPage = function(updated) {
	// don't open the option page if it is already open
	var optionPageUrl = sdkData.url("options/options.html");
	var index;
	for (index = 0; index < sdkTabs.length; ++index) {
		var openTab = sdkTabs[index];
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
    sdkTabs.open({
		url: sdkData.url("options/options.html" + updated),
		onReady: runScript
	});
	function runScript(tab) {
		tabWorker = tab.attach({
			contentScriptFile: [sdkData.url("thirdparty/pratikabu-jquery.js"), sdkData.url("thirdparty/pratikabu-simple-slider.js"), sdkData.url("browserspecific/options-browser-impl.js"), sdkData.url("options/res/options.js")]
		});
		
		tabWorker.port.on('getPrefs', function() {
			tabWorker.port.emit("prefsValue", getDataJson());
		});
		
		tabWorker.port.on('setPrefs', function(data) {
			sdkSS.storage.sttArray = data.sttArray;
			sdkSS.storage.supportPrompt = data.supportPrompt;
			
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
		
		tabWorker.port.emit("loadJavascriptFunctions");
	};
};

sdkSP.on("myButtonPref", openOptioinPage);

// open option page on initial in this version
var currentVersion = 9.1;// this variable should be incremented with every update so that, add-on update message can be shown
if(!sdkSS.storage.versionInfo || currentVersion > sdkSS.storage.versionInfo) {
	sdkSS.storage.versionInfo = currentVersion;
	openOptioinPage("updated");
}