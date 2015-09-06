var iconsFolderUrl;// icon folder url, this location will come from fetchPreferences

var pratikabustt_browser_impl = {
	getFixedLocation : function() {
		// #BrowserSpecific location
		return "pratikabu-stt-";
	},
	
	fetchPreferences: function() {
		// #BrowserSpecific method call
		// prefsValue listener
    	self.port.on("prefsValue", function(data) {
    		iconsFolderUrl = data.iconFolderLocation;
    		var urlToMatch = window.location.href;
    		var profileFound = false;
    		for(var i = 0; i < data.sttArray.length; i++) {
    		    var sttData = data.sttArray[i];
    			if(!sttData.default_setting && pratikabustt.mactchDomainAgainstDomainList(urlToMatch, sttData.profile_url_pattern)) {
    				// load the css and image source from preference
    				pratikabustt_browser_impl.loadFromPreference(sttData);
    				profileFound = true;
    				break;
    			}
    		}
    		
    		if(!profileFound) {
    			pratikabustt_browser_impl.loadFromPreference(data.sttArray[0]);
    		}
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
	
	getBrowserSpecificUrl: function(imgUrl) {
		// #BrowserSpecific method to get the resource
		return iconsFolderUrl + "/" + imgUrl;
	},
	
	convertResponse: function(rawResponse) {
		// #BrowserSpecific method to convert response to single known format
		var response = rawResponse;
		return response;
	},
	
	openOptionPage: function() {
		// #BrowserSpecific method to open the option page
		self.port.emit("optionPage");// method to communicate to main.js
	},
	
	setImageForId: function(imgId, imageName) {
		var imgUrl = pratikabustt_browser_impl.getFixedLocation() + imageName;
		$("." + imgId).attr("src", pratikabustt_browser_impl.getBrowserSpecificUrl(imgUrl));
	},
	
	/**
		Remove all excess code required for 
	*/
	removeCompleteAddOnCode: function() {
	}
};