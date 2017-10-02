import Swiper from 'swiper'
import tracker from './tracker'
import ScrollTrigger from './scrollTrigger'

var isAndroidApp = (window.location.origin === "file://" && /(android)/i.test(navigator.userAgent) ) ? true : false;

const maxNoneSwipeH = 160;

function initSwiper() {
    var analytics = tracker();
    var swipers = [];
    var cardStacks = document.querySelectorAll('.swiper-container');

    removeDisabled();

    for (var s = 0; s < cardStacks.length; s++) {

      cardStacks[s].setAttribute('data-stack-position', s+1);

      var swiper = new Swiper(cardStacks[s], {
            paginationClickable: true, 
            loop: true,
            slidesPerView: 1.2,
            loopedSlides: 2,
            spaceBetween: 10,
            pagination: ".pagination",
            centeredSlides: true
        })
        .on('slideChangeEnd', function(currentSwiper, event) {

            swipers.forEach(function(s,i) {
              var eq = (currentSwiper == s) ? true : false;
              if(eq){
                var stackPosition = swiper.container[0].getAttribute('data-stack-position');
                analytics.registerEvent('stack_card_view', i)
              }

                if (s.activeIndex != currentSwiper.activeIndex) {
                  //s.activeIndex = currentSwiper.activeIndex;
                    s.slideTo(currentSwiper.activeIndex, 0, false);
                } else {


                }
            });
        })
        .on('onTouchStart', function(currentSwiper, e) {
            if (isAndroidApp && window.GuardianJSInterface.registerRelatedCardsTouch) {
                window.GuardianJSInterface.registerRelatedCardsTouch(true);
            }
        })
        .on('onTouchEnd', function(currentSwiper, e) {
            if (isAndroidApp && window.GuardianJSInterface.registerRelatedCardsTouch) {
                window.GuardianJSInterface.registerRelatedCardsTouch(false);
            }
        });

        swipers.push(swiper);

    }

    let swipeSlides = document.querySelectorAll('.swiper-slide');

}

// init jump bar
var jumpLinks = document.querySelectorAll('[data-jump-to]'), i;

for (i = 0; i < jumpLinks.length; ++i) {
    var jumpLink = jumpLinks[i];
    jumpLink.addEventListener("click", function(e){
        e.preventDefault();
        var jumpTarget = this.getAttribute('data-jump-to');
        var jumpDiv = document.querySelector('[id="group-'+jumpTarget+'"]');
        var body = document.documentElement || document.body || document.querySelector('body');
        var jumpBar = document.querySelector('.interactive-nav');
        var dadgummit = 5;
        var jumpOffset = body.scrollTop + jumpDiv.getBoundingClientRect().top - jumpBar.offsetHeight + dadgummit;
        //body.scrollTo(0, jumpOffset);
        // console.log(jumpOffset)
        scrollTo(body, jumpOffset,  240);
    },false);
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

function removeDisabled(){
    let swipeSlides = document.querySelectorAll('.swiper-wrapper');

    for (var n = 0; n < swipeSlides.length; n++) {
        swipeSlides[n].classList.remove('swipe-disabled');
    }  
}

// scrollTrigger
var trigger = new ScrollTrigger({
    offset: { x: -50, y: 50 }
});

function initFullScrn(){

    let exceededMaxH = getSlidesMaxH();

    if(document.querySelector("body").clientWidth < 740 && exceededMaxH) {
      // comment out for embeds
        initSwiper();
    }

    if(document.querySelector("body").clientWidth > 740) {
        removeDisabled();
    }  

    addListeners();
     
}

function addListeners(){

    document.querySelector('.gv-back-top-btn').addEventListener("click", 
        function(e){
            var jumpTarget = document.querySelector('.interactive-nav');
            var body = document.documentElement || document.body || document.querySelector('body');
            var dadgummit = 5;
            var jumpOffset = body.scrollTop + jumpTarget.getBoundingClientRect().top - jumpTarget.offsetHeight + dadgummit;
            //body.scrollTo(0, jumpOffset);
            // console.log(jumpOffset)
            scrollTo(body, jumpOffset,  240); 
        }
    )

    var Window =  window || document;

    Window.addEventListener("scroll", WindowScrollListener);

}

function WindowScrollListener(){
    checkFixView()
}


function getSlidesMaxH(){
    let a = false;
    let swipeSlides = document.querySelectorAll('.swiper-slide');

        for (var n = 0; n < swipeSlides.length; n++) {       
            if (swipeSlides[n].offsetHeight > maxNoneSwipeH){ a = true; console.log(swipeSlides[n].offsetHeight) };
        }

    return a;
}

function checkFixView() {
    let footTop = 0;
    let navTop = document.querySelector(".interactive-nav").getBoundingClientRect().top;
    var pos_top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (document.querySelector(".gv-hidden-footer")){
        footTop = document.querySelector(".gv-hidden-footer").offsetTop;
    }

    console.log(document.querySelector(".gv-hidden-footer").getBoundingClientRect().top)

    // if (pos_top > h) {
    //     document.querySelector('.gv-back-top-btn').classList.remove('hidden');
    // } else if (pos_top < h) {
    //     document.querySelector('.gv-back-top-btn').classList.add('hidden');
    // }

        if( navTop < 0  && pos_top < (footTop - 240)){
           document.querySelector('.gv-back-top-btn').classList.remove('hidden'); 
        }
        else if(pos_top > (footTop - 240) || navTop > 0 ){
            document.querySelector('.gv-back-top-btn').classList.add('hidden');
        }


        // }else if (pos_top > navTop) {
        //     document.querySelector('.gv-back-top-btn').classList.remove('hidden');
        // } 
        // else if (pos_top < h) {
        //     document.querySelector('.gv-back-top-btn').classList.add('hidden');
        // }
   

}

// comment out for embed
initFullScrn();

