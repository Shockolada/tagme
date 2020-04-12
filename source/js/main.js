/* MENU */
$(document).ready(function () {
  var menu = $('.mobileMenu');
  var menuToggle = $('.menuToggleBtn');

  menuToggle.click(function (evt) {
    evt.preventDefault();
    $(this).toggleClass('active');
    menu.toggleClass('active');
  });
});

/* HEADER */
$(document).ready(function () {
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 150) {
      $('.page-header__wrap').addClass('scrolled');
    } else {
      $('.page-header__wrap').removeClass('scrolled');
    }
  });
});

$(document).ready(function () {

  $('.langsTrigger').click(function (evt) {
    evt.preventDefault();
    $(this).hide();
    $('.langsPanel').addClass('active');
  });

  $('.languages-list__item a').click(function (evt) {
    $(this).closest('.langsPanel').removeClass('active');
    setTimeout(function(){
      $('.langsTrigger').fadeIn(100);
    }, 200);
  });

  $('.openMenu').click(function (evt) {
    evt.preventDefault()
    $(this).addClass('active');
    $('.menu').addClass('active')
  });

  $('.menuClose').click(function (evt) {
    evt.preventDefault()
    $('.menu').removeClass('active')
    $('.openMenu').removeClass('active')
  });

  $('.menu__overlay').click(function (evt) {
    evt.preventDefault()
    $('.menu').removeClass('active')
    $('.openMenu').removeClass('active')
  });
});





// function scrollLock(selector) {
//   return bodyScrollLock.disableBodyScroll(document.querySelector(selector));
//   }; // iOS blocking body scroll function.
//   scrollLock('element');
//   bodyScrollLock.clearAllBodyScrollLocks();

// // 1. Get a target element that you want to persist scrolling for (such as a modal/lightbox/flyout/nav).
// // Specifically, the target element is the one we would like to allow scroll on (NOT a parent of that element).
// // This is also the element to apply the CSS '-webkit-overflow-scrolling: touch;' if desired.
// const targetElement = document.querySelector('#someElementId');

// // 2. ...in some event handler after showing the target element...disable body scroll
// bodyScrollLock.disableBodyScroll(targetElement);

// // 3. ...in some event handler after hiding the target element...
// bodyScrollLock.enableBodyScroll(targetElement);

// // 4. Useful if we have called disableBodyScroll for multiple target elements,
// // and we just want a kill-switch to undo all that.
// bodyScrollLock.clearAllBodyScrollLocks();
