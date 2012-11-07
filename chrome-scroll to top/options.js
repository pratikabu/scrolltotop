// Saves options to localStorage.
function default_options() {
	localStorage["vertical_location"] = "bottom";
	localStorage["horizontal_location"] = "right";
	localStorage["image_size"] = "48";
	localStorage["scrolling_speed"] = "1200";
	localStorage["visibility_behavior"] = "alwaysshow";
	localStorage["control_options"] = "pager";
	
	restore_options();

	// Update status to let user know options were defaulted.
	show_message("Restored to defaults.");
}

// Saves options to localStorage.
function save_options() {
	localStorage["vertical_location"] = $('#imgVerticalLocation').val();
	localStorage["horizontal_location"] = $('#imgHorizontalLocation').val();
	localStorage["image_size"] = $('input:radio[name=imgSize]:checked').val();
	localStorage["scrolling_speed"] = $('#scrollSpeed').val();
	localStorage["visibility_behavior"] = $('#visbilityBehavior').val();
	localStorage["control_options"] = $('#controlOptions').val();

	// Update status to let user know options were saved.
	show_message("Settings have been successfully saved.");
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	$("#imgVerticalLocation option[value=" + localStorage["vertical_location"] +"]").attr("selected", "selected");
	$("#imgHorizontalLocation option[value=" + localStorage["horizontal_location"] +"]").attr("selected", "selected");
	$('input:radio[name=imgSize]').filter('[value=' + localStorage["image_size"] + ']').attr('checked', true);
	$("#scrollSpeed option[value=" + localStorage["scrolling_speed"] +"]").attr("selected", "selected");
	$("#visbilityBehavior option[value=" + localStorage["visibility_behavior"] +"]").attr("selected", "selected");
	$("#controlOptions option[value=" + localStorage["control_options"] +"]").attr("selected", "selected");
}

function show_message(msg) {
	var status = document.getElementById("status");
	status.innerHTML = msg;
	setTimeout(function() {
		status.innerHTML = "";
	}, 3000);
}

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if(results == null)
		return "";
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}

//document.addEventListener('DOMContentReady', restore_options);
document.addEventListener('DOMContentLoaded', function () {
	var updated = getParameterByName("updated");
	if("true" == updated) {
		var updateDiv = '<div id="updateDiv" align="center" style="width: 100%;">Congratulations Scroll To Top has been updated to the latest version. See <a href="http://github.com/pratikabu/scrolltotop/wiki/Release-Notes">Release Notes</a>.</div>';
		$('body').prepend(updateDiv);
	}
	restore_options();
	document.querySelector('#saveSettings').addEventListener('click', save_options);
	document.querySelector('#defaultBut').addEventListener('click', default_options);
});