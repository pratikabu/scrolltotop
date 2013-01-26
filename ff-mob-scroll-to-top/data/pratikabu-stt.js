var pratikabustt_bAppended = false;
var pratikabustt_arrow_up;
var pratikabustt_lastScrollLoc = 0;
var pratikabustt_data = null;// it will hold the preferences fetched from main.js

var pratikabustt = {
	middleLoc: 0,
	
	loadIcon : function() {
		pratikabustt_arrow_up = document.createElement("img");
		pratikabustt_arrow_up.id = "pratikabuSTTArrowUp";
		pratikabustt_arrow_up.src = self.options.sttIcon;
		pratikabustt_arrow_up.onclick = function() { pratikabustt.scrolltotop(); };
		
		pratikabustt_lastScrollLoc = pratikabustt.currentLocation();
		
		// fetch the icon from settings
		self.port.on("prefsValue", function(data) {
			// load the css and image source from preference
			pratikabustt.loadFromPreference(data);
		});
		self.port.emit("getPrefs");// method to communicate to main.js
	},
	
	scrollHandler : function() {
		if(!pratikabustt_arrow_up) {
			pratikabustt.loadIcon();
			return;
		}
		
		var nVScroll = pratikabustt.currentLocation();
		//pratikabustt_bAppended = nVScroll > 10 ?
		pratikabustt_bAppended = (nVScroll != 0 && pratikabustt_lastScrollLoc > nVScroll) ?
			pratikabustt_bAppended || (document.body.appendChild(pratikabustt_arrow_up), true)
			: pratikabustt_bAppended && (document.body.removeChild(pratikabustt_arrow_up), false);
		
		pratikabustt_lastScrollLoc = nVScroll;
	},
	
	scrolltotop: function() {
		if(null != pratikabustt_data && pratikabustt_data.animatedScrolling) {
			middleLoc = pratikabustt.currentLocation() / 2;
			pratikabustt.smoothScroll();
		} else {// immediate
			window.scrollTo(0, 0);
		}
	},
	
	loadFromPreference: function(data) {
		pratikabustt_data = data;
		pratikabustt_arrow_up.src = data.imgUrl;
	},
	
	// its a beta feature, will see any other better implementation in the next release
	smoothScroll: function() {
		var currentLocation = pratikabustt.currentLocation();
		var offset = middleLoc - currentLocation;
		if(offset <= 0) {
			offset = middleLoc + offset;
		} else {
			offset = middleLoc - offset;
		}

		offset = offset / 10;
		if(offset <= 0) {
			offset = 10;
		}

		var scrollY = currentLocation - offset;
		if(scrollY < 0) {
			scrollY = 0;
		}

		window.scrollTo(0, scrollY);
		if(scrollY > 0) {
			setTimeout(pratikabustt.smoothScroll, 10);// its a beta feature, will see any other better implementation in the next release
		}
	},
	
	currentLocation: function() {
		return document.documentElement.scrollTop || document.body.scrollTop;
	}
}

window.addEventListener('scroll', pratikabustt.scrollHandler, false);