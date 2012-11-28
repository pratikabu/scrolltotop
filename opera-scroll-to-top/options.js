var requestCount = 0;
var ignoreImgLoad = true;

// Saves options to localStorage.
function default_options() {
	ignoreImgLoad = true;// ignore the image load method as it will reset myIcon in the radio button
	
	localStorage["vertical_location"] = "bottom";
	localStorage["horizontal_location"] = "right";
	localStorage["image_size"] = "48";
	localStorage["scrolling_speed"] = "1200";
	localStorage["visibility_behavior"] = "alwaysshow";
	localStorage["control_options"] = "pager";
	localStorage["icon_library"] = "1";
	localStorage["user_saved_icon"] = "/9j/4AAQSkZJRgABAQEASABIAAD//gAUQ3JlYXRlZCB3aXRoIEdJTVAA/9sAQwACAQECAQECAgICAgICAgMFAwMDAwMGBAQDBQcGBwcHBgcHCAkLCQgICggHBwoNCgoLDAwMDAcJDg8NDA4LDAwM/9sAQwECAgIDAwMGAwMGDAgHCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAMAAwAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/J/TdPBK/LwRita10oEpxn5efypNItw5GAcg963bW33FcDGB1ps0KqaMrJgDOR1ol0vMpBUAEc10FtY7duMABc4/KmSaeefMJJ+gHGaQHJX2kgKTgcDnHWsbU7EBcYwxHFdpe2JizgFt2cE96wdWtwc8EGmmB1/wV8eJ8NPFUGo3Hhzwz4ssgR9o0zXLL7RbXKem5SskZ9GjcHpkMOD+wX7Nf7Mn7Ov7S3wQ8P8AjjRPhP4YtLPXIGd7WWJmksp43aOaFiGAYpIjgNgbgAwADAV+LGh3gRQZPlPy4+b72f8A69e8/B79ur4s/BPwRY+G/CvjG60TQtPeV7e0hsbR0RpJGlcsXiZnJZmPzE44AwAAEJo+4fip/wAEXbHxV8fm1fw9remaD4C1F99zpKQyJd6X+62lbUgMki+YA4DlNoJX5sZK/Cn/AIIvWHhT4/rrHiLWtM1/wHpsjSWmkPDI91qX7raq3TYVEAclyEL7toX5Qcji/wBjj/gsF4ou/H2leHvip/ZuqaVq1wlqNct7ZLO50+R2Cq8yRgRPCCRu2ojKCWy2Nhb+15/wWF8Tr481PQPhadN0nRtLne1/tye1S7utRdGKtJEkgMUcJIO3cjsww2UztALU+gf2mv2av2d/2aPgdr/jjW/hP4YvbXQ4VaO0iiZJL2eR1jhhVix275HUFsHau5sHbivx7+NPj5PiR4ruNRg8O+GfC1mW/caZoVj9ntrZc/d3MWkkPT5pHY9cbRxXrXxk/bk+K3xr8DXvhvxZ4yu9a0O/eOSe1msrRFLRuJEZWSJWQhlH3SM8g5BIPgmqEbTk7sE/jQNIqabcjK/y6Gug069UR7TnHAIzXFaZf7QM5xitux1IYzn8+lNoZ1dvqY2k8le/PPT0p0t/kcEjjj2rnk1XYCFbntTZdX6fMOfWkBe1C9Bz8xz9frWDql0DuwefrUl1qIAP5etYV/qe7crAAcYyRzVJAf/Z";
	
	restore_options();

	// Update status to let user know options were defaulted.
	show_message("Restored to defaults.");
}

// Saves options to localStorage.
function save_options() {
	localStorage["vertical_location"] = $('#imgVerticalLocation').val();
	localStorage["horizontal_location"] = $('#imgHorizontalLocation').val();
	localStorage["image_size"] = $('#iconSize').val();
	localStorage["scrolling_speed"] = $('#scrollSpeed').val();
	localStorage["visibility_behavior"] = $('#visbilityBehavior').val();
	localStorage["control_options"] = $('#controlOptions').val();
	localStorage["icon_library"] = $('input:radio[name=iconLib]:checked').val();
	localStorage["user_saved_icon"] = $('#useMyIconTextBox').val();

	// Update status to let user know options were saved.
	show_message("Saved successfully.");
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	$("#imgVerticalLocation option[value=" + localStorage["vertical_location"] +"]").attr("selected", "selected");
	$("#imgHorizontalLocation option[value=" + localStorage["horizontal_location"] +"]").attr("selected", "selected");
	$("#iconSize option[value=" + localStorage["image_size"] +"]").attr("selected", "selected");
	$("#scrollSpeed option[value=" + localStorage["scrolling_speed"] +"]").attr("selected", "selected");
	$("#visbilityBehavior option[value=" + localStorage["visibility_behavior"] +"]").attr("selected", "selected");
	$("#controlOptions option[value=" + localStorage["control_options"] +"]").attr("selected", "selected");
	$('input:radio[name=iconLib]').filter('[value=' + localStorage["icon_library"] + ']').attr('checked', true);
	$('#useMyIconTextBox').val(localStorage["user_saved_icon"]);
	
	$("#useMyIconTextBox").change();// load the image
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