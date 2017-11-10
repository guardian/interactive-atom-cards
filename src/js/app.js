import tracker from './tracker'

var isAndroidApp = (window.location.origin === "file://" && /(android)/i.test(navigator.userAgent)) ? true : false;

const maxNoneSwipeH = 160;

function initSwiper() {
    var analytics = tracker();
    var swipers = [];
    var cardStacks = document.querySelectorAll('.swiper-container');

    removeDisabled();

    console.log(cardStacks)

    for (var s = 0; s < cardStacks.length; s++) {
        // console.log(document.getElementByID("#pagination-"+s);
        cardStacks[s].setAttribute('data-stack-position', s + 1);

        // refs added to allow different lengths of swiper
        var swiperTgt = document.querySelector(".swiperContainer" + s);
        var paginateTgt = ".paginate" + s;

        var swiper = new Swiper(swiperTgt, {
                paginationClickable: true,
                loop: true,
                slidesPerView: 1.2,
                loopedSlides: cardStacks[s].length,
                spaceBetween: 10,
                pagination: paginateTgt,
                centeredSlides: true
            })
        //uncomment to change all sliders when 1 slider updates
        // .on('slideChangeEnd', function(currentSwiper, event) {

        //     swipers.forEach(function(s,i) {
        //       var eq = (currentSwiper == s) ? true : false;
        //       if(eq){
        //         var stackPosition = swiper.container[0].getAttribute('data-stack-position');
        //         analytics.registerEvent('stack_card_view', i)
        //       }

        //         if (s.activeIndex != currentSwiper.activeIndex) {
        //           //s.activeIndex = currentSwiper.activeIndex;
        //             s.slideTo(currentSwiper.activeIndex, 0, false);
        //         } else {


        //         }
        //     });
        // })
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


//let swipeSlides = document.querySelectorAll('.swiper-slide');

    

}

function addListeners(){

    Array.from(document.querySelectorAll('.gv-read-more-btn')).forEach((el,k) => {

            el.addEventListener('click', function(){   
                    window.open(el.getAttribute("link-ref"), "_self");

                console.log(el.getAttribute("link-ref") ) });  
                     
        })  
 
}


function removeDisabled() {
    let swipeSlides = document.querySelectorAll('.swiper-wrapper');

    for (var n = 0; n < swipeSlides.length; n++) {
        swipeSlides[n].classList.remove('swipe-disabled');
    }
}


function initFullScrn() {
    addListeners()
    if (document.querySelector("body").clientWidth > 740) {
       removeDisabled(); 
    }
}






function getSlidesMaxH() {
    let a = false;
    let swipeSlides = document.querySelectorAll('.swiper-slide');

    for (var n = 0; n < swipeSlides.length; n++) {
        if (swipeSlides[n].offsetHeight > maxNoneSwipeH) { a = true;
            console.log(swipeSlides[n].offsetHeight) };
    }

    return a;
}



// comment out for embed
initFullScrn();

