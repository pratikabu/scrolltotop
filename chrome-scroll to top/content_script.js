/*****************************************
************** This file contains code which is browser independent ****************
************** Write browser dependent code in the specific browser dependent js file. *********
******************************************/
var pratikabu_stt_inversionPoint = 300;// inversion point where the inversion should happen
var pratikabu_stt_bVisibility = false;// variable to check whether the button is already visible or hidden
var pratikabu_stt_fadeSpeed = 300;
var pratikabu_stt_hoverOpacity = 1;
var pratikabu_stt_otherDefaultFade = 0.35;
var pratikabu_stt_preferencesLoaded = false;
var pratikabu_stt_buttonCreated;// this variable will tell whether the button is created or not on this page also whether this page is eligible for the button or not it will be initialzied once during load
var pratikabu_stt_prefs;// this variable holds the preferences
var pratikabu_stt_dualArrow = false;
var pratikabu_stt_flipScrolling = false;
var pratikabu_stt_scrollingInProgress = false;

var pratikabustt = {
	scrollHideShowHandler: function () {
		pratikabustt.hideOrShowButton();
	},
	
	scrollRotationHandler: function() {
		if(pratikabu_stt_inversionPoint > $(document).scrollTop()) {// you are at the top rotate arrows to original state
			pratikabu_stt_flipScrolling = true;
			$("#pratikabuSTTArrowUp").rotate({ animateTo: 180 });
		} else {
			pratikabu_stt_flipScrolling = false;
			$("#pratikabuSTTArrowUp").rotate({ animateTo: 0 });
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
				$(window).unbind('scroll', pratikabustt.scrollHideShowHandler);
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
		var vlocVal = pratikabu_stt_prefs.vOffset + "px";
		var hloc = pratikabu_stt_prefs.hLoc;
		var hlocVal = pratikabu_stt_prefs.hOffset + "px";
		
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
		if("pager" == pratikabu_stt_prefs.controlOption) {
			if($(document).height() != pratikabustt.getWindowHeight()) {
				showPagerButtons = true;
			} else {
				pratikabu_stt_prefs.controlOption = "simple";// set the control option to simple
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
			$("#pratikabuSTTDiv2").css("marginLeft", pratikabu_stt_prefs.iconSize + "px");
		}
		
		$("#pratikabuSTTArrowUp").css("float", pratikabu_stt_float);
		$("#pratikabuSTTArrowUp").css("width", pratikabu_stt_prefs.iconSize + "px");
		$("#pratikabuSTTArrowUp").css("height", pratikabu_stt_prefs.iconSize + "px");
		
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
			pratikabustt.scrollPageTo(pratikabu_stt_prefs.scrSpeed, 0);
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
			pratikabustt.scrollPageTo(pratikabu_stt_prefs.scrSpeed, location);
			return false;
		});
		
		// populate from preferences
		var vloc = pratikabu_stt_prefs.vLoc;
		var vlocVal = pratikabu_stt_prefs.vOffset + "px";
		var hloc = pratikabu_stt_prefs.hLoc;
		var hlocVal = pratikabu_stt_prefs.hOffset + "px";
		
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
		
		pratikabustt.scrollPageTo(pratikabu_stt_prefs.scrSpeed, 0);
	},
	
	scrollToBottom: function() {
		var location = $(document).height();
		if($(document).scrollTop() == location) {
			return false;
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
		
		pratikabustt.scrollPageTo(speed, location, true);
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
			var suffixString = pratikabu_stt_prefs.iconSize + "-" + pratikabu_stt_prefs.iconLib;
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
				iconName = pratikabu_stt_prefs.iconSize + "-";
			}
			
			var suffixString = iconName + iconNumber;
			pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowUp", suffixString + ".png");
			pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowDown", suffixString + ".png");
		}
		
		$("#pratikabuSTTArrowDown").rotate(180);
	},
	
	hideOrShowButton: function() {
		if(!pratikabu_stt_prefs) {// check whether the preferences have been loaded or not
			return;
		}
		if("false" == pratikabu_stt_buttonCreated) {
			// page not eligible for the button, do nothing
			return;
		}
		
		var boolShow = false;
		var vScrollTop = $(document).scrollTop();
		var ignoreCreation = "false";// this variable will be turned on, iff the page dissatisfies the height check see below
		
		if("autohide" == pratikabu_stt_prefs.visibilityBehav) {
			boolShow = vScrollTop > pratikabu_stt_inversionPoint;
		} else if("alwaysshow" == pratikabu_stt_prefs.visibilityBehav) {
			boolShow = $(document).height() > (pratikabustt.getWindowHeight() + pratikabu_stt_inversionPoint);
			if(!boolShow) {// if the logic fails for the pages in which window.height and docuemnt.height is same then trigger the below logic
				boolShow = vScrollTop > pratikabu_stt_inversionPoint;
			}
			
			// once the bool is visible remove the scroll event as for alwaysshow its not required
			if(boolShow) {// remove the scroll event
				$(window).unbind('scroll', pratikabustt.scrollHideShowHandler);
				if(!pratikabu_stt_dualArrow) {// skip this condition for dual arrows
					$(window).scroll(pratikabustt.scrollRotationHandler);// bind the pollable handler
				}
			}
		}
		
		if(!pratikabu_stt_buttonCreated && (!boolShow || window != window.top)) {// ignore any iFrame/frame, work only for top window. also ignore creation if boolShow is false
			// since the page doesnot satisfies the height criteria, ignore the creation and hide logic
			// this logic can create an icon once user resizes the window
			return;
		}
		
		if(!pratikabu_stt_buttonCreated) {
			if(pratikabu_stt_dualArrow) {
				pratikabu_stt_buttonCreated = pratikabustt.createDualButton();
			} else {
				pratikabu_stt_buttonCreated = pratikabustt.createButton();
			}
		}
		
		if(!pratikabu_stt_dualArrow && boolShow && "alwaysshow" == pratikabu_stt_prefs.visibilityBehav) {
			pratikabustt.scrollRotationHandler();// call this method to show the arrow in downward direction when the page loads
		}
		
		// show the icon if it satisfies this condition
		pratikabu_stt_bVisibility = boolShow ? // offset is added so that it will not come on all the pages
		pratikabu_stt_bVisibility || ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 1), true)
			: pratikabu_stt_bVisibility && ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {if(!pratikabu_stt_bVisibility) $("#pratikabuSTTDiv").hide();}), false);
	},
	
	mainDivHover: function(hoverIn) {
		if("none" == pratikabu_stt_prefs.controlOption) {
			return;
		}
		
		if(hoverIn) {
			$("#pratikabuSTTDiv2").stop(true, true);// to execute the fading out method
			
			var otherImagesSize = pratikabustt.getOtherImageSize();
			var divSize = pratikabu_stt_prefs.iconSize + otherImagesSize;
			if("pager" == pratikabu_stt_prefs.controlOption) {// check whether the page up is shown or not
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
		if(48 == pratikabu_stt_prefs.iconSize) {
			otherImagesSize = 24;
		}
		
		return otherImagesSize;
	},
	
	loadFromResponse: function(response) {// load the images, css, include/remove elements
		pratikabu_stt_prefs = response;
		pratikabu_stt_preferencesLoaded = true;
		if(pratikabustt.isValidPageForAddon()) {
			// if everything is great, go ahead
			pratikabu_stt_prefs.scrSpeed = parseInt(pratikabu_stt_prefs.scrSpeed);
			pratikabu_stt_prefs.iconSize = parseInt(pratikabu_stt_prefs.iconSize);
			pratikabu_stt_dualArrow = ("2" == pratikabu_stt_prefs.arrowType);
			
			pratikabustt.hideOrShowButton();// call the logic to hide or show the add-on
			$(window).scroll(pratikabustt.scrollHideShowHandler);// add the scroll handler on the page to hide and show the image
			$(window).resize(function() {// when window is resized do the below mentioned steps
				if(!pratikabu_stt_buttonCreated || "true" == pratikabu_stt_buttonCreated) {// ??
					// hide or show the button based on the current location, because a page can be loaded scrolled..
					pratikabustt.hideOrShowButton();
				}
			});
		} else {
			pratikabustt.removeAddOnCode();
		}
	},
	
	/**
		There will be two checks one for removed sites and one for internal frames.
	*/
	isValidPageForAddon: function() {
		if(!pratikabustt.mactchDomainAgainstDomainList(pratikabu_stt_prefs.removedSites) || // check for removed sites
				(window != window.top && // internal frame identified
				pratikabustt.mactchDomainAgainstDomainList(pratikabu_stt_prefs.frameSupportedSites)) // check if domain is supported
				) {
			return true;
		}
		
		return false;
	},
	
	/**
		Match current page domain against a list of domains separated by ;
	*/
	mactchDomainAgainstDomainList: function(listOfDomainsToCheck) {
		var domains = listOfDomainsToCheck.split(";");
		for(var i = 0; i < domains.length; i++) {
			if(0 == domains[i].length) {
				continue;
			}
			if(-1 != window.location.href.indexOf(domains[i])) {
				return true;
			}
		}
		
		return false;
	},
	
	/**
		Remove all excess code required for 
	*/
	removeAddOnCode: function() {
	}
};

/**
	Fetch preferences : #ENTRY POINT
	loadFromResponse() will be executed once the preferences have been fetched.
*/
pratikabustt_browser_impl.fetchPreferences();