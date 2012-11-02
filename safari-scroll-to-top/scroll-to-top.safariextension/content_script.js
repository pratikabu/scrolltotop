/*****************************************
************** This file contains code which is browser independent ****************
************** Write browser dependent code in the specific browser dependent js file. *********
******************************************/
var pratikabu_stt_delay = 1200;// variable used to reduce the delay in scrolling
var pratikabu_stt_maxScrollAmount = 5;// the offset of the scroll bar
var pratikabu_stt_bVisibility = false;// variable to check whether the button is already visible or hidden
var pratikabu_stt_fadeSpeed = 300;
var pratikabu_stt_hoverOpacity = 1;
var pratikabu_stt_iconSize = 48;
var pratikabu_stt_showPager = "true";
var pratikabu_stt_otherDefaultFade = 0.35;

var pratikabustt = {
	createButton: function() {
		// create div tag
		$('body').prepend('<div id="pratikabuSTTDiv"><img id="pratikabuSTTArrowUp" style="float: left;" /><div id="pratikabuSTTDiv2"><img id="pratikabuSTTPageUp" /><img id="pratikabuSTTClear" /><img id="pratikabuSTTPageDown" /><img id="pratikabuSTTArrowDown" /></div></div>');
		$("#pratikabuSTTDiv").hide();
		
		// check whether the css has been applied to the div tag or not, if not then remove it from DOM
		// as it got added to a wrong iFrame
		if("fixed" != $("#pratikabuSTTDiv").css("position")) {
			$("#pratikabuSTTDiv").remove();
			return;
		}
		
		pratikabustt.hoverEffect("#pratikabuSTTArrowUp", 0.5);
		pratikabustt.hoverEffect("#pratikabuSTTClear", pratikabu_stt_otherDefaultFade);
		pratikabustt.hoverEffect("#pratikabuSTTArrowDown", pratikabu_stt_otherDefaultFade);
		pratikabustt.hoverEffect("#pratikabuSTTPageUp", pratikabu_stt_otherDefaultFade);
		pratikabustt.hoverEffect("#pratikabuSTTPageDown", pratikabu_stt_otherDefaultFade);
		
		// add the main div hover effects
		$("#pratikabuSTTDiv").hover(
			function() {
				pratikabustt.mainDivHover(true)
			},
			function() {
				pratikabustt.mainDivHover(false)
			});
		
		// fetch preferences
		pratikabustt_browser_impl.fetchPreferences();
		
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
			var location = ($(document).height() - pratikabustt.getWindowHeight());
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
		var winHeight = pratikabustt.getWindowHeight();
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
	
	getWindowHeight: function() {
		var winHeight = $(window).height();
		var docHeight = $(document).height();
		
		if(winHeight == docHeight && $(frameElement)) {
			var frameHeight = $(frameElement).height();
			if(frameHeight && 0 < frameHeight) {
				winHeight = frameHeight;
			}
		}
		
		return winHeight;
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
		var imgUrl = pratikabustt_browser_impl.getFixedLocation() + "pause-" + pratikabu_stt_iconSize + ".png";
		$("#pratikabuSTTArrowUp").attr("src", pratikabustt_browser_impl.getBrowserSpecificUrl(imgUrl));
	},
	
	showUpArrowImage: function() {
		$("#pratikabuSTTArrowUp").attr("src", pratikabustt_browser_impl.getBrowserSpecificUrl(pratikabustt_browser_impl.getFixedLocation() + pratikabu_stt_iconSize + ".png"));
	},
	
	hideOrShowButton: function() {
		var scrollTop = $(document).scrollTop();
		
		// show the icon if it satisfies this condition
		pratikabu_stt_bVisibility = $(document).height() > (pratikabustt.getWindowHeight() + 50) ? // offset is added so that it will not come on all the pages
		pratikabu_stt_bVisibility || ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 1), true)
			: pratikabu_stt_bVisibility && ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {if(!pratikabu_stt_bVisibility) $("#pratikabuSTTDiv").hide();}), false);
	},
	
	mainDivHover: function(hoverIn) {
		if(hoverIn) {
			$("#pratikabuSTTDiv2").stop(true, true);// to execute the fading out method
			
			var otherImagesSize = pratikabustt.getOtherImageSize();
			var divSize = pratikabu_stt_iconSize + otherImagesSize;
			if("true" == pratikabu_stt_showPager) {// check whether the page up is shown or not
				divSize += otherImagesSize;// add pixels based on the settings
			}
			$("#pratikabuSTTDiv").css("width", divSize + "px");
			
			$("#pratikabuSTTDiv2").fadeTo("slow", pratikabu_stt_hoverOpacity);
		} else {
			$("#pratikabuSTTDiv2").stop(true, true).fadeTo("slow", 0, function() {
					$("#pratikabuSTTDiv2").hide();
					
					var divSize = pratikabu_stt_iconSize;
					$("#pratikabuSTTDiv").css("width", divSize + "px");
				});
		}
	},
	
	getOtherImageSize: function() {
		var otherImagesSize = 16;
		if(48 == pratikabu_stt_iconSize) {
			otherImagesSize = 24;
		}
		
		return otherImagesSize;
	},
	
	loadFromResponse: function(response) {// load the images, css, include/remove elements
		pratikabu_stt_iconSize = parseInt(response.iconSize);
		pratikabu_stt_showPager = response.showPageUp;
		
		$("#pratikabuSTTDiv").css(response.vLoc, "20px");// set the vertical alignment of the image
		$("#pratikabuSTTDiv").css(response.hLoc, "20px");// set the horizontal alignment of the image
		
		// set the image
		pratikabustt.showUpArrowImage();
		
		var otherImagesSize = pratikabustt.getOtherImageSize();
		
		var divSize = otherImagesSize;
		if("true" == pratikabu_stt_showPager) {// check whether the page up is shown or not
			divSize += otherImagesSize;// add pixels based on the settings
		}
		$("#pratikabuSTTDiv2").css("width", divSize + "px");
		
		imgUrl = pratikabustt_browser_impl.getFixedLocation() + "clear-" + otherImagesSize + ".png";
		$("#pratikabuSTTClear").attr("src", pratikabustt_browser_impl.getBrowserSpecificUrl(imgUrl));
		
		imgUrl = pratikabustt_browser_impl.getFixedLocation() + "down-" + otherImagesSize + ".png";
		$("#pratikabuSTTArrowDown").attr("src", pratikabustt_browser_impl.getBrowserSpecificUrl(imgUrl));
		
		// show/remove page up and page down buttons from settings
		if("true" == pratikabu_stt_showPager) {
			imgUrl = pratikabustt_browser_impl.getFixedLocation() + "pageup-" + otherImagesSize + ".png";
			$("#pratikabuSTTPageUp").attr("src", pratikabustt_browser_impl.getBrowserSpecificUrl(imgUrl));
			$("#pratikabuSTTPageDown").attr("src", pratikabustt_browser_impl.getBrowserSpecificUrl(imgUrl));
			$("#pratikabuSTTPageDown").css(pratikabustt_browser_impl.getRotationCssName(), "rotate(180deg)");
		} else {
			$("#pratikabuSTTPageUp").remove();
			$("#pratikabuSTTPageDown").remove();
		}
		
		// change the location of the main image
		var pratikabu_stt_float = response.hLoc;
		if("right" == response.hLoc) {// replace the locations of the icons
			if("true" == pratikabu_stt_showPager) {
				$("#pratikabuSTTPageUp").before($("#pratikabuSTTClear"));
				$("#pratikabuSTTPageDown").before($("#pratikabuSTTArrowDown"));
			}
			$("#pratikabuSTTDiv2").css("marginLeft", 0 + "px");
		} else {
			$("#pratikabuSTTDiv2").css("marginLeft", pratikabu_stt_iconSize + "px");
		}
		
		$("#pratikabuSTTArrowUp").css("float", pratikabu_stt_float);
	}
};

pratikabustt.createButton();

$(document).ready(function() {// when page is ready do the below mentioned steps
	// hide or show the button based on the current location, because a page can be loaded scrolled..
	pratikabustt.hideOrShowButton();
});

$(window).resize(function() {// when window is resized do the below mentioned steps
	// hide or show the button based on the current location, because a page can be loaded scrolled..
	pratikabustt.hideOrShowButton();
});