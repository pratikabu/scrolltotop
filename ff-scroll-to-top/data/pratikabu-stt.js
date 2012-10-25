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
		
		// prefsValue listner
		self.port.on("prefsValue", function(data) {
			// load the css and image source from preference
			pratikabustt.loadFromPreference(data);
		});
		self.port.emit("getPrefs");// method to communicate to main.js
		
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
		$("#pratikabuSTTArrowUp").attr("src", data.imgUrl);// reset the source of the image
		
		// set the vertical alignment of the image
		var location = "top";
		if(true == data.buttonAtBottom) {
			location = "bottom";
		}
		$("#pratikabuSTTArrowUp").css(location, "10px");
		
		// set the horizontal alignment of the image
		location = "right";
		if(true == data.buttonAtLeft) {
			location = "left";
		}
		$("#pratikabuSTTArrowUp").css(location, "10px");
	}
}

pratikabustt.createButton();

$(document).ready(function() {// when page is ready do the below mentioned steps
	// hide or show the button based on the current location, because a page can be loaded scrolled..
	pratikabustt.hideOrShowButton();
});