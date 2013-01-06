var requestCount = 0;
var ignoreImgLoad = true;
var ignoreForDefaults = false;

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
	
	localStorage["toggle_pause"] = "false";
	localStorage["arrow_type"] = "1";
	
	ignoreForDefaults = true;
	restore_options();

	// Update status to let user know options were defaulted.
	show_message("Restored to defaults.");
}

// Saves options to localStorage.
function save_options() {
	localStorage["vertical_location"] = $('input:radio[name=imgVerticalLocation]:checked').val();
	localStorage["horizontal_location"] = $('input:radio[name=imgHorizontalLocation]:checked').val();
	localStorage["visibility_behavior"] = $('input:radio[name=visbilityBehavior]:checked').val();
	
	localStorage["arrow_type"] = $('input:radio[name=arrowType]:checked').val();
	localStorage["control_options"] = $('input:radio[name=controlOptions]:checked').val();
	localStorage["image_size"] = $('input:radio[name=iconSize]:checked').val();
	localStorage["icon_library"] = $('input:radio[name=iconLib]:checked').val();
	localStorage["user_saved_icon"] = $('#useMyIconTextBox').val();
	localStorage["toggle_pause"] = $('#togglePause').is(':checked');

	// Update status to let user know options were saved.
	show_message("Saved successfully.");
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	$('input:radio[name=imgVerticalLocation]').filter('[value=' + localStorage["vertical_location"] + ']').attr('checked', true);
	$('input:radio[name=imgHorizontalLocation]').filter('[value=' + localStorage["horizontal_location"] + ']').attr('checked', true);
	
	initSlider(localStorage["scrolling_speed"]);
	$('input:radio[name=visbilityBehavior]').filter('[value=' + localStorage["visibility_behavior"] + ']').attr('checked', true);
	
	$('input:radio[name=arrowType]').filter('[value=' + localStorage["arrow_type"] + ']').attr('checked', true);
	swapAdvancedOptions(localStorage["arrow_type"]);
	
	$('input:radio[name=controlOptions]').filter('[value=' + localStorage["control_options"] + ']').attr('checked', true);
	$("#togglePause").attr('checked', localStorage["toggle_pause"] == "true" ? true : false);
	$('input:radio[name=iconSize]').filter('[value=' + localStorage["image_size"] + ']').attr('checked', true);
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

function populateSliderSpeedOnText(scrollSpeed) {
	var speed = 2400 - scrollSpeed;
	
	var multiplicity = (1200 - speed) / 100;
	if(0 > multiplicity) multiplicity = multiplicity * -1;
	multiplicity = multiplicity + " X ";
	
	var displayText = multiplicity + "FASTER";
	if(2000 == speed) {
		displayText = "SLOWEST";
	} else if(1200 < speed) {
		displayText = multiplicity + "SLOWER";
	} else if(1200 == speed) {
		displayText = "NORMAL";
	} else if(400 == speed) {
		displayText = "IMMEDIATE";
	}
	
	$("#currentSpeed").html(displayText);
}

function initSlider(initialValue) {
	if(0 == initialValue) {
		initialValue = 400;
	}
	initialValue = 2400 - initialValue;
	populateSliderSpeedOnText(initialValue);
	
	$( "#scrollSpeed" ).slider({
		value: initialValue,
		min: 400,
		max: 2000,
		step: 100,
		animate: true,
		range: "min",
		slide: function( event, ui ) {
			populateSliderSpeedOnText(ui.value);
		},
		change: function( event, ui ) {
			var speedVal = 2400 - ui.value;
			if(400 == speedVal) {
				speedVal = 0;
			}
			localStorage["scrolling_speed"] = speedVal;
			
			if(!ignoreForDefaults) {
				save_options();
			} else {
				ignoreForDefaults = false;
			}
		}
	});
}

function selectableRadioContent(id, name, value) {
	$("#" + id).css("cursor", "default");
	$("#" + id).click(function() {
		$('input:radio[name=' + name + ']').filter('[value=' + value + ']').attr('checked', true);
		$('input:radio[name=' + name + ']').change();
	});
}

/*
	for all radio button's content to be selecatable
*/
function makeElementsSelactable() {
	for(var i = 1; i <= 11; i++) {
		selectableRadioContent("iconGal" + i, "iconLib", "" + i);
	}
	
	selectableRadioContent("vlTop", "imgVerticalLocation", "top");
	selectableRadioContent("vlMiddle", "imgVerticalLocation", "middle");
	selectableRadioContent("vlBottom", "imgVerticalLocation", "bottom");
	
	selectableRadioContent("hlLeft", "imgHorizontalLocation", "left");
	selectableRadioContent("hlMiddle", "imgHorizontalLocation", "middle");
	selectableRadioContent("hlRight", "imgHorizontalLocation", "right");
	
	selectableRadioContent("vbAutoHide", "visbilityBehavior", "autohide");
	selectableRadioContent("vbAlwaysShow", "visbilityBehavior", "alwaysshow");
	
	selectableRadioContent("atSingle", "arrowType", "1");
	selectableRadioContent("atDual", "arrowType", "2");
	
	selectableRadioContent("coNone", "controlOptions", "none");
	selectableRadioContent("coSimple", "controlOptions", "simple");
	selectableRadioContent("coPager", "controlOptions", "pager");
	
	selectableRadioContent("iconSizeOp1", "iconSize", "32");
	selectableRadioContent("iconSizeOp2", "iconSize", "48");
	
	selectableRadioContent("useMyIcon", "iconLib", "myIcon");
	
	$("#tpToggle").css("cursor", "default");
	$('#tpToggle').click(function() {
		$("#togglePause").attr('checked', !$('#togglePause').is(':checked'));
		$("#togglePause").change();
	});
}

function swapAdvancedOptions(selectedValue) {
	if("1" == selectedValue) {
		$("#dualArrowSettings").hide();
		$("#singleArrowSettings").show();
	} else {
		$("#singleArrowSettings").hide();
		$("#dualArrowSettings").show();
	}
}

function isRightChangedEvent(name, val) {
	var rightEvent = $('input:radio[name=' + name + ']:checked').val() == val;
	if(rightEvent) {
		save_options();
	}
	return rightEvent;
}

document.addEventListener('DOMContentLoaded', function () {
	var updated = getParameterByName("updated");
	if("true" == updated) {
		var updateDiv = '<div id="updateDiv" align="center" style="width: 100%;">Congratulations Scroll To Top has been updated to the latest version. See <a href="http://github.com/pratikabu/scrolltotop/wiki/Release-Notes">What&apos;s New</a>.</div>';
		$('body').prepend(updateDiv);
	}
	
	// add all events
	
	//document.querySelector('#saveSettings').addEventListener('click', save_options);
	document.querySelector('#defaultBut').addEventListener('click', default_options);
	
	$('input:radio[name=imgVerticalLocation]').change(function() { isRightChangedEvent("imgVerticalLocation", $(this).val()); });
	$('input:radio[name=imgHorizontalLocation]').change(function() { isRightChangedEvent("imgHorizontalLocation", $(this).val()); });
	$('input:radio[name=iconSize]').change(function() { isRightChangedEvent("iconSize", $(this).val()); });
	$('input:radio[name=visbilityBehavior]').change(function() { isRightChangedEvent("visbilityBehavior", $(this).val()); });
	$('input:radio[name=controlOptions]').change(function() { isRightChangedEvent("controlOptions", $(this).val()); });
	$("#togglePause").change(function() { save_options(); });
	$('input:radio[name=iconLib]').change(function() { isRightChangedEvent("iconLib", $(this).val()); });
	
	$('input:radio[name=arrowType]').change(function() {
		if(isRightChangedEvent("arrowType", $(this).val())) {
			swapAdvancedOptions($(this).val());
			
			$('input:radio[name=imgHorizontalLocation]').filter('[value=right]').attr('checked', true);
			if("1" == $(this).val()) {
				$('input:radio[name=imgVerticalLocation]').filter('[value=bottom]').attr('checked', true);
			} else {
				$('input:radio[name=imgVerticalLocation]').filter('[value=middle]').attr('checked', true);
				$('input:radio[name=visbilityBehavior]').filter('[value=alwaysshow]').attr('checked', true);
			}
			save_options();
		}
	});
	
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
	
	makeElementsSelactable();
	restore_options();
});