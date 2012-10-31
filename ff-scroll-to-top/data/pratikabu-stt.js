/*****************************************
    ********** Variables ****************
******************************************/
var pratikabu_stt_delay = 1200;// variable used to reduce the delay in scrolling
var pratikabu_stt_maxScrollAmount = 5;// the offset of the scroll bar
var pratikabu_stt_bVisibility = false;// variable to check whether the button is already visible or hidden
var pratikabu_stt_fadeSpeed = 300;
var pratikabu_stt_hoverOpacity = 1;
var pratikabu_stt_iconSize = 48;
var pratikabu_stt_fixed = "pratikabu-stt-";

var pratikabustt = {
    createButton: function() {
		// create div tag
		$('body').prepend('<div align="right" id="pratikabuSTTDiv"><img id="pratikabuSTTArrowUp" style="float: left;" /><img id="pratikabuSTTPageUp" /><img id="pratikabuSTTClear" /><img id="pratikabuSTTPageDown" /><img id="pratikabuSTTArrowDown" /></div>');
		$("#pratikabuSTTDiv").hide();
		
		// check whether the css has been applied to the div tag or not, if not then remove it from DOM
		// as it got added to a wrong iFrame
		if("fixed" != $("#pratikabuSTTDiv").css("position")) {
			$("#pratikabuSTTDiv").remove();
			return;
		}
		
		pratikabustt.hoverEffect("#pratikabuSTTArrowUp", 0.5);
		pratikabustt.hoverEffect("#pratikabuSTTClear", 0.35);
		pratikabustt.hoverEffect("#pratikabuSTTArrowDown", 0.35);
		pratikabustt.hoverEffect("#pratikabuSTTPageUp", 0.35);
		pratikabustt.hoverEffect("#pratikabuSTTPageDown", 0.35);
		
		// #BrowserSpecific method call
		// prefsValue listner
    	self.port.on("prefsValue", function(data) {
			// load the css and image source from preference
			pratikabustt.loadFromPreference(data);
		});
		self.port.emit("getPrefs");// method to communicate to main.js
		
		// add the scroll up logic
		$("#pratikabuSTTArrowUp").click(function() {
			if($(document).scrollTop() == 0) {
				return false;
			}
			if($(this).attr("src").lastIndexOf("pause") == -1) {// identify up arrow
				pratikabustt.scrollPageTo(pratikabu_stt_delay, 0, true);
			} else {
				pratikabustt.showUpArrowImage();
				$("html, body").stop();
			}
			return false;
		});
		
		// add the remove div logic
		$("#pratikabuSTTArrowDown").click(function() {
			var location = ($(document).height() - $(window).height());
			if($(document).scrollTop() == location) {
				return false;
			}
			pratikabustt.scrollPageTo(pratikabu_stt_delay, location, true);
			return false;
		});
		
		var scrollHandler = function () {
			pratikabustt.hideOrShowButton();
		};
		
		// add the scroll down logic
		$("#pratikabuSTTClear").click(function() {
			$("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {
				$("#pratikabuSTTDiv").hide();
				pratikabu_stt_bVisibility = false;
				$(window).unbind('scroll', scrollHandler);
			});
		});
		
		// add the scroll handler on the page to hide and show the image
		$(window).scroll(scrollHandler);
		
		// add page up and page down handlers
		$("#pratikabuSTTPageUp").click(function() {
			pratikabustt.scrollPageScreen(1);
		});
		
		$("#pratikabuSTTPageDown").click(function() {
			pratikabustt.scrollPageScreen(-1);
		});
	},
	
	scrollPageTo: function(delay, location, showPause) {
		if(showPause) {
			pratikabustt.showPauseImage();
		}
		$("html, body").stop(true, true).animate({ scrollTop: location }, delay, function() {
			if(showPause) {
				pratikabustt.showUpArrowImage();
			}
		});
	},
	
	scrollPageScreen: function(direction) {
		var speed = 344;
		var location = 0;
		var scrollTop = $(document).scrollTop();
		var winHeight = $(window).height();
		var docHeight = $(document).height() - winHeight;
		
		if(0 > direction) {// page down
			location = scrollTop + winHeight;
			if(location > docHeight) {
				location = docHeight;
			}
		} else {// page up
			location = scrollTop - winHeight;
			if(location < 0) {
				location = 0;
			}
		}
		
		pratikabustt.scrollPageTo(speed, location, false);
	},
	
	hoverEffect: function(varId, idleOpacity) {
		$(varId).attr("class", "pratikabuSTTImg");// add it for all the images we've
		$(varId).hide();
		$(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, idleOpacity);
		$(varId).css("cursor", "pointer");
		$(varId).hover(
			function() {
				$(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, pratikabu_stt_hoverOpacity);
			},
			function() {
				$(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, idleOpacity);
			});
	},
	
	showPauseImage: function() {
		var imgUrl = pratikabu_stt_fixed + "pause-" + pratikabu_stt_iconSize + ".png";
		$("#pratikabuSTTArrowUp").attr("src", pratikabustt.getBrowserSpecificUrl(imgUrl));
	},
	
	showUpArrowImage: function() {
		$("#pratikabuSTTArrowUp").attr("src", pratikabustt.getBrowserSpecificUrl(pratikabu_stt_fixed + pratikabu_stt_iconSize + ".png"));
	},
	
	hideOrShowButton: function() {
		var scrollTop = $(document).scrollTop();
		
		// show the icon if it satisfies this condition
		pratikabu_stt_bVisibility = $(document).height() > ($(window).height() + 50) ?// offset is added so that it will not come on all the pages
		pratikabu_stt_bVisibility || ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 1), true)
			: pratikabu_stt_bVisibility && ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {if(!pratikabu_stt_bVisibility) $("#pratikabuSTTDiv").hide();}), false);
	},
	
	loadFromPreference: function(data) {
		// #BrowserSpecific this method is somewhat browser specific
		if(!data) {
			return;
		}
		var response = pratikabustt.convertResponse(data);
		
        pratikabu_stt_iconSize = response.iconSize;
		
		$("#pratikabuSTTDiv").css(response.vLoc, "20px");// set the vertical alignment of the image
		$("#pratikabuSTTDiv").css(response.hLoc, "20px");// set the horizontal alignment of the image
		
		// set the image
		pratikabustt.showUpArrowImage();
		
		var otherImagesSize = 16;
		var divSize = 48;
		if("48" == response.iconSize) {
			otherImagesSize = 24;
			divSize = 72;
		}
		if("true" == response.showPageUp) {// check whether the page up is shown or not
			divSize += (divSize == 72 ? 24 : 16);// add pixels based on the settings
		}
		$("#pratikabuSTTDiv").css("width", divSize + "px");
		
		imgUrl = pratikabu_stt_fixed + "clear-" + otherImagesSize + ".png";
		$("#pratikabuSTTClear").attr("src", pratikabustt.getBrowserSpecificUrl(imgUrl));
		
		imgUrl = pratikabu_stt_fixed + "down-" + otherImagesSize + ".png";
		$("#pratikabuSTTArrowDown").attr("src", pratikabustt.getBrowserSpecificUrl(imgUrl));
		
		// show/remove page up and page down buttons from settings
		if("true" == response.showPageUp) {
			imgUrl = pratikabu_stt_fixed + "pageup-" + otherImagesSize + ".png";
			$("#pratikabuSTTPageUp").attr("src", pratikabustt.getBrowserSpecificUrl(imgUrl));
			$("#pratikabuSTTPageDown").attr("src", pratikabustt.getBrowserSpecificUrl(imgUrl));
			$("#pratikabuSTTPageDown").css("-moz-transform", "rotate(180deg)");// #BrowserSpecific css
		} else {
			$("#pratikabuSTTPageUp").remove();
			$("#pratikabuSTTPageDown").remove();
		}
		
		// change the location of the main image
		var pratikabu_stt_float = "left";
		if("left" == response.hLoc) {// replace the locations of the icons
			pratikabu_stt_float = "right";
			
			if("true" == response.showPageUp) {
				$("#pratikabuSTTPageUp").before($("#pratikabuSTTClear"));
				$("#pratikabuSTTPageDown").before($("#pratikabuSTTArrowDown"));
			}
		}
		
		$("#pratikabuSTTArrowUp").css("float", pratikabu_stt_float);
	},
	
	getBrowserSpecificUrl: function(imgUrl) {
		// #BrowserSpecific method to get the resource
		return "resource://jid0-grmsxw9byuhwgjlhtxjg27ynzrs-at-jetpack/scroll-to-top/data/" + imgUrl;
	},
	
	convertResponse: function(rawResponse) {
		// #BrowserSpecific method to convert response to single known format
		var response = {
			vLoc: true == rawResponse.buttonAtBottom ? "bottom" : "top" ,
			hLoc: true == rawResponse.buttonAtLeft ? "left" : "right" ,
			iconSize: rawResponse.iconSize,
			showPageUp: "true"
		};
		return response;
	}
}

pratikabustt.createButton();

$(document).ready(function() {// when page is ready do the below mentioned steps
	// hide or show the button based on the current location, because a page can be loaded scrolled..
	pratikabustt.hideOrShowButton();
});

$(window).resize(function() {// when window is resized do the below mentioned steps
	// hide or show the button based on the current location, because a page can be loaded scrolled..
	pratikabustt.hideOrShowButton();
});