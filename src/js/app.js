import Swiper from 'swiper'
import tracker from './tracker'
import ScrollTrigger from './scrollTrigger'
import scrollToElement from 'scroll-to-element'

var isAndroidApp = (window.location.origin === "file://" && /(android)/i.test(navigator.userAgent)) ? true : false;

const twitterBaseUrl = 'https://twitter.com/intent/tweet?text=';
const facebookBaseUrl = 'https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&redirect_uri=http://www.theguardian.com&link=';
const googleBaseUrl = 'https://plus.google.com/share?url=';


//https://gu.com/p/899e5

const maxNoneSwipeH = 160;

function initSwiper() {
    var analytics = tracker();
    var swipers = [];
    var cardStacks = document.querySelectorAll('.swiper-container');

    removeDisabled();

    let swipeSlides = document.querySelectorAll('.swiper-slide');

}

// init jump bar
var jumpLinks = document.querySelectorAll('[data-jump-to]'),
    i;

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
        //checkFixView();
    }, 10);
}


function removeDisabled() {
    let swipeSlides = document.querySelectorAll('.swiper-wrapper');

    for (var n = 0; n < swipeSlides.length; n++) {
        swipeSlides[n].classList.remove('swipe-disabled');
    }
}

// scrollTrigger
var trigger = new ScrollTrigger({
    offset: { x: -50, y: 50 }
});

function initFullScrn() {

    let exceededMaxH = getSlidesMaxH();

    if (document.querySelector("body").clientWidth < 740 && exceededMaxH) {
        initSwiper();
    }

    if (document.querySelector("body").clientWidth > 740) {
        removeDisabled();
    }

    addListeners();

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

    document.getElementById('wcLogo').classList.remove("hide");

    document.getElementById('wcLogo').addEventListener("click",
        function(e) {
            window.open("https://www.gu.com/football/world-cup-2018");
        }
    )



    document.querySelectorAll('.expand-btn').forEach((el) => {
             el.addEventListener('click', function(){ 
                el.classList.add("hidden")
                expandCards(el.getAttribute("data-country"));

             });
    })


    document.querySelectorAll('.gv-team-filter').forEach(teamFilter => {
        console.log(teamFilter)
        teamFilter.addEventListener("change", function( e ) {
            //showTeam( e.target.value );
            
            var tgt = "teamAnchor"+e.target.value; 
            console.log( tgt );
            document.getElementById(tgt).scrollIntoView(true);
            }, false );
    });

    var Window = window || document;

   // Window.addEventListener("scroll", WindowScrollListener);

    adjustView();

}

function expandCards(s){
  
    document.querySelectorAll('.swiper-wrapper').forEach((el) => {
                console.log(el)
                if(el.getAttribute("data-country") == s){ 

                    el.classList.remove("mobile-init-view")
                };

             });

}


var prevClip;
var firstClick = true;

function addAccordianListener() {       

         document.querySelectorAll('.horizontal-accordion ul li').forEach((el) => {

        

             el.addEventListener('click', function(){ 
                scrollFromAccordian(el.getAttribute("data-team"))
             });
        })


     document.querySelectorAll('.gv-mobile-swatch').forEach((el) => {

             el.addEventListener('click', function(){ 
                scrollFromAccordian(el.getAttribute("data-team"))
             });
        })




        
}

function onInitClickAccordian(){
    document.querySelectorAll('.horizontal-accordion ul li').forEach((listEl) => {
                    listEl.classList.remove("init");
                    listEl.classList.add("closed");
                })
}


function scrollFromAccordian(s){
    console.log(s)

    document.querySelectorAll('.left-col').forEach((listEl) => {
                    if(s == listEl.getAttribute("data-title")){
                      
                                    scrollToElement(listEl, {
                                        offset: 0,
                                        ease: 'outSine',
                                        duration: 1500
                                    });
                    }
                })
}



function WindowScrollListener() {
    //checkFixView()
}


function adjustView() {
    let slides = document.querySelectorAll('.swiper-slide');

    var prevTop = 0;
    var prevEl;
    var prevCountry = "Narnia";
    var topPosArr = [];

    slides.forEach((el, k) => {
        if (prevEl && prevCountry != el.getAttribute("data-country")) {
            prevEl.classList.add("no-border-right");
        }
        if (el.offsetTop != prevTop) {
            prevEl.classList.add("no-border-right");
        }

        prevTop = el.offsetTop;
        prevEl = el;
        prevCountry = el.getAttribute("data-country")

    })

}


function getSlidesMaxH() {
    let a = false;
    let swipeSlides = document.querySelectorAll('.swiper-slide');

    for (var n = 0; n < swipeSlides.length; n++) {
        if (swipeSlides[n].offsetHeight > maxNoneSwipeH) {
            a = true;
            console.log(swipeSlides[n].offsetHeight)
        };
    }

    return a;
}

function checkFixView() {
    let footTop = 0;
    let navTop = document.querySelector(".interactive-nav").getBoundingClientRect().top;
    var pos_top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (document.querySelector(".gv-hidden-footer")) {
        footTop = document.querySelector(".gv-hidden-footer").offsetTop - document.querySelector(".gv-hidden-footer").offsetHeight;
    }

    if (navTop < 0 && pos_top < (footTop - 240)) {
        document.querySelector('.gv-back-top-btn').classList.remove('hidden');
    } else if (pos_top > (footTop - 240) || navTop > 0) {
        document.querySelector('.gv-back-top-btn').classList.add('hidden');
    }

}



function share(title, shareURL, fbImg, twImg, hashTag) {
        var twImgText = twImg ? ` ${twImg.trim()} ` : '';
        var fbImgQry = fbImg ? `&picture=${encodeURIComponent(fbImg)}` : '';
        return function(network, extra = '') {
            var twitterMessage = `${extra}${title}${twImgText}`;
            var shareWindow;

            if (network === 'twitter') {
                shareWindow = twitterBaseUrl + encodeURIComponent(twitterMessage + ' ') + shareURL + '?CMP=share_btn_tw';
            } else if (network === 'facebook') {
                shareWindow = facebookBaseUrl + shareURL + fbImgQry + '%3FCMP%3Dshare_btn_fb';
            } else if (network === 'email') {
                shareWindow = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + shareURL;
            } else if (network === 'google') {
                shareWindow = googleBaseUrl + shareURL;
            }

            window.open(shareWindow, network + 'share', 'width=640,height=320');
        }
    }

    var shareFn = share('World Cup kits through the ages', 'https://gu.com/p/899e5');

    [].slice.apply(document.querySelectorAll('.interactive-share')).forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click', () => shareFn(network));
    });

// comment out for embed
initFullScrn();


