// script
var bAppended = false, oBookmark = document.createElement("img");
oBookmark.id = "pratikabuSTTArrowUp";
oBookmark.title = "Scroll to Top of the page.";
oBookmark.src = "resource://jid0-grmsxw9byuhwgjlhtxjg27ynzrs-at-jetpack/scroll-to-top/data/pratikabu-stt-48.png";
oBookmark.onclick = function() { pratikabuscrolltotop.pratikabuscrollinit(); };

window.addEventListener('scroll', scrollHandler, false);
    
function scrollHandler() {
    var nVScroll = document.documentElement.scrollTop || document.body.scrollTop;
    bAppended = nVScroll > 300 ?
        bAppended || (document.body.appendChild(oBookmark), true)
        : bAppended && (document.body.removeChild(oBookmark), false);
}

var pratikabuscrolltotop = {
	middleLoc : 0,
	
	pratikabuscrollinit: function() {
		middleLoc = (document.documentElement.scrollTop || document.body.scrollTop) / 2;
		pratikabuscrolltotop.pratikabuscroll();
	},
	
	pratikabuscroll: function() {
		var currentLocation = document.documentElement.scrollTop || document.body.scrollTop;
		var offset = middleLoc - currentLocation;//currentLocation / 10;
		if(offset <= 0) {
			offset = middleLoc + offset;
		} else {
			offset = middleLoc - offset;
		}
		
		offset = offset / 10;
		if(offset <= 0) {
			offset = 10;
		}
		
		var isStop = false,
			scrollY = currentLocation - offset;
		if(scrollY < 0) {
			scrollY = 0;
		}
			 
		isStop = scrollY > 0;
		
		window.scrollTo(0, scrollY);
		if(isStop) {
			setTimeout(pratikabuscrolltotop.pratikabuscroll, 10);
		}
	}
}