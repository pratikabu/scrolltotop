var pratikabustt_bAppended = false;
var pratikabustt_arrow_up;
var pratikabustt_lastScrollLoc = 0;

var pratikabustt = {
	middleLoc : 0,
	
	loadIcon : function() {
		pratikabustt_arrow_up = document.createElement("img");
		pratikabustt_arrow_up.id = "pratikabuSTTArrowUp";
		pratikabustt_arrow_up.src = "resource://jid0-grmsxw9byuhwgjlhtxjg27ynzrs-at-jetpack/scroll-to-top/data/pratikabu-stt-48.png";
		pratikabustt_arrow_up.onclick = function() { pratikabustt.scrolltotop(); };
		
		pratikabustt_lastScrollLoc = document.documentElement.scrollTop || document.body.scrollTop;
		//console.log("last Location: " + pratikabustt_lastScrollLoc);
	},
	
	scrollHandler : function() {
		if(!pratikabustt_arrow_up) {
			pratikabustt.loadIcon();
			return;
		}
		
		var nVScroll = document.documentElement.scrollTop || document.body.scrollTop;
		//console.log("last Location: " + pratikabustt_lastScrollLoc + ", nvscroll: " + nVScroll);
		//pratikabustt_bAppended = nVScroll > 10 ?
		pratikabustt_bAppended = (nVScroll != 0 && pratikabustt_lastScrollLoc > nVScroll) ?
			pratikabustt_bAppended || (document.body.appendChild(pratikabustt_arrow_up), true)
			: pratikabustt_bAppended && (document.body.removeChild(pratikabustt_arrow_up), false);
		
		pratikabustt_lastScrollLoc = nVScroll;
	},
	
	scrolltotop: function() {
		window.scrollTo(0, 0);
	}
}

//console.log("I came in");
window.addEventListener('scroll', pratikabustt.scrollHandler, false);