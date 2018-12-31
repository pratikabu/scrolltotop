var ignoreImgLoad = true;
var dIgnoreImgLoad = true;
var globalScrollSpeed, globalTransparency;
var addonVersion = "4.8";
var globalDialogId;

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

/**
 * Saves options to localStorage.
 * @param returnValue
 * @returns data optionally returns data json object
 */
function save_options(returnValue) {
	var data = {
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
		removedSites: $('#removedSites').val(),
		
		supportPrompt: $('#supportPromptCBId').is(':checked')
	};
	
	if(!returnValue) {
		bsSaveSettings(data);
	} else {
		return data;
	}
}

/**
 * Restores select box state to saved value from localStorage.
 * @param data
 */
function restore_options(data) {
	ignoreImgLoad = true;// ignore the image load method as it will reset myIcon in the radio button
	dIgnoreImgLoad = true;// ignore the image load method as it will reset myIcon in the radio button
	
	$('input:radio[name=imgVerticalLocation]').filter('[value=' + data.vLoc + ']').prop('checked', true);
	$('input:radio[name=imgHorizontalLocation]').filter('[value=' + data.hLoc + ']').prop('checked', true);
	
	globalScrollSpeed = data.scrSpeed;// for future references
	loadValueInSpeedSlider(data.scrSpeed);
	$('input:radio[name=visbilityBehavior]').filter('[value=' + data.visibilityBehav + ']').prop('checked', true);
	globalTransparency = data.iconTransparency;
	loadValueInTransparencySlider(data.iconTransparency);
	$("#blackWhiteCBId").prop('checked', ("true" === data.blackAndWhite));
	updateBlackAndWhite();
	
	$('input:radio[name=arrowType]').filter('[value=' + data.arrowType + ']').prop('checked', true);
	swapAdvancedOptions(data.arrowType);
	
	$('input:radio[name=smartDirection]').filter('[value=' + data.smartDirection + ']').prop('checked', true);
	$('input:radio[name=controlOptions]').filter('[value=' + data.controlOption + ']').prop('checked', true);
	$('input:radio[name=autoHideControls]').filter('[value=' + data.hideControls + ']').prop('checked', true);
	$('input:radio[name=iconSize]').filter('[value=' + data.iconSize + ']').prop('checked', true);
	$('input:radio[name=iconLib]').filter('[value=' + data.iconLib + ']').prop('checked', true);
	$('#useMyIconTextBox').val(data.userIcon);
	$("#useMyIconTextBox").change();// load the image
	
	$('input:radio[name=dIconLib]').filter('[value=' + data.dIconLib + ']').prop('checked', true);
	$('#dUseMyIconTextBox').val(data.dUserIcon);
	$("#dUseMyIconTextBox").change();// load the image
	$('input:radio[name=dIconArrangemnt]').filter('[value=' + data.dArrang + ']').prop('checked', true);
	
	$('#hOffset').val(data.hOffset);
	$('#vOffset').val(data.vOffset);
	$('#removedSites').val(data.removedSites);
	
	$("#supportPromptCBId").prop('checked', "true" === data.supportPrompt ? true : false);
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
		$('input:radio[name=' + name + ']').filter('[value=' + value + ']').prop('checked', true);
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
		$(checkboxId).prop('checked', !isChecked(checkboxId));
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
		$('input:radio[name=eiRBG]').filter('[value=E]').prop('checked', true);
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
	randomOpenSupportDialog();
	
	// add all icons
	addIcons();
	
	// add all events
	
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
			
			$('input:radio[name=visbilityBehavior]').filter('[value=alwaysshow]').prop('checked', true);
			$('input:radio[name=imgHorizontalLocation]').filter('[value=right]').prop('checked', true);
			if("1" === $(this).val()) {
				$('input:radio[name=imgVerticalLocation]').filter('[value=bottom]').prop('checked', true);
			} else {
				$('input:radio[name=imgVerticalLocation]').filter('[value=middle]').prop('checked', true);
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
				$('input:radio[name=visbilityBehavior]').filter('[value=autohide]').prop('checked', true);
				save_options();
			}
		}
	});
	
	$("#useMyIconTextBox").change(function() {
		$('#useMyIconTextBox').val($('#useMyIconTextBox').val().trim());
		$('#previewIcon').attr('src', getBase64Url($('#useMyIconTextBox').val()));
	});
	$("#useMyIconTextBox").focus(function() {
		this.select();
		
		// Work around Chrome's little problem
		$("#useMyIconTextBox").mouseup(function() {
			// Prevent further mouseup intervention
			$("#useMyIconTextBox").unbind("mouseup");
			return false;
		});
	});
	
	$("#previewIcon").on('load', function() {
		if(ignoreImgLoad) {
			ignoreImgLoad = false;
		} else {
			$('input:radio[name=iconLib]').filter('[value=myIcon]').prop('checked', true);
			$('input:radio[name=iconLib]').change();
		}
	});
	$("#previewIcon").on("error", function() {
		show_error_message("Error loading uploaded image.");
		$('input:radio[name=iconLib]').focus();
	});
	// single arrow settings ends
	
	// dual arrow changes starts
	$('input:radio[name=dIconLib]').change(function() {
		if(isRightChangedEvent("dIconLib", $(this).val(), true)) {
			if(20 >= parseInt($(this).val())) {
				$('input:radio[name=dIconArrangemnt]').filter('[value=hr]').prop('checked', true);
			} else if(40 >= parseInt($(this).val())) {
				$('input:radio[name=dIconArrangemnt]').filter('[value=vr]').prop('checked', true);
			}
			save_options();
		}
	});
	
	$("#dUseMyIconTextBox").change(function() {
		$('#dUseMyIconTextBox').val($('#dUseMyIconTextBox').val().trim());
		$('#dPreviewIcon').attr('src', getBase64Url($('#dUseMyIconTextBox').val()));
	});
	$("#dUseMyIconTextBox").focus(function() {
		this.select();
		
		// Work around Chrome's little problem
		$("#dUseMyIconTextBox").mouseup(function() {
			// Prevent further mouseup intervention
			$("#dUseMyIconTextBox").unbind("mouseup");
			return false;
		});
	});
	
	$("#dPreviewIcon").on('load', function() {
		if(dIgnoreImgLoad) {
			dIgnoreImgLoad = false;
		} else {
			$('input:radio[name=dIconLib]').filter('[value=myIcon]').prop('checked', true);
			$('input:radio[name=dIconLib]').change();
		}
	});
	$("#dPreviewIcon").on("error", function() {
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
	bsFetchSettings();
	
	// place the version
	$(".addonVersionId").append(addonVersion);
	// what's new link
	$("#whatsNewId").append('<a target="_blank" href="http://pratikabu.users.sourceforge.net/extensions/scrolltotop/release.html?v=' + addonVersion + '" style="font-size: 12px;" title="See what&#39;s new and exciting.">Release Notes</a>');
	// give review link
	$(".reviewId").append('<a class="mybutton small green mylink" target="_blank" style="font-size: 12px;" href="' + bsReviewPageUrl() + '" title="Love Scroll To Top, give it a 5 star and leave your feedback.">Give Review</a>');
	
	$(".donateId").append('<a target="_blank" title="Show your support." href="http://pratikabu.users.sourceforge.net/extensions/scrolltotop/donate.php"><span class="donateButton">&nbsp;</span></a>');
}

function getBase64Url(base64Url) {
	if(base64Url.startsWith("data:")) {
		// return the URL as is
		return base64Url;
	}
	
	return "data:image/png;base64," + base64Url;
}