/************************************************************
	Browser specific coding
************************************************************/

/** Saves options to localStorage. */
function bsDefaultSettings() {
	// Asks background.html for [LocalStorage] settings from Options Page and assigns them to variables
	chrome.extension.sendMessage({method: "resetSettings"}, function(response_msg) {
		bsFetchSettings();
		// Update status to let user know options were defaulted.
		post_restore_success();
	});
}

function bsInit() {
}

function bsFetchSettings() {
	var data = {
		vLoc: localStorage["vertical_location"],
		hLoc: localStorage["horizontal_location"],
		visibilityBehav: localStorage["visibility_behavior"],
		scrSpeed: localStorage["scrolling_speed"],
		iconTransparency: localStorage["icon_transparency"],
		blackAndWhite: localStorage["black_and_white"],
		
		arrowType: localStorage["arrow_type"],
		
		smartDirection: localStorage["smart_direction_mode"],
		controlOption: localStorage["control_options"],
		hideControls: localStorage["hide_controls"],
		iconSize: localStorage["image_size"],
		iconLib: localStorage["icon_library"],
		userIcon: localStorage["user_saved_icon"],
		
		dArrang: localStorage["d_arrangement"],
		dIconLib: localStorage["d_icon_library"],
		dUserIcon: localStorage["d_user_saved_icon"],
		
		hOffset: localStorage["h_offset"],
		vOffset: localStorage["v_offset"],
		removedSites: localStorage["removed_sites"],
		
		supportPrompt: localStorage["support_prompt"]
	};
	
	restore_options(data);
}

function bsSaveSettings(data) {
	localStorage["vertical_location"] = data.vLoc;
	localStorage["horizontal_location"] = data.hLoc;
	localStorage["visibility_behavior"] = data.visibilityBehav;
	localStorage["scrolling_speed"] = data.scrSpeed;
	localStorage["icon_transparency"] = data.iconTransparency;
	localStorage["black_and_white"] = data.blackAndWhite;
	
	localStorage["arrow_type"] = data.arrowType;
	
	localStorage["smart_direction_mode"] = data.smartDirection;
	localStorage["control_options"] = data.controlOption;
	localStorage["hide_controls"] = data.hideControls;
	localStorage["image_size"] = data.iconSize;
	localStorage["icon_library"] = data.iconLib;
	localStorage["user_saved_icon"] = data.userIcon;
	
	localStorage["d_icon_library"] = data.dIconLib;
	localStorage["d_user_saved_icon"] = data.dUserIcon;
	localStorage["d_arrangement"] = data.dArrang;
	
	localStorage["h_offset"] = data.hOffset;
	localStorage["v_offset"] = data.vOffset;
	localStorage["removed_sites"] = data.removedSites;
	
	localStorage["support_prompt"] = data.supportPrompt;
	
	// Update status to let user know options were saved.
	post_save_success();
}

function bsReviewPageUrl() {
	return "https://chrome.google.com/webstore/detail/scroll-to-top/hegiignepmecppikdlbohnnbfjdoaghj/reviews";
}

document.addEventListener('DOMContentLoaded', function () {
	psInitJavascriptFunctions();
});