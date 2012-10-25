/*****************************************
	********** Variables ****************
******************************************/
var pratikabu_stt_delay = 1200;// variable used to reduce the delay in scrolling
var pratikabu_stt_maxScrollAmount = 300;// the offset of the scroll bar
var pratikabu_stt_bVisibility = false;// variable to check whether the button is already visible or hidden

var pratikabustt = {
	createButton: function() {
		// create the image variable
		var pratikabu_stt_imgScrollUp = document.createElement("img");
		pratikabu_stt_imgScrollUp.id = "pratikabuSTTArrowUp";
		pratikabu_stt_imgScrollUp.title = "Scroll to Top of the page.";
		
		// add to the body tag. it will be the first item.
		$('body').prepend(pratikabu_stt_imgScrollUp);
		$("#pratikabuSTTArrowUp").hide();// hide it for the first time
		
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
		
		// add the scroll handler on the page to hide and show the image
		$(window).scroll(function () {
			pratikabustt.hideOrShowButton();
		});
	},
	
	hideOrShowButton: function() {
		var height = $(document).height();
		var scrollTop = $(document).scrollTop();
		
		// show the icon if it satisfies this condition
		pratikabu_stt_bVisibility = scrollTop > pratikabu_stt_maxScrollAmount ?
		pratikabu_stt_bVisibility || ($("#pratikabuSTTArrowUp").show(200), true)
			: pratikabu_stt_bVisibility && ($("#pratikabuSTTArrowUp").hide(200), false);
	},
	
	loadFromPreference: function(data) {
		// Asks background.html for [LocalStorage] settings from Options Page and assigns them to variables
		chrome.extension.sendRequest({method: "getSettings"}, function(response) {
			if(!response) {
				return;
			}
			$("#pratikabuSTTArrowUp").css(response.vLoc, "10px");// set the vertical alignment of the image
			$("#pratikabuSTTArrowUp").css(response.hLoc, "10px");// set the horizontal alignment of the image
			
			// set the image
			var imgUrl = "icons/pratikabu-stt-" + response.iconSize + ".png";
			$("#pratikabuSTTArrowUp").attr("src", chrome.extension.getURL(imgUrl));
		});
	}
}

pratikabustt.createButton();

$(document).ready(function() {// when page is ready do the below mentioned steps
	// hide or show the button based on the current location, because a page can be loaded scrolled..
	pratikabustt.hideOrShowButton();
});