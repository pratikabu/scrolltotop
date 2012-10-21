// Save this script as `options.js`

// Saves options to localStorage.
function save_options() {
	var select = document.getElementById("imgVerticalLocation");
	var vLoc = select.children[select.selectedIndex].value;
	localStorage["vertical_location"] = vLoc;
	
	select = document.getElementById("imgHorizontalLocation");
	var hLoc = select.children[select.selectedIndex].value;
	localStorage["horizontal_location"] = hLoc;

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Settings have been successfully save.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 2000);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	restore_state("vertical_location", "imgVerticalLocation");
	restore_state("horizontal_location", "imgHorizontalLocation");
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

//document.addEventListener('DOMContentReady', restore_options);
document.addEventListener('DOMContentLoaded', function () {
	restore_options();
	document.querySelector('#saveSettings').addEventListener('click', save_options);
});