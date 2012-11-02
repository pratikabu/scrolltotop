var pratikabustt_browser_impl = {
	getFixedLocation : function() {
		// #BrowserSpecific location
		return safari.extension.baseURI + "icons/pratikabu-stt-";
	},
	
	fetchPreferences: function() {
		// #BrowserSpecific method call
		// logic to set the location
		safari.self.addEventListener("message", pratikabustt_browser_impl.loadFromPreference, false);
		safari.self.tab.dispatchMessage("requestSettings");
	},
	
	loadFromPreference: function(data) {
		// #BrowserSpecific this method is somewhat browser specific
		if(!data) {
			return;
		}
		pratikabustt.loadFromResponse(pratikabustt_browser_impl.convertResponse(data));
	},
	
	getRotationCssName: function() {
		// #BrowserSpecific css
		return "-webkit-transform";
	},
	
	getBrowserSpecificUrl: function(imgUrl) {
		// #BrowserSpecific method to get the resource
		return imgUrl;
	},
	
	convertResponse: function(rawResponse) {
		// #BrowserSpecific method to convert response to single known format
		var response = rawResponse.message;
		response.showPageUp = response.showPageUp + "";
		return response;
	}
};