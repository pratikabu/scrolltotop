var pratikabustt_browser_impl = {
	getFixedLocation : function() {
		// #BrowserSpecific location
		return "icons/pratikabu-stt-";
	},
	
	fetchPreferences: function() {
		chrome.runtime.sendMessage({method: "fetchSettings"}, function(response_msg) {
			pratikabustt.loadFromResponse(response_msg);
		});
	},
	
	getBrowserSpecificUrl: function(imgUrl) {
		// #BrowserSpecific method to get the resource
		return chrome.runtime.getURL(imgUrl);
	},
	
	openOptionPage: function() {
		// #BrowserSpecific method to open the option page
		chrome.runtime.sendMessage({method: "openOptionPage"});
	},
	
	setImageForId: function(imgId, imageName) {
		var imgUrl = pratikabustt_browser_impl.getFixedLocation() + imageName;
		$("#" + imgId).attr("src", pratikabustt_browser_impl.getBrowserSpecificUrl(imgUrl));
	},
	
	/**
		Remove all excess code required for 
	*/
	removeCompleteAddOnCode: function() {
	}
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.pratikabusttaction == "top")
		pratikabustt.scrollToTop();
	else if (request.pratikabusttaction == "intelligentflip")
		pratikabustt.scrollIntelligently();
	else if(request.pratikabusttaction == "bottom")
		pratikabustt.scrollToBottom();
});
