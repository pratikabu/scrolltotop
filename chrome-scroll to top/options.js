var requestCount = 0;
var ignoreImgLoad = true;
var dIgnoreImgLoad = true;
var globalScrollSpeed;
var ignoreForDefaults = false;
var addonVersion = "4.3";

/*********************************************************************
	Browser Independent code.
*********************************************************************/

// Saves options to localStorage.
function save_options(returnValue) {
	var data = {
		vLoc: $('input:radio[name=imgVerticalLocation]:checked').val(),
		hLoc: $('input:radio[name=imgHorizontalLocation]:checked').val(),
		scrSpeed: globalScrollSpeed,
		visibilityBehav: $('input:radio[name=visbilityBehavior]:checked').val(),
		
		arrowType: $('input:radio[name=arrowType]:checked').val(),
		
		smartDirection: $('input:radio[name=smartDirection]:checked').val(),
		controlOption: $('input:radio[name=controlOptions]:checked').val(),
		hideControls: $('input:radio[name=autoHideControls]:checked').val(),
		iconSize: $('input:radio[name=iconSize]:checked').val(),
		iconLib: $('input:radio[name=iconLib]:checked').val(),
		userIcon: $('#useMyIconTextBox').val(),
		
		dArrang: $('input:radio[name=dIconArrangemnt]:checked').val(),
		dIconLib: $('input:radio[name=dIconLib]:checked').val(),
		dUserIcon: $('#dUseMyIconTextBox').val(),
		
		hOffset: $('#hOffset').val(),
		vOffset: $('#vOffset').val(),
		removedSites: $('#removedSites').val(),
		
		supportPrompt: $('#supportPromptCBId').is(':checked')
	};
	
	if(!returnValue) {
		bsSaveSettings(data);
	} else {
		return data;
	}
}

// Restores select box state to saved value from localStorage.
function restore_options(data) {
	ignoreImgLoad = true;// ignore the image load method as it will reset myIcon in the radio button
	dIgnoreImgLoad = true;// ignore the image load method as it will reset myIcon in the radio button
	
	$('input:radio[name=imgVerticalLocation]').filter('[value=' + data.vLoc + ']').attr('checked', true);
	$('input:radio[name=imgHorizontalLocation]').filter('[value=' + data.hLoc + ']').attr('checked', true);
	
	globalScrollSpeed = data.scrSpeed;// for future references
	initSlider(data.scrSpeed);
	$('input:radio[name=visbilityBehavior]').filter('[value=' + data.visibilityBehav + ']').attr('checked', true);
	
	$('input:radio[name=arrowType]').filter('[value=' + data.arrowType + ']').attr('checked', true);
	swapAdvancedOptions(data.arrowType);
	
	$('input:radio[name=smartDirection]').filter('[value=' + data.smartDirection + ']').attr('checked', true);
	$('input:radio[name=controlOptions]').filter('[value=' + data.controlOption + ']').attr('checked', true);
	$('input:radio[name=autoHideControls]').filter('[value=' + data.hideControls + ']').attr('checked', true);
	$('input:radio[name=iconSize]').filter('[value=' + data.iconSize + ']').attr('checked', true);
	$('input:radio[name=iconLib]').filter('[value=' + data.iconLib + ']').attr('checked', true);
	$('#useMyIconTextBox').val(data.userIcon);
	$("#useMyIconTextBox").change();// load the image
	
	$('input:radio[name=dIconLib]').filter('[value=' + data.dIconLib + ']').attr('checked', true);
	$('#dUseMyIconTextBox').val(data.dUserIcon);
	$("#dUseMyIconTextBox").change();// load the image
	$('input:radio[name=dIconArrangemnt]').filter('[value=' + data.dArrang + ']').attr('checked', true);
	
	$('#hOffset').val(data.hOffset);
	$('#vOffset').val(data.vOffset);
	$('#removedSites').val(data.removedSites);
	
	$("#supportPromptCBId").attr('checked', "true" == data.supportPrompt ? true : false);
}

function show_message(msg) {
	requestCount++;
	$("#status").append(msg + "<br/>");
	$("#status").slideDown('normal');
	setTimeout(function() {
		if(0 == --requestCount) {
			$("#status").slideUp('slow', function() {
				$("#status").html("");
			});
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
			globalScrollSpeed = speedVal;
			
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

/**
	ignoreSave: this parameter has been created for export import, as I'm using a radio button there.
*/
function isRightChangedEvent(name, val, ignoreSave) {
	var rightEvent = $('input:radio[name=' + name + ']:checked').val() == val;
	if(rightEvent && !ignoreSave) {
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

function closeExportImport() {
	$('#exportImportDialog').fadeTo("slow", 0, function() {
		$("#exportImportDialog").hide();
	});
	
	$('#maskDiv').fadeTo("slow", 0, function() {
		$("#maskDiv").hide();
	});
}

function exportImportSettingsInits() {
	$("#exportImportBut").click(function() {
		// load in the export textarea
		$('#txtExportSettings').val(JSON.stringify(save_options(true)));
		
		$('#maskDiv').fadeTo("slow", .5);
		$('#exportImportDialog').fadeTo("slow", 1);
		
		// by default export should be selected
		$('input:radio[name=eiRBG]').filter('[value=E]').attr('checked', true);
		$('input:radio[name=eiRBG]').change();
	});
	$('#eiSave').click(function() {
		var jsonSTR = $("#txtImportSettings").val().trim();
		if(0 == jsonSTR.length) {
			return;
		}
		if(!confirm("All your settings will be overwritten. Are you sure?")) {
			return;
		}
		// save the content
		var data = JSON.parse(jsonSTR);
		bsSaveSettings(data);
		restore_options(data);
		$("#txtImportSettings").val("");
		closeExportImport();
	});
	$('#eiClose').click(function() {
		closeExportImport();
	});
	$('#txtExportSettings').click(function() {
		this.select();
	});
	
	$('input:radio[name=eiRBG]').change(function() {
		if(isRightChangedEvent("eiRBG", $(this).val(), true)) {
			var visibleProps = ".eiExport";
			var invisibleProps = ".eiImport";
			if('E' == $(this).val()) {
				visibleProps = ".eiExport";
				invisibleProps = ".eiImport";
			} else {
				visibleProps = ".eiImport";
				invisibleProps = ".eiExport";
			}
			$(invisibleProps).hide();
			$(visibleProps).fadeTo(300, 1);
		}
	});
	
	selectableRadioContent("eiExportLb", "eiRBG", "E");
	selectableRadioContent("eiImportLb", "eiRBG", "I");
}

function openSupportDialog() {
	$('#maskDiv').fadeTo("slow", .5);
	$('#donateReviewDialog').fadeTo("slow", 1);
}

function donateReviewInits() {
	$("#donateReviewBut").click(function() {
		openSupportDialog();
	});
	
	
	$('#drClose').click(function() {
		$('#donateReviewDialog').fadeTo("slow", 0, function() {
			$("#donateReviewDialog").hide();
		});
		
		$('#maskDiv').fadeTo("slow", 0, function() {
			$("#maskDiv").hide();
		});
	});
	
	$("#supportPromptId").css("cursor", "default");
	$("#supportPromptCBId").change(function() {
		save_options();
	});
	$('#supportPromptId').click(function() {
		$("#supportPromptCBId").attr('checked', !$('#supportPromptCBId').is(':checked'));
		$("#supportPromptCBId").change();
	});
}

function randomOpenSupportDialog() {
	if(!$('#supportPromptCBId').is(':checked') && 0 == new Date().getTime() % 4) {
		openSupportDialog();
	}
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
	// is updated then show update dialog
	var updated = getParameterByName("updated");
	if("true" === updated) {
		$('#maskDiv').fadeTo("slow", .5);
		$('#updateDialog').fadeTo("slow", 1);

		$('#okaygotit').click(function() {
			$('#updateDialog').fadeTo("slow", 0, function() {
				$("#updateDialog").remove();
			});
			
			$('#maskDiv').fadeTo("slow", 0, function() {
				$("#maskDiv").hide();
			});
		});
	}
	
	// add all events
	
	//document.querySelector('#saveSettings').addEventListener('click', save_options);
	$("#defaultBut").click(function() { bsDefaultSettings(); });
	$("#advSettingsBut").click(function() { activateAdvancedSettings(); });
	exportImportSettingsInits();
	donateReviewInits();
	
	// common settings starts
	$('input:radio[name=imgVerticalLocation]').change(function() { isRightChangedEvent("imgVerticalLocation", $(this).val()); });
	$('input:radio[name=imgHorizontalLocation]').change(function() { isRightChangedEvent("imgHorizontalLocation", $(this).val()); });
	$('input:radio[name=visbilityBehavior]').change(function() { isRightChangedEvent("visbilityBehavior", $(this).val()); });
	// common settings ends
	
	// arrow type settings starts
	$('input:radio[name=arrowType]').change(function() {
		if(isRightChangedEvent("arrowType", $(this).val())) {// auto set location of the icon as per the selection
			swapAdvancedOptions($(this).val());
			
			$('input:radio[name=visbilityBehavior]').filter('[value=alwaysshow]').attr('checked', true);
			$('input:radio[name=imgHorizontalLocation]').filter('[value=right]').attr('checked', true);
			if("1" == $(this).val()) {
				$('input:radio[name=imgVerticalLocation]').filter('[value=bottom]').attr('checked', true);
			} else {
				$('input:radio[name=imgVerticalLocation]').filter('[value=middle]').attr('checked', true);
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
	// advanced settings ends
	
	bsInit();
	makeElementsSelactable();
	bsFetchSettings(updated);
	
	// place the version
	$(".addonVersionId").append(addonVersion);
	// latest version check
	$("#latestVersionCheckId").append('<a target="_blank" href="http://pratikabu.users.sourceforge.net/extensions/scrolltotop/latest.html?v=' + addonVersion + '" style="font-size: 12px;" title="See if any new version available.">Check Updates</a>');
	// give review link
	$(".reviewId").append('<a class="mybutton small green mylink" target="_blank" style="font-size: 12px;" href="' + bsReviewPageUrl() + '" title="Love Scroll To Top, give it a 5 star and leave your feedback.">Give Review</a>');
	
	$(".donateId").append('<a target="_blank" title="Show your support." href="http://pratikabu.users.sourceforge.net/extensions/scrolltotop/donate.php"><span class="donateButton">&nbsp;</span></a>');
});

/************************************************************
	Browser specific coding
************************************************************/

/** Saves options to localStorage. */
function bsDefaultSettings() {
	if(!confirm("All settings will be reverted to original settings.")) {
		return;
	}
	
	ignoreForDefaults = true;// ignore the image load method as it will reset myIcon in the radio button
	
	// Asks background.html for [LocalStorage] settings from Options Page and assigns them to variables
	chrome.extension.sendMessage({method: "resetSettings"}, function(response_msg) {
		bsFetchSettings();
		// Update status to let user know options were defaulted.
		show_message("Restored to defaults.");
	});
}

function bsInit() {
}

function bsFetchSettings(updated) {
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
		removedSites: localStorage["removed_sites"],
		
		supportPrompt: localStorage["support_prompt"]
	}
	
	restore_options(data);
	
	if("true" !== updated) {
		randomOpenSupportDialog();// only once it will be called
	}
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
	
	localStorage["support_prompt"] = data.supportPrompt;
	
	// Update status to let user know options were saved.
	show_message("Saved successfully. <a target='_blank' href='http://pratikabu.users.sourceforge.net/extensions/scrolltotop/release.html'>Preview your changes</a>.");
}

function bsReviewPageUrl() {
	return "https://chrome.google.com/webstore/detail/scroll-to-top/hegiignepmecppikdlbohnnbfjdoaghj/reviews";
}