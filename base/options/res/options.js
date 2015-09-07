var ignoreImgLoad = true;
var dIgnoreImgLoad = true;
var globalScrollSpeed, globalTransparency;
var addonVersion = "1000.1.38";
var globalDialogId;
var globalSttData;

/*******************************************************************************
 * Browser Independent code.
 ******************************************************************************/

function updateBlackAndWhite() {
	if(isChecked("#blackWhiteCBId")) {
		$(".blackAndWhiteCSS").addClass("pratikabuSTTBlackAndWhite");
	} else {
		$(".blackAndWhiteCSS").removeClass("pratikabuSTTBlackAndWhite");
	}
}

function errorToggle(inputId, errorText) {
	if(errorText) {
		// reset the error message
		errorToggle(inputId);
	}
	
	var inputObject = $("#" + inputId);
	var errorTextId = inputId + "_ErrorText";
	
	if(!errorText) {
		inputObject.removeClass("error");
		$("#" + errorTextId).remove();
	} else {
		inputObject.addClass("error");
		$('<div/>', {
			id: errorTextId,
			class: "errorText",
			text: errorText
		}).insertAfter("#" + inputId);
	}
}

function populateProfileSelector(selectedValue) {
	var selectObject = $("#profileSelectorId");
	selectObject.find('option').remove();
	for(var i = 0; i < globalSttData.sttArray.length; i++) {
	    var sttData = globalSttData.sttArray[i];
		var name = sttData.profile_name;
		var value = name;
		selectObject.append(new Option(name, value));
	}
	
	if(5 >= globalSttData.sttArray.length) {
		selectObject.append(new Option("Create New Profile...", "new"));
	}
	
	selectObject.val(selectedValue);
	return selectObject;
}

/**
 * Saves options to localStorage.
 * @param returnValue
 * @returns data optionally returns data json object
 */
function save_options(returnValue) {
	var sttData = {
		vLoc: $('input:radio[name=imgVerticalLocation]:checked').val(),
		hLoc: $('input:radio[name=imgHorizontalLocation]:checked').val(),
		scrSpeed: globalScrollSpeed,
		visibilityBehav: $('input:radio[name=visbilityBehavior]:checked').val(),
		iconTransparency: globalTransparency,
		blackAndWhite: isChecked("#blackWhiteCBId") + "",
		
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
		removedSites: $('#removedSites').val()
	};
	globalSttData.supportPrompt = $('#supportPromptCBId').is(':checked');
	
	var selectProfileValue = $("#profileSelectorId").val();
	
	if("default" === selectProfileValue.toLowerCase()) {
		sttData.default_setting = true;
		sttData.profile_name = "Default";
	} else {
		sttData.profile_name = $("#profile_nameId").val();
		sttData.profile_url_pattern = $("#profile_url_patternId").val();
	}
	
	var isNew = "new" === selectProfileValue.toLowerCase();
	var isNewError = false;
	var isDuplicate = false;
	var isProfileEmptyError = false;
	var isProfileNameUpdate = selectProfileValue.toLowerCase() != sttData.profile_name.toLowerCase();
	var originalIndex = getProfileIndexForValue(selectProfileValue);
	if(!sttData.profile_name) {
		isProfileEmptyError = true;
	} else if("new" === sttData.profile_name.toLowerCase()) {
		isNewError = true;
	} else if(-1 != getProfileIndexForValue(sttData.profile_name) && (isNew || isProfileNameUpdate)) {
		isDuplicate = true;
	} else if(-1 == originalIndex) {
		globalSttData.sttArray.push(sttData);
	} else if(-1 != originalIndex) {
		globalSttData.sttArray[originalIndex] = sttData;
	}
	
	if(isProfileEmptyError) {
		errorToggle("profile_nameId", 'Profile name must not be empty.');
	}
	
	if(isNewError) {
		errorToggle("profile_nameId", 'Profile name must not be "new".');
	}
	
	if(isDuplicate) {
		errorToggle("profile_nameId", 'Profile name must be unique.');
	}
	
	if(!isNewError && !isDuplicate && !isProfileEmptyError && !returnValue) {
		errorToggle("profile_nameId");
		bsSaveSettings(globalSttData);
		
		if(isNew || isProfileNameUpdate) {
			populateProfileSelector(sttData.profile_name);
		}
	}
	
	return globalSttData;
}

function getProfileIndexForValue(value) {
	var index = -1;
	for(var i = 0; i < globalSttData.sttArray.length; i++) {
	    var sttData = globalSttData.sttArray[i];
	    if(value.toLowerCase() === sttData.profile_name.toLowerCase()) {
	    	index = i;
	    	break;
	    }
	}
	return index;
}

/**
 * Restores select box state to saved value from localStorage.
 * @param data
 */
function restore_options(sttMainData) {
	globalSttData = sttMainData;
	var selectObject = populateProfileSelector("Default");
	selectObject.change();
}

function restore_single_options(data) {
	ignoreImgLoad = true;// ignore the image load method as it will reset myIcon in the radio button
	dIgnoreImgLoad = true;// ignore the image load method as it will reset myIcon in the radio button
	
	if(data.default_setting) {
		$("#profile_nameId").val("");
		$("#profile_url_patternId").val("");
	} else {
		$("#profile_nameId").val(data.profile_name);
		$("#profile_url_patternId").val(data.profile_url_pattern);
	}
	
	$('input:radio[name=imgVerticalLocation]').filter('[value=' + data.vLoc + ']').attr('checked', true);
	$('input:radio[name=imgHorizontalLocation]').filter('[value=' + data.hLoc + ']').attr('checked', true);
	
	globalScrollSpeed = data.scrSpeed;// for future references
	loadValueInSpeedSlider(data.scrSpeed);
	$('input:radio[name=visbilityBehavior]').filter('[value=' + data.visibilityBehav + ']').attr('checked', true);
	globalTransparency = data.iconTransparency;
	loadValueInTransparencySlider(data.iconTransparency);
	$("#blackWhiteCBId").attr('checked', ("true" === data.blackAndWhite));
	updateBlackAndWhite();
	
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
	
	$("#supportPromptCBId").attr('checked', "true" === data.supportPrompt ? true : false);
}

function restore_settings() {
	if(!confirm("All settings will be reverted to original settings.")) {
		return;
	}
	bsDefaultSettings();
}

function post_save_success() {
	show_message("<b>Saved!</b> <a target='_blank' href='http://pratikabu.users.sourceforge.net/extensions/scrolltotop/release.html'>Preview</a>");
}

function post_restore_success() {
	show_message("Restored to defaults.");
}

function show_error_message(msg) {
	show_message("<span style='color: RED;'>" + msg + "</span>");
}

function show_message(msg) {
	var statusVar = $("#status");
	statusVar.stop();
	statusVar.html(msg);
	statusVar.slideDown('fast').delay(5000).slideUp('fast');
}

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if(results === null)
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
	if(2000 === speed) {
		displayText = "SLOWEST";
	} else if(1200 < speed) {
		displayText = multiplicity + "SLOWER";
	} else if(1200 === speed) {
		displayText = "NORMAL";
	} else if(400 === speed) {
		displayText = "IMMEDIATE";
	}
	
	$("#currentSpeed").html(displayText);
}

function loadValueInSpeedSlider(initialValue) {
	if(0 === initialValue) {
		initialValue = 400;
	}
	initialValue = 2400 - initialValue;
	populateSliderSpeedOnText(initialValue);
	$("#scrollSpeedSliderId").simpleSlider("setValue", initialValue);
}


function updateTransparency(transparency) {
	$("#transparencyImgId").stop(true, true).fadeTo(300, transparency);
}

function loadValueInTransparencySlider(transparency) {
	updateTransparency(transparency);
	$("#transparencySliderId").simpleSlider("setValue", transparency);
}

function selectableRadioContent(id, name, value) {
	$("#" + id).css("cursor", "default");
	$("#" + id).click(function() {
		$('input:radio[name=' + name + ']').filter('[value=' + value + ']').attr('checked', true);
		$('input:radio[name=' + name + ']').change();
	});
}

function isChecked(checkboxId) {
	return $(checkboxId).is(':checked');
}

function selectatbleCheckBoxContent(checkboxId, spanId) {
	checkboxId = "#" + checkboxId;
	spanId = "#" + spanId;
	$(spanId).css("cursor", "default");
	$(spanId).click(function() {
		$(checkboxId).attr('checked', !isChecked(checkboxId));
		$(checkboxId).change();
	});
}

function addElement(tag, groupName, value, componentId, image) {
	tag.append('<input type="radio" name="' + groupName + '" value="' + value + '" style="margin-left: 8px;">'
			+ '<img class="blackAndWhiteCSS" style="vertical-align: middle;" id="'+ componentId
			+ '" src="../icons/pratikabu-stt-'+ image + '.png" />');
	selectableRadioContent(componentId, groupName, "" + value);
}

function addBatchOfIcons(tag, length, cidPrefix, cidStartNumber, groupName, imageSuffix) {
	for(var i = 1; i <= length; i++) {
		var value = cidStartNumber + i;
		var componentId = cidPrefix + value;
		addElement(tag, groupName, value, componentId, imageSuffix + i);
		
		if(0 == i % 9) {
			tag.append("<div style='margin-bottom: 5px;' />");
		}
	}
	if(0 != length % 9) {
		tag.append("</div>");
	}
}

function addIcons() {
	// single icons
	addBatchOfIcons($('#singleIconTD'), 35, 'iconGal', 0, 'iconLib', '48-');
	
	// horizontal icons
	addBatchOfIcons($('#dualHRTD'), 6, 'dIconGal', 0, 'dIconLib', 'dual-hr-');
	
	// vertical icons
	addBatchOfIcons($('#dualVRTD'), 3, 'dIconGal', 20, 'dIconLib', 'dual-vr-');
	
	// dual single icon
	addBatchOfIcons($('#dualNornalTD'), 35, 'dIconGal', 40, 'dIconLib', '48-');
}

/*
	for all radio button's content to be selectable
*/
function makeElementsSelactable() {
	selectableRadioContent("vlTop", "imgVerticalLocation", "top");
	selectableRadioContent("vlMiddle", "imgVerticalLocation", "middle");
	selectableRadioContent("vlBottom", "imgVerticalLocation", "bottom");
	selectatbleCheckBoxContent("blackWhiteCBId", "blackWhiteId");
	
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
	
	selectableRadioContent("dUseMyIcon", "dIconLib", "myIcon");
}

function swapAdvancedOptions(selectedValue) {
	if("1" === selectedValue) {
		$("#dualArrowSettings").hide();
		$("#singleArrowSettings").show();
	} else {
		$("#singleArrowSettings").hide();
		$("#dualArrowSettings").show();
	}
}

/**
 * ignoreSave: this parameter has been created for export import, as I'm using a radio button there.
 * @param {type} name
 * @param {type} val
 * @param {type} ignoreSave
 * @returns {Boolean}
 */
function isRightChangedEvent(name, val, ignoreSave) {
	var rightEvent = $('input:radio[name=' + name + ']:checked').val() === val;
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

function exportImportSettingsInits() {
	$("#exportImportBut").click(function() {
		// load in the export textarea
		$('#txtExportSettings').val(JSON.stringify(save_options(true)));
		
		toggleDialog("exportImportDialog");
		
		// by default export should be selected
		$('input:radio[name=eiRBG]').filter('[value=E]').attr('checked', true);
		$('input:radio[name=eiRBG]').change();
	});
	$('#eiSave').click(function() {
		var jsonSTR = $("#txtImportSettings").val().trim();
		if(0 === jsonSTR.length) {
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
		toggleDialog();
	});
	$('#txtExportSettings').click(function() {
		this.select();
	});
	
	$('input:radio[name=eiRBG]').change(function() {
		if(isRightChangedEvent("eiRBG", $(this).val(), true)) {
			var visibleProps = ".eiExport";
			var invisibleProps = ".eiImport";
			if('E' === $(this).val()) {
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
	toggleDialog("donateReviewDialog");
}

function donateReviewInits() {
	$("#donateReviewBut").click(function() {
		openSupportDialog();
	});
	
	$("#supportPromptCBId").change(function() {
		save_options();
	});
	selectatbleCheckBoxContent("supportPromptCBId", "supportPromptId");
}

function randomOpenSupportDialog() {
	setTimeout(function() {
		if(!$('#supportPromptCBId').is(':checked') && 0 === new Date().getTime() % 7) {
			openSupportDialog();
		}
	}, 10 * 1000);// 10 seconds delay
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
	if(!isNaN(value) && 0 !== value.length) {// should be a number and shouldn't be empty
		intVal = parseInt(value);
		intVal = intVal < 0 ? intVal * -1 : intVal;// B-positive :)
		intVal = intVal > 300 ? 300 : intVal;// not more than 300
	}
	t.val(intVal + "");// reset the value in the textbox
	
	save_options();// save these settings
}

function toggleDialog(dialogId) {
	if(dialogId) {
		globalDialogId = '#' + dialogId;
	}
	$('#maskDiv').fadeToggle("slow");
	$(globalDialogId).fadeToggle("slow");
}

function psInitJavascriptFunctions() {
	// is updated then show update dialog
	var updated = getParameterByName("updated");
	if("true" === updated) {
		$('#updateIframeId').load(function() {
			$('#updateLoadingId').fadeOut(300, function() {
				$('#updateLoadingId').remove();
			});
		});
		$('#updateIframeId').attr("src", 'http://pratikabu.users.sourceforge.net/extensions/scrolltotop/release-stt.html?v=' + addonVersion);
		
		toggleDialog("updateDialog");
	} else {
		randomOpenSupportDialog();
	}
	
	// add all icons
	addIcons();
	
	// add all events
	
	$( "#profileSelectorId" ).change(function() {
		errorToggle("profile_nameId");
		var selectedProfile = $("#profileSelectorId").val();
		if("new" === selectedProfile.toLowerCase()) {
			$("#profile_nameId").val("");
			$("#profile_url_patternId").val("");
		} else {
			for(var i = 0; i < globalSttData.sttArray.length; i++) {
			    var sttData = globalSttData.sttArray[i];
			    if(("default" === selectedProfile.toLowerCase() && sttData.default_setting) ||
			    		selectedProfile.toLowerCase() === sttData.profile_name.toLowerCase()) {
			    	restore_single_options(sttData);
			    	break;
			    }
			}
		}
		
		if("default" === selectedProfile.toLowerCase()) {
			$('#profilePatternTDID').css("vertical-align", "middle");
			$(".profile_def").show();
			$(".profile_cust").hide();
		} else {
			$('#profilePatternTDID').css("vertical-align", "baseline");
			$(".profile_cust").show();
			$(".profile_def").hide();
			$("#profile_nameId").focus();
		}
	});
	
	$( "#profile_nameId" ).focus(function() {
		errorToggle("profile_nameId");
	});
	
	$( "#profile_nameId" ).change(function() {
		$(this).val($(this).val().trim());
		save_options();
	});
	
	$( "#profile_url_patternId" ).change(function() {
		save_options();
	});
	
	$("#removeProfileId").click(function() {
		var selectProfileValue = $("#profileSelectorId").val();
		
		var removeIndex = -1;
		if("new" != selectProfileValue.toLowerCase()) {
			if(!confirm('Do you want to remove "' + selectProfileValue + '" profile?')) {
				return;
			}
			// remove the setting and save it
			removeIndex = getProfileIndexForValue(selectProfileValue);
			if(-1 != removeIndex) {
				globalSttData.sttArray.splice(removeIndex, 1);
			}
		}
		var selectObject = populateProfileSelector("Default");
		selectObject.change();
		if(-1 != removeIndex) {
			save_options();
		}
	});
	
	//document.querySelector('#saveSettings').addEventListener('click', save_options);
	$("#defaultBut").click(function() { restore_settings(); });
	$("#advSettingsBut").click(function() { activateAdvancedSettings(); });
	exportImportSettingsInits();
	donateReviewInits();
	
	// common settings starts
	$('input:radio[name=imgVerticalLocation]').change(function() { isRightChangedEvent("imgVerticalLocation", $(this).val()); });
	$('input:radio[name=imgHorizontalLocation]').change(function() { isRightChangedEvent("imgHorizontalLocation", $(this).val()); });
	$("#scrollSpeedSliderId").bind("slider:changed", function(event, data) {
		populateSliderSpeedOnText(data.value);
		var speedVal = 2400 - data.value;
		if(400 === speedVal) {
			speedVal = 0;
		}
		globalScrollSpeed = speedVal;
	});
	$("#scrollSpeedSliderId").bind("slider:postChangeComplete", function(event) {
		save_options();
	});
	$('input:radio[name=visbilityBehavior]').change(function() { isRightChangedEvent("visbilityBehavior", $(this).val()); });
	$("#transparencySliderId").bind("slider:changed", function(event, data) {
		updateTransparency(data.value);
		globalTransparency = data.value;
	});
	$("#transparencySliderId").bind("slider:postChangeComplete", function(event) {
		save_options();
	});
	$("#transparencyImgId").hover(
			function() {
				$("#transparencyImgId").stop(true, true).fadeTo(300, 1);
			},
			function() {
				$("#transparencyImgId").stop(true, true).fadeTo(300, globalTransparency);
			});
	$("#blackWhiteCBId").change(function() {
		updateBlackAndWhite();
		save_options();
	});
	$('.dialogCloseButton').click(function() {// dialog closing common script
		toggleDialog();
	});
	$('#maskDiv').click(function() {// dialog closing common script
		toggleDialog();
	});
	// common settings ends
	
	// arrow type settings starts
	$('input:radio[name=arrowType]').change(function() {
		if(isRightChangedEvent("arrowType", $(this).val(), true)) {// auto set location of the icon as per the selection
			swapAdvancedOptions($(this).val());
			
			$('input:radio[name=visbilityBehavior]').filter('[value=alwaysshow]').attr('checked', true);
			$('input:radio[name=imgHorizontalLocation]').filter('[value=right]').attr('checked', true);
			if("1" === $(this).val()) {
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
			if("true" === $(this).val()) {// auto set to visibility to autohide
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
		show_error_message("Error loading uploaded image.");
		$('input:radio[name=iconLib]').focus();
	});
	// single arrow settings ends
	
	// dual arrow changes starts
	$('input:radio[name=dIconLib]').change(function() {
		if(isRightChangedEvent("dIconLib", $(this).val(), true)) {
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
		show_error_message("Error loading uploaded image.");
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
	// what's new link
	$("#whatsNewId").append('<a target="_blank" href="http://pratikabu.users.sourceforge.net/extensions/scrolltotop/release.html?v=' + addonVersion + '" style="font-size: 12px;" title="See what&#39;s new and exciting.">What&#39;s New</a>');
	// latest version check
	$("#latestVersionCheckId").append('<a target="_blank" href="http://pratikabu.users.sourceforge.net/extensions/scrolltotop/latest.html?v=' + addonVersion + '" style="font-size: 12px;" title="See if any new version available.">Check Updates</a>');
	// give review link
	$(".reviewId").append('<a class="mybutton small green mylink" target="_blank" style="font-size: 12px;" href="' + bsReviewPageUrl() + '" title="Love Scroll To Top, give it a 5 star and leave your feedback.">Give Review</a>');
	
	$(".donateId").append('<a target="_blank" title="Show your support." href="http://pratikabu.users.sourceforge.net/extensions/scrolltotop/donate.php"><span class="donateButton">&nbsp;</span></a>');
}