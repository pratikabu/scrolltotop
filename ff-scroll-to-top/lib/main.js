// Import the page-mod API
var pageMod = require("page-mod");
// Import the self API
var data = require("self").data;
// import the preferences
var sp = require("simple-prefs");

// Create a page mod
// The script replaces the page contents with a message
pageMod.PageMod({
    include: "*", // for all pages, as it will give the scrolling for all pages
    contentStyleFile: data.url("pratikabu-stt.css"),
    contentScriptFile: [data.url("jquery-1.8.2.pratikabu.js"),
        data.url("pratikabu-stt.js")],
    onAttach: function onAttach(worker) {// attaching the worker so as to do the communication with contentscript file
        worker.port.on('getPrefs', function() {
            // load the saved image
            var imgSize = "48";
            if(true == sp.prefs.smallSizeButton) {
                imgSize = "32";
            }
            worker.port.emit("prefsValue", {// send the image url, bottom preference and the left preference
                iconSize: imgSize,
    			buttonAtBottom: sp.prefs.buttonAtBottom,
                buttonAtLeft: sp.prefs.buttonAtLeft,
                showPager: sp.prefs.showPager
    		});
        });
    }
});