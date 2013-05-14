// ==UserScript==
// @name ScrollToTop
// @version 4.2
// @description Scroll to top and vice versa in a window.
// @author Pratik Soni
// @include *
// ==/UserScript==

var pratikabusttjquery;

window.addEventListener('DOMContentLoaded', function() {
	if(window != window.top) {// return if its an internal frame
		return;
	}
	
	if(!window.jQuery) {// load only if its required as it is giving problem on many pages.
		function addLibrary(path) {
			// Get the library resource
			var fileObj = opera.extension.getFile(path);
			if (fileObj) {
				// Read out the File object as a Data URI:
				var fr = new FileReader();
				fr.onload = function() {                
					eval(fr.result);
					pratikabusttjquery = window.jQuery.noConflict(true);
					callOnceLoaded();
				};
				fr.readAsText(fileObj);
			}
		}

		addLibrary("/jquery-1.8.2.pratikabu.js");
	} else {
		pratikabusttjquery = window.jQuery;
		callOnceLoaded();
	}
}, false);

function callOnceLoaded() {
	/* VERSION: 2.2 LAST UPDATE: 13.03.2012 Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009 */
	(function(j){for(var d,k=document.getElementsByTagName("head")[0].style,h=["transformProperty","WebkitTransform","OTransform","msTransform","MozTransform"],g=0;g<h.length;g++)void 0!==k[h[g]]&&(d=h[g]);var i="v"=="\v";pratikabusttjquery.fn.extend({rotate:function(a){if(!(0===this.length||"undefined"==typeof a)){"number"==typeof a&&(a={angle:a});for(var b=[],c=0,f=this.length;c<f;c++){var e=this.get(c);if(!e.Wilq32||!e.Wilq32.PhotoEffect){var d=j.extend(!0,{},a),e=(new Wilq32.PhotoEffect(e,d))._rootObj; b.push(j(e))}else e.Wilq32.PhotoEffect._handleRotation(a)}return b}},getRotateAngle:function(){for(var a=[],b=0,c=this.length;b<c;b++){var f=this.get(b);f.Wilq32&&f.Wilq32.PhotoEffect&&(a[b]=f.Wilq32.PhotoEffect._angle)}return a},stopRotate:function(){for(var a=0,b=this.length;a<b;a++){var c=this.get(a);c.Wilq32&&c.Wilq32.PhotoEffect&&clearTimeout(c.Wilq32.PhotoEffect._timer)}}});Wilq32=window.Wilq32||{};Wilq32.PhotoEffect=function(){return d?function(a,b){a.Wilq32={PhotoEffect:this};this._img=this._rootObj= this._eventObj=a;this._handleRotation(b)}:function(a,b){this._img=a;this._rootObj=document.createElement("span");this._rootObj.style.display="inline-block";this._rootObj.Wilq32={PhotoEffect:this};a.parentNode.insertBefore(this._rootObj,a);if(a.complete)this._Loader(b);else{var c=this;pratikabusttjquery(this._img).bind("load",function(){c._Loader(b)})}}}();Wilq32.PhotoEffect.prototype={_setupParameters:function(a){this._parameters=this._parameters||{};"number"!==typeof this._angle&&(this._angle=0);"number"=== typeof a.angle&&(this._angle=a.angle);this._parameters.animateTo="number"===typeof a.animateTo?a.animateTo:this._angle;this._parameters.step=a.step||this._parameters.step||null;this._parameters.easing=a.easing||this._parameters.easing||function(a,c,f,e,d){return-e*((c=c/d-1)*c*c*c-1)+f};this._parameters.duration=a.duration||this._parameters.duration||1E3;this._parameters.callback=a.callback||this._parameters.callback||function(){};a.bind&&a.bind!=this._parameters.bind&&this._BindEvents(a.bind)},_handleRotation:function(a){this._setupParameters(a); this._angle==this._parameters.animateTo?this._rotate(this._angle):this._animateStart()},_BindEvents:function(a){if(a&&this._eventObj){if(this._parameters.bind){var b=this._parameters.bind,c;for(c in b)b.hasOwnProperty(c)&&pratikabusttjquery(this._eventObj).unbind(c,b[c])}this._parameters.bind=a;for(c in a)a.hasOwnProperty(c)&&pratikabusttjquery(this._eventObj).bind(c,a[c])}},_Loader:function(){return i?function(a){var b=this._img.width,c=this._img.height;this._img.parentNode.removeChild(this._img);this._vimage=this.createVMLNode("image"); this._vimage.src=this._img.src;this._vimage.style.height=c+"px";this._vimage.style.width=b+"px";this._vimage.style.position="absolute";this._vimage.style.top="0px";this._vimage.style.left="0px";this._container=this.createVMLNode("group");this._container.style.width=b;this._container.style.height=c;this._container.style.position="absolute";this._container.setAttribute("coordsize",b-1+","+(c-1));this._container.appendChild(this._vimage);this._rootObj.appendChild(this._container);this._rootObj.style.position= "relative";this._rootObj.style.width=b+"px";this._rootObj.style.height=c+"px";this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._eventObj=this._rootObj;this._handleRotation(a)}:function(a){this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._width=this._img.width;this._height=this._img.height;this._widthHalf=this._width/2;this._heightHalf=this._height/2;var b=Math.sqrt(this._height* this._height+this._width*this._width);this._widthAdd=b-this._width;this._heightAdd=b-this._height;this._widthAddHalf=this._widthAdd/2;this._heightAddHalf=this._heightAdd/2;this._img.parentNode.removeChild(this._img);this._aspectW=(parseInt(this._img.style.width,10)||this._width)/this._img.width;this._aspectH=(parseInt(this._img.style.height,10)||this._height)/this._img.height;this._canvas=document.createElement("canvas");this._canvas.setAttribute("width",this._width);this._canvas.style.position="relative"; this._canvas.style.left=-this._widthAddHalf+"px";this._canvas.style.top=-this._heightAddHalf+"px";this._canvas.Wilq32=this._rootObj.Wilq32;this._rootObj.appendChild(this._canvas);this._rootObj.style.width=this._width+"px";this._rootObj.style.height=this._height+"px";this._eventObj=this._canvas;this._cnv=this._canvas.getContext("2d");this._handleRotation(a)}}(),_animateStart:function(){this._timer&&clearTimeout(this._timer);this._animateStartTime=+new Date;this._animateStartAngle=this._angle;this._animate()}, _animate:function(){var a=+new Date,b=a-this._animateStartTime>this._parameters.duration;if(b&&!this._parameters.animatedGif)clearTimeout(this._timer);else{(this._canvas||this._vimage||this._img)&&this._rotate(~~(10*this._parameters.easing(0,a-this._animateStartTime,this._animateStartAngle,this._parameters.animateTo-this._animateStartAngle,this._parameters.duration))/10);this._parameters.step&&this._parameters.step(this._angle);var c=this;this._timer=setTimeout(function(){c._animate.call(c)},10)}this._parameters.callback&& b&&(this._angle=this._parameters.animateTo,this._rotate(this._angle),this._parameters.callback.call(this._rootObj))},_rotate:function(){var a=Math.PI/180;return i?function(a){this._angle=a;this._container.style.rotation=a%360+"deg"}:d?function(a){this._angle=a;this._img.style[d]="rotate("+a%360+"deg)"}:function(b){this._angle=b;b=b%360*a;this._canvas.width=this._width+this._widthAdd;this._canvas.height=this._height+this._heightAdd;this._cnv.translate(this._widthAddHalf,this._heightAddHalf);this._cnv.translate(this._widthHalf, this._heightHalf);this._cnv.rotate(b);this._cnv.translate(-this._widthHalf,-this._heightHalf);this._cnv.scale(this._aspectW,this._aspectH);this._cnv.drawImage(this._img,0,0)}}()};i&&(Wilq32.PhotoEffect.prototype.createVMLNode=function(){document.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{return!document.namespaces.rvml&&document.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),function(a){return document.createElement("<rvml:"+a+' class="rvml">')}}catch(a){return function(a){return document.createElement("<"+ a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}}())})(pratikabusttjquery);

	var style3 = document.createElement('style');
	style3.type = 'text/css';
	style3.innerHTML = '#pratikabuSTTDiv { background: none !important; z-index: 2147483647 !important; position: fixed !important; display: none; padding: 0px !important; margin: 0px !important; line-height: 0 !important; }';
	document.getElementsByTagName('head')[0].appendChild(style3);

	var style2 = document.createElement('style');
	style2.type = 'text/css';
	style2.innerHTML = '#pratikabuSTTDiv2 { background: none !important; z-index: 2147483647 !important; position: fixed !important; display: none; padding: 0px !important; margin-top: 0px !important; margin-bottom: 0px !important; margin-right: 0px !important; margin-left: 0px; line-height: 0 !important; width: 48px; }';
	document.getElementsByTagName('head')[0].appendChild(style2);

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '.pratikabuSTTImg { padding: 0px !important; margin: 0px !important; border: 0px !important; }';
	document.getElementsByTagName('head')[0].appendChild(style);

	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '.otherDiv { background: none !important; display: block; padding: 0px !important; margin: 0px !important; line-height: 0 !important; }';
	document.getElementsByTagName('head')[0].appendChild(style);
	
	/*****************************************
	************** This file contains code which is browser specific ****************
	************** Write browser dependent code in here *********
	******************************************/
	var pratikabustt_browser_impl = {
		
		getFixedLocation : function() {
			// #BrowserSpecific location
			return "pratikabu-stt-";
		},
		
		fetchPreferences: function() {
			// #BrowserSpecific method call
			// write the logic to set the location
			opera.extension.postMessage({requestFor: "getPrefs"});
		},
		
		loadFromPreference: function(data) {
			// #BrowserSpecific this method is somewhat browser specific
			if(!data) {
				return;
			}
			pratikabustt.loadFromResponse(pratikabustt_browser_impl.convertResponse(data));
		},
		
		getBrowserSpecificUrl: function(imgUrl) {
			return "/icons/" + imgUrl;
		},
		
		convertResponse: function(rawResponse) {
			// #BrowserSpecific method to convert response to single known format
			return rawResponse;
		},
		
		openOptionPage: function() {
			// #BrowserSpecific method to open the option page
			opera.extension.postMessage({requestFor: "optionPage"});
		},
		
		setImageForId: function(imgId, imageName) {
			// Get the image resource
			var imgFile = opera.extension.getFile(
				pratikabustt_browser_impl.getBrowserSpecificUrl(
					pratikabustt_browser_impl.getFixedLocation() + imageName));

			// Read out the File object as a Data URI
			var fr = new FileReader();
			fr.onload = function(event) {
				pratikabusttjquery("#" + imgId).attr("src", event.target.result);
			};
			fr.readAsDataURL(imgFile);
		},
		
		/**
			Remove all excess code required for 
		*/
		removeCompleteAddOnCode: function() {
		}
	};

	/**********
		OPERA index.html and injectedScript messaging
	***********/
	opera.extension.onmessage = function(event) {
		var responseFor = event.data.responseFor;
		if("getPrefs" == responseFor) {
			pratikabustt_browser_impl.loadFromPreference(event.data);
		} else if("" == responseFor) {
			event.source.postMessage(data);
		}
	}

	/*****************************************
	************** This file contains code which is browser independent ****************
	************** Write browser dependent code in the specific browser dependent js file. *********
	******************************************/
	var pratikabu_stt_inversionPoint = 300;// inversion point where the inversion should happen
	var pratikabu_stt_bVisibility = false;// variable to check whether the button is already visible or hidden
	var pratikabu_stt_fadeSpeed = 300;
	var pratikabu_stt_hoverOpacity = 1;
	var pratikabu_stt_otherDefaultFade = 0.35;
	var pratikabu_stt_prefs;// this variable holds the preferences
	var pratikabu_stt_dualArrow = false;
	var pratikabu_stt_flipScrolling = false;
	var pratikabu_stt_scrollingInProgress = false;
	var pratikabu_stt_lastDocumentTop = 0;// this variable will hold the document top since the last scroll, for smart direction based
	var pratikabu_stt_autoHide = false;
	var pratikabu_stt_ahRequestCount = 0;// counter to handle autohide in seconds

	var pratikabustt = {
		scrollHandlerOneTime: function() {
			if(pratikabusttjquery(document).scrollTop() > pratikabu_stt_inversionPoint) {// terminating condition for this handler
				pratikabusttjquery(window).unbind('scroll', pratikabustt.scrollHandlerOneTime);
				pratikabustt.showHideAddon(true);
			}
		},
		
		scrollHandlerHideAtTop: function () {
			pratikabustt.showHideAddon(pratikabusttjquery(document).scrollTop() > pratikabu_stt_inversionPoint);
		},
		
		windowResizeHandlerHideAtTop: function() {
			// hide or show the button based on the current location, because a page can be loaded scrolled..
			pratikabustt.scrollHandlerHideAtTop();
		},
		
		smartDirectionLogic: function(animateRotation) {
			if(pratikabu_stt_lastDocumentTop == pratikabusttjquery(document).scrollTop()) {
				// do nothing
			} else if(pratikabu_stt_lastDocumentTop > pratikabusttjquery(document).scrollTop()) {// user scrolled upwards
				pratikabustt.rotateUp();
			} else {// user scrolled downwards
				pratikabustt.rotateDown(animateRotation);
			}
			
			pratikabu_stt_lastDocumentTop = pratikabusttjquery(document).scrollTop();// update to latest
			
			// finally once the scrolling is finished, rotate addon if needed
			if(0 == pratikabu_stt_lastDocumentTop) {
				pratikabustt.rotateDown(true);
			} else if(pratikabu_stt_lastDocumentTop >= (pratikabusttjquery(document).height() - pratikabustt.getWindowHeight())) {
				pratikabustt.rotateUp();
			}
		},
		
		scrollHandlerAutoHide: function() {
			var animateRotation = pratikabu_stt_bVisibility;
			pratikabustt.showHideAddon(true);
			// handle the rotation for normal scenario, make it to behave like alwaysshow
			if(pratikabu_stt_prefs.smartDirection) {
				pratikabustt.smartDirectionLogic(animateRotation);
			} else if(!pratikabu_stt_dualArrow && !pratikabu_stt_prefs.smartDirection) {
				pratikabustt.scrollRotationHandler();
			}
		},
		
		scrollRotationHandler: function() {
			if(pratikabu_stt_inversionPoint > pratikabusttjquery(document).scrollTop()) {// you are at the top rotate arrows to original state
				pratikabustt.rotateDown(true);
			} else {
				pratikabustt.rotateUp();
			}
		},
		
		rotateDown: function(animateRotation) {
			pratikabu_stt_flipScrolling = true;
			if(animateRotation) {
				pratikabusttjquery("#pratikabuSTTArrowUp").rotate({ animateTo: 180 });
			} else {
				pratikabusttjquery("#pratikabuSTTArrowUp").rotate(180);
			}
		},
		
		rotateUp: function() {
			pratikabu_stt_flipScrolling = false;
			pratikabusttjquery("#pratikabuSTTArrowUp").rotate({ animateTo: 0 });
		},
		
		createAddonHtml: function() {
			if(pratikabu_stt_dualArrow) {
				// create div tag
				if("hr" == pratikabu_stt_prefs.dArrang) {
					pratikabusttjquery('body').prepend('<div id="pratikabuSTTDiv"><img id="pratikabuSTTArrowUp" /><img id="pratikabuSTTArrowDown" /></div>');
				} else if("vr" == pratikabu_stt_prefs.dArrang) {
					pratikabusttjquery('body').prepend('<div id="pratikabuSTTDiv"><img id="pratikabuSTTArrowUp" style="display: block !important;" /><img id="pratikabuSTTArrowDown" style="display: block !important;" /></div>');
				}
			} else {
				// create div tag
				pratikabusttjquery('body').prepend('<div id="pratikabuSTTDiv"><img id="pratikabuSTTArrowUp" style="float: left;" /><div id="pratikabuSTTDiv2"><img id="pratikabuSTTPageUp" /><img id="pratikabuSTTClear" /><img id="pratikabuSTTPageDown" /><img id="pratikabuSTTSettings" /></div></div>');
			}
			
			// check whether the css has been applied to the div tag or not, if not then remove it from DOM
			// as it got added to a wrong iFrame
			if("fixed" != pratikabusttjquery("#pratikabuSTTDiv").css("position")) {
				pratikabustt.removeCompleteAddonFromPage();
				return false;
			}
			
			if(pratikabu_stt_dualArrow) {
				pratikabustt.hoverEffect("#pratikabuSTTArrowUp", pratikabu_stt_otherDefaultFade);
				pratikabustt.hoverEffect("#pratikabuSTTArrowDown", pratikabu_stt_otherDefaultFade);
			} else {
				pratikabustt.hoverEffect("#pratikabuSTTArrowUp", 0.5);
				pratikabustt.hoverEffect("#pratikabuSTTClear", pratikabu_stt_otherDefaultFade);
				pratikabustt.hoverEffect("#pratikabuSTTSettings", pratikabu_stt_otherDefaultFade);
				pratikabustt.hoverEffect("#pratikabuSTTPageUp", pratikabu_stt_otherDefaultFade);
				pratikabustt.hoverEffect("#pratikabuSTTPageDown", pratikabu_stt_otherDefaultFade);
			}
			// add the main div hover effects
			pratikabusttjquery("#pratikabuSTTDiv").hover(
				function() { pratikabustt.mainDivHover(true) },
				function() { pratikabustt.mainDivHover(false) });
			
			// add the scroll up logic
			pratikabusttjquery("#pratikabuSTTArrowUp").click(function() {
				if(pratikabu_stt_flipScrolling) {
					pratikabustt.scrollToBottom();
				} else {
					pratikabustt.scrollToTop();
				}
				return false;
			});
			if(pratikabu_stt_dualArrow) {
				// add the scroll down logic
				pratikabusttjquery("#pratikabuSTTArrowDown").click(function() {
					pratikabustt.scrollToBottom();
					return false;
				});
			} else {
				// add the scroll down logic
				pratikabusttjquery("#pratikabuSTTSettings").click(function() {
					pratikabustt_browser_impl.openOptionPage();
					return false;
				});
				
				// add rotation for scrolling down
				pratikabusttjquery("#pratikabuSTTSettings").hover(
					function() { pratikabusttjquery(this).rotate({ animateTo: 180 }); },
					function() { pratikabusttjquery(this).rotate({ animateTo: 0 }); });
				
				// add the remove div logic
				pratikabusttjquery("#pratikabuSTTClear").click(function() {
					pratikabustt.removeCompleteAddonFromPage();
				});
				
				// add page up and page down handlers
				pratikabusttjquery("#pratikabuSTTPageUp").click(function() { pratikabustt.scrollPageScreen(1); });
				pratikabusttjquery("#pratikabuSTTPageDown").click(function() { pratikabustt.scrollPageScreen(-1); });
			}
			
			// populate from preferences
			var vloc = pratikabu_stt_prefs.vLoc;
			var vlocVal = pratikabu_stt_prefs.vOffset + "px";
			var hloc = pratikabu_stt_prefs.hLoc;
			var hlocVal = pratikabu_stt_prefs.hOffset + "px";
			
			if("middle" == vloc) {
				vloc = "top";
				vlocVal = "50%";
			}
			
			if("middle" == hloc) {
				hloc = "left";
				hlocVal = "50%";
			}
			
			pratikabusttjquery("#pratikabuSTTDiv").css(vloc, vlocVal);// set the vertical alignment of the image
			pratikabusttjquery("#pratikabuSTTDiv").css(hloc, hlocVal);// set the horizontal alignment of the image
			
			// set the image
			if(pratikabu_stt_dualArrow) {
				pratikabustt.showDualArrowImage();
			} else {
				pratikabustt.showUpArrowImage();
			}
			
			if(!pratikabu_stt_dualArrow) {
				var otherImagesSize = pratikabustt.getOtherImageSize();
				
				var showPagerButtons = false;
				if("pager" == pratikabu_stt_prefs.controlOption) {
					if(pratikabusttjquery(document).height() != pratikabustt.getWindowHeight()) {
						showPagerButtons = true;
					} else {
						pratikabu_stt_prefs.controlOption = "simple";// set the control option to simple
					}
				}
				
				var divSize = otherImagesSize;
				if(showPagerButtons) {// check whether the page up is shown or not
					divSize += otherImagesSize;// add pixels based on the settings
				}
				pratikabusttjquery("#pratikabuSTTDiv2").css("width", divSize + "px");
				
				pratikabustt_browser_impl.setImageForId("pratikabuSTTClear", "clear-" + otherImagesSize + ".png");
				pratikabustt_browser_impl.setImageForId("pratikabuSTTSettings", "settings-" + otherImagesSize + ".png");
				
				// show/remove page up and page down buttons from settings
				if(showPagerButtons) {
					pratikabustt_browser_impl.setImageForId("pratikabuSTTPageUp", "pageup-" + otherImagesSize + ".png");
					pratikabustt_browser_impl.setImageForId("pratikabuSTTPageDown", "pageup-" + otherImagesSize + ".png");
					pratikabusttjquery("#pratikabuSTTPageDown").rotate(180);
				} else {
					pratikabusttjquery("#pratikabuSTTPageUp").remove();
					pratikabusttjquery("#pratikabuSTTPageDown").remove();
				}
				
				// change the location of the main image
				var pratikabu_stt_float = pratikabu_stt_prefs.hLoc;
				if("right" == pratikabu_stt_prefs.hLoc) {// replace the locations of the icons
					if(showPagerButtons) {
						pratikabusttjquery("#pratikabuSTTPageUp").before(pratikabusttjquery("#pratikabuSTTClear"));
						pratikabusttjquery("#pratikabuSTTPageDown").before(pratikabusttjquery("#pratikabuSTTSettings"));
					}
					pratikabusttjquery("#pratikabuSTTDiv2").css("marginLeft", 0 + "px");
				} else {
					pratikabusttjquery("#pratikabuSTTDiv2").css("marginLeft", pratikabu_stt_prefs.iconSize + "px");
				}
				
				pratikabusttjquery("#pratikabuSTTArrowUp").css("float", pratikabu_stt_float);
				pratikabusttjquery("#pratikabuSTTArrowUp").css("width", pratikabu_stt_prefs.iconSize + "px");
				pratikabusttjquery("#pratikabuSTTArrowUp").css("height", pratikabu_stt_prefs.iconSize + "px");
				
				if(!pratikabu_stt_prefs.hideControls) {
					pratikabustt.showHideControlOptions(true);
				}
			}
			
			return true;
		},
		
		showHideAddon: function(boolShowAddon) {
			if(boolShowAddon != pratikabu_stt_bVisibility) {
				if(boolShowAddon) {// show addon
					if(pratikabustt.createAddonHtml()) {
						pratikabusttjquery("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 1);
					}
				} else {// remove it
					pratikabustt.removeAddonHtml();
				}
			}
			if(boolShowAddon) {
				pratikabustt.triggerAutoHide();
			}
			pratikabu_stt_bVisibility = boolShowAddon;// set the latest value
		},
		
		triggerAutoHide: function() {
			if(!pratikabu_stt_autoHide) {
				return;
			}
			
			pratikabu_stt_ahRequestCount++;
			setTimeout(function() {
				if(0 == --pratikabu_stt_ahRequestCount) {
					pratikabustt.showHideAddon(false);
				}
			}, 5000);
		},
		
		removeAddonHtml: function() {
			pratikabusttjquery("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {
				pratikabusttjquery("#pratikabuSTTDiv").remove();
			});
		},
		
		scrollToTop: function() {
			if(0 == pratikabusttjquery(document).scrollTop()) {
				return false;
			}
			
			pratikabustt.scrollPageTo(pratikabu_stt_prefs.scrSpeed, 0);
		},
		
		scrollToBottom: function() {
			var location = (pratikabusttjquery(document).height() - pratikabustt.getWindowHeight());
			if(0 == location) {// this should never happen, but it gives this result on some pages
				location = pratikabusttjquery(document).height();
			}
			pratikabustt.scrollPageTo(pratikabu_stt_prefs.scrSpeed, location);
		},
		
		scrollPageTo: function(delay, location, isPager) {
			if(!isPager && pratikabu_stt_scrollingInProgress) {// pause any scroll when scrolling is in progress
				pratikabusttjquery("html, body").stop();
				pratikabu_stt_scrollingInProgress = false;
				return;
			}
			
			pratikabu_stt_scrollingInProgress = true;
			
			pratikabusttjquery("html, body").stop(true, true).animate({ scrollTop: location }, delay, function() {
				pratikabu_stt_scrollingInProgress = false;
			});
		},
		
		scrollPageScreen: function(direction) {
			var speed = 344;
			var location = 0;
			var scrollTop = pratikabusttjquery(document).scrollTop();
			var winHeight = pratikabustt.getWindowHeight();
			var docHeight = pratikabusttjquery(document).height();
			
			docHeight -= winHeight;
			
			if(0 > direction) {// page down
				location = scrollTop + winHeight;
				if(location > docHeight) {
					location = docHeight;
				}
			} else {// page up
				location = scrollTop - winHeight;
				if(location < 0) {
					location = 0;
				}
			}
			
			pratikabustt.scrollPageTo(speed, location, true);
		},
		
		getWindowHeight: function() {
			return window.innerHeight;
		},
		
		hoverEffect: function(varId, idleOpacity) {
			pratikabusttjquery(varId).attr("class", "pratikabuSTTImg");// add it for all the images we've
			pratikabusttjquery(varId).hide();
			pratikabusttjquery(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, idleOpacity);
			pratikabusttjquery(varId).css("cursor", "pointer");
			pratikabusttjquery(varId).hover(
				function() {
					pratikabusttjquery(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, pratikabu_stt_hoverOpacity);
				},
				function() {
					pratikabusttjquery(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, idleOpacity);
				});
		},
		
		showUpArrowImage: function() {
			if("myIcon" == pratikabu_stt_prefs.iconLib) {
				pratikabusttjquery("#pratikabuSTTArrowUp").attr("src", "data:image/png;base64," + pratikabu_stt_prefs.userIcon);
			} else {
				var suffixString = pratikabu_stt_prefs.iconSize + "-" + pratikabu_stt_prefs.iconLib;
				pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowUp", suffixString + ".png");
			}
		},
		
		showDualArrowImage: function() {
			if("myIcon" == pratikabu_stt_prefs.dIconLib) {
				var base64url = "data:image/png;base64," + pratikabu_stt_prefs.dUserIcon;
				pratikabusttjquery("#pratikabuSTTArrowUp").attr("src", base64url);
				pratikabusttjquery("#pratikabuSTTArrowDown").attr("src", base64url);
			} else {
				var iconNumber = parseInt(pratikabu_stt_prefs.dIconLib);
				var iconName = "dual-";
				if(20 >= iconNumber) {
					iconName += "hr-";
				} else if(40 >= iconNumber) {
					iconNumber -= 20;
					iconName += "vr-";
				} else {
					iconNumber -= 40;
					iconName = pratikabu_stt_prefs.iconSize + "-";
				}
				
				var suffixString = iconName + iconNumber;
				pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowUp", suffixString + ".png");
				pratikabustt_browser_impl.setImageForId("pratikabuSTTArrowDown", suffixString + ".png");
			}
			
			pratikabusttjquery("#pratikabuSTTArrowDown").rotate(180);
		},
		
		mainDivHover: function(hoverIn) {
			if("none" == pratikabu_stt_prefs.controlOption) {
				return;
			}
			
			if(hoverIn) {
				pratikabu_stt_ahRequestCount++;// increment the autohide counter, so that it will stop removing it
				
				if(pratikabu_stt_prefs.hideControls) {
					pratikabustt.showHideControlOptions(true);
				}
			} else {
				pratikabu_stt_ahRequestCount--;// decrement the counter
				pratikabustt.triggerAutoHide();// trigger the autohide timer
				
				if(pratikabu_stt_prefs.hideControls) {
					pratikabustt.showHideControlOptions(false);
				}
			}
		},
		
		showHideControlOptions: function(boolShow) {
			if(boolShow) {
				pratikabusttjquery("#pratikabuSTTDiv2").stop(true, true);// to execute the fading out method
				var otherImagesSize = pratikabustt.getOtherImageSize();
				var divSize = pratikabu_stt_prefs.iconSize + otherImagesSize;
				if("pager" == pratikabu_stt_prefs.controlOption) {// check whether the page up is shown or not
					divSize += otherImagesSize;// add pixels based on the settings
				}
				pratikabusttjquery("#pratikabuSTTDiv").css("width", divSize + "px");
				pratikabusttjquery("#pratikabuSTTDiv2").fadeTo("slow", pratikabu_stt_hoverOpacity);
			} else {
				pratikabusttjquery("#pratikabuSTTDiv2").stop(true, true).fadeTo("slow", 0, function() {
					pratikabusttjquery("#pratikabuSTTDiv2").hide();
					var divSize = pratikabu_stt_prefs.iconSize;
					pratikabusttjquery("#pratikabuSTTDiv").css("width", divSize + "px");
				});
			}
		},
		
		getOtherImageSize: function() {
			var otherImagesSize = 16;
			if(48 == pratikabu_stt_prefs.iconSize) {
				otherImagesSize = 24;
			}
			
			return otherImagesSize;
		},
		
		loadFromResponse: function(response) {// load the images, css, include/remove elements
			pratikabu_stt_prefs = response;
			if(pratikabustt.isValidPageForAddon()) {
				// if everything is great, go ahead
				pratikabu_stt_prefs.scrSpeed = parseInt(pratikabu_stt_prefs.scrSpeed);
				pratikabu_stt_prefs.iconSize = parseInt(pratikabu_stt_prefs.iconSize);
				pratikabu_stt_dualArrow = ("2" == pratikabu_stt_prefs.arrowType);
				if(!pratikabu_stt_dualArrow) {
					pratikabu_stt_prefs.smartDirection = ("true" == pratikabu_stt_prefs.smartDirection);
					pratikabu_stt_prefs.hideControls = ("true" == pratikabu_stt_prefs.hideControls);
				}
				
				pratikabustt.addRemoveGlobalHandlers(true);
			} else {
				pratikabustt_browser_impl.removeCompleteAddOnCode();
			}
		},
		
		addRemoveGlobalHandlers: function(booleanAdd) {
			if(booleanAdd) {
				if(pratikabu_stt_prefs.smartDirection && "hideattop" == pratikabu_stt_prefs.visibilityBehav) {
					pratikabu_stt_prefs.visibilityBehav = "autohide";// if hideattop is selected change it to autohide
				}
				
				if("hideattop" == pratikabu_stt_prefs.visibilityBehav) {
					pratikabusttjquery(window).scroll(pratikabustt.scrollHandlerHideAtTop);
					pratikabusttjquery(window).resize(pratikabustt.windowResizeHandlerHideAtTop);
				} else if("alwaysshow" == pratikabu_stt_prefs.visibilityBehav) {
					var boolShow = pratikabusttjquery(document).height() > (pratikabustt.getWindowHeight() + pratikabu_stt_inversionPoint);
					if(!pratikabu_stt_dualArrow) {
						if(pratikabu_stt_prefs.smartDirection) {
							pratikabusttjquery(window).scroll(pratikabustt.scrollHandlerAutoHide);
						} else {
							pratikabusttjquery(window).scroll(pratikabustt.scrollRotationHandler);// bind the pollable handler
						}
					}
					pratikabustt.showHideAddon(boolShow);
					if(boolShow) {
						// call this method to show the arrow in proper direction when the page loads
						if(!pratikabu_stt_dualArrow) {
							if(pratikabu_stt_prefs.smartDirection) {
								pratikabustt.scrollHandlerAutoHide();
							} else {
								pratikabustt.scrollRotationHandler();
							}
						}
					} else {// attach one time handler #specialCase
						pratikabusttjquery(window).scroll(pratikabustt.scrollHandlerOneTime);
					}
				} else if("autohide" == pratikabu_stt_prefs.visibilityBehav) {
					pratikabu_stt_autoHide = true;
					pratikabusttjquery(window).scroll(pratikabustt.scrollHandlerAutoHide);
				}
			} else {
				if("hideattop" == pratikabu_stt_prefs.visibilityBehav) {
					pratikabusttjquery(window).unbind('scroll', pratikabustt.scrollHandlerHideAtTop);
					pratikabusttjquery(window).unbind('resize', pratikabustt.windowResizeHandlerHideAtTop);
				} else if("alwaysshow" == pratikabu_stt_prefs.visibilityBehav) {
					if(!pratikabu_stt_dualArrow) {
						if(pratikabu_stt_prefs.smartDirection) {
							pratikabusttjquery(window).unbind('scroll', pratikabustt.scrollHandlerAutoHide);
						} else {
							pratikabusttjquery(window).unbind('scroll', pratikabustt.scrollRotationHandler);
						}
					}
					pratikabusttjquery(window).unbind('scroll', pratikabustt.scrollHandlerOneTime);// remove this handler also if not already removed
				} else if("autohide" == pratikabu_stt_prefs.visibilityBehav) {
					pratikabu_stt_autoHide = false;
					pratikabusttjquery(window).unbind('scroll', pratikabustt.scrollHandlerAutoHide);
				}
			}
		},
		
		/**
			There will be two checks one for removed sites and one for internal frames.
		*/
		isValidPageForAddon: function() {
			var validPage = false;
			
			validPage = !pratikabustt.mactchDomainAgainstDomainList(window.location.href, pratikabu_stt_prefs.removedSites);// check for removed sites
			validPage = validPage && window == window.top;// check top window. As of now removing the support for internal frames
			/** if(validPage && window != window.top) { // internal frame identified
				validPage = pratikabustt.mactchDomainAgainstDomainList(document.referrer, pratikabu_stt_prefs.frameSupportedSites);// check if the parent's domain is supported
			} */
			
			return validPage;
		},
		
		/**
			Match passed domain against a list of domains separated by ';' (a semicolon)
		*/
		mactchDomainAgainstDomainList: function(urlToMatch, listOfDomainsToCheck) {
			var domains = listOfDomainsToCheck.split(";");
			for(var i = 0; i < domains.length; i++) {
				if(0 == domains[i].length) {
					continue;
				}
				if(-1 != urlToMatch.indexOf(domains[i])) {
					return true;
				}
			}
			
			return false;
		},
		
		removeCompleteAddonFromPage: function() {
			pratikabustt.addRemoveGlobalHandlers(false);// remove all handlers
			pratikabustt.removeAddonHtml();
			pratikabustt_browser_impl.removeCompleteAddOnCode();// remove everything
		}
	};
	
	/**
		Fetch preferences : #ENTRY POINT
		loadFromResponse() will be executed once the preferences have been fetched.
	*/
	pratikabustt_browser_impl.fetchPreferences();
}