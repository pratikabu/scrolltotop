// Creates options defaults in case user hasn't set them yet
if (!localStorage["vertical_location"]) {
	localStorage["vertical_location"] = "bottom";
}
if (!localStorage["horizontal_location"]) {
	localStorage["horizontal_location"] = "right";
}
if (!localStorage["image_size"]) {
	localStorage["image_size"] = "48";
}
if (!localStorage["scrolling_speed"]) {
	localStorage["scrolling_speed"] = "1200";
}
if (!localStorage["visibility_behavior"]) {
	localStorage["visibility_behavior"] = "alwaysshow";
}
if (!localStorage["control_options"]) {
	localStorage["control_options"] = "pager";
}

// Message passer to give [LocalStorage] settings to content_script.js
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.method == "getSettings") {
			sendResponse({vLoc: localStorage["vertical_location"], hLoc: localStorage["horizontal_location"], iconSize: localStorage["image_size"], showPageUp: localStorage["show_page_up_new"], scrSpeed: localStorage["scrolling_speed"], visibilityBehav: localStorage["visibility_behavior"], controlOption: localStorage["control_options"]});
		} else {
			sendResponse({}); // snub them.
		}
	});