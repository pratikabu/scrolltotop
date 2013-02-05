/*****************************************
************** This file contains code which is browser independent ****************
************** Write browser dependent code in the specific browser dependent js file. *********
******************************************/
var pratikabu_stt_delay = 1200;// variable used to reduce the delay in scrolling
var pratikabu_stt_maxScrollAmount = 50;// the offset of the scroll bar
var pratikabu_stt_bVisibility = false;// variable to check whether the button is already visible or hidden
var pratikabu_stt_fadeSpeed = 300;
var pratikabu_stt_hoverOpacity = 1;
var pratikabu_stt_iconSize = 48;
var pratikabu_stt_otherDefaultFade = 0.35;
var pratikabu_stt_visibilityBehavior = "autohide";
var pratikabu_stt_controlOption = "simple";
var pratikabu_stt_preferencesLoaded = false;
var pratikabu_stt_firstAlwaysShow = true;
var pratikabu_stt_buttonCreated;// this variable will tell whether the button is created or not on this page also whether this page is eligible for the button or not it will be initialzied once during load
var pratikabu_stt_prefs;// this variable holds the preferences
var pratikabu_stt_onceVisible = false;// this variable will be used for the special case in which document and window height are same. it will be used to identify the always on property so that visibility of the icon can be persisted.
var pratikabu_stt_dualArrow = false;
var pratikabu_stt_flipScrolling = false;
var pratikabu_stt_scrollingInProgress = false;

var pratikabustt = {
	pratikabu_stt_scrollHandler: function () {
		pratikabustt.callHideOrShowOnceAfterInit();
		
		if(!pratikabu_stt_dualArrow && "true" == pratikabu_stt_buttonCreated && "autohide" != pratikabu_stt_visibilityBehavior) {
			if(pratikabu_stt_maxScrollAmount > $(document).scrollTop()) {// you are at the top rotate arrows to original state
				pratikabu_stt_flipScrolling = true;
				$("#pratikabuSTTArrowUp").rotate({ animateTo: 180 });
			} else {
				pratikabu_stt_flipScrolling = false;
				$("#pratikabuSTTArrowUp").rotate({ animateTo: 0 });
			}
		}
	},
	
	createButton: function() {
		// create div tag
		$('body').prepend('<div id="pratikabuSTTDiv"><img id="pratikabuSTTArrowUp" style="float: left;" /><div id="pratikabuSTTDiv2"><img id="pratikabuSTTPageUp" /><img id="pratikabuSTTClear" /><img id="pratikabuSTTPageDown" /><img id="pratikabuSTTSettings" /></div></div>');
		$("#pratikabuSTTDiv").hide();
		
		// check whether the css has been applied to the div tag or not, if not then remove it from DOM
		// as it got added to a wrong iFrame
		if("fixed" != $("#pratikabuSTTDiv").css("position")) {
			$("#pratikabuSTTDiv").remove();
			return "false";// tag removed
		}
		
		pratikabustt.hoverEffect("#pratikabuSTTArrowUp", 0.5);
		pratikabustt.hoverEffect("#pratikabuSTTClear", pratikabu_stt_otherDefaultFade);
		pratikabustt.hoverEffect("#pratikabuSTTSettings", pratikabu_stt_otherDefaultFade);
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
		
		// add the scroll up logic
		$("#pratikabuSTTArrowUp").click(function() {
			if(pratikabu_stt_flipScrolling) {
				pratikabustt.scrollToBottom();
			} else {
				pratikabustt.scrollToTop();
			}
			
			return false;
		});
		
		// add the scroll down logic
		$("#pratikabuSTTSettings").click(function() {
			pratikabustt_browser_impl.openOptionPage();
			return false;
		});
		
		// add rotation for scrolling down
		$("#pratikabuSTTSettings").hover(
			function() {
				$(this).rotate({ animateTo: 180 });
			},
			function() {
				$(this).rotate({ animateTo: 0 });
			});
		
		// add the remove div logic
		$("#pratikabuSTTClear").click(function() {
			$("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {
				$("#pratikabuSTTDiv").remove();
				pratikabu_stt_bVisibility = false;
				$(window).unbind('scroll', pratikabustt.pratikabu_stt_scrollHandler);
			});
		});
		
		// add page up and page down handlers
		$("#pratikabuSTTPageUp").click(function() {
			pratikabustt.scrollPageScreen(1);
		});
		
		$("#pratikabuSTTPageDown").click(function() {
			pratikabustt.scrollPageScreen(-1);
		});
		
		// populate from preferences
		var vloc = pratikabu_stt_prefs.vLoc;
		var vlocVal = "20px";
		var hloc = pratikabu_stt_prefs.hLoc;
		var hlocVal = "20px";
		
		if("middle" == vloc) {
			vloc = "top";
			vlocVal = "50%";
		}
		
		if("middle" == hloc) {
			hloc = "left";
			hlocVal = "50%";
		}
		
		$("#pratikabuSTTDiv").css(vloc, vlocVal);// set the vertical alignment of the image
		$("#pratikabuSTTDiv").css(hloc, hlocVal);// set the horizontal alignment of the image
		
		// set the image
		pratikabustt.showUpArrowImage();
		
		var otherImagesSize = pratikabustt.getOtherImageSize();
		
		var showPagerButtons = false;
		if("pager" == pratikabu_stt_controlOption) {
			if($(document).height() != pratikabustt.getWindowHeight()) {
				showPagerButtons = true;
			} else {
				pratikabu_stt_controlOption = "simple";// set the control option to simple
			}
		}
		
		var divSize = otherImagesSize;
		if(showPagerButtons) {// check whether the page up is shown or not
			divSize += otherImagesSize;// add pixels based on the settings
		}
		$("#pratikabuSTTDiv2").css("width", divSize + "px");
		
		pratikabustt_browser_impl.setImageForId("pratikabuSTTClear", "clear-" + otherImagesSize + ".png");
		pratikabustt_browser_impl.setImageForId("pratikabuSTTSettings", "settings-" + otherImagesSize + ".png");
		
		// show/remove page up and page down buttons from settings
		if(showPagerButtons) {
			pratikabustt_browser_impl.setImageForId("pratikabuSTTPageUp", "pageup-" + otherImagesSize + ".png");
			pratikabustt_browser_impl.setImageForId("pratikabuSTTPageDown", "pageup-" + otherImagesSize + ".png");
			$("#pratikabuSTTPageDown").rotate(180);
		} else {
			$("#pratikabuSTTPageUp").remove();
			$("#pratikabuSTTPageDown").remove();
		}
		
		// change the location of the main image
		var pratikabu_stt_float = pratikabu_stt_prefs.hLoc;
		if("right" == pratikabu_stt_prefs.hLoc) {// replace the locations of the icons
			if(showPagerButtons) {
				$("#pratikabuSTTPageUp").before($("#pratikabuSTTClear"));
				$("#pratikabuSTTPageDown").before($("#pratikabuSTTSettings"));
			}
			$("#pratikabuSTTDiv2").css("marginLeft", 0 + "px");
		} else {
			$("#pratikabuSTTDiv2").css("marginLeft", pratikabu_stt_iconSize + "px");
		}
		
		$("#pratikabuSTTArrowUp").css("float", pratikabu_stt_float);
		$("#pratikabuSTTArrowUp").css("width", pratikabu_stt_iconSize + "px");
		$("#pratikabuSTTArrowUp").css("height", pratikabu_stt_iconSize + "px");
		
		return "true";// successfully created
	},
	
	createDualButton: function() {
		// create div tag
		if("hr" == pratikabu_stt_prefs.dArrang) {
			$('body').prepend('<div id="pratikabuSTTDiv"><img id="pratikabuSTTArrowUp" /><img id="pratikabuSTTArrowDown" /></div>');
		} else if("vr" == pratikabu_stt_prefs.dArrang) {
			//$('body').prepend('<div id="pratikabuSTTDiv"><div class="otherDiv"><img id="pratikabuSTTArrowUp" /></div><div align="center" class="otherDiv"><img id="pratikabuSTTArrowDown" /></div></div>');
			$('body').prepend('<div id="pratikabuSTTDiv"><img id="pratikabuSTTArrowUp" style="display: block !important;" /><img id="pratikabuSTTArrowDown" style="display: block !important;" /></div>');
		}
		$("#pratikabuSTTDiv").hide();
		
		// check whether the css has been applied to the div tag or not, if not then remove it from DOM
		// as it got added to a wrong iFrame
		if("fixed" != $("#pratikabuSTTDiv").css("position")) {
			$("#pratikabuSTTDiv").remove();
			return "false";// tag removed
		}
		
		pratikabustt.hoverEffect("#pratikabuSTTArrowUp", pratikabu_stt_otherDefaultFade);
		pratikabustt.hoverEffect("#pratikabuSTTArrowDown", pratikabu_stt_otherDefaultFade);
		
		// add the scroll up logic
		$("#pratikabuSTTArrowUp").click(function() {
			if($(document).scrollTop() == 0) {
				return false;
			}
			pratikabustt.scrollPageTo(pratikabu_stt_delay, 0);
			return false;
		});
		
		// add the scroll down logic
		$("#pratikabuSTTArrowDown").click(function() {
			var location = ($(document).height() - pratikabustt.getWindowHeight());
			if(0 == location) {// this should never happen, but it gives this result on some pages
				location = $(document).height();
			}
			if($(document).scrollTop() == location) {
				return false;
			}
			pratikabustt.scrollPageTo(pratikabu_stt_delay, location);
			return false;
		});
		
		// populate from preferences
		var vloc = pratikabu_stt_prefs.vLoc;
		var vlocVal = "20px";
		var hloc = pratikabu_stt_prefs.hLoc;
		var hlocVal = "20px";
		
		if("middle" == vloc) {
			vloc = "top";
			vlocVal = "50%";
		}
		
		if("middle" == hloc) {
			hloc = "left";
			hlocVal = "50%";
		}
		
		$("#pratikabuSTTDiv").css(vloc, vlocVal);// set the vertical alignment of the image
		$("#pratikabuSTTDiv").css(hloc, hlocVal);// set the horizontal alignment of the image
		
		// set the image
		pratikabustt.showDualArrowImage();
		
		return "true";// successfully created
	},
	
	scrollToTop: function() {
		if($(document).scrollTop() == 0) {
			return false;
		}
		
		pratikabustt.scrollPageTo(pratikabu_stt_delay, 0);
	},
	
	scrollToBottom: function() {
		var location = ($(document).height() - pratikabustt.getWindowHeight());
		if(0 == location) {// this should never happen, but it gives this result on some pages
			location = $(document).height();
		}
		if($(document).scrollTop() == location) {
			return false;
		}
		pratikabustt.scrollPageTo(pratikabu_stt_delay, location);
	},
	
	scrollPageTo: function(delay, location) {
		if(pratikabu_stt_scrollingInProgress) {// pause any scroll when scrolling is in progress
			$("html, body").stop();
			pratikabu_stt_scrollingInProgress = false;
			return;
		}
		
		pratikabu_stt_scrollingInProgress = true;
		
		$("html, body").stop(true, true).animate({ scrollTop: location }, delay, function() {
			pratikabu_stt_scrollingInProgress = false;
		});
	},
	
	scrollPageScreen: function(direction) {
		var speed = 344;
		var location = 0;
		var scrollTop = $(document).scrollTop();
		var winHeight = pratikabustt.getWindowHeight();
		var docHeight = $(document).height();
		
		if(docHeight == winHeight) {
			// cannot scroll between pages as window height and document heights are same
			return;
		}
		
		docHeight -= winHeight;
		
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
		
		pratikabustt.scrollPageTo(speed, location);
	},
	
	getWindowHeight: function() {
		var winHeight = $(window).height();
		/**var docHeight = $(document).height();
		
		if(winHeight == docHeight && $(frameElement)) {
			var frameHeight = $(frameElement).height();
			if(frameHeight && 0 < frameHeight) {
				winHeight = frameHeight;
			}
		}*/
		
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
	
	showUpArrowImage: function() {
		if("myIcon" == pratikabu_stt_prefs.iconLib) {
			$("#pratikabuSTTArrowUp").attr("src", "data:image/png;base64," + pratikabu_stt_prefs.userIcon);
		} else {
			var suffixString = pratikabu_stt_iconSize + "-" + pratikabu_stt_prefs.iconLib;
			pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowUp", suffixString + ".png");
		}
	},
	
	showDualArrowImage: function() {
		if("myIcon" == pratikabu_stt_prefs.dIconLib) {
			var base64url = "data:image/png;base64," + pratikabu_stt_prefs.dUserIcon;
			$("#pratikabuSTTArrowUp").attr("src", base64url);
			$("#pratikabuSTTArrowDown").attr("src", base64url);
		} else {
			var iconNumber = parseInt(pratikabu_stt_prefs.dIconLib);
			var iconName = "dual-";
			if(20 >= iconNumber) {
				iconName += "hr-";
			} else if(40 >= iconNumber) {
				iconNumber -= 20;
				iconName += "vr-";
			} else {
				iconNumber -= 40;
				iconName = pratikabu_stt_iconSize + "-";
			}
			
			var suffixString = iconName + iconNumber;
			pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowUp", suffixString + ".png");
			pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowDown", suffixString + ".png");
		}
		
		$("#pratikabuSTTArrowDown").rotate(180);
	},
	
	hideOrShowButton: function() {
		if("false" == pratikabu_stt_buttonCreated) {
			// page not eligible for the button, do nothing
			return;
		}
		
		var boolShow = false;
		var vScrollTop = $(document).scrollTop();
		var ignoreCreation = "false";// this variable will be turned on, iff the page dissatisfies the height check see below
		
		boolShow = $(document).height() > (pratikabustt.getWindowHeight() + pratikabu_stt_maxScrollAmount) || vScrollTop > pratikabu_stt_maxScrollAmount; // terminating condition
		
		// SPECIAL Handling STARTS
		// this logic is solely for the special condition in which document and window height are same
		if(!pratikabu_stt_onceVisible && boolShow) {
			pratikabu_stt_onceVisible = true;
		}
		
		if(!boolShow && pratikabu_stt_onceVisible && "alwaysshow" == pratikabu_stt_visibilityBehavior) {
			boolShow = true;
		}
		// SPECIAL Handling ENDS
		
		if(!pratikabu_stt_buttonCreated && (!boolShow || window != window.top)) {// ignore any iFrame/frame, work only for top window. also ignore creation if boolShow is false
			// since the page doesnot satisfies the height criteria, ignore the creation and hide logic
			// this logic can create an icon once user resizes the window
			return;
		}
		
		if("autohide" == pratikabu_stt_visibilityBehavior) {
			boolShow = vScrollTop > pratikabu_stt_maxScrollAmount;
		} else {
			if(0 < vScrollTop) {
				pratikabu_stt_firstAlwaysShow = false;
			}
			
			if(0 == vScrollTop && pratikabu_stt_firstAlwaysShow) {
				boolShow = false;
			}
		}
		
		if(!pratikabu_stt_buttonCreated) {
			if(pratikabu_stt_dualArrow) {
				pratikabu_stt_buttonCreated = pratikabustt.createDualButton();
			} else {
				pratikabu_stt_buttonCreated = pratikabustt.createButton();
			}
		}
		
		// show the icon if it satisfies this condition
		pratikabu_stt_bVisibility = boolShow ? // offset is added so that it will not come on all the pages
		pratikabu_stt_bVisibility || ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 1), true)
			: pratikabu_stt_bVisibility && ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {if(!pratikabu_stt_bVisibility) $("#pratikabuSTTDiv").hide();}), false);
	},
	
	mainDivHover: function(hoverIn) {
		if("none" == pratikabu_stt_controlOption) {
			return;
		}
		
		if(hoverIn) {
			$("#pratikabuSTTDiv2").stop(true, true);// to execute the fading out method
			
			var otherImagesSize = pratikabustt.getOtherImageSize();
			var divSize = pratikabu_stt_iconSize + otherImagesSize;
			if("pager" == pratikabu_stt_controlOption) {// check whether the page up is shown or not
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
		pratikabu_stt_prefs = response;
		
		pratikabu_stt_delay = parseInt(pratikabu_stt_prefs.scrSpeed);
		pratikabu_stt_iconSize = parseInt(pratikabu_stt_prefs.iconSize);
		pratikabu_stt_visibilityBehavior = pratikabu_stt_prefs.visibilityBehav;
		pratikabu_stt_controlOption = pratikabu_stt_prefs.controlOption;
		
		pratikabu_stt_dualArrow = ("2" == pratikabu_stt_prefs.arrowType);
		
		pratikabu_stt_preferencesLoaded = true;// enable functioning document.ready function
		pratikabustt.callHideOrShowOnceAfterInit();
	},
	
	callHideOrShowOnceAfterInit: function() {// function to handle the call to hideOrShowButton
		if(pratikabu_stt_preferencesLoaded) {// check whether the preferences have been loaded or not
			// hide or show the button based on the current location, because a page can be loaded scrolled..
			pratikabustt.hideOrShowButton();
		}
	}
};

// fetch preferences
pratikabustt_browser_impl.fetchPreferences();
		
// add the scroll handler on the page to hide and show the image
$(window).scroll(pratikabustt.pratikabu_stt_scrollHandler);

$(window).resize(function() {// when window is resized do the below mentioned steps
	if(!pratikabu_stt_buttonCreated || "true" == pratikabu_stt_buttonCreated) {// ??
		// hide or show the button based on the current location, because a page can be loaded scrolled..
		pratikabustt.callHideOrShowOnceAfterInit();
	}
});