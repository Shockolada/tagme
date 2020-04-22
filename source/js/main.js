/* ADD THEME DATA TO LOCAL STORAGE */
const THEME_KEY = 'theme';
const BTN_COUNT_KEY = 'btn-count';
const THEMES = {
  light: 'light',
  dark: 'dark'
}
let localTheme = localStorage.getItem(THEME_KEY);

if (localTheme == null) {
  localTheme = THEMES.light
}
const lampBtnText = {
  light: {
    data: ['Хочешь романтики?', 'Клик', 'Выключи свет'],
    count: 0,
  },
  dark: {
    data: ['Нет, люблю при свете', 'Клак', 'Включи свет'],
    count: 0,
  }
}
let localCount = JSON.parse(localStorage.getItem(BTN_COUNT_KEY));
if (localCount == null) {
  localCount = {
    light: {
      count: 0,
    },
    dark: {
      count: 0,
    }
  }
}
lampBtnText.light.count = localCount.light.count;
lampBtnText.dark.count = localCount.dark.count;

if (localTheme === THEMES.dark) {
  $('html').attr('data-theme-dark', 'true');
}

/* PRELOADER */
$(window).on('load', function () {
  setTimeout(function () {
    $('.preloader').fadeOut().fadeOut(200);
  }, 1200);
});

$(document).ready(function () {
  const PORT = 'port';
  const LAND = 'land';
  let orientationNow = getOrientation();

  function getOrientation() {
    if (window.innerHeight > window.innerWidth) {
      return PORT;
    } else {
      return LAND;
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
    $(document).keydown(function (evt) {
      if (evt.keyCode == 27) {
        closeMenu();
      }
    });
  });

  $('.menu__overlay').click(function () {
    closeMenu();
  });

  function closeMenu() {
    $('.menu').removeClass('active')
    $('.openMenu').removeClass('active')
    closeActiveElement();
  }

  /* HEADER */
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 150) {
      $('.page-header__wrap').addClass('scrolled');
    } else {
      $('.page-header__wrap').removeClass('scrolled');
    }
  });

  /* LANGUAGES */
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

  /* THEME */
  changeThemeText();

  function changeThemeText() {
    let currentData = lampBtnText[localTheme];
    $('.theme-btn span').text(currentData.data[currentData.count]);
    if (currentData.count === currentData.data.length - 1) {
      currentData.count = 0;
      localCount[localTheme].count = 0;
    } else {
      currentData.count += 1;
      localCount[localTheme].count += 1;
    }
    // localStorage.setItem(BTN_COUNT_KEY, JSON.stringify(localCount));
  }

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
    changeThemeText();
  });

  function toggleTheme() {
    if ($('html').attr('data-theme-dark') != null) {
      $('html').removeAttr('data-theme-dark');
      localStorage.setItem(THEME_KEY, THEMES.light);
      localTheme = THEMES.light;
    } else {
      $('html').attr('data-theme-dark', 'true');
      localStorage.setItem(THEME_KEY, THEMES.dark);
      localTheme = THEMES.dark;
    }
  }

  /* TO TOP */
  $('.toTop').click(function (evt) {
    evt.preventDefault();
    $('body,html').animate({
      scrollTop: 0
    }, 400);
    return false;
  });

  /* VACANCIES */
  $('.openVacancyInfo').click(function (evt) {
    evt.preventDefault();
    $('.vacancy').removeClass('active');
    let vacancyId = $(this).data('id');
    let vacancyInfo = $('#' + vacancyId);
    vacancyInfo.addClass('active');
    $('.vacancies__wrap').addClass('active');
    $('.openVacancyInfo').removeClass('active');
    $(this).addClass('active');
    $(this).closest('.full-screen-page').addClass('scroll-mobile');
  });

  $('.hideVacancyInfo').click(function (evt) {
    evt.preventDefault();
    $('.openVacancyInfo').removeClass('active');
    $('.vacancies__wrap').removeClass('active');
    $('.vacancy').removeClass('active');
    $('.full-screen-page').animate({
      scrollTop: 0
    }, 100);
    $(this).closest('.full-screen-page').removeClass('scroll-mobile');
  });

  /* QUIZ STEPS */
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

  /* PROJECT PAGE */
  if ($('section').is('.project') || $('div').is('.project')) {
    $('img').bind('contextmenu', function (evt) {
      return false;
    });
  }

  /* SLIDERS */
  /* Main Slider */
  var swiper = new Swiper('#fullScreenSlider .swiper-container', {
    direction: getDirection(),
    initialSlide: 0,
    spaceBetween: 0,
    mousewheel: {
      releaseOnEdges: true
    },
    speed: 700,
    parallax: true,
    on: {
      resize: function () {
        swiper.changeDirection(getDirection());
      }
    },
  });

  function getDirection() {
    var windowWidth = window.innerWidth;
    var direction = window.innerWidth <= 940 ? 'vertical' : 'horizontal';

    return direction;
  }

  refreshClientsSlider();
  $(window).on("resize", function () {
    if (orientationNow !== getOrientation()) {
      orientationNow = getOrientation();
      refreshClientsSlider();
    }
  });

  /* Clients Slider */
  function refreshClientsSlider() {
    if (orientationNow === PORT) {
      if (clientsSlider != null) {
        clientsSlider.destroy(true, true);
      }
      var clientsSlider = new Swiper('.clientsSlider', {
        slidesPerView: 2,
        slidesPerColumn: 6,
        mousewheel: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: true,
        },
      });
    } else if (orientationNow === LAND) {
      if (clientsSlider != null) {
        clientsSlider.destroy(true, true);
      }
      var clientsSlider = new Swiper('.clientsSlider', {
        slidesPerView: 6,
        slidesPerColumn: 3,
        mousewheel: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: true,
        },
      });
    }
  }






  /* FUNCTIONS */
  function openActiveElement(selector) {
    $(selector).addClass('active');
    scrollLock(selector);
  };

  function closeActiveElement() {
    $('.overlay').removeClass('active');
    bodyScrollLock.clearAllBodyScrollLocks();
  };

  function scrollLock(selector) {
    return bodyScrollLock.disableBodyScroll(document.querySelector(selector));
  }; // iOS blocking body scroll function.

  function isMobile() {
    let isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      isMobile = true
    }
    return isMobile
  }

  function compensateScrollbar(selector) {
    let scrollWidth = (window.innerWidth - document.documentElement.clientWidth);
    selector.css('padding-right', scrollWidth)
  }
});
