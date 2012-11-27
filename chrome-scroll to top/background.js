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
if (!localStorage["icon_library"]) {
	localStorage["icon_library"] = "1";
}
if (!localStorage["user_saved_icon"]) {
	localStorage["user_saved_icon"] = "/9j/4AAQSkZJRgABAQEASABIAAD//gAUQ3JlYXRlZCB3aXRoIEdJTVAA/9sAQwACAQECAQECAgICAgICAgMFAwMDAwMGBAQDBQcGBwcHBgcHCAkLCQgICggHBwoNCgoLDAwMDAcJDg8NDA4LDAwM/9sAQwECAgIDAwMGAwMGDAgHCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAMAAwAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/J/TdPBK/LwRita10oEpxn5efypNItw5GAcg963bW33FcDGB1ps0KqaMrJgDOR1ol0vMpBUAEc10FtY7duMABc4/KmSaeefMJJ+gHGaQHJX2kgKTgcDnHWsbU7EBcYwxHFdpe2JizgFt2cE96wdWtwc8EGmmB1/wV8eJ8NPFUGo3Hhzwz4ssgR9o0zXLL7RbXKem5SskZ9GjcHpkMOD+wX7Nf7Mn7Ov7S3wQ8P8AjjRPhP4YtLPXIGd7WWJmksp43aOaFiGAYpIjgNgbgAwADAV+LGh3gRQZPlPy4+b72f8A69e8/B79ur4s/BPwRY+G/CvjG60TQtPeV7e0hsbR0RpJGlcsXiZnJZmPzE44AwAAEJo+4fip/wAEXbHxV8fm1fw9remaD4C1F99zpKQyJd6X+62lbUgMki+YA4DlNoJX5sZK/Cn/AIIvWHhT4/rrHiLWtM1/wHpsjSWmkPDI91qX7raq3TYVEAclyEL7toX5Qcji/wBjj/gsF4ou/H2leHvip/ZuqaVq1wlqNct7ZLO50+R2Cq8yRgRPCCRu2ojKCWy2Nhb+15/wWF8Tr481PQPhadN0nRtLne1/tye1S7utRdGKtJEkgMUcJIO3cjsww2UztALU+gf2mv2av2d/2aPgdr/jjW/hP4YvbXQ4VaO0iiZJL2eR1jhhVix275HUFsHau5sHbivx7+NPj5PiR4ruNRg8O+GfC1mW/caZoVj9ntrZc/d3MWkkPT5pHY9cbRxXrXxk/bk+K3xr8DXvhvxZ4yu9a0O/eOSe1msrRFLRuJEZWSJWQhlH3SM8g5BIPgmqEbTk7sE/jQNIqabcjK/y6Gug069UR7TnHAIzXFaZf7QM5xitux1IYzn8+lNoZ1dvqY2k8le/PPT0p0t/kcEjjj2rnk1XYCFbntTZdX6fMOfWkBe1C9Bz8xz9frWDql0DuwefrUl1qIAP5etYV/qe7crAAcYyRzVJAf/Z";
}

// Message passer to give [LocalStorage] settings to content_script.js
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.method == "getSettings") {
			sendResponse({vLoc: localStorage["vertical_location"], hLoc: localStorage["horizontal_location"], iconSize: localStorage["image_size"], scrSpeed: localStorage["scrolling_speed"], visibilityBehav: localStorage["visibility_behavior"], controlOption: localStorage["control_options"], iconLib: localStorage["icon_library"], userIcon: localStorage["user_saved_icon"]});
		} else {
			sendResponse({}); // snub them.
		}
	});

// open option page on initial in this version
var currentVersion = 1;// this variable should be incremented with every update so that, add-on update message can be shown
if(!localStorage["version_info"] || currentVersion > localStorage["version_info"]) {
	localStorage["version_info"] = currentVersion;
	chrome.tabs.create({url: "options.html?updated=true"});
}