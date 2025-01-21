'use strict';
var dim = '<div class="dim" aria-hidden="true"></div>';
var ua = navigator.userAgent.toLocaleLowerCase();
var isAOS = ua.indexOf('android') !== -1;
var isiOS = ua.indexOf('iphone') !== -1;
var safeArea = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  header: 50,
  filter: 38
}

function androidV(ua) {
  ua = (ua || navigator.userAgent).toLowerCase(); 
  var match = ua.match(/android\s([0-9\.]*)/i);
  return match ? match[1] : undefined;
};
function iosV(ua) {
  ua = (ua || navigator.userAgent).toLowerCase();
  var match = ua.match(/os (\d+)_(\d+)_?(\d+)?/);
  return match ? match[1] : undefined;
}  

$(function(){
  setTimeout(function(){
    safeArea.top = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safeTop'));
    safeArea.right = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safeRight'));
    safeArea.bottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safeBottom'));
    safeArea.left = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safeLeft'));
    safeArea.header = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerH'));
    safeArea.filter = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--filterH'));
  },200, safeArea);

  if (isAOS) {
    $('html').addClass('AOS');
    if ( parseInt(androidV(ua)) < 8) {
      $('html').addClass('AOS_old');
    }
  } else {
    $('html').addClass('iOS');
  }
  
  addNotchMeta(); // notch metatag추가
  registUI();
});

var registUI = function(){
  if ( $('.container__wrap .fnStickyTop').length ) { setTimeout(function(){fnStickyTop.set();},200);} // 스크롤에 따른 상단 sticky 고정
  if ( $('.layerpop__wrap').length ) { _layerPop(); exeTransitionInLayer(); } // 레이어팝업
  if ( $('.check-list__wrap .check-list__all').length ) { _agreeCheckAll(); } // 전체동의
  if ( $('.tab__wrap').length ) { fnTabControl(); } // 탭 기능
  if ( $('.accordion__wrap').length ) { fnAccorControl(); } // 아코디언 기능
  if ( $('.select__wrap').length ) { fnSelectBtn(); } // 셀럭트버튼
  if ( $('.count__wrap').length ) { fnCountBtn(); } // 카운트 기능
  if ( $('.splide__product').length ) { fnProductSlide(); }
  if ( $('.splide__default').length ) { fnDefaultSlide(); } // 디폴트 슬라이드
  if ( $('.filter-select__wrap').length ) { fnFilterBtn(); } // 정렬 필터
  if ( $('.rating').length ) { fnRating(); } // 별점
  if ( $('.review-txt').length ) { fnMoreBtn(); } // 리뷰 더보기 버튼

  fnLikeBtn(); 
};

/**
  * @name addNotchMeta();
  * @description notch 대응 metatag 추가
  */
var addNotchMeta = function() {
  var $viewport = $('meta[name="viewport"]');
  if (isiOS) {
    $viewport.attr('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no, viewport-fit=cover');
    $viewport.after('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />');
    $viewport.after('<meta name="apple-mobile-web-app-capable" content="yes" />');
  }
}

/**
  * @name fnStickyTop.set()
  * @description 스크롤에 따른 콘텐츠 상단고정 position 설정
  */
var fnStickyTop = (function() {
  var stickyEl,
      container,
      setHeight,
      top

  // sticky 설정 계산 최초만 실행
  function _getTop() {
    stickyEl = document.querySelectorAll('.fnStickyTop');
    container = $(stickyEl).parents('.container__wrap')[0];
    var headerHeight = $(window).width() > 320 // Header 기본 높이
      ? $('.header__wrap').outerHeight(true)
      : $('.header__wrap').outerHeight(true) * 10 / 9;
    var $fixedEl = $(container).find('.fnFixedTop'); // 상단고정 element
    setHeight = $fixedEl.length 
      ? headerHeight + parseInt($fixedEl.attr('data-height'))
      : headerHeight; // Header blur 높이
    top = container == $(stickyEl).parents('.container__wrap')[0]
      ? setHeight * 0.1                   // page인 경우
      : (setHeight - headerHeight) * 0.1 ; // popup인 경우
    return container, setHeight, top;
  }

  function set() {
    // IntersectionObserver 미지원버전 sticky 실행X
    if ( iosV() < 13 || parseInt(androidV(ua)) < 7 ) {
      $('.fnStickyTop').each(function(idx, el){
        $(el).css('position','static');
      });
      return;
    }
    if (!container || container !=  $(stickyEl).parents('.content_layer')[0]) {_getTop();}
    // else if ($(stickyEl).parents('.layerpop__wrap').hasClass('show')) {_getTop();}
    var fixed = top;

    $(container).find('.fnStickyTop').removeClass('fixed');
    var stickyElements = container.querySelectorAll('.fnStickyTop');
    stickyElements.forEach(function(el) {
      el.style.top = fixed + 'rem'; // sticky position 설정
    });

    $(document).ready(function(){
      var $fnStickyTop = $('.fnStickyTop').offset().top - $('.header__wrap').height() + 1;
      $(window).scroll(function() {
        var $winScrollTop = $(window).scrollTop();
        if( $winScrollTop >= $fnStickyTop) {
          $('.fnStickyTop').addClass('fixed');
        } else {
          $('.fnStickyTop').removeClass('fixed');
        }
      })
    })
    
  }

  return {
    set: set
  }
})();


/**
  * @name _agreeCheckAll()
  * @description // 약관전체동의
  */
var _agreeCheckAll = function() {
  $('.check-list__wrap').each(function(){
    var $this = $(this);
    var chkAllBtn = $this.find('.check-list__all input[type="checkbox"]');
    var chks = $this.find('.check-list__con input[type="checkbox"]');
    var _checkedAll = function() {
      // 전체체크
      if( $this.find('.check-list__con input[type="checkbox"]:checked').length == chks.length ){
        chkAllBtn.prop('checked',true);
      }else{
        chkAllBtn.prop('checked',false);
      }
    }

    // 전체동의버튼 클릭
    chkAllBtn.on('change', function(){
      if( $(this).is(':checked') == false ){
        chks.prop('checked',false);
      }else{
        chks.prop('checked',true);
      }   
    });

    chks.on('change', function(){
      _checkedAll();
    });

  });
}

/**
  * @name _layerPop()
  * @description // 레이어팝업
  */
var _layerPop = function() {
  var $focusBtn;
  $('.fnOpenPop').on('click', function(){
    var popId = $(this).attr('data-name');
    fnOpenLayerPop(popId);
    $focusBtn = $(this);
  });

  $('.fnClosePop').on('click', function(){
    var popId = $(this).closest('.layerpop__wrap').attr('id');
    fnCloseLayerPop(popId);
  });
};

/**
  * @name fnOpenLayerPop()
  * @description 레이어팝업 열기
  * @param {string} popID 팝업ID 
  */
var fnOpenLayerPop = function(popID) {
  var $el = $('#' + popID);

  if ($('.layerpop__wrap.show').length) {
    var current = $('.layerpop__wrap.show').css('z-index');
    var zIndex = parseInt(current) + 1;
    $el.css('z-index', zIndex);
  }

  $('body').addClass('overflow');
  $el.addClass('show').trigger('layerOpened');
  $el.append(dim);

  // 딤 클릭 시 해당 팝업 닫기
  $('.dim').on('click', function() {
    var popup = $(this).closest('.layerpop__wrap');
    var popupID = $(this).closest('.layerpop__wrap').attr('id');
    if (popup.hasClass('type-alert')) { 
      return;
    }
    fnCloseLayerPop(popupID);
  });
}

/**
  * @name fnCloseLayerPop()
  * @description 레이어팝업 닫기
  * @param {string} popID 팝업ID
  */
var fnCloseLayerPop = function(popID){
  var $el = $('#' + popID);

  $el.removeClass('show');
  setTimeout(function(){
    $el.find('.dim').remove();
    $('body').removeClass('overflow');
  },300);
};

/**
  * @name fnToastPop()
  * @description 토스트팝업 열기
  * @param {string} popID 팝업ID 
  */
var fnToastPop = function(popID) {
  var $el = $('#' + popID);
  $el.addClass('active');

  setTimeout(function(){
    $el.removeClass('active');
  }, 3000);
};

/**
  * @name exeTransitionInLayer()
  * @description 팝업 오픈시 트랜지션 실행
  */
var exeTransitionInLayer = function() {
  var popup = $('.layerpop__wrap');

  popup.on('layerOpened', function(e) {
    var $this = $(e.target);

    if ($this.find('.fnStickyTop').length) {
      setTimeout(function(){
        fnStickyTop.set();
      }, 300);
    }
  });
}

/**
  * @name fnTabControl();
  * @description tab 기능
  */
var fnTabControl = function() {
  $('.tab__wrap .tab__inner').each(function(){
    var $tabLi = $(this).find('li');
    var $tabBtn = $(this).find('a');

    $tabBtn.on('click', function(){
      $tabLi.removeClass('active');
      $(this).parent('li').addClass('active');
      
      var idx = $(this).closest('li').index(),
        $tabCont = $(this).parents('.tab__wrap').find('.tab-contents');

      $tabCont.eq(idx).addClass('active').siblings().removeClass('active');
    });
  });

  $('.tab-sub__wrap .tab-sub__inner').each(function(){
    var $tabLi2 = $(this).find('li');
    var $tabBtn2 = $(this).find('a');

    $tabBtn2.on('click', function(){
      $tabLi2.removeClass('active');
      $(this).parent('li').addClass('active');
      
      var idx2 = $(this).closest('li').index(),
        $tabCont2 = $(this).parents('.tab-sub__wrap').find('.tab-subcontents');

      $tabCont2.eq(idx2).addClass('active').siblings().removeClass('active');
    });
  });
}

/**
  * @name fnAccorControl();
  * @description accordion 기능
  */
var fnAccorControl = function() {
  $('.accordion__wrap').each(function(){
    var $accBtn = $(this).find('.accordion__tit');

    $accBtn.on('click', function(){
      $(this).toggleClass('active');
      $(this).parent('.accordion__list').toggleClass('active');
      
      var $accorCont = $(this).siblings('.accordion__con');
      $accorCont.slideToggle('100');
    });
  });
}

/**
  * @name fnSelectBtn();
  * @description select btn 기능
  */
var fnSelectBtn = function() {
  $('.select__wrap').each(function(){
    var $selectLi = $(this).find('li');

    $selectLi.on('click', function(){
      const selecType = $(this).parents('.select__wrap');
      if( selecType.hasClass('single-select') ) {
        $(this).addClass('active').siblings().removeClass('active');
      } 
      if( selecType.hasClass('multi-select') ) {
        $(this).toggleClass('active');
      }
    });
  });
}

/**
  * @name fnCountBtn();
  * @description 카운트 기능
  */
var fnCountBtn = function() {
  $('.count__con').each(function() {
    let $plusBtn = $(this).find('.btn-count__plus');
    let $minusBtn = $(this).find('.btn-count__minus');
    let $thisNum = $(this).find('.num');
    let $countAgeWrap = $(this).siblings('.count-age__wrap');

    updateMinusButton();
    $plusBtn.click(function() {
      let $num = $(this).siblings('.num');
      let currentValue = parseInt($num.text());

      $num.text(currentValue + 1);

      appendAgeSelection($countAgeWrap, currentValue + 1);
      updateMinusButton();
    });

    $minusBtn.click(function() {
      let $num = $(this).siblings('.num');
      let currentValue = parseInt($num.text());

      if (currentValue > 0) {
        $num.text(currentValue - 1);

        removeLastAgeSelection($countAgeWrap, currentValue - 1);
      }
      updateMinusButton();
    });

    function updateMinusButton() {
      let currentValue = parseInt($thisNum.text());
      if (currentValue > 0) {
        $minusBtn.children('.ico').addClass('active');
      } else {
        $minusBtn.children('.ico').removeClass('active');
      }
    }

    function appendAgeSelection($wrap, count) {
      $wrap.empty();
      for (let i = 1; i <= count; i++) {
        $wrap.append(`
          <div class="count-age">
            <p class="ft-xxs">아동 <span>${i}</span></p>
            <div class="count-select" data-name="popupAge">
              <p>나이 선택</p>
              <i class="ico ico-arrow__down"></i>
            </div>
          </div>
        `);
      }
    }

    function removeLastAgeSelection($wrap, count) {
      if (count === 0) {
        $wrap.empty();
      } else {
        $wrap.children().last().remove();
      }
    }
  });

  $(document).on('click', '.count-age', function() {
    $('.layerpop__select').addClass('show');

    $(this).find('.layerpop__select .select__wrap a').click(function(e) {
      e.preventDefault();
      $(this).parents('.layerpop__select').removeClass('show');
    });
  });

  $(document).on('click', '.layerpop__select .select__wrap a', function() {
    $(this).parents('.layerpop__select').removeClass('show');
  });

  $(document).on('click', '.layerpop__select .fnClosePop', function() {
    $(this).parents('.layerpop__select').removeClass('show');
  });
}

/**
  * @name fnFilterBtn();
  * @description 정렬 셀렉트
  */
var fnFilterBtn = function() {
  $('.filter-select__wrap').each(function(){
    var $filterBtn = $(this).find('.filter-select__tit');

    $filterBtn.on('click', function(){
      $(this).next().toggleClass('active');
    });
  });
}

/**
  * @name fnLikeBtn();
  * @description 찜 기능
  */
var fnLikeBtn = function() {
  $('.btn-product__like').each(function(){
    var $likeBtn = $(this);

    $likeBtn.on('click', function(){
      $(this).toggleClass('active');
    });
  });
}

/**
  * @name fnDefaultSlide();
  * @description default slide
  */
var fnDefaultSlide = function() {
  $('.splide__default').each(function(index, element) {
    new Splide(element, {
      arrows: false,
      type: 'loop',
      perPage: 1,
    }).mount();
  });
}

/**
  * @name fnProductSlide();
  * @description default slide
  */
var fnProductSlide = function() {
  $('.splide__product').each(function(index, element) {
    var splide = new Splide(element, {
      arrows: false,
      perPage: 1,
      pagination: false
    }).mount();

    var totalSlides = $(element).find('.splide__slide').length;
    $(element).find('.total-slides').text(totalSlides);

    splide.on('mounted moved', function () {
      var currentSlide = splide.index + 1;
      $(element).find('.current-slide').text(currentSlide);
    });
  });
};

/**
  * @name fnDoubleRange();
  * @description double range 기능
  */
$(document).ready(function() {
  let sliderOne = $(".slider-1");
  let sliderTwo = $(".slider-2");
  let displayValOne = $(".range1");
  let displayValTwo = $(".range2");
  let minGap = 0;
  let sliderTrack = $(".slider-track");
  let sliderMaxValue = sliderOne.attr("max");

  slideOne();
  slideTwo();
  sliderOne.on("input", function() {
    slideOne();
  });
  sliderTwo.on("input", function() {
    slideTwo();
  });

  function slideOne() {
    if (parseInt(sliderTwo.val()) - parseInt(sliderOne.val()) <= minGap) {
      sliderOne.val(parseInt(sliderTwo.val()) - minGap);
    }
    displayValOne.text(sliderOne.val());
    fillColor();
  }

  function slideTwo() {
    if (parseInt(sliderTwo.val()) - parseInt(sliderOne.val()) <= minGap) {
      sliderTwo.val(parseInt(sliderOne.val()) + minGap);
    }
    displayValTwo.text(sliderTwo.val());
    fillColor();
  }

  function fillColor() {
    let percent1 = (sliderOne.val() / sliderMaxValue) * 100;
    let percent2 = (sliderTwo.val() / sliderMaxValue) * 100;
    sliderTrack.css("background", `linear-gradient(to right, #EBEBEB ${percent1}% , #714CDC ${percent1}% , #714CDC ${percent2}%, #EBEBEB ${percent2}%)`);
  }
});

/**
  * @name fnRating();
  * @description 별점 기능
  */
var fnRating = function() {
  $(".rating").each(function (e) {
    var $rating = $(this).attr("data-rating");
    var $starWidth = $(this).attr("data-width");
    var $spacing = $(this).attr("data-spacing");
    $(this).rateYo({
        rating: $rating,
        starWidth: $starWidth,
        numStars: 5,
        halfStar: true,
        normalFill: "#EBEBEB",
        spacing: $spacing,
    });
  });
  $('.jq-ry-normal-group').find('path').attr('fill', $('.jq-ry-normal-group').find('svg').attr('fill'));
  $('.jq-ry-normal-group').find('path').attr('stroke', $('.jq-ry-normal-group').find('svg').attr('fill'));
};

/**
  * @name fnMoreBtn();
  * @description 리뷰 더보기 기능
  */
var fnMoreBtn = function() {
  $('.btn-more').click(function(){
    $(this).siblings('.review').toggleClass('active');
  });
};