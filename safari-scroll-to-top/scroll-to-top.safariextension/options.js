var requestCount = 0;
var ignoreImgLoadEvent = true;
var dIgnoreImgLoadEvent = true;
var globalScrollSpeed;
var ignoreForDefaults = true;

// Saves options to localStorage.
function default_options() {
	ignoreForDefaults = true;
	safari.self.tab.dispatchMessage("resetSettings");
}

// Saves options to localStorage.
function save_options() {
	var data = {
		iconSize: $('input:radio[name=iconSize]:checked').val(),
		vLoc: $('input:radio[name=imgVerticalLocation]:checked').val(),
		hLoc: $('input:radio[name=imgHorizontalLocation]:checked').val(),
		scrSpeed: globalScrollSpeed,
		visibilityBehav: $('input:radio[name=visbilityBehavior]:checked').val(),
		controlOption: $('input:radio[name=controlOptions]:checked').val(),
		iconLib: $('input:radio[name=iconLib]:checked').val(),
		userIcon: $('#useMyIconTextBox').val(),
		arrowType: $('input:radio[name=arrowType]:checked').val(),
		dIconLib: $('input:radio[name=dIconLib]:checked').val(),
		dUserIcon: $('#dUseMyIconTextBox').val(),
		dArrang: $('input:radio[name=dIconArrangemnt]:checked').val()
	}
	safari.self.tab.dispatchMessage("saveSettings", data);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	ignoreImgLoadEvent = true;// ignore the image load method as it will reset myIcon in the radio button
	dIgnoreImgLoadEvent = true;// ignore the image load method as it will reset myIcon in the radio button
	
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
		
		$('input:radio[name=imgVerticalLocation]').filter('[value=' + data.vLoc + ']').attr('checked', true);
		$('input:radio[name=imgHorizontalLocation]').filter('[value=' + data.hLoc + ']').attr('checked', true);
		
		globalScrollSpeed = data.scrSpeed;// for future references
		initSlider(data.scrSpeed);
		$('input:radio[name=visbilityBehavior]').filter('[value=' + data.visibilityBehav + ']').attr('checked', true);
		
		$('input:radio[name=arrowType]').filter('[value=' + data.arrowType + ']').attr('checked', true);
		swapAdvancedOptions(data.arrowType);
		
		$('input:radio[name=controlOptions]').filter('[value=' + data.controlOption + ']').attr('checked', true);
		$('input:radio[name=iconSize]').filter('[value=' + data.iconSize + ']').attr('checked', true);
		$('input:radio[name=iconLib]').filter('[value=' + data.iconLib + ']').attr('checked', true);
		$('#useMyIconTextBox').val(data.userIcon);
		$("#useMyIconTextBox").change();// load the image
		
		$('input:radio[name=dIconLib]').filter('[value=' + data.dIconLib + ']').attr('checked', true);
		$('#dUseMyIconTextBox').val(data.dUserIcon);
		$("#dUseMyIconTextBox").change();// load the image
		$('input:radio[name=dIconArrangemnt]').filter('[value=' + data.dArrang + ']').attr('checked', true);
	} else if("saveCompleted" === theMessageEvent.name) {
		// Update status to let user know options were saved.
		show_message("Saved successfully.");
	}
}

safari.self.addEventListener("message", respondMessage, false);

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
	document.querySelector('#defaultBut').addEventListener('click', default_options);
	
	$('input:radio[name=imgVerticalLocation]').change(function() { isRightChangedEvent("imgVerticalLocation", $(this).val()); });
	$('input:radio[name=imgHorizontalLocation]').change(function() { isRightChangedEvent("imgHorizontalLocation", $(this).val()); });
	$('input:radio[name=iconSize]').change(function() { isRightChangedEvent("iconSize", $(this).val()); });
	$('input:radio[name=visbilityBehavior]').change(function() { isRightChangedEvent("visbilityBehavior", $(this).val()); });
	$('input:radio[name=controlOptions]').change(function() { isRightChangedEvent("controlOptions", $(this).val()); });
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
		if(ignoreImgLoadEvent) {
			ignoreImgLoadEvent = false;
		} else {
			$('input:radio[name=iconLib]').filter('[value=myIcon]').attr('checked', true);
			$('input:radio[name=iconLib]').change();
		}
	});
	$("#previewIcon").error(function() {
		show_message("Error loading uploaded image.");
		$('input:radio[name=iconLib]').focus();
	});
	
	// dual arrow changes
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
		if(dIgnoreImgLoadEvent) {
			dIgnoreImgLoadEvent = false;
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
	
	makeElementsSelactable();
	restore_options();
});