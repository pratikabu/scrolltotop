var requestCount = 0;
var ignoreImgLoad = true;
var dIgnoreImgLoad = true;
var ignoreForDefaults = false;

// Saves options to localStorage.
function default_options() {
	ignoreForDefaults = true;// ignore the image load method as it will reset myIcon in the radio button
	
	var commonIcon = "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";
	
	localStorage["vertical_location"] = "bottom";
	localStorage["horizontal_location"] = "right";
	localStorage["image_size"] = "48";
	localStorage["scrolling_speed"] = "1200";
	localStorage["visibility_behavior"] = "alwaysshow";
	localStorage["control_options"] = "pager";
	localStorage["icon_library"] = "1";
	localStorage["user_saved_icon"] = commonIcon;
	
	localStorage["arrow_type"] = "1";
	
	localStorage["d_icon_library"] = "1";
	localStorage["d_user_saved_icon"] = commonIcon;
	localStorage["d_arrangement"] = "hr";
	
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
	
	localStorage["d_icon_library"] = $('input:radio[name=dIconLib]:checked').val();
	localStorage["d_user_saved_icon"] = $('#dUseMyIconTextBox').val();
	localStorage["d_arrangement"] = $('input:radio[name=dIconArrangemnt]:checked').val();

	// Update status to let user know options were saved.
	show_message("Saved successfully. <a target='_blank' href='http://pratikabu.users.sourceforge.net/extensions/scrolltotop/release.html'>Preview your changes</a>.");
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	ignoreImgLoad = true;// ignore the image load method as it will reset myIcon in the radio button
	dIgnoreImgLoad = true;// ignore the image load method as it will reset myIcon in the radio button
	
	$('input:radio[name=imgVerticalLocation]').filter('[value=' + localStorage["vertical_location"] + ']').attr('checked', true);
	$('input:radio[name=imgHorizontalLocation]').filter('[value=' + localStorage["horizontal_location"] + ']').attr('checked', true);
	
	initSlider(localStorage["scrolling_speed"]);
	$('input:radio[name=visbilityBehavior]').filter('[value=' + localStorage["visibility_behavior"] + ']').attr('checked', true);
	
	$('input:radio[name=arrowType]').filter('[value=' + localStorage["arrow_type"] + ']').attr('checked', true);
	swapAdvancedOptions(localStorage["arrow_type"]);
	
	$('input:radio[name=controlOptions]').filter('[value=' + localStorage["control_options"] + ']').attr('checked', true);
	$('input:radio[name=iconSize]').filter('[value=' + localStorage["image_size"] + ']').attr('checked', true);
	$('input:radio[name=iconLib]').filter('[value=' + localStorage["icon_library"] + ']').attr('checked', true);
	$('#useMyIconTextBox').val(localStorage["user_saved_icon"]);
	$("#useMyIconTextBox").change();// load the image
	
	$('input:radio[name=dIconLib]').filter('[value=' + localStorage["d_icon_library"] + ']').attr('checked', true);
	$('#dUseMyIconTextBox').val(localStorage["d_user_saved_icon"]);
	$("#dUseMyIconTextBox").change();// load the image
	$('input:radio[name=dIconArrangemnt]').filter('[value=' + localStorage["d_arrangement"] + ']').attr('checked', true);
}

function show_message(msg) {
	requestCount++;
	$("#status").html(msg);
	setTimeout(function() {
		if(0 == --requestCount) {
			$("#status").html("&nbsp;");
		}
	}, 5000);
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
	for(var i = 1; i <= 23; i++) {
		selectableRadioContent("iconGal" + i, "iconLib", "" + i);
	}
	
	selectableRadioContent("vlTop", "imgVerticalLocation", "top");
	selectableRadioContent("vlMiddle", "imgVerticalLocation", "middle");
	selectableRadioContent("vlBottom", "imgVerticalLocation", "bottom");
	
	selectableRadioContent("hlLeft", "imgHorizontalLocation", "left");
	selectableRadioContent("hlMiddle", "imgHorizontalLocation", "middle");
	selectableRadioContent("hlRight", "imgHorizontalLocation", "right");
	
	selectableRadioContent("vbHideAtTop", "visbilityBehavior", "hideattop");
	selectableRadioContent("vbAlwaysShow", "visbilityBehavior", "alwaysshow");
	selectableRadioContent("vbAutoHide", "visbilityBehavior", "autohide");
	
	selectableRadioContent("atSingle", "arrowType", "1");
	selectableRadioContent("atDual", "arrowType", "2");
	
	selectableRadioContent("sdOn", "smartDirection", "true");
	selectableRadioContent("sdOff", "smartDirection", "false");
	
	selectableRadioContent("coNone", "controlOptions", "none");
	selectableRadioContent("coSimple", "controlOptions", "simple");
	selectableRadioContent("coPager", "controlOptions", "pager");
	
	selectableRadioContent("ahcYes", "autoHideControls", "true");
	selectableRadioContent("ahcNo", "autoHideControls", "false");
	
	selectableRadioContent("iconSizeOp1", "iconSize", "32");
	selectableRadioContent("iconSizeOp2", "iconSize", "48");
	
	selectableRadioContent("useMyIcon", "iconLib", "myIcon");
	
	//dual arrow selectors
	
	selectableRadioContent("diarrHr", "dIconArrangemnt", "hr");
	selectableRadioContent("diarrVr", "dIconArrangemnt", "vr");
	
	// horizontal arrangement selector
	for(var i = 1; i <= 6; i++) {
		selectableRadioContent("dIconGal" + i, "dIconLib", "" + i);
	}
	
	// vertical arrangement selector
	for(var i = 21; i <= 23; i++) {
		selectableRadioContent("dIconGal" + i, "dIconLib", "" + i);
	}
	
	// dual icon's single icon selector
	for(var i = 41; i <= 63; i++) {
		selectableRadioContent("dIconGal" + i, "dIconLib", "" + i);
	}
	
	selectableRadioContent("dUseMyIcon", "dIconLib", "myIcon");
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

function activateAdvancedSettings() {
	//$(".advancedProp").show();
	$(".advancedProp").fadeTo(300, 1);
	$("#advSettingsBut").remove();
	$("html, body").scrollTop(0);
}

function validateDomainDataAndFix(textareaId) {
	var ta = $('#' + textareaId);
	var domains = ta.val();
	domains = domains.replace(/\ /g, "");// remove all spaces
	domains = domains.replace(/\*/g, "");// remove all *
	ta.val(domains);// reset the value in the textarea
	
	save_options();// save these settings
}

function validateOffsetDataAndFix(textId) {
	var t = $('#' + textId);
	var value = t.val();
	var intVal = 20;
	if(!isNaN(value) && 0 != value.length) {// should be a number and shouldn't be empty
		intVal = parseInt(value);
		intVal = intVal < 0 ? intVal * -1 : intVal;// B-positive :)
		intVal = intVal > 300 ? 300 : intVal;// not more than 300
	}
	t.val(intVal + "");// reset the value in the textbox
	
	save_options();// save these settings
}

document.addEventListener('DOMContentLoaded', function () {
	var updated = getParameterByName("updated");
	if("true" == updated) {
		$('#maskDiv').fadeTo("slow", .8);
		$('#updateDialog').fadeTo("slow", 1);

		$('#okaygotit').click(function() {
			$('#updateDialog').fadeTo("slow", 0, function() {
				$("#updateDialog").remove();
			});
			
			$('#maskDiv').fadeTo("slow", 0, function() {
				$("#maskDiv").remove();
			});
		});
	}
	
	// add all events
	
	//document.querySelector('#saveSettings').addEventListener('click', save_options);
	$("#defaultBut").click(function() { default_options(); });
	$("#advSettingsBut").click(function() { activateAdvancedSettings(); });
	
	// common settings starts
	$('input:radio[name=imgVerticalLocation]').change(function() { isRightChangedEvent("imgVerticalLocation", $(this).val()); });
	$('input:radio[name=imgHorizontalLocation]').change(function() { isRightChangedEvent("imgHorizontalLocation", $(this).val()); });
	$('input:radio[name=visbilityBehavior]').change(function() { isRightChangedEvent("visbilityBehavior", $(this).val()); });
	// common settings ends
	
	// arrow type settings starts
	$('input:radio[name=arrowType]').change(function() {
		if(isRightChangedEvent("arrowType", $(this).val())) {// auto set location of the icon as per the selection
			swapAdvancedOptions($(this).val());
			
			$('input:radio[name=imgHorizontalLocation]').filter('[value=right]').attr('checked', true);
			if("1" == $(this).val()) {
				$('input:radio[name=imgVerticalLocation]').filter('[value=bottom]').attr('checked', true);
				$('input:radio[name=visbilityBehavior]').filter('[value=autohide]').attr('checked', true);
			} else {
				$('input:radio[name=imgVerticalLocation]').filter('[value=middle]').attr('checked', true);
				$('input:radio[name=visbilityBehavior]').filter('[value=alwaysshow]').attr('checked', true);
			}
			save_options();
		}
	});
	// arrow type settings ends
	
	// single arrow settings starts
	$('input:radio[name=controlOptions]').change(function() { isRightChangedEvent("controlOptions", $(this).val()); });
	$('input:radio[name=autoHideControls]').change(function() { isRightChangedEvent("autoHideControls", $(this).val()); });
	$('input:radio[name=iconSize]').change(function() { isRightChangedEvent("iconSize", $(this).val()); });
	$('input:radio[name=iconLib]').change(function() { isRightChangedEvent("iconLib", $(this).val()); });
	$('input:radio[name=smartDirection]').change(function() {
		if(isRightChangedEvent("smartDirection", $(this).val())) {
			if("true" == $(this).val()) {// auto set to visibility to autohide
				$('input:radio[name=visbilityBehavior]').filter('[value=autohide]').attr('checked', true);
				save_options();
			}
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
		if(ignoreImgLoad) {
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
	// single arrow settings ends
	
	// dual arrow changes starts
	$('input:radio[name=dIconLib]').change(function() {
		if(isRightChangedEvent("dIconLib", $(this).val())) {
			if(20 >= parseInt($(this).val())) {
				$('input:radio[name=dIconArrangemnt]').filter('[value=hr]').attr('checked', true);
			} else if(40 >= parseInt($(this).val())) {
				$('input:radio[name=dIconArrangemnt]').filter('[value=vr]').attr('checked', true);
			}
			save_options();
		}
	});
	
	$("#dUseMyIconTextBox").change(function() { $('#dPreviewIcon').attr('src', 'data:image/png;base64,' + $('#dUseMyIconTextBox').val()); });
	$("#dUseMyIconTextBox").focus(function() {
		this.select();
		
		// Work around Chrome's little problem
		$("#dUseMyIconTextBox").mouseup(function() {
			// Prevent further mouseup intervention
			$("#dUseMyIconTextBox").unbind("mouseup");
			return false;
		});
	});
	
	$("#dPreviewIcon").load(function() {
		if(dIgnoreImgLoad) {
			dIgnoreImgLoad = false;
		} else {
			$('input:radio[name=dIconLib]').filter('[value=myIcon]').attr('checked', true);
			$('input:radio[name=dIconLib]').change();
		}
	});
	$("#dPreviewIcon").error(function() {
		show_message("Error loading uploaded image.");
		$('input:radio[name=dIconLib]').focus();
	});
	
	$('input:radio[name=dIconArrangemnt]').change(function() { isRightChangedEvent("dIconArrangemnt", $(this).val()); });
	// dual arrow settings ends
	
	// advanced settings starts
	$("#hOffset").change(function() { validateOffsetDataAndFix('hOffset'); });
	$("#vOffset").change(function() { validateOffsetDataAndFix('vOffset'); });
	
	$("#removedSites").change(function() { validateDomainDataAndFix('removedSites'); });
	$("#frameSupportedSites").change(function() { validateDomainDataAndFix('frameSupportedSites'); });
	// advanced settings ends
	
	makeElementsSelactable();
	restore_options();
});