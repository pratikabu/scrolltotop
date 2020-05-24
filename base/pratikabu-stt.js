/*****************************************
************** This file contains code which is browser independent ****************
************** Write browser dependent code in the specific browser dependent js file. *********
******************************************/
var pratikabu_stt_inversionPoint = 300;// inversion point where the inversion should happen
var pratikabu_stt_bVisibility = false;// variable to check whether the button is already visible or hidden
var pratikabu_stt_fadeSpeed = 300;
var pratikabu_stt_hoverOpacity = 1;
var pratikabu_stt_prefs;// this variable holds the preferences
var pratikabu_stt_dualArrow = false;
var pratikabu_stt_flipScrolling = false;
var pratikabu_stt_scrollingInProgress = false;
var pratikabu_stt_lastDocumentTop = 0;// this variable will hold the document top since the last scroll, for smart direction based
var pratikabu_stt_autoHide = false;
var pratikabu_stt_ahRequestCount = 0;// counter to handle autohide in seconds
var pratikabu_stt_pollabelIconSwitch = false;// maintains whether or not the pollable downward icon is visible or not
var pratikabu_stt_ROTATE_180_CLASS = "pratikabuSTTRotate180";

var pratikabustt = {
	scrollHandlerOneTime: function() {
		if(pratikabustt.isPOICrossed()) {// terminating condition for this handler
			$(window).unbind('scroll', pratikabustt.scrollHandlerOneTime);
			pratikabustt.showHideAddon(true);
		}
	},
	
	scrollHandlerHideAtTop: function () {
		pratikabustt.togglePollableIcon();
		pratikabustt.showHideAddon(pratikabustt.isPOICrossed());
	},
	
	windowResizeHandlerHideAtTop: function() {
		// hide or show the button based on the current location, because a page can be loaded scrolled..
		pratikabustt.scrollHandlerHideAtTop();
	},
	
	smartDirectionLogic: function(animateRotation) {
		pratikabustt.togglePollableIcon();
		if(pratikabu_stt_lastDocumentTop === $(document).scrollTop()) {
			// do nothing
		} else if(pratikabu_stt_lastDocumentTop > $(document).scrollTop()) {// user scrolled upwards
			pratikabustt.rotateUp();
		} else {// user scrolled downwards
			pratikabustt.rotateDown(animateRotation);
		}
		
		pratikabu_stt_lastDocumentTop = $(document).scrollTop();// update to latest
		
		// finally once the scrolling is finished, rotate addon if needed
		if(0 === pratikabu_stt_lastDocumentTop) {
			pratikabustt.rotateDown(true);
		} else if(pratikabustt.isAtBottom()) {
			pratikabustt.rotateUp();
		}
	},
	
	scrollHandlerAutoHide: function() {
		var animateRotation = pratikabu_stt_bVisibility;
		pratikabustt.showHideAddon(true);
		// handle the rotation for normal scenario, make it to behave like alwaysshow
		if(!pratikabu_stt_dualArrow) {
			if(pratikabu_stt_prefs.smartDirection) {
				pratikabustt.smartDirectionLogic(animateRotation);
			} else {
				pratikabustt.scrollRotationHandler();
			}
		}
	},
	
	scrollRotationHandler: function() {
		pratikabustt.togglePollableIcon();
		if(!pratikabustt.isPOICrossed()) {// you are at the top rotate arrows to original state
			pratikabustt.rotateDown(true);
		} else {
			pratikabustt.rotateUp();
		}
	},
	
	/**
	 * POI: Point of Inversion, used to see whether or not the scroll has passed the POI.
	 * @returns {Boolean}
	 */
	isPOICrossed: function() {
		var isCrossed = pratikabu_stt_inversionPoint < $(document).scrollTop();
		return isCrossed;
	},
	
	/**
	 * Identifies whether or not the scroll is at the bottom of the page.
	 * @returns {Boolean}
	 */
	isAtBottom: function() {
		var atBottom = $(document).scrollTop() >= ($(document).height() - pratikabustt.getWindowHeight());
		return atBottom;
	},
	
	rotateDown: function(animateRotation) {
		if(pratikabu_stt_pollabelIconSwitch) {
			$("#pratikabuSTTSettings").addClass(pratikabu_stt_ROTATE_180_CLASS);
		}
		
		if(true === pratikabu_stt_flipScrolling) {
			return;
		}
		
		pratikabu_stt_flipScrolling = true;
		if(animateRotation) {
			$("#pratikabuSTTArrowUp").addClass(pratikabu_stt_ROTATE_180_CLASS);
		} else {
			$("#pratikabuSTTArrowUp").addClass(pratikabu_stt_ROTATE_180_CLASS);
		}
	},
	
	rotateUp: function() {
		if(pratikabu_stt_pollabelIconSwitch) {
			$("#pratikabuSTTSettings").removeClass(pratikabu_stt_ROTATE_180_CLASS);
		}
		
		if(false === pratikabu_stt_flipScrolling) {
			return;
		}
		
		pratikabu_stt_flipScrolling = false;
		$("#pratikabuSTTArrowUp").removeClass(pratikabu_stt_ROTATE_180_CLASS);
	},
	
	createAddonHtml: function() {
		// create div tag
		var divTag = '<div id="pratikabuSTTDiv" class="pratikabusttdiv-no-print"><img id="pratikabuSTTArrowUp" ';
		if(pratikabu_stt_dualArrow) {
			if("hr" === pratikabu_stt_prefs.dArrang) {
				divTag = divTag + '/><img id="pratikabuSTTArrowDown" />';
			} else {// if("vr" === pratikabu_stt_prefs.dArrang) {
				divTag = divTag + 'style="display: block !important;" />' +
						'<img id="pratikabuSTTArrowDown" style="display: block !important;" />';
			}
		} else {
			divTag = divTag + 'style="float: left;" />' +
					'<div id="pratikabuSTTDiv2" class="pratikabusttdiv-no-print">' +
						'<img id="pratikabuSTTPageUp" /><img id="pratikabuSTTClear" />' +
						'<img id="pratikabuSTTPageDown" /><img id="pratikabuSTTSettings" />' +
					'</div>';
		}
		divTag = divTag + '</div>';
		
		$('body').prepend(divTag);
		
		// check whether the css has been applied to the div tag or not, if not then remove it from DOM
		// as it got added to a wrong iFrame
		if("fixed" !== $("#pratikabuSTTDiv").css("position")) {
			pratikabustt.removeCompleteAddonFromPage();
			return false;
		}
		
		pratikabustt.hoverEffect("#pratikabuSTTArrowUp");
		if(pratikabu_stt_dualArrow) {
			pratikabustt.hoverEffect("#pratikabuSTTArrowDown");
		} else {
			pratikabustt.hoverEffect("#pratikabuSTTClear");
			pratikabustt.hoverEffect("#pratikabuSTTSettings");
			pratikabustt.hoverEffect("#pratikabuSTTPageUp");
			pratikabustt.hoverEffect("#pratikabuSTTPageDown");
		}
		// add the main div hover effects
		$("#pratikabuSTTDiv").hover(
			function() { pratikabustt.mainDivHover(true); },
			function() { pratikabustt.mainDivHover(false); });
		
		// add the scroll up logic
		$("#pratikabuSTTArrowUp").click(function() {
			pratikabustt.scrollIntelligently();
			return false;
		});
		if(pratikabu_stt_dualArrow) {
			// add the scroll down logic
			$("#pratikabuSTTArrowDown").click(function() {
				pratikabustt.scrollToBottom();
				return false;
			});
		} else {
			// add the scroll down logic
			$("#pratikabuSTTSettings").click(function() {
				if(pratikabu_stt_pollabelIconSwitch) {
					if(pratikabu_stt_flipScrolling) {
						pratikabustt.scrollToTop();
					} else {
						pratikabustt.scrollToBottom();
					}
				} else {
					pratikabustt_browser_impl.openOptionPage();
				}
				return false;
			});
			
			// add rotation for scrolling down
			$("#pratikabuSTTSettings").hover(
				function() { if(!pratikabu_stt_pollabelIconSwitch) { $(this).addClass(pratikabu_stt_ROTATE_180_CLASS);} },
				function() { if(!pratikabu_stt_pollabelIconSwitch) { $(this).removeClass(pratikabu_stt_ROTATE_180_CLASS);} });
			
			// add the remove div logic
			$("#pratikabuSTTClear").click(function() {
				pratikabustt.removeCompleteAddonFromPage();
			});
			
			// add page up and page down handlers
			$("#pratikabuSTTPageUp").click(function() { pratikabustt.scrollPageScreen(1); });
			$("#pratikabuSTTPageDown").click(function() { pratikabustt.scrollPageScreen(-1); });
		}
		
		// populate from preferences
		var vloc = pratikabu_stt_prefs.vLoc;
		var vlocVal = pratikabu_stt_prefs.vOffset + "px";
		var hloc = pratikabu_stt_prefs.hLoc;
		var hlocVal = pratikabu_stt_prefs.hOffset + "px";
		
		if("middle" === vloc) {
			vloc = "top";
			vlocVal = "50%";
		}
		
		if("middle" === hloc) {
			hloc = "left";
			hlocVal = "50%";
		}
		
		$("#pratikabuSTTDiv").css(vloc, vlocVal);// set the vertical alignment of the image
		$("#pratikabuSTTDiv").css(hloc, hlocVal);// set the horizontal alignment of the image
		
		// set the image
		if(pratikabu_stt_dualArrow) {
			pratikabustt.showDualArrowImage();
		} else {
			pratikabustt.showUpArrowImage();
		}
		
		if(!pratikabu_stt_dualArrow && "none" === pratikabu_stt_prefs.controlOption) {
			$("#pratikabuSTTDiv2").remove();
		} else if(!pratikabu_stt_dualArrow) {
			var otherImagesSize = pratikabustt.getOtherImageSize();
			
			var showPagerButtons = false;
			if("pager" === pratikabu_stt_prefs.controlOption) {
				if($(document).height() !== pratikabustt.getWindowHeight()) {
					showPagerButtons = true;
				}
			}
			
			var divSize = otherImagesSize;
			if(showPagerButtons) {// check whether the page up is shown or not
				divSize += otherImagesSize;// add pixels based on the settings
			}
			$("#pratikabuSTTDiv2").css("width", divSize + "px");
			$("#pratikabuSTTDiv2").css({opacity: 0, display: 'block'});
			
			pratikabustt_browser_impl.setImageForId("pratikabuSTTClear", "clear-" + otherImagesSize + ".png");
			pratikabustt.setSettingsIcon(pratikabu_stt_pollabelIconSwitch);
			
			// show/remove page up and page down buttons from settings
			if("simple" === pratikabu_stt_prefs.controlOption) {
				$("#pratikabuSTTPageUp").remove();
				$("#pratikabuSTTPageDown").remove();
			} else {
				pratikabustt_browser_impl.setImageForId("pratikabuSTTPageUp", "pageup-" + otherImagesSize + ".png");
				pratikabustt_browser_impl.setImageForId("pratikabuSTTPageDown", "pageup-" + otherImagesSize + ".png");
				$("#pratikabuSTTPageDown").addClass(pratikabu_stt_ROTATE_180_CLASS);
				if("pagerOnly" === pratikabu_stt_prefs.controlOption) {
					$("#pratikabuSTTClear").remove();
					$("#pratikabuSTTSettings").remove();
				}
			}
			
			// change the location of the main image
			var pratikabu_stt_float = pratikabu_stt_prefs.hLoc;
			if("right" === pratikabu_stt_prefs.hLoc) {// replace the locations of the icons
				if(showPagerButtons) {
					$("#pratikabuSTTPageUp").before($("#pratikabuSTTClear"));
					$("#pratikabuSTTPageDown").before($("#pratikabuSTTSettings"));
				}
				$("#pratikabuSTTDiv2").css("marginLeft", 0 + "px");
			} else {
				$("#pratikabuSTTDiv2").css("marginLeft", pratikabu_stt_prefs.iconSize + "px");
			}
			
			$("#pratikabuSTTArrowUp").css("float", pratikabu_stt_float);
			$("#pratikabuSTTArrowUp").css("width", pratikabu_stt_prefs.iconSize + "px");
			$("#pratikabuSTTArrowUp").css("height", pratikabu_stt_prefs.iconSize + "px");
			
			if(!pratikabu_stt_prefs.hideControls) {
				pratikabustt.showHideControlOptions(true);
			}
		}
		
		if(pratikabu_stt_prefs.blackAndWhite) {
			$(".pratikabuSTTImg").addClass("pratikabuSTTBlackAndWhite");
		}
		
		return true;
	},
	
	togglePollableIcon: function() {
		var showPollable = pratikabustt.isPOICrossed() && !pratikabustt.isAtBottom();
		if(showPollable === pratikabu_stt_pollabelIconSwitch) {
			return;
		}
		
		pratikabu_stt_pollabelIconSwitch = showPollable;
		pratikabustt.setSettingsIcon(showPollable);
	},
	
	setSettingsIcon: function(showPollable) {
		if(showPollable) {
			pratikabustt_browser_impl.setImageForId("pratikabuSTTSettings", "bottom-" + pratikabustt.getOtherImageSize() + ".png");
		} else {
			pratikabustt_browser_impl.setImageForId("pratikabuSTTSettings", "settings-" + pratikabustt.getOtherImageSize() + ".png");
			$("#pratikabuSTTSettings").removeClass(pratikabu_stt_ROTATE_180_CLASS);
		}
	},
	
	showHideAddon: function(boolShowAddon) {
		if(boolShowAddon !== pratikabu_stt_bVisibility) {
			if(boolShowAddon) {// show addon
				if(pratikabustt.createAddonHtml()) {
					$("#pratikabuSTTDiv").stop(true, true).css({opacity: 0, display: 'block'}).fadeTo("slow", 1);
				}
			} else {// remove it
				pratikabustt.removeAddonHtml();
			}
		}
		if(boolShowAddon) {
			pratikabustt.triggerAutoHide();
		}
		pratikabu_stt_bVisibility = boolShowAddon;// set the latest value
	},
	
	triggerAutoHide: function() {
		if(!pratikabu_stt_autoHide) {
			return;
		}
		
		pratikabu_stt_ahRequestCount++;
		setTimeout(function() {
			if(0 === --pratikabu_stt_ahRequestCount) {
				pratikabustt.showHideAddon(false);
			}
		}, 5000);
	},
	
	removeAddonHtml: function() {
		$("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {
			$("#pratikabuSTTDiv").remove();
		});
	},

	scrollIntelligently: function() {
		if(pratikabu_stt_flipScrolling) {
			pratikabustt.scrollToBottom();
		} else {
			pratikabustt.scrollToTop();
		}
	},
	
	scrollToTop: function() {
		if(0 === $(document).scrollTop()) {
			return false;
		}
		
		pratikabustt.scrollPageTo(pratikabu_stt_prefs.scrSpeed, 0);
	},
	
	scrollToBottom: function() {
		var location = ($(document).height() - pratikabustt.getWindowHeight());
		if(0 === location) {// this should never happen, but it gives this result on some pages
			location = $(document).height();
		}
		pratikabustt.scrollPageTo(pratikabu_stt_prefs.scrSpeed, location);
	},
	
	scrollPageTo: function(delay, location, isPager) {
		if(!isPager && pratikabu_stt_scrollingInProgress) {// pause any scroll when scrolling is in progress
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
		
		pratikabustt.scrollPageTo(speed, location, true);
	},
	
	getWindowHeight: function() {
		return window.innerHeight;
	},
	
	hoverEffect: function(varId) {
		$(varId).attr("class", "pratikabuSTTImg");// add it for all the images we've
		$(varId).hide();
		$(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, pratikabu_stt_prefs.iconTransparency);
		$(varId).css("cursor", "pointer");
		$(varId).hover(
			function() {
				$(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, pratikabu_stt_hoverOpacity);
			},
			function() {
				$(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, pratikabu_stt_prefs.iconTransparency);
			});
	},
	
	showUpArrowImage: function() {
		if("myIcon" === pratikabu_stt_prefs.iconLib) {
			$("#pratikabuSTTArrowUp").attr("src", pratikabustt.getBase64Url(pratikabu_stt_prefs.userIcon));
		} else {
			var suffixString = pratikabu_stt_prefs.iconSize + "-" + pratikabu_stt_prefs.iconLib;
			pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowUp", suffixString + ".png");
		}
	},
	
	showDualArrowImage: function() {
		if("myIcon" === pratikabu_stt_prefs.dIconLib) {
			var base64url = pratikabustt.getBase64Url(pratikabu_stt_prefs.dUserIcon);
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
				iconName = pratikabu_stt_prefs.iconSize + "-";
			}
			
			var suffixString = iconName + iconNumber;
			pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowUp", suffixString + ".png");
			pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowDown", suffixString + ".png");
		}
		
		$("#pratikabuSTTArrowDown").addClass(pratikabu_stt_ROTATE_180_CLASS);
	},
	
	getBase64Url: function(base64Url) {
		if(base64Url.startsWith("data:")) {
			// return the URL as is
			return base64Url;
		}
		
		return "data:image/png;base64," + base64Url;
	},
	
	mainDivHover: function(hoverIn) {
		if(pratikabu_stt_dualArrow || "none" === pratikabu_stt_prefs.controlOption) {
			return;
		}
		
		if(hoverIn) {
			pratikabu_stt_ahRequestCount++;// increment the autohide counter, so that it will stop removing it
			
			if(pratikabu_stt_prefs.hideControls) {
				pratikabustt.showHideControlOptions(true);
			}
		} else {
			pratikabu_stt_ahRequestCount--;// decrement the counter
			pratikabustt.triggerAutoHide();// trigger the autohide timer
			
			if(pratikabu_stt_prefs.hideControls) {
				pratikabustt.showHideControlOptions(false);
			}
		}
	},
	
	showHideControlOptions: function(boolShow) {
		if(boolShow) {
			$("#pratikabuSTTDiv2").stop(true, true);// to execute the fading out method
			var otherImagesSize = pratikabustt.getOtherImageSize();
			var divSize = pratikabu_stt_prefs.iconSize + otherImagesSize;
			if("pager" === pratikabu_stt_prefs.controlOption) {// check whether the page up is shown or not
				divSize += otherImagesSize;// add pixels based on the settings
			}
			$("#pratikabuSTTDiv").css("width", divSize + "px");
			$("#pratikabuSTTDiv2").fadeTo("slow", pratikabu_stt_hoverOpacity);
		} else {
			$("#pratikabuSTTDiv2").stop(true, true).fadeTo("slow", 0, function() {
				$("#pratikabuSTTDiv2").hide();
				var divSize = pratikabu_stt_prefs.iconSize;
				$("#pratikabuSTTDiv").css("width", divSize + "px");
			});
		}
	},
	
	getOtherImageSize: function() {
		var otherImagesSize = 16;
		if(48 === pratikabu_stt_prefs.iconSize) {
			otherImagesSize = 24;
		}
		
		return otherImagesSize;
	},

	videoFullScreenChangeEvent: function() {
		var elem = $("#pratikabuSTTDiv");
		!document.fullscreenElement ? elem.show() : elem.hide();
	},

	registerFullScreenListener: function() {
		document.addEventListener("fullscreenchange", pratikabustt.videoFullScreenChangeEvent, false);
		document.addEventListener("msfullscreenchange", pratikabustt.videoFullScreenChangeEvent, false);
		document.addEventListener("mozfullscreenchange", pratikabustt.videoFullScreenChangeEvent, false);
		document.addEventListener("webkitfullscreenchange", pratikabustt.videoFullScreenChangeEvent, false);
	},
	
	loadFromResponse: function(response) {// load the images, css, include/remove elements
		pratikabu_stt_prefs = response;
		if(pratikabustt.isValidPageForAddon()) {
			// if everything is great, go ahead
			pratikabu_stt_prefs.scrSpeed = parseInt(pratikabu_stt_prefs.scrSpeed);
			pratikabu_stt_prefs.iconSize = parseInt(pratikabu_stt_prefs.iconSize);
			pratikabu_stt_dualArrow = ("2" === pratikabu_stt_prefs.arrowType);
			pratikabu_stt_prefs.blackAndWhite = ("true" === pratikabu_stt_prefs.blackAndWhite);
			if(!pratikabu_stt_dualArrow) {
				pratikabu_stt_prefs.smartDirection = ("true" === pratikabu_stt_prefs.smartDirection);
				pratikabu_stt_prefs.hideControls = ("true" === pratikabu_stt_prefs.hideControls);
			}
			
			pratikabustt.addRemoveGlobalHandlers(true);
		} else {
			pratikabustt_browser_impl.removeCompleteAddOnCode();
		}
	},
	
	addRemoveGlobalHandlers: function(booleanAdd) {
		if(booleanAdd) {
			if(!pratikabu_stt_dualArrow &&
					pratikabu_stt_prefs.smartDirection && "hideattop" === pratikabu_stt_prefs.visibilityBehav) {
				pratikabu_stt_prefs.visibilityBehav = "autohide";// if hideattop is selected change it to autohide
			}
			
			if("hideattop" === pratikabu_stt_prefs.visibilityBehav) {
				$(window).scroll(pratikabustt.scrollHandlerHideAtTop);
				$(window).resize(pratikabustt.windowResizeHandlerHideAtTop);
			} else if("alwaysshow" === pratikabu_stt_prefs.visibilityBehav) {
				var boolShow = $(document).height() > (pratikabustt.getWindowHeight() + pratikabu_stt_inversionPoint);
				if(!pratikabu_stt_dualArrow) {
					if(pratikabu_stt_prefs.smartDirection) {
						$(window).scroll(pratikabustt.scrollHandlerAutoHide);
					} else {
						$(window).scroll(pratikabustt.scrollRotationHandler);// bind the pollable handler
					}
				}
				pratikabustt.showHideAddon(boolShow);
				if(boolShow) {
					// call this method to show the arrow in proper direction when the page loads
					if(!pratikabu_stt_dualArrow) {
						if(pratikabu_stt_prefs.smartDirection) {
							pratikabustt.scrollHandlerAutoHide();
						} else {
							pratikabustt.scrollRotationHandler();
						}
					}
				} else {// attach one time handler #specialCase
					$(window).scroll(pratikabustt.scrollHandlerOneTime);
				}
			} else if("autohide" === pratikabu_stt_prefs.visibilityBehav) {
				pratikabu_stt_autoHide = true;
				$(window).scroll(pratikabustt.scrollHandlerAutoHide);
			}

			pratikabustt.registerFullScreenListener();
		} else {
			if("hideattop" === pratikabu_stt_prefs.visibilityBehav) {
				$(window).unbind('scroll', pratikabustt.scrollHandlerHideAtTop);
				$(window).unbind('resize', pratikabustt.windowResizeHandlerHideAtTop);
			} else if("alwaysshow" === pratikabu_stt_prefs.visibilityBehav) {
				if(!pratikabu_stt_dualArrow) {
					if(pratikabu_stt_prefs.smartDirection) {
						$(window).unbind('scroll', pratikabustt.scrollHandlerAutoHide);
					} else {
						$(window).unbind('scroll', pratikabustt.scrollRotationHandler);
					}
				}
				$(window).unbind('scroll', pratikabustt.scrollHandlerOneTime);// remove this handler also if not already removed
			} else if("autohide" === pratikabu_stt_prefs.visibilityBehav) {
				pratikabu_stt_autoHide = false;
				$(window).unbind('scroll', pratikabustt.scrollHandlerAutoHide);
			}
		}
	},
	
	/**
		There will be two checks one for removed sites and one for internal frames.
	*/
	isValidPageForAddon: function() {
		var validPage = false;

		validPage = "false" !== pratikabu_stt_prefs.showIconsOnPage;
		validPage = validPage && !pratikabustt.mactchDomainAgainstDomainList(window.location.href, pratikabu_stt_prefs.removedSites);// check for removed sites
		validPage = validPage && window === window.top;// check top window. As of now removing the support for internal frames
		/** if(validPage && window !== window.top) { // internal frame identified
			validPage = pratikabustt.mactchDomainAgainstDomainList(document.referrer, pratikabu_stt_prefs.frameSupportedSites);// check if the parent's domain is supported
		} */
		
		return validPage;
	},
	
	/**
	 * Match passed domain against a list of domains separated by ';' (a semicolon)
	 * @param {type} urlToMatch
	 * @param {type} listOfDomainsToCheck
	 * @returns {Boolean}
	 */
	mactchDomainAgainstDomainList: function(urlToMatch, listOfDomainsToCheck) {
		var domains = listOfDomainsToCheck.split(";");
		for(var i = 0; i < domains.length; i++) {
			if(0 === domains[i].length) {
				continue;
			}
			if(-1 !== urlToMatch.indexOf(domains[i])) {
				return true;
			}
		}
		
		return false;
	},
	
	removeCompleteAddonFromPage: function() {
		pratikabustt.addRemoveGlobalHandlers(false);// remove all handlers
		pratikabustt.removeAddonHtml();
		pratikabustt_browser_impl.removeCompleteAddOnCode();// remove everything
	}
};

/**
	Fetch preferences : #ENTRY POINT
	loadFromResponse() will be executed once the preferences have been fetched.
*/
pratikabustt_browser_impl.fetchPreferences();