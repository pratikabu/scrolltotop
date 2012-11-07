// Saves options to localStorage.
function default_options() {
	// prefsValue listner
	self.port.on("resetStatus", function(data) {
		restore_options();
		// Update status to let user know options were defaulted.
		show_message("Restored to defaults.");
	});
	self.port.emit("resetPrefs");// method to communicate to main.js
}

// Saves options to localStorage.
function save_options() {
	// prefsValue listner
	self.port.on("saveStatus", function(data) {
		// Update status to let user know options were saved.
		show_message("Settings have been successfully saved.");
	});
	
	var data = {
		iconSize: $('input:radio[name=imgSize]:checked').val(),
		vLoc: $('#imgVerticalLocation').val(),
		hLoc: $('#imgHorizontalLocation').val(),
		showPager: ($('input[name=showPageUp]').is(":checked") + "")
	}
	
	self.port.emit("setPrefs", data);// method to communicate to main.js
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	// prefsValue listner
	self.port.on("prefsValue", function(data) {
		$("#imgVerticalLocation option[value=" + data.vLoc +"]").attr("selected", "selected");
		$("#imgHorizontalLocation option[value=" + data.hLoc +"]").attr("selected", "selected");
		$('input:radio[name=imgSize]').filter('[value=' + data.iconSize + ']').attr('checked', true);
		$('input[name=showPageUp]').attr('checked', "true" == data.showPageUp);
	});
	self.port.emit("getPrefs");// method to communicate to main.js
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