// Saves options to localStorage.
function default_options() {
	self.port.emit("resetPrefs");// method to communicate to main.js
}

// Saves options to localStorage.
function save_options() {
	var data = {
		iconSize: $('input:radio[name=imgSize]:checked').val(),
		vLoc: $('#imgVerticalLocation').val(),
		hLoc: $('#imgHorizontalLocation').val(),
		scrSpeed: $('#scrollSpeed').val(),
		visibilityBehav: $('#visbilityBehavior').val(),
		controlOption: $('#controlOptions').val()
	}
	
	self.port.emit("setPrefs", data);// method to communicate to main.js
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	self.port.emit("getPrefs");// method to communicate to main.js
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
	
	// prefsValue listner
	self.port.on("resetStatus", function(data) {
		restore_options();
		// Update status to let user know options were defaulted.
		show_message("Restored to defaults.");
	});
	
	self.port.on("saveStatus", function(data) {
		// Update status to let user know options were saved.
		show_message("Settings have been successfully saved.");
	});
	
	self.port.on("prefsValue", function(data) {
		$("#imgVerticalLocation option[value=" + data.vLoc +"]").attr("selected", "selected");
		$("#imgHorizontalLocation option[value=" + data.hLoc +"]").attr("selected", "selected");
		$('input:radio[name=imgSize]').filter('[value=' + data.iconSize + ']').attr('checked', true);
		$("#scrollSpeed option[value=" + data.scrSpeed +"]").attr("selected", "selected");
		$("#visbilityBehavior option[value=" + data.visibilityBehav +"]").attr("selected", "selected");
		$("#controlOptions option[value=" + data.controlOption +"]").attr("selected", "selected");
	});
});