import tracker from './tracker'
var isAndroidApp = (window.location.origin === "file://" && /(android)/i.test(navigator.userAgent)) ? true : false;

// init jump bar
var jumpLinks = document.querySelectorAll('[data-jump-to]'), i;

for (i = 0; i < jumpLinks.length; ++i) {
    var jumpLink = jumpLinks[i];
    jumpLink.addEventListener("click", function(e) {
        e.preventDefault();
        var jumpTarget = this.getAttribute('data-jump-to');
        var jumpDiv = document.querySelector('[id="group-' + jumpTarget + '"]');
        var body = document.documentElement || document.body || document.querySelector('body');
        var jumpBar = document.querySelector('.interactive-nav');
        var dadgummit = 5;
        var jumpOffset = body.scrollTop + jumpDiv.getBoundingClientRect().top - jumpBar.offsetHeight + dadgummit;
        //body.scrollTo(0, jumpOffset);
        // console.log(jumpOffset)
        scrollTo(body, jumpOffset, 240);
    }, false);
}

function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        //console.log(element, to, duration) ;
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
        checkFixView();
    }, 10);
}

function addListeners() {

    document.querySelector('.gv-back-top-btn').addEventListener("click",
        function(e) {
            var jumpTarget = document.querySelector('.interactive-nav');
            var body = document.documentElement || document.body || document.querySelector('body');
            var dadgummit = 5;
            var jumpOffset = body.scrollTop + jumpTarget.getBoundingClientRect().top - jumpTarget.offsetHeight + dadgummit;
            //body.scrollTo(0, jumpOffset);
            // console.log(jumpOffset)
            scrollTo(body, jumpOffset, 240);
        }
    )

    var Window = window || document;

    Window.addEventListener("scroll", WindowScrollListener);

}

function WindowScrollListener() {
    checkFixView()
}


// comment out for embed
//initFullScrn();

