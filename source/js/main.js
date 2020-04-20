const THEME_KEY = 'theme';
const THEMES = {
  light: 'light',
  dark: 'dark'
}
let localTheme = localStorage.getItem(THEME_KEY);
if (localTheme != null) {
  if (localTheme === THEMES.dark) {
    $('html').attr('data-theme-dark', 'true');
  }
}

/* Preloader */
$(window).on('load', function () {
  setTimeout(function () {
    $('.preloader').fadeOut().fadeOut(200);
  }, 1200);
});

$(document).ready(function () {
  var port = "port";
  var land = "land";
  var orientationNow = getOrientation();

  function getOrientation() {
    if (window.innerHeight > window.innerWidth) {
      return port;
    } else {
      return land;
    }
  }

  /* MENU */
  $('.openMenu').click(function (evt) {
    evt.preventDefault();
    if (!$('.menu').hasClass('active')) {
      $(this).addClass('active');
      openActiveElement('.menu');
    } else if ($('.menu').hasClass('active')) {
      $(this).removeClass('active');
      closeActiveElement();
      $('.menu').removeClass('active');
    }
  });

  $('.menu__overlay').click(function () {
    $('.menu').removeClass('active')
    $('.openMenu').removeClass('active')
    closeActiveElement();
  });

  /* HEADER */
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 150) {
      $('.page-header__wrap').addClass('scrolled');
    } else {
      $('.page-header__wrap').removeClass('scrolled');
    }
  });

  /* Languages */
  $('.langsTrigger').click(function (evt) {
    evt.preventDefault();
    $(this).hide();
    $('.langsPanel').addClass('active');
  });

  $('.languages-list__item a').click(function () {
    $(this).closest('.langsPanel').removeClass('active');
    setTimeout(function () {
      $('.langsTrigger').fadeIn(100);
    }, 200);
  });

  /* Theme */
  bindClick();
  function bindClick() {
    $('.theme-btn--swing').one("click", function () {
      $(this).addClass('active');
      swingTimeId = setTimeout(function () {
        $('.theme-btn--swing').removeClass('active');
      }, 1990);
      setTimeout(bindClick, 2000);
    });
  }

  $('.theme-btn').click(function (evt) {
    evt.preventDefault();
    toggleTheme();
  });
  function toggleTheme() {
    console.log($('html').attr('data-theme-dark'))
    if ($('html').attr('data-theme-dark') != null) {
      $('html').removeAttr('data-theme-dark');
      localStorage.setItem(THEME_KEY, THEMES.light);
    } else {
      $('html').attr('data-theme-dark', 'true');
      localStorage.setItem(THEME_KEY, THEMES.dark);
    }
  }

  /* To top */
  $('.toTop').click(function (evt) {
    evt.preventDefault();
    $('body,html').animate({
      scrollTop: 0
    }, 400);
    return false;
  });

  /* Vacancies */
  $('.openVacancyInfo').click(function (evt) {
    evt.preventDefault();
    $('.openVacancyInfo').removeClass('active')
    $('.vacancy').removeClass('active')
    $(this).addClass('active');
    var vacancyId = $(this).data('id');
    var vacancyInfo = $('#' + vacancyId);
    if (orientationNow === port) {
      $('.vacancies__list').addClass('hidden');
    }
    $('.vacancies__inner').addClass('active');
    $('.vacancies__img-side').addClass('hidden');
    $(this).closest('.full-screen-page').addClass('scroll-mobile')

    vacancyInfo.addClass('active')
  });

  $('.hideVacancyInfo').click(function (evt) {
    evt.preventDefault();

    $('.vacancy').removeClass('active');
    if (orientationNow === port) {
      $('.vacancies__list').removeClass('hidden');
    }
    $('.vacancies__img-side').removeClass('hidden');
    $('.full-screen-page').animate({
      scrollTop: 0
    }, 100);
    $(this).closest('.full-screen-page').removeClass('scroll-mobile')
    $('.vacancies__inner').removeClass('active');
  });

  $(window).on("resize", function () {

  });

  /* Quiz steps */
  $('.step .nextStep').click(function (evt) {
    evt.preventDefault();
    $('.preloader').show();
    setTimeout(function () {
      $('.preloader').fadeOut().fadeOut(200);
    }, 1000);
    $(this).closest('.step').removeClass('active').next('.step').addClass('active');
  })

  $('.step .prevStep').click(function (evt) {
    evt.preventDefault();
    $('.preloader').show();
    setTimeout(function () {
      $('.preloader').fadeOut().fadeOut(200);
    }, 1000);
    $(this).closest('.step').removeClass('active').prev('.step').addClass('active');
  })

  /* Functions */
  function openActiveElement(selector) {
    // $('html').addClass('no-scroll');
    // $('body').addClass('no-scroll');
    $(selector).addClass('active');
    scrollLock(selector);
  };

  function closeActiveElement() {
    // compensateScrollbar('body')
    $('.overlay').removeClass('active');
    // $('html').removeClass('no-scroll');
    // $('body').removeClass('no-scroll');
    bodyScrollLock.clearAllBodyScrollLocks();
  };

  function scrollLock(selector) {
    return bodyScrollLock.disableBodyScroll(document.querySelector(selector));
  }; // iOS blocking body scroll function.

  // function isMobile() {
  //   var isMobile = false;
  //   if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  //     isMobile = true
  //   }
  //   return isMobile
  // }

  // if (isMobile()) {
  // }


  // console.log(isMobile())

  // function compensateScrollbar(selector) {
  //   var scrollWidth = (window.innerWidth - document.documentElement.clientWidth);
  //   selector.css('padding','+scrollWidth+')
  // }
});
