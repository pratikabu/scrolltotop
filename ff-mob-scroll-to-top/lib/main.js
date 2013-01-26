var data = require("self").data;
var pageMod = require("page-mod");
var sp = require("simple-prefs");

// load the content script
pageMod.PageMod({
	include: ["*", "file://*"],
	attachTo: ["existing", "top"],
	contentStyleFile: data.url("pratikabu-stt.css"),
	contentScriptFile: data.url("pratikabu-stt.js"),
	contentScriptOptions: {
		sttIcon: data.url("pratikabu-stt-" + (sp.prefs.largerIcon ? "64" : "48") + ".png")
	},
	contentScriptWhen: "ready",
	onAttach: function onAttach(worker) {// attaching the worker so as to do the communication with contentscript file
		worker.port.on('getPrefs', function() {
			// load the saved image
			worker.port.emit("prefsValue", {// send the image url, bottom preference and the left preference
				imgUrl: data.url("pratikabu-stt-" + (sp.prefs.largerIcon ? "64" : "48") + ".png"),
				animatedScrolling: sp.prefs.animatedBeta // its a beta feature, will see any other better implementation in the next release
			});
		});
	}
});