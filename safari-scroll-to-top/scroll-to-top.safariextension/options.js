var requestCount = 0;
var ignoreImgLoad = true;

// Saves options to localStorage.
function default_options() {
	ignoreImgLoad = true;// ignore the image load method as it will reset myIcon in the radio button
	safari.self.tab.dispatchMessage("resetSettings");
}

// Saves options to localStorage.
function save_options() {
	var data = {
		iconSize: $('#iconSize').val(),
		vLoc: $('#imgVerticalLocation').val(),
		hLoc: $('#imgHorizontalLocation').val(),
		scrSpeed: $('#scrollSpeed').val(),
		visibilityBehav: $('#visbilityBehavior').val(),
		controlOption: $('#controlOptions').val(),
		iconLib : $('input:radio[name=iconLib]:checked').val(),
		userIcon : $('#useMyIconTextBox').val()
	}
	safari.self.tab.dispatchMessage("saveSettings", data);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	safari.self.tab.dispatchMessage("requestSettings");
}

function show_message(msg) {
	requestCount++;
	$("#status").html(msg);
	setTimeout(function() {
		if(0 == --requestCount) {
			$("#status").html("&nbsp;");
		}
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

function respondMessage(theMessageEvent) {
	if("resetCompleted" === theMessageEvent.name) {
		restore_options();
		
		// Update status to let user know options were defaulted.
		show_message("Restored to defaults.");
	} else if("preferences" === theMessageEvent.name) {
		var data = theMessageEvent.message;
		
		$("#imgVerticalLocation option[value=" + data.vLoc +"]").attr("selected", "selected");
		$("#imgHorizontalLocation option[value=" + data.hLoc +"]").attr("selected", "selected");
		$('input:radio[name=imgSize]').filter('[value=' + data.iconSize + ']').attr('checked', true);
		$("#scrollSpeed option[value=" + data.scrSpeed +"]").attr("selected", "selected");
		$("#visbilityBehavior option[value=" + data.visibilityBehav +"]").attr("selected", "selected");
		$("#controlOptions option[value=" + data.controlOption +"]").attr("selected", "selected");
		$('input:radio[name=iconLib]').filter('[value=' + data.iconLib + ']').attr('checked', true);
		$('#useMyIconTextBox').val(data.userIcon);
	
		$("#useMyIconTextBox").change();// load the image
	} else if("saveCompleted" === theMessageEvent.name) {
		// Update status to let user know options were saved.
		show_message("Saved successfully.");
	}
}

safari.self.addEventListener("message", respondMessage, false);

document.addEventListener('DOMContentLoaded', function () {
	var updated = getParameterByName("updated");
	if("true" == updated) {
		var updateDiv = '<div id="updateDiv" align="center" style="width: 100%;">Congratulations Scroll To Top has been updated to the latest version. See <a href="http://github.com/pratikabu/scrolltotop/wiki/Release-Notes">Release Notes</a>.</div>';
		$('body').prepend(updateDiv);
	}
	
	// add all events
	
	//document.querySelector('#saveSettings').addEventListener('click', save_options);
	document.querySelector('#defaultBut').addEventListener('click', default_options);
	
	$("#imgVerticalLocation").change(function() { save_options(); });
	$("#imgHorizontalLocation").change(function() { save_options(); });
	$("#iconSize").change(function() { save_options(); });
	$("#scrollSpeed").change(function() { save_options(); });
	$("#visbilityBehavior").change(function() { save_options(); });
	$("#controlOptions").change(function() { save_options(); });
	$('input:radio[name=iconLib]').change(function() { save_options(); });
	
	$("#iconGal1").click(function() { $('input:radio[name=iconLib]').filter('[value=1]').attr('checked', true); $('input:radio[name=iconLib]').change(); });
	$("#iconGal2").click(function() { $('input:radio[name=iconLib]').filter('[value=2]').attr('checked', true); $('input:radio[name=iconLib]').change(); });
	$("#iconGal3").click(function() { $('input:radio[name=iconLib]').filter('[value=3]').attr('checked', true); $('input:radio[name=iconLib]').change(); });
	
	$("#useMyIconTextBox").change(function() { $('#previewIcon').attr('src', 'data:image/png;base64,' + $('#useMyIconTextBox').val()); });
	$("#useMyIconTextBox").focus(function() {
		this.select();
		
		// Work around Chrome's little problem
		$("#useMyIconTextBox").mouseup(function() {
			// Prevent further mouseup intervention
			$("#useMyIconTextBox").unbind("mouseup");
			return false;
		});
	});
	
	$("#previewIcon").load(function() {
		if(true === ignoreImgLoad) {
			ignoreImgLoad = false;
		} else {
			$('input:radio[name=iconLib]').filter('[value=myIcon]').attr('checked', true);
			$('input:radio[name=iconLib]').change();
		}
	});
	$("#previewIcon").error(function() {
		show_message("Error loading uploaded image.");
		$('input:radio[name=iconLib]').focus();
	});
	
	restore_options();
});