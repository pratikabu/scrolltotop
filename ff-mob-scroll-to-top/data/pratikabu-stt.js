var pratikabustt_bAppended = false;
var pratikabustt_arrow_up;
var pratikabustt_lastScrollLoc = 0;

var pratikabustt = {
	middleLoc : 0,
	
	loadHandler : function() {
		pratikabustt_arrow_up = document.createElement("img");
		pratikabustt_arrow_up.id = "pratikabuSTTArrowUp";
		pratikabustt_arrow_up.src = "resource://jid0-grmsxw9byuhwgjlhtxjg27ynzrs-at-jetpack/scroll-to-top/data/pratikabu-stt-32.png";
		pratikabustt_arrow_up.onclick = function() { pratikabustt.pratikabuscrollinit(); };
		
		pratikabustt_lastScrollLoc = document.documentElement.scrollTop || document.body.scrollTop;
	},
	
	scrollHandler : function() {
		if(!pratikabustt_arrow_up) {
			return;
		}
		
		var nVScroll = document.documentElement.scrollTop || document.body.scrollTop;
		//pratikabustt_bAppended = nVScroll > 10 ?
		pratikabustt_bAppended = (nVScroll != 0 && pratikabustt_lastScrollLoc > nVScroll) ?
			pratikabustt_bAppended || (document.body.appendChild(pratikabustt_arrow_up), true)
			: pratikabustt_bAppended && (document.body.removeChild(pratikabustt_arrow_up), false);
		
		pratikabustt_lastScrollLoc = nVScroll;
	},
	
	pratikabuscrollinit: function() {
		pratikabustt.pratikabuscroll();
	},
	
	pratikabuscroll: function() {
		window.scrollTo(0, 0);
	},
	
	addStyleSheet : function(url) {
		var link = document.createElement("link");

		link.setAttribute("href", url);
		link.setAttribute("type", "text/css");
		link.setAttribute("rel", "StyleSheet");

		document.documentElement.appendChild(link);
	}
}

pratikabustt.addStyleSheet("resource://jid0-grmsxw9byuhwgjlhtxjg27ynzrs-at-jetpack/scroll-to-top/data/pratikabu-stt.css");
window.document.onload = function() {
	pratikabustt.loadHandler();
}
window.addEventListener('scroll', pratikabustt.scrollHandler, false);