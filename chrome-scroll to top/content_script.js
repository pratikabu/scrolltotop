/*****************************************
	********** Variables ****************
******************************************/
var pratikabu_stt_delay = 1200;// variable used to reduce the delay in scrolling
var pratikabu_stt_maxScrollAmount = 5;// the offset of the scroll bar
var pratikabu_stt_bVisibility = false;// variable to check whether the button is already visible or hidden
var pratikabu_stt_fadeSpeed = 300;
var pratikabu_stt_hoverOpacity = 1;

var pratikabustt = {
	createButton: function() {
		// create div tag
		$('body').prepend('<div align="right" id="pratikabuSTTDiv"><img id="pratikabuSTTArrowUp" style="float: left;" /><img id="pratikabuSTTClear" /><img id="pratikabuSTTArrowDown" /></div>');
		
		pratikabustt.hoverEffect("#pratikabuSTTArrowUp", 0.5);
		pratikabustt.hoverEffect("#pratikabuSTTClear", 0.35);
		pratikabustt.hoverEffect("#pratikabuSTTArrowDown", 0.35);
		
		// write the logic to set the location
		pratikabustt.loadFromPreference();
		
		// add the scroll up logic
		$("#pratikabuSTTArrowUp").click(function() {
			$("html, body").animate({ scrollTop: 0 }, pratikabu_stt_delay);
			return false;
		});
		
		// add the scroll down logic
		$("#pratikabuSTTArrowDown").click(function() {
			$("html, body").animate({ scrollTop: $(document).height() }, pratikabu_stt_delay);
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
	},
	
	hoverEffect: function(varId, idleOpacity) {
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
	
	hideOrShowButton: function() {
		var scrollTop = $(document).scrollTop();
		
		// show the icon if it satisfies this condition
		console.log("came in");
		pratikabu_stt_bVisibility = scrollTop > pratikabu_stt_maxScrollAmount ?
		pratikabu_stt_bVisibility || ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 1), true)
			: pratikabu_stt_bVisibility && ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {if(!pratikabu_stt_bVisibility) $("#pratikabuSTTDiv").hide();}), false);
	},
	
	loadFromPreference: function(data) {
		// Asks background.html for [LocalStorage] settings from Options Page and assigns them to variables
		chrome.extension.sendRequest({method: "getSettings"}, function(response) {
			if(!response) {
				return;
			}
			$("#pratikabuSTTDiv").css(response.vLoc, "20px");// set the vertical alignment of the image
			$("#pratikabuSTTDiv").css(response.hLoc, "20px");// set the horizontal alignment of the image
			
			var pratikabu_stt_fixed = "icons/pratikabu-stt-";
			// set the image
			var imgUrl = pratikabu_stt_fixed + response.iconSize + ".png";
			$("#pratikabuSTTArrowUp").attr("src", chrome.extension.getURL(imgUrl));
			
			var downPixel = 16;
			var margin_bottom = "0px";
			if("48" == response.iconSize) {
				downPixel = 24;
				margin_bottom = "7px";
				$("#pratikabuSTTDiv").css("width", "72px");
			} else {
				$("#pratikabuSTTDiv").css("width", "48px");
			}
			
			imgUrl = pratikabu_stt_fixed + "clear.png";
			$("#pratikabuSTTClear").attr("src", chrome.extension.getURL(imgUrl));
			
			$("#pratikabuSTTClear").css("margin-bottom", margin_bottom);
			
			imgUrl = pratikabu_stt_fixed + "down-" + downPixel + ".png";
			$("#pratikabuSTTArrowDown").attr("src", chrome.extension.getURL(imgUrl));
			
			// change the location of the main image
			var pratikabu_stt_float = "left";
			if("left" == response.hLoc) {
				pratikabu_stt_float = "right";
			}
			
			$("#pratikabuSTTArrowUp").css("float", pratikabu_stt_float);
		});
	}
}

pratikabustt.createButton();

$(document).ready(function() {// when page is ready do the below mentioned steps
	// hide or show the button based on the current location, because a page can be loaded scrolled..
	pratikabustt.hideOrShowButton();
});