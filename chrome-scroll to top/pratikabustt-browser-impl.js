var pratikabustt_browser_impl = {
	getFixedLocation : function() {
		// #BrowserSpecific location
		return "icons/pratikabu-stt-";
	},
	
	fetchPreferences: function() {
		// #BrowserSpecific method call
		// write the logic to set the location
		pratikabustt_browser_impl.loadFromPreference();
	},
	
	loadFromPreference: function(data) {
		// #BrowserSpecific call
		// Asks background.html for [LocalStorage] settings from Options Page and assigns them to variables
		chrome.extension.sendMessage({method: "getSettings"}, function(response_msg) {
			// #BrowserSpecific this method is somewhat browser specific
			if(!response_msg) {
				return;
			}
			pratikabustt.loadFromResponse(pratikabustt_browser_impl.convertResponse(response_msg));
		});
	},
	
	getBrowserSpecificUrl: function(imgUrl) {
		// #BrowserSpecific method to get the resource
		return chrome.extension.getURL(imgUrl);
	},
	
	convertResponse: function(rawResponse) {
		// #BrowserSpecific method to convert response to single known format
		return rawResponse;
	},
	
	openOptionPage: function() {
		// #BrowserSpecific method to open the option page
		chrome.extension.sendMessage({method: "openOptionPage"});
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