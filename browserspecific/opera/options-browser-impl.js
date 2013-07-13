/************************************************************
	Browser specific coding
************************************************************/

/** Saves options to localStorage. */
function bsDefaultSettings() {
	ignoreForDefaults = true;// ignore the image load method as it will reset myIcon in the radio button
	opera.extension.postMessage({requestFor: "resetSettings"});
}

function bsInit() {
	opera.extension.onmessage = function(event) {
		var responseFor = event.data.responseFor;
		if("resetSettings" == responseFor) {
			bsFetchSettings();
			// Update status to let user know options were defaulted.
			show_message("Restored to defaults.");
		}
	};
}

function bsFetchSettings() {
	var data = {
		vLoc: localStorage["vertical_location"],
		hLoc: localStorage["horizontal_location"],
		visibilityBehav: localStorage["visibility_behavior"],
		scrSpeed: localStorage["scrolling_speed"],
		
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
		removedSites: localStorage["removed_sites"]
	};
	
	restore_options(data);
}

function bsSaveSettings(data) {
	localStorage["vertical_location"] = data.vLoc;
	localStorage["horizontal_location"] = data.hLoc;
	localStorage["visibility_behavior"] = data.visibilityBehav;
	localStorage["scrolling_speed"] = data.scrSpeed;
	
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
	
	// Update status to let user know options were saved.
	show_message("Saved successfully. <a target='_blank' href='http://pratikabu.users.sourceforge.net/extensions/scrolltotop/release.html'>Preview your changes</a>.");
}