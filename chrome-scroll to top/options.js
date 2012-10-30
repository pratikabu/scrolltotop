// Saves options to localStorage.
function default_options() {
	localStorage["vertical_location"] = "bottom";
	localStorage["horizontal_location"] = "right";
	localStorage["image_size"] = "48";
	localStorage["show_page_up"] = "false";
	
	restore_options();

	// Update status to let user know options were defaulted.
	show_message("Restored to defaults.");
}

// Saves options to localStorage.
function save_options() {
	var select = document.getElementById("imgVerticalLocation");
	var vLoc = select.children[select.selectedIndex].value;
	localStorage["vertical_location"] = vLoc;
	
	select = document.getElementById("imgHorizontalLocation");
	var hLoc = select.children[select.selectedIndex].value;
	localStorage["horizontal_location"] = hLoc;
	
	localStorage["image_size"] = myForm.elements["imgSize"].value;
	
	localStorage["show_page_up"] = myForm.elements["showPageUp"].checked;

	// Update status to let user know options were saved.
	show_message("Settings have been successfully saved.");
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	restore_state("vertical_location", "imgVerticalLocation");
	restore_state("horizontal_location", "imgHorizontalLocation");
	
	myForm.elements["imgSize"].value = localStorage["image_size"];
	if("true" == localStorage["show_page_up"]) {
		myForm.elements["showPageUp"].checked = true;
	}
}

function restore_state(key, id) {
	var sValue = localStorage[key];
	if (!sValue) {
		return;
	}
	var select = document.getElementById(id);
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == sValue) {
			child.selected = "true";
			break;
		}
	}
}

function show_message(msg) {
	var status = document.getElementById("status");
	status.innerHTML = msg;
	setTimeout(function() {
		status.innerHTML = "";
	}, 3000);
}

//document.addEventListener('DOMContentReady', restore_options);
document.addEventListener('DOMContentLoaded', function () {
	restore_options();
	document.querySelector('#saveSettings').addEventListener('click', save_options);
	document.querySelector('#defaultBut').addEventListener('click', default_options);
});