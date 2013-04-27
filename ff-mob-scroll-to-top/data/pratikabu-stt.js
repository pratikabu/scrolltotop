var pratikabu_stt_bVisibility = false;
var pratikabustt_arrow_up;
var pratikabustt_lastScrollLoc = 0;
var pratikabustt_data = null;// it will hold the preferences fetched from main.js
var pratikabu_stt_ahRequestCount = 0;// to count hide request
var pratikabu_stt_arrowDirectionUp = true;

var pratikabustt = {
	middleLoc: 0,
	
	loadIcon : function() {
		if(pratikabustt_arrow_up) {
			return;
		}
		
		pratikabustt_arrow_up = document.createElement("img");
		pratikabustt_arrow_up.id = "pratikabuSTTArrowUp";
		pratikabustt_arrow_up.src = self.options.sttIcon;
		pratikabustt_arrow_up.onclick = function() { pratikabustt.scrolltotop(); };
		pratikabustt_arrow_up.src = pratikabustt_data.imgUrl;
		
		if(pratikabustt_data.smartDirectionMode) {
			pratikabustt.rotateDown();
		}
	},
	
	showHideAddon: function(boolShowAddon) {
		if(boolShowAddon != pratikabu_stt_bVisibility) {
			if(boolShowAddon) {// show addon
				pratikabustt.loadIcon();
				document.body.appendChild(pratikabustt_arrow_up);
			} else {// remove it
				if(pratikabustt_arrow_up) {
					document.body.removeChild(pratikabustt_arrow_up);
				}
			}
		}
		if(boolShowAddon) {
			pratikabustt.triggerAutoHide();
		}
		pratikabu_stt_bVisibility = boolShowAddon;// set the latest value
	},
	
	triggerAutoHide: function() {
		pratikabu_stt_ahRequestCount++;
		setTimeout(function() {
			if(0 == --pratikabu_stt_ahRequestCount) {
				pratikabustt.showHideAddon(false);
			}
		}, 5000);
	},
	
	scrollHandler: function() {
		if(pratikabustt_data.smartDirectionMode) {
			pratikabustt.smartDirectionScrolling();
		} else {
			pratikabustt.normalScrolling();
		}
	},
	
	normalScrolling : function() {
		var nVScroll = pratikabustt.currentLocation();
		pratikabustt.showHideAddon(nVScroll != 0 && (pratikabustt_lastScrollLoc > nVScroll));
		pratikabustt_lastScrollLoc = nVScroll;
	},
	
	smartDirectionScrolling: function() {
		if(pratikabustt_lastScrollLoc == pratikabustt.currentLocation()) {
			// do nothing
		} else if(pratikabustt_lastScrollLoc > pratikabustt.currentLocation()) {// user scrolled upwards
			pratikabustt.rotateUp();
		} else {// user scrolled downwards
			pratikabustt.rotateDown();
		}
		
		pratikabustt_lastScrollLoc = pratikabustt.currentLocation();// update to latest
		
		// finally once the scrolling is finished, rotate addon if needed
		if(0 == pratikabustt_lastScrollLoc) {
			pratikabustt.rotateDown();
		} else if(pratikabustt_lastScrollLoc >= (pratikabustt.getDocHeight() - window.innerHeight)) {
			pratikabustt.rotateUp();
		}
		
		pratikabustt.showHideAddon(true);
	},
	
	rotateUp: function() {
		if(pratikabustt_arrow_up) {
			pratikabustt_arrow_up.style.MozTransform = "rotate(0deg)";
		}
		pratikabu_stt_arrowDirectionUp = true;
	},
	
	rotateDown: function() {
		if(pratikabustt_arrow_up) {
			pratikabustt_arrow_up.style.MozTransform = "rotate(180deg)";
		}
		
		pratikabu_stt_arrowDirectionUp = false;
	},
	
	getDocHeight: function() {
		return Math.max(document.body.scrollHeight, document.body.offsetHeight);//,
			//document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
	},
	
	scrolltotop: function() {
		if(pratikabu_stt_arrowDirectionUp) {
			if(pratikabustt_data.animatedScrolling) {
				middleLoc = pratikabustt.currentLocation() / 2;
				pratikabustt.smoothScroll();
			} else {// immediate
				window.scrollTo(0, 0);
			}
		} else {
			window.scrollTo(0, pratikabustt.getDocHeight());
		}
	},
	
	loadFromPreference: function(data) {
		pratikabustt_data = data;
		window.addEventListener('scroll', pratikabustt.scrollHandler, false);
		pratikabustt_lastScrollLoc = pratikabustt.currentLocation();
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

// fetch the icon from settings
self.port.on("prefsValue", function(data) {
	// load the css and image source from preference
	pratikabustt.loadFromPreference(data);
});
self.port.emit("getPrefs");// method to communicate to main.js