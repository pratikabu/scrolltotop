// Import the page-mod API
var pageMod = require("page-mod");
// Import the self API
var data = require("self").data;
// import the preferences
var sp = require("simple-prefs"); // to show the customize button
var tabs = require("tabs");// to open the options page
var ss = require("simple-storage"); // to store user specific settings

var checkForInitialize = function() {
	if(!ss.storage.icon_size) {
		ss.storage.icon_size = "48";
	}
	if(!ss.storage.vertical_location) {
		ss.storage.vertical_location = "bottom";
	}
	if(!ss.storage.horizontal_location) {
		ss.storage.horizontal_location = "right";
	}
	if(!ss.storage.scrolling_speed) {
		ss.storage.scrolling_speed = "1200";
	}
	if(!ss.storage.visibility_behavior) {
		ss.storage.visibility_behavior = "alwaysshow";
	}
	if(!ss.storage.control_options) {
		ss.storage.control_options = "pager";
	}
	if(!ss.storage.icon_library) {
		ss.storage.icon_library = "1";
	}
	if(!ss.storage.user_saved_icon) {
		ss.storage.user_saved_icon = "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";
	}
	if (!ss.storage.arrow_type) {
		ss.storage.arrow_type = "1";
	}
	
	if(ss.storage.toggle_pause) {
		delete ss.storage.toggle_pause;
	}
	if (!ss.storage.d_icon_library) {
		ss.storage.d_icon_library = "1";
	}
	if (!ss.storage.d_user_saved_icon) {
		ss.storage.d_user_saved_icon = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAMbElEQVR42tVYC3BU5RU+5967793s5r1JSMIjD16Rd5SXgKAySqGFjkWkI4hYlerY6UxnrLWODLa1Hd9QfDC+K1TQyhgriASBBAHlKSGEdwgQQpJNdrOP7N7H3/Pv3lu3lEfCAOKdfLN3s/+993znfOf851yEq3jsXPy0Wbhzpq+9I4AOm/2+EcUD/nmln4FXy/gDAyDNkpX9pv/dqik2q02MxWIzyvJ6f/yjIXBoIKy0CDCjraIO7HYnKIoytZ+3sOJHQeBAmXCfyLRljAEEP6tFh8MJsZg8mSKw9ronUNMfikWEHQKAa2sHsqL1e9DtSgGl4fjEQSPGV17XBKpLwOSRYLMIUI5056YYwNGFy6B4eDlkPvublSXL1v/iuiawtx8ukpD9nryPAt1ZFIAdzu2P8qKlULpwPhNOHp3XZ5fy1nVJYGd/cazE1EqSj0jGI32CmQioDPDIHXOgcPcGJjXWB+n70JLv4PB1RWBLCbitAuyREAq44RwUBbBIiQd0MvpmMoEoR0FhsK1Tg7GDakC5bghsL4V/mBBmSQnjGY+ATBVoW1hgt3k05NWIPM/oE1Var2jwTP8a+MN1QaC6rzjbzNR3yXiUdN0LAuCqTie8DelskdiIo2wx0FSSEz1P04BHQSHcUrYfNv+gBDYWQS/y/C7Sego3XiKliFSCvgMbvOIdCorJDK6AH54O7IZcQQOVjNdYnADIGtRTlIYMrYX2H4TA+4WAPUyw2Yow2kReJ+NRIuN9gsBeK52ELK8QJMnEOgIdmHF4Hzzm28VsXEJaQk5EAGMMPiAC9/wgBNb3gdHk9Sorz0+dgEwEVvQexToGj8SsrGyKhsgCROBUw0ko27GezQwfQ8YJaMAoChijoKiC1HN4jXLymhOoLIIXST6PUr+TkA5VnHXpRXB4/DTIzy8AjzuVCAgQDAbhzNmzUF93CKZs+xRGk2JUNR4FLiMqRfjYsFr28jUl8F4BiCSfetJ+noW8LknA9lnTcNOtsyC3Vy/mzcpGp9PFb84inZ3Y3NoCDQ0NrPVAHc7bVQE9BZlRFOKVirBpWC2Mu6YESD43k3y+IuPRRJ5vFSRWccvdmFraDzKzspkrJRVtZlOcQEyW0R+KQMvZRkYkUN35LTx8rJo5SXJUTiGWyO2C4Qfg9LUk8Ap5f4GFbFQpAqtLRrItAaSmzQEFPbxs/PTp+Mmbb4HZZmcOM2L5T2fBJ0ueZ02+IIb8frjDxtgs/yHERAR4VXqECCy+JgTeK4zL5wTtsjlUJWFz72HQOnIi7NmxH2wOO2SnumDijOnwEREQzDZw2yQYf9dsWLn4RQiEYxDwtULB4CEwZtNqGBc9G3c/VaONRGDCNSGwrlS8mTaujTYzsLqMPDzwswchLyuVbVlfhYLZAi6bmd1590z88PXXqDRZmcdhwdvvvhdW/P0lFo7KKIeDUDRmHGuqq8OfV30EfbQIJ6CQlPJH1sGZq05gTbHwilPUfu2zWVn1tIcwt99AyPS42IbVn6IiSGAVgf1k9mxc9caroAiWOIHJ98yFFUteotKJKGgylE2aTPlwAkM7d8DcfWvBSV1GhwoLxh2EpVeVwLO5IA6xQwNK4P2YpGMvGwQ98rzgIukc3F4NUb7FUs8wdNwE+PbLNaCiCHarGQaNnQBb135OO52J7w3gLR0AzS0+OHmyCTJq98CcztMQ1qDyy6Bw66LTfK++CgQyJcCX82Bcpgkq16Xlob9sAMsvyEW3xw2i3cOObq9Gs0ANpiqzvMHl2Lz3a2rakJltNswsGQTHv60mRdniz0vvO4Q1t0ewrfksNJ1qhPK679gtEFJqI1D4wAloitJOTcu6RKQrBPgaLDKD8KQXXjoiOh7amJGLGVlpzJOWiia7mzxtZQw1tGKM2mjGFI3RQIO876FGmlEHSkMCrzmCQDHRQFNk1haIoa+9AzrafaD429i8yBk8EVEW/K0J3ogwWgRxXJLEpQigDpF6HvOfc6By083TYjeMKR+d4nKBEg5DJMJ7TBG4YTaqOK6sTODtc9PRE/QfBIn664zCHsAJ+U6eBjneV2sQU1RwOK2gkawC1PDVfLrm32MObtcebwQ+dqo6WBK6TeC/xnPkSFDkECAfS/u7Hv3T4/wFFTu2dSPW7D9OPhYYMhVzslLhxmkz6FzDVYuXgCyYWAol8R1z5xJHE9vw5lIMKPx2tMGpDEeNHAxZfctAoJ7pdzMfHDFE67hxSwiWk+ujAPGBR71UJC5GQNB/p70WqOJTjwzgTMvMKHqtYvkavuDI1g2455vdYLNIVF8A3W4XjJ05jx7GsOWzF8Cb6WYN7Qxzb59PQ7LIPvzrU6iINj5zsqis4qQpkyG77w0QCYaCsydMnUQTTxvdtoMQgf8lccEoXIgAJhlvIli58YS0gnTLwGeWvfSOM7eYRkbqB5iaWIx0zicZyRa/snXtC5Cd7oRTfgG8k+5P3FQJc26UG3yiUUATTEBEIFBbFZ5//1P3kLwaaZlPJ0GLIXZOFFh3CIg6LAQHwUPImnVTyqzhsxY84C4exlKcLjRTz8P7foHcKgiUCzQP8OvPVDxHJVRiIXShd+J9oCoq00hadMTPY3IMo51RaG9vB3awkr3z+gfPbDsSrqJrmwhGJHgU5ItJCS9gvEFA0r2fQkgn5D57V+YfpeFzR4jevsxus6PJZIprmltGJCDxELIy2sFP6I8mZLMdyHo6+HzMIHHKkEchFAoCHqtiR7dVfL5kne89up7PBs0Evx6F6MWicCkChvbd3PtkSsGGJwqXhQbMdThcHvK8Ob6UGxWx54NsTtVvz+KS4jzi32gQ1rTEs62xM2COnIV4J0fXRWNRCDcfA9+u1cfnLD31F1pUTzijSylI6LxYLlyIgKAT4O616/LxEgqfnz/8hazyqRnU75NsTPHrrVobS89JR39KOZhEiYZ6IS4V/jA6aIzUuOaZLCuYF/gc6lq9NMGptIJyQY6CP+Bn+1YvO/TcmsZX6ZpjhFOEFkJAJxDTI6B1l4ARAXIt5BB6L3p44pNFA8p6iTQDKJqGnZ0yWJiP5ZQMRCy8DRzUQktU/AU05ARxArFYjLUHAuhu+AB218nM4bCihfpx/g5JURVW+cVX+15fvXsFrecvvRoIZ3UZRS6WBxcjIOgE7DqBfMKAX92Wf69fsdhIx2ZVYxZZ0awjiy2OkfmSFRSEFKdE46UQ37gSIaAnq5yABv6gDKnUk7xaGYy1hZlMI6dMhUs2iYLSGWw/verr5i/oklrCUT2ZDQLdjoCRA6akCPQhlM8YYp/+r92RABHgHuEVyjX/9szcUTmYEuqIYZpLFCI0pfBeAvWnabT70vTGfB0q613swSc+bPLvre8M6fLQvCmiVJQp+auORHkV2kk4SGjUCXTqEegyAUiKgFGFPDqBm27IM0840CRjTGEhnaT7tzNy+/QxxzyxqIIZZExYJ6AnAW9QwU7p0hJQ1fyeKfDyOp9vc02QJymvMEIPj2RTGWtp9Kvf0PfthDo9kY1SqkA3qtD58sBFyCX0J/SFRFkFXV5ZC+cUDk4JdnhMIhPTnKIpyAnwAOgh4BXIQa4gAkpGthOW7wg1VWxr4zoPwvfVpZWwn7CXcFz/HoLL2AeSZSTA9zsxL6XZkEjmVJ1EFs+NxY/0GZ8X9WfYbYJot5Kw+U4gQJxBPAIaDWdUjTrCqmp12fD9XZETb3/RvF/3sl8nwg0+AYkEbu6K9y9G4NwoGCQcOhEuqUxIJHbp+4+XTO0V9Wc6HKJgsQpIkxfo/o8nMd/EJNrrwhHKZhqkl9eqR59beapa9/Rp3XifjnboQv3vCgEjF5ITmietTfd+BqEnYfDCaanTM2yYarMKkkVCsVNNlE+eBSw+nDDmNKHQFqJ6SXvatgal/q2qwJeQqDjc4y16JLhkjB7IkM5lt9PnSsloLYzSyqNQSBj6y5scUzJcols0CaBvYIKxC9PVJCA+AmjcDIHGNGHXKbl+/f7Ievq1BhKbVrtuvLFpGbK55FDT5YnsPCQcuoyKCUW6tJJLsFFFjQQE/VpBlwyvNMd07xvGG16/pOe7QyCZRHKTZ9JJpEGi0XPo/zd+F/Rrkz2J+jlPUJ6oPt348w0wV2wmPne9sUcYhlqSICWRMAgYxhhEVN1gY2iR4f8rTZffTFzOq8XkaBhEjE0v+XvyvZNJqOcgOULdeqVyuQTORySZEF7gvsnePdfb3Tb8ShA43z0uZHwyifN9XpGHX+njQlG4osd/AAHSeXwT8bWrAAAAAElFTkSuQmCC";
	}
	if(!ss.storage.d_arrangement) {
		ss.storage.d_arrangement = "hr";
	}
};

// initialize settings
checkForInitialize();

var forceInitializeSettings = function() {
	delete ss.storage.icon_size;
	delete ss.storage.vertical_location;
	delete ss.storage.horizontal_location;
	delete ss.storage.scrolling_speed;
	delete ss.storage.visibility_behavior;
	delete ss.storage.control_options;
	delete ss.storage.icon_library;
	delete ss.storage.user_saved_icon;
	delete ss.storage.arrow_type;
	
	delete ss.storage.d_icon_library;
	delete ss.storage.d_user_saved_icon;
	delete ss.storage.d_arrangement;
	
	checkForInitialize();
};

// Create a page mod
// The script replaces the page contents with a message
pageMod.PageMod({
    include: "*", // for all pages, as it will give the scrolling for all pages
	attachTo: ["existing", "top"],
    contentStyleFile: data.url("pratikabu-stt.css"),
    contentScriptFile: [data.url("jquery-1.8.2.pratikabu.js"), data.url("jQueryRotate.js"),
        data.url("pratikabustt-browser-impl.js"), data.url("pratikabu-stt.js")],
	contentScriptWhen: "ready",
    onAttach: function onAttach(worker) {// attaching the worker so as to do the communication with contentscript file
		worker.port.on('getPrefs', function() {
			worker.port.emit("prefsValue", {// send the image url, bottom preference and the left preference
				iconSize: ss.storage.icon_size,
				vLoc: ss.storage.vertical_location,
				hLoc: ss.storage.horizontal_location,
				scrSpeed: ss.storage.scrolling_speed,
				visibilityBehav: ss.storage.visibility_behavior,
				controlOption: ss.storage.control_options,
				iconLib: ss.storage.icon_library,
				userIcon: ss.storage.user_saved_icon,
				arrowType: ss.storage.arrow_type,
				dUserIcon: ss.storage.d_user_saved_icon,
				dIconLib: ss.storage.d_icon_library,
				dArrang: ss.storage.d_arrangement
			});
		});
		
		worker.port.on('optionPage', function() {
			openOptioinPage();
		});
    }
});

var openOptioinPage = function(updated) {
	// don't open the option page if it is already open
	var optionPageUrl = data.url("options.html");
	for each (var openTab in tabs) {
		if(openTab.url.toLowerCase().indexOf(optionPageUrl.toLowerCase()) != -1) {
			// page is already open
			openTab.activate();
			return;
		}
	}
	
	if(updated) {
		updated = "?updated=true";
	} else {
		updated = "";
	}
    tabs.open({
		url: data.url("options.html" + updated),
		onReady: runScript
	});
	function runScript(tab) {
		tabWorker = tab.attach({
			contentScriptFile: [data.url("jquery-1.8.2.pratikabu.js"), data.url("pratikabustt-slider.js"), data.url("options.js")]
		});
		
		tabWorker.port.on('getPrefs', function() {
			tabWorker.port.emit("prefsValue", {// send the image url, bottom preference and the left preference
				iconSize: ss.storage.icon_size,
				vLoc: ss.storage.vertical_location,
				hLoc: ss.storage.horizontal_location,
				scrSpeed: ss.storage.scrolling_speed,
				visibilityBehav: ss.storage.visibility_behavior,
				controlOption: ss.storage.control_options,
				iconLib: ss.storage.icon_library,
				userIcon: ss.storage.user_saved_icon,
				arrowType: ss.storage.arrow_type,
				dUserIcon: ss.storage.d_user_saved_icon,
				dIconLib: ss.storage.d_icon_library,
				dArrang: ss.storage.d_arrangement
			});
		});
		
		tabWorker.port.on('setPrefs', function(data) {
			ss.storage.icon_size = data.iconSize;
			ss.storage.vertical_location = data.vLoc;
			ss.storage.horizontal_location = data.hLoc;
			ss.storage.scrolling_speed = data.scrSpeed;
			ss.storage.visibility_behavior = data.visibilityBehav;
			ss.storage.control_options = data.controlOption;
			ss.storage.icon_library = data.iconLib;
			ss.storage.user_saved_icon = data.userIcon;
			ss.storage.arrow_type = data.arrowType;
			ss.storage.d_user_saved_icon = data.dUserIcon;
			ss.storage.d_icon_library = data.dIconLib;
			ss.storage.d_arrangement = data.dArrang;
			
			tabWorker.port.emit("saveStatus", {// send the status of the step
				status: "Saved perfectly."
			});
		});
		
		tabWorker.port.on('resetPrefs', function() {
			forceInitializeSettings();
			
			tabWorker.port.emit("resetStatus", {// send the status of the step
				status: "Saved perfectly."
			});
		});
	}
};

sp.on("myButtonPref", openOptioinPage);

// open option page on initial in this version
var currentVersion = 5;// this variable should be incremented with every update so that, add-on update message can be shown
if(!ss.storage.versionInfo || currentVersion > ss.storage.versionInfo) {
	ss.storage.versionInfo = currentVersion;
	openOptioinPage("updated");
}