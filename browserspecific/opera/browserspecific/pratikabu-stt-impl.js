var pratikabustt_browser_impl = {
	getFixedLocation : function() {
		// #BrowserSpecific location
		return "pratikabu-stt-";
	},
	
	fetchPreferences: function() {
		// #BrowserSpecific method call
		// write the logic to set the location
		opera.extension.postMessage({requestFor: "getPrefs"});
	},
	
	loadFromPreference: function(data) {
		// #BrowserSpecific this method is somewhat browser specific
		if(!data) {
			return;
		}
		pratikabustt.loadFromResponse(pratikabustt_browser_impl.convertResponse(data));
	},
	
	getBrowserSpecificUrl: function(imgUrl) {
		return "/icons/" + imgUrl;
	},
	
	convertResponse: function(rawResponse) {
		// #BrowserSpecific method to convert response to single known format
		return rawResponse;
	},
	
	openOptionPage: function() {
		// #BrowserSpecific method to open the option page
		opera.extension.postMessage({requestFor: "optionPage"});
	},
	
	setImageForId: function(imgId, imageName) {
		// Get the image resource
		var imgFile = opera.extension.getFile(
			pratikabustt_browser_impl.getBrowserSpecificUrl(
				pratikabustt_browser_impl.getFixedLocation() + imageName));

		// Read out the File object as a Data URI
		var fr = new FileReader();
		fr.onload = function(event) {
			pratikabusttjquery("#" + imgId).attr("src", event.target.result);
		};
		fr.readAsDataURL(imgFile);
	},
	
	/**
		Remove all excess code required for 
	*/
	removeCompleteAddOnCode: function() {
	}
};

/**********
OPERA index.html and injectedScript messaging
***********/
opera.extension.onmessage = function(event) {
	var responseFor = event.data.responseFor;
	if("getPrefs" == responseFor) {
		pratikabustt_browser_impl.loadFromPreference(event.data);
	} else if("" == responseFor) {
		event.source.postMessage(data);
	}
};