var data = require("self").data;
var pageMod = require("page-mod");

pageMod.PageMod({
    include: "*",
    //contentStyleFile: data.url("pratikabu-stt.css"),
	contentScriptFile: data.url("pratikabu-stt.js")
});