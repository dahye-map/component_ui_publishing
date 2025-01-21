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
  _hasFixedBtn();
});

var registUI = function(){
  if ( $('#header').length ) { _headerControl(); } // 스크롤에 따른 Header
  if ( $('.contents .fnStickyTop').length ) { setTimeout(function(){fnStickyTop.set();},200);} // 스크롤에 따른 상단 sticky 고정
  if ( $('.layerpop-wrap').length ) { _layerPop(); exeTransitionInLayer(); } // 레이어팝업
  if ( $('.section-terms .chk-all-wrap').length ) { _agreeCheckAll(); } // 약관전체동의
  if ( $('.tab-wrap').length ) { fnTabControl(); } // 탭 기능
};


/**
  * @name _headerControl()
  * @description 스크롤에 따른 Header
  */
var _headerControl = function(){
  _headerChange($(window));

  function _headerChange(el) {
    $(el).on('scroll', function(){
      if ($(this).scrollTop() > 0) {
        $('#header').addClass('scrolled');
      }else {
        $('#header').removeClass('scrolled');
      }
    });
  }
};

/**
  * @name _hasFixedBtn()
  * @description 하단 버튼 고정 영역에 따른 하단 여백 설정
  */
var _hasFixedBtn = function() {
  var fixedBtn = $('.section-bottom-fixed');

  if(fixedBtn.length > 0) {
    $('.contents').addClass('hasbtn')
  }
};


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
    container = $(stickyEl).parents('.contents')[0];
    var headerHeight = $(window).width() > 320 // Header 기본 높이
      ? $('#header').outerHeight(true)
      : $('#header').outerHeight(true) * 10 / 9;
    var $fixedEl = $(container).find('.fnFixedTop'); // 상단고정 element
    setHeight = $fixedEl.length 
      ? headerHeight + parseInt($fixedEl.attr('data-height'))
      : headerHeight; // Header blur 높이
    top = container == $(stickyEl).parents('.contents')[0]
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
    // else if ($(stickyEl).parents('.layerpop-wrap').hasClass('show')) {_getTop();}
    var fixed = top;

    $(container).find('.fnStickyTop').removeClass('fixed');
    var stickyElements = container.querySelectorAll('.fnStickyTop');
    stickyElements.forEach(function(el) {
      el.style.top = fixed + 'rem'; // sticky position 설정
    });
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
  $('.section-terms').each(function(){
    var $this = $(this);
    var chkAllBtn = $this.find('.chk-all-wrap input[type="checkbox"]');
    var chks = $this.find('.agree-list-wrap input[type="checkbox"]');
    var _checkedAll = function() {
      // 전체체크
      if( $this.find('.agree-list-wrap input[type="checkbox"]:checked').length == chks.length ){
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
    var popId = $(this).closest('.layerpop-wrap').attr('id');
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

  if ($('.layerpop-wrap.show').length) {
    var current = $('.layerpop-wrap.show').css('z-index');
    var zIndex = parseInt(current) + 1;
    $el.css('z-index', zIndex);
  }

  $('body').addClass('overflow');
  $el.addClass('show').trigger('layerOpened');
  $el.append(dim);

  // 딤 클릭 시 해당 팝업 닫기
  $('.dim').on('click', function() {
    var popup = $(this).closest('.layerpop-wrap');
    var popupID = $(this).closest('.layerpop-wrap').attr('id');
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
  var page = $('.contents');
  var fullPop = $('.layerpop-wrap.type_full.show');
  $el.addClass('show');

  var _closeToast = function(){
    $el.addClass('closing');
    setTimeout(function(){
      $el.removeClass('show withFixedBtn closing');
    }, 3000);
  }

  if ( page.find('.wrap_btn_full').length && page.find('.wrap_btn_full').is(':visible') || fullPop.find('.wrap_btn_full').length ) {
    $el.addClass('withFixedBtn');
  }

  if ($el.hasClass('type_snackbar')) {
    // 스낵바 닫기
    $el.find('.btn_ico_close_w').on('click', function(){
      _closeToast();
    });
    // 스낵바 외 영역 클릭 시 툴팁 닫기
    $(window).on('touchstart', function(e) {
      if ($('.wrap_toast.type_snackbar.show').length && !$(e.target).hasClass('wrap_toast') && !$(e.target).parents('.wrap_toast').length ) {
        $('.wrap_toast.type_snackbar').removeClass('show withFixedBtn');
      }
    });
  } else {
    setTimeout(function(){
      _closeToast();
    }, 3000);
    
  }
};

/**
  * @name exeTransitionInLayer()
  * @description 팝업 오픈시 트랜지션 실행
  */
var exeTransitionInLayer = function() {
  var popup = $('.layerpop-wrap');

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
  * @name fnCheckInView()
  * @description 뷰포트 안에 있는 지 체크
  * @param {Element | string} el 뷰포트 안에 있는지 체크할 element 
  */
var fnCheckInView = function(el) {
  var posTop = $(el).offset().top;
  var posBottom = posTop + $(el).outerHeight();

  var viewTop = $(window).scrollTop();
  var viewBottom = viewTop + $(window).height();

  return posBottom > viewTop && posTop < viewBottom;
}

/**
  * @name fnScrollToEl()
  * @description 해당 element로 스크롤이동 애니메이션
  * @param {Element | string} el 스크롤 이동할 element 
  */
var fnScrollToEl = function(el) {
  var posTop = $(el).offset().top - $('#header').height() + 1;

  $('html, body').animate({
    scrollTop: posTop
  }, 400);
}


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
  * @name fnTabControl();
  * @description tab 기능
  */
var fnTabControl = function() {
  var $tab = $('.tab-wrap');
  var $tabLi = $('.tab-wrap ul li');
  var $tabBtn = $('.tab-wrap ul li a');

  $tabBtn.on('click', function(){
    $tabLi.removeClass('on');
    $(this).parent('li').addClass('on');
    
    // 스크롤 탭 감지
    if($tab.hasClass('type-scroll')) {
      var left = $('.tab-wrap ul li.on').offset().left - 20;
      var curLeft = $('.tab-wrap').scrollLeft();

      if(curLeft >= 300) {
        $('.section-tab-con').addClass('scrolled');
      } else {
        $('.section-tab-con').removeClass('scrolled');
      }
      $('.tab-wrap').animate({scrollLeft : curLeft+left}, 400);
    }

  });
}