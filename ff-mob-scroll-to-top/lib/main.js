var data = require("self").data;
var pageMod = require("page-mod");

pageMod.PageMod({
    include: ["*", "file://*"],
	attachTo: ["existing", "top"],
    contentStyleFile: data.url("pratikabu-stt.css"),
	contentScriptFile: data.url("pratikabu-stt.js")
});