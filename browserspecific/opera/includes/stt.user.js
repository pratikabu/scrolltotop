// ==UserScript==
// @name ScrollToTop
// @version 4.2
// @description Scroll to top and vice versa in a window.
// @author Pratik Soni
// @include *
// ==/UserScript==

var pratikabusttjquery;

function addLibrary(path, onLoadFunction) {
	// Get the library resource
	var fileObj = opera.extension.getFile(path);
	if (fileObj) {
		// Read out the File object as a Data URI:
		var fr = new FileReader();
		fr.onload = function() {
			onLoadFunction(fr.result);
		};
		fr.readAsText(fileObj);
	}
}

function loadJQuery() {
	if(!window.jQuery) {// load only if its required as it is giving problem on many pages.
		addLibrary("/thirdparty/jquery-pratikabu.js", function(result) {
			eval(result);
			pratikabusttjquery = window.jQuery.noConflict(true);// this line will replace any existing mapping of $ and jQuery on the current page
			loadCompleteFile();
		});
	} else {
		pratikabusttjquery = window.jQuery;
		loadCompleteFile();
	}
}

function loadCompleteFile() {
	// TODO SKIP the below todo snippets will be replaced by actual files while the build is happening in the ant file
	// TODO REPLACE ../generated/opera/thirdparty/jquery-rotate.js
	
	createStyleElement('#pratikabuSTTDiv{background:none!important;z-index:2147483647!important;position:fixed!important;display:none;padding:0!important;margin:0!important;line-height:0!important;}');
	createStyleElement('#pratikabuSTTDiv2{background:none!important;z-index:2147483647!important;position:fixed!important;display:none;padding:0!important;margin-top:0!important;margin-bottom:0!important;margin-right:0!important;margin-left:0;line-height:0!important;width:48px;}');
	createStyleElement('.pratikabuSTTImg{padding:0!important;margin:0!important;border:0!important;}');
	createStyleElement('.pratikabuSTTBlackAndWhite{filter:grayscale(100%);-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:url(#greyscale);filter:gray;-webkit-filter:grayscale(1);}');
	
	// TODO REPLACE ../generated/opera/browserspecific/pratikabu-stt-impl.js
	
	// TODO REPLACE ../generated/opera/pratikabu-stt.js
}

function createStyleElement(cssText) {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = cssText;
	document.getElementsByTagName('head')[0].appendChild(style);
}

window.addEventListener('DOMContentLoaded', function() {
	if(window != window.top) {// return if its an internal frame
		return;
	}
	
	loadJQuery();
}, false);