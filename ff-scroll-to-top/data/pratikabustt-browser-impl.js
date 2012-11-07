var pratikabustt_browser_impl = {
	getFixedLocation : function() {
		// #BrowserSpecific location
		return "pratikabu-stt-";
	},
	
	fetchPreferences: function() {
		// #BrowserSpecific method call
		// prefsValue listner
    	self.port.on("prefsValue", function(data) {
			// load the css and image source from preference
			pratikabustt_browser_impl.loadFromPreference(data);
		});
		self.port.emit("getPrefs");// method to communicate to main.js
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
		return "-moz-transform";
	},
	
	getBrowserSpecificUrl: function(imgUrl) {
		// #BrowserSpecific method to get the resource
		return "resource://jid0-grmsxw9byuhwgjlhtxjg27ynzrs-at-jetpack/scroll-to-top/data/icons/" + imgUrl;
	},
	
	convertResponse: function(rawResponse) {
		// #BrowserSpecific method to convert response to single known format
		var response = rawResponse;
		return response;
	}
};