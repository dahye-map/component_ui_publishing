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

  // disableUserScalable(); // user scaling 막기
  addNotchMeta(); // notch metatag추가
  registUI();
});

var registUI = function(){
  if ( $('#header').length ) { _headerControl(); } // 스크롤에 따른 Header
  if ( $('.contents .fnFixedTop').length ) { setTimeout(function(){_fixedTopInPage();},200); } // 스크롤에 따른 페이지 상단 fixed 고정
  if ( $('.contents .fnStickyTop').length ) { setTimeout(function(){fnStickyTop.set();},200);} // 스크롤에 따른 상단 sticky 고정
  if ( $('.section_bottom_fixed.type_noFullBtn .fnScrollEnd').length ) { _fixedBottomBtnGap(); } // 스크롤에 따른 페이지 하단고정 위치
  if ( $('.section_bottom_fixed .wrap_btn_full').length) { _checkfixedButton(); } // 하단고정버튼 유무에 따른 레이아웃
  if ( $('.wrap_link_list').length ) { _tabHightlight(); } // 링크 탭 하이라이트
  // if ( (iosV() >= 13) && $('.inp').length ) { _iOSInpFixdPos(); } // iOS 키패드 하단고정영역(iOS13 이상)
  if ( $('.wrap_inp').length ) { _inpControl(); } // 인풋 인터렉션
  if ( $('.wrap_inp.type_decimal').length ) { _inpDecimal(); } // 인풋 소수점 분리형
  if ( $('.type_won .inp').length ) { _inpWon(); } // 인풋 원단위 인터렉션
  if ( $('.textarea.preventEnter').length ) { _inpPreventEnter(); } // textarea 엔터키 입력 방지
  if ( $('.sel').length || $('.wrap_sel_list').length ) { _selControl(); } // 셀렉트
  if ( $('.wrap_quick_sel').length ) { _quickSelControl($('.wrap_quick_sel')); } // 셀렉트
  if ( $('.wrap_dropdown').length ) { _dropDown(); } // dropdown 선택
  if ( $('.wrap_tab_btn').length ) { _tabContents(); } // 탭 
  if ( $('.fnSimpleAcco').length ) { _simpleAcco(); } // 단일 아코디언
  if ( $('.section_faq').length ) { _faqAcco(); } // faq 아코디언
  if ( $('.section_terms .btn_acco').length ) { _agreeAccoBtn(); } // 약관동의 아코디언 기능
  if ( $('.section_terms .wrap_chk_all').length ) { _agreeCheckAll(); } // 약관전체동의
  if ( $('.wrap_tooltip').length ) { _tooltip(); } // 툴팁
  if ( $('.wrap_layer').length ) { _layerPop(); exeTransitionInLayer(); } // 레이어팝업
  
  if ( $('.wrap_item_benefit .list_benefit').length ) { _showBenefitList(); } // 혜택리스트 애니메이션
  if ( $('.list_benefit_label').length ) { _showBenefitLabel(); } // 혜택리스트 라벨 애니메이션
  if ( $('.wrap_loop_scrl').length ) { _loopScrlCont(); } // 무한스크롤링 컨텐츠
  if ( $('.fnFitToCont').length ) { _textFitToCont(); } // 택스트 사이즈 조정
  if ( $('.chart_bar_stacked').length ) { _barChartStacked(); } // stacked bar chart
  if ( $('.wrap_bubble[data-animate="trans"]').length ) { _bubbleAnimate(); } // 말풍선 애니메이션
  if ( $('.tooltip_bubble[data-width="flexable"]').length ) { _bubbleSetPosition(); } // 말풍선 위치조정

  if ( $('.gsp_travlog_info').length ) { _gspTravlogInfo(); } // 트래블로그 혜택안내 애니메이션 실행
  if ( $('.visual_usr_card').length ) { _usrCardAnimate(); } // 카드신청 브릿지 애니메이션 실행
  if ( $('.section_top_visual.cov002').length ) { _covGuideInfo(); } // 카드신청 브릿지 애니메이션 실행

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
  * @name _headerPopControl()
  * @description F-POP 콘텐츠 스크롤에 따른 Header
  * @param {Element} el 팝업 element
  */
var _headerPopControl = function(el){
  var defaultHeight = safeArea.header;

  $(el).find('.content_layer').on('scroll', function(){
    var $this = $(this);
    var $header = $this.closest('.inner_layer').find('.head_layer');
    var $fixedEl = $this.find('.fnFixedTop');
    var setHeight = parseInt($fixedEl.attr('data-height')) + defaultHeight + safeArea.top;

    if ($this.scrollTop() > 0) {
      $header.addClass('scrolled');
      if ( $fixedEl.length ) {
        _setFixedTop($fixedEl, $header, setHeight);
      }
    }else {
      $header.removeClass('scrolled');
      if ( $fixedEl.length ) {
        _clearFixedTop($fixedEl, $header);
      }
    }
  });
}

/**
  * @name _fixedTopInPage()
  * @description 페이지 스크롤에 따른 콘텐츠 상단고정
  */
var _fixedTopInPage = function() {
  var $fixedEl = $('.contents').find('.fnFixedTop');
  var $header = $fixedEl.closest('.contents').siblings('#header').find('.inner_fixed');
  var headerHeight = $(window).width() > 320 ? $('#header').outerHeight(true) : $('#header').outerHeight(true) * 10 / 9;
  var setHeight = $fixedEl.length ? headerHeight + parseInt($fixedEl.attr('data-height')) : headerHeight;

  $(window).on('scroll', function() {
    var scrollTop = $(this).scrollTop();
    if (scrollTop > 0) {
      _setFixedTop($fixedEl, $header, setHeight);
    } else {
      _clearFixedTop($fixedEl, $header);
    }
  });
}

/**
  * @name _fixedContent()
  * @description 스크롤에 따른 콘텐츠 상단고정
  * @param {element | string} fixedEl 고정할 element
  * @param {number} fixPos 고정할 element position top
  * @param {element | string} header 고정헤더 element
  * @param {setHeight} header 고정헤더 element 변경 height 
  */
function _setFixedTop(fixedEl, header, setHeight) {
  $(fixedEl).addClass('scrolled');
  $(header).css({
    'height': setHeight * 0.1 + 'rem',
  });

  if ( $(fixedEl).attr('data-addMargin') !== "false" ) {
    $(fixedEl).next('div').css({
      'margin-top': parseInt($(fixedEl).attr('data-height')) * 0.1 + 'rem'
    });
  }
}
function _clearFixedTop(fixedEl, header) {
  $(fixedEl).removeClass('scrolled');
  $(header).attr('style','');

  if ( $(fixedEl).attr('data-addMargin') !== "false" ) {
    $(fixedEl).next('div').attr('style','');
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
      filterHeight,
      top,
      observer;

  // Dispatches a sticky-event
  function _fire(stuck, target) {
    var evt = new CustomEvent('sticky-change', {detail: {stuck, target}});
    if ( !$(target).hasClass('wrap_filter') && $(container).find('.wrap_filter.fixed').length) {
      $(container).find('.wrap_filter').addClass('prev');
    }
    document.dispatchEvent(evt);
  }

  // stuck 감지를 위한 element 추가
  function _addSentinel(el, fixed) {
    var sentinelTop = parseInt(fixed + setHeight*0.1);
    var sentinel = document.createElement('div');
    sentinel.classList.add('sticky_sentinel', 'sticky_sentinel_top');
    sentinel.style.height = top + 'rem';
    sentinel.style.top = -sentinelTop + 'rem';
    if ( !$(el).parent().find('.sticky_sentinel').length ) {
      el.parentElement.append(sentinel);
    }
  }

  // detect stuck
  function _observeIntersection() {
    observer = new IntersectionObserver(function(records, observer) {
      for (var record of records) {
        var targetInfo = record.boundingClientRect;
        var stickyTarget = record.target.parentElement.querySelector('.fnStickyTop');
        var rootBoundsInfo = record.rootBounds;
  
        if (targetInfo.bottom < rootBoundsInfo.top) {
          _fire(true, stickyTarget);
        }
  
        if (targetInfo.bottom >= rootBoundsInfo.top &&
            targetInfo.bottom < rootBoundsInfo.bottom) {
          _fire(false, stickyTarget);
        }
      }
    }, {
      threshold: [0]
    });

    $('.sticky_sentinel_top').each(function(idx, el){
      observer.observe(el);
    })
  }
  
  // sticky 설정 계산 최초만 실행
  function _getTop() {
    stickyEl = document.querySelectorAll('.fnStickyTop');
    container = $(stickyEl).parents('.wrap_layer').hasClass('show') 
      ? $(stickyEl).parents('.content_layer')[0]
      : $(stickyEl).parents('.contents')[0];
    var headerHeight = $(window).width() > 320 // Header 기본 높이
      ? $('#header').outerHeight(true)
      : $('#header').outerHeight(true) * 10 / 9;
    var $fixedEl = $(container).find('.fnFixedTop'); // 상단고정 element
    setHeight = $fixedEl.length 
      ? headerHeight + parseInt($fixedEl.attr('data-height'))
      : headerHeight; // Header blur 높이
    top = container == $(stickyEl).parents('.contents')[0]
      ? setHeight * 0.1 - 0.2                   // page인 경우
      : (setHeight - headerHeight) * 0.1 - 0.2; // popup인 경우
    filterHeight = $(window).width() > 320
      ? safeArea.filter * 0.1
      : (safeArea.filter * 0.9) * 0.1;

    // Update sticky element class
    // document.addEventListener('sticky-change', function(e) {
    //   var [stickyEl, stuck] = [e.detail.target, e.detail.stuck];
    //   stickyEl.classList.toggle('fixed', stuck);
    // });

    return container, setHeight, top;
  }

  function unobserve() {
    // 기존 element 삭제 시 observer 기능 중지
    if ( iosV() < 13 || parseInt(androidV(ua)) < 7 ) {
      return;
    }
    // $('.sticky_sentinel_top').each(function(idx, el){
    //   observer.unobserve(el);
    // });
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
    // else if ($(stickyEl).parents('.wrap_layer').hasClass('show')) {_getTop();}
    var fixed = top;

    $(container).find('.fnStickyTop').removeClass('fixed');
    var stickyElements = container.querySelectorAll('.fnStickyTop');
    stickyElements.forEach(function(el) {
      if ( $(container).find('.wrap_filter').length && !$(el).hasClass('wrap_filter') ) {
        fixed = top + filterHeight;
      } else {
        fixed = top;
      }
      el.style.top = fixed + 'rem'; // sticky position 설정
      _addSentinel(el, fixed);
    });
    _observeIntersection();
  }

  return {
    set: set,
    unobserve: unobserve
  }
})();

/**
  * @name _fixedBottomBtnGap()
  * @description 페이지 스크롤에 따른 하단고정버튼 위치조정
  */
var _fixedBottomBtnGap = function() {
  var $fixedEl = $('.section_bottom_fixed.type_noFullBtn').find('.fnScrollEnd');
  var windowH = $(window).height();

  $(window).on('scroll', function() {
    var contentsH = $('body').outerHeight(true);
    if ( windowH + $(window).scrollTop() >= (contentsH - $fixedEl.outerHeight(true)) && !(contentsH - windowH <= 0)) {
      $fixedEl.addClass('scrollEnd');
    } else {
      $fixedEl.removeClass('scrollEnd');
    }
  });
}

/**
  * @name _checkfixedButton()
  * @description 페이지 스크롤에 따른 하단고정버튼 위치조정
  */
var _checkfixedButton = function() {
  var $fixedEl = $('.section_bottom_fixed');
  $fixedEl.closest('.contents').addClass('hasFixedBtn');
}

/**
  * @name _tabHightlight()
  * @description 링크 탭 하이라이트 컬러
  */
var _tabHightlight = function() {
  $(document).on('touchstart', '.wrap_link_list a', function(e){
    if (!$(this).hasClass('wrap_box')) {
      $(this).addClass('active');
    }
  });
  $(document).on('touchend', '.wrap_link_list a', function(e){
    $(this).removeClass('active');
  });
};

/**
  * @name _iOSInpFixdPos()
  * @description // iOS 키패드 오픈시 하단고정 영역 키패드 위로 (ios13이상)
  */
var _iOSInpFixdPos = function() {
  var fixedEl = $('.contents, .wrap_layer.type_full .inner_layer').find('.section_bottom_fixed > div');
  var height = window.visualViewport.height;
  var viewport = window.visualViewport;
  window.visualViewport.addEventListener('resize', resizeHandler);

  function resizeHandler() {
    fixedEl.each(function(idx, el) {
      var $el = $(el);
      var pos = -(height - viewport.height) + 'px';

      $el.css('transform', 'translateY(' +  pos + ')');
    });

    // keyboard 닫힘 시 - focus out
    if ( height - viewport.height == 0 ) {
      _resetInpWithFixedBtn();
    }
  }
};

/**
  * @name iOSKeyBoardHeight()
  * @description // iOS 키패드 오픈시 하단고정 영역 키패드 위로 (iOS12이하)
  * @param {keyboardHeight} // 네이티브에서 키보드 호출 시 높이값 전달하여 함수 바로 호출
  */
var iOSKeyBoardHeight = function(keyboardHeight) {
  if ($('.section_bottom_fixed').length && iosV() < 13 ) {
    $('.contents, .wrap_layer.type_full .inner_layer').find('.section_bottom_fixed > div').each(function(idx, el) {
      var pos =  -keyboardHeight + 'px';
      $(el).css('transform', 'translateY(' +  pos + ')');
    });
  }
}

/**
  * @name iOSKeyBoardHide()
  * @description // iOS 키패드 오픈시 하단고정 영역 키패드 닫힘 시 (iOS12이하)
  */
var iOSKeyBoardHide = function() {
  if ( $('.inp').length && iosV() < 13 ) {
    _resetInpWithFixedBtn();
  }
}

var _resetInpWithFixedBtn = function () {
  // console.log('reset input');
  $('.section_bottom_fixed > div').each(function(idx, el) {
    $(el).css('transform', '');
  });
  $('.inp').each(function(){
    $(this).blur();
    $(this).closest('.box_inp').removeClass('show_btn');
  });
}

/**
  * @name _inpControl()
  * @description // 인풋 입력창 인터렉션
  */
var _inpControl = function() {
  var inp = $('.wrap_inp .inp'),
      isFixed = false,
      returnFixed = inp.closest('.contents, .inner_layer').find('.section_bottom_fixed').attr('data-fixed');
  _inpChkVal(inp);

  inp.each(function(idx, el) {
    var keepFocus = false;
    var inpId = $(el).attr('id');
    // 입력 삭제 버튼 추가
    if ( $(el).siblings('.btn_ico_clear').length <= 0 && !$(el).hasClass('fnClearFocus') ) {
      $(el).closest('.box_inp').append('<button type="button" class="btn_ico_clear"><span class="blind">입력삭제</span></button>');
    }

    // 버튼이 있는 경우 간격 조정
    if ( $(el).closest('.box_inp').hasClass('hasBtn') ) {
      var padding = $(el).closest('.box_inp').find('.btn_round, .btn_box_s').outerWidth() + 4;
      $(el).css('padding-right', padding + 18);
      $(el).closest('.box_inp').find('.btn_ico_clear').css('right', padding);
    }

    // 레이블, 플레이스홀더 같은 경우
    if ( $(el).attr('placeholder') == $('label[for="'+inpId+'"]').text()) {
      $(el).closest('.wrap_inp').addClass('transparent');
    }

    // readonly
    if ( $(el).attr('readonly')) {
      $(this).closest('.wrap_inp').addClass('readonly');
    }

    $(el).on('focus', function(e){
      var $thisInp = $(this);
      _inpChkVal($thisInp);
      
      // 레이블 인터렉션 없는 타입
      if ($thisInp.closest('.wrap_inp').attr('data-interaction') !== 'false') { 
        $thisInp.closest('.wrap_inp').addClass('focused');
      }

      // iOS 키패드 하단고정영역
      if ( (iosV() >= 13) && !isFixed && returnFixed == 'true' ) {
        _iOSInpFixdPos();
        isFixed = true;
      }

      // AOS 키패드 하단고정영역
      if ( isAOS && returnFixed !== 'true') {
        $('.section_bottom_fixed').css({
          'visibility': 'hidden'
        });
      }
    });

    $(el).on('blur', function(e){
      keepFocus = false;
      setTimeout(function(){
        var $thisInp = $(this);
        if ( !keepFocus ) {
          // console.log('blur');
          $thisInp.closest('.box_inp').removeClass('show_btn');
          if ($thisInp.val() == '') {
            $thisInp.closest('.wrap_inp').removeClass('focused');
          }
          keepFocus = false;
        }
      }.bind($(el)), 0);
      if ( isAOS && returnFixed !== 'true' ) {
        $('.section_bottom_fixed').css({
          'visibility': 'visible'
        });
      }
    });

    $(el).bind('keyup change',function(e){
      if ($(this).hasClass('fnClearFocus')) {return;}
      // console.log('change');
      keepFocus = true;
      $(this).focus().click();
      $(this).closest('.box_inp').addClass('show_btn');
      _inpChkVal($(this));
    });
  
    // 인풋 claer 버튼 클릭시 - keep focus
    $(el).closest('.box_inp').find('.btn_ico_clear').bind('click', function(e) {
      e.preventDefault();
      keepFocus = true;
      // console.log('clear');
      $(this).siblings('.inp').val('').focus().click();
      $(this).closest('.box_inp').removeClass('show_btn hasVal');
    });
  
    // 하단고정영역 벼튼클릭시(CTA 제외) - keep focus
    $(el).closest('.contents').find('.section_bottom_fixed .wrap_btn_box button').bind('click', function(e) {
      e.preventDefault();
      // console.log('button');
      keepFocus = true;
    });
  
    // 하단고정영역 체크박스 클릭시 - focus out
    $(el).closest('.contents').find('.section_bottom_fixed .wrap_chk label').on('click', function(e) { 
      e.preventDefault();
      // console.log('check');
      keepFocus = false;
      var check = $(this).siblings('input');
      if ( !check.is(':checked') ) {
        check.prop('checked',true);
        $('.inp').blur();
      } else {
        check.prop('checked',false);
        $('.inp').blur();
      }
    });
  });

  // 인풋 및 하단고정영역 외 클릭 시 - focus out
  $('body').on('click', function(e) {
    e.stopPropagation();
    var el = e.target.classList;
    if (
      inp.is(':focus') 
      && !el.contains('inp') 
      && !el.contains('btn_ico_clear') 
      && !$(e.target).parents('.wrap_btn_box').parent('.section_bottom_fixed').length
      && !$(e.target).parents('.wrap_chk').parent('.section_bottom_fixed').length )  {
        _resetInpWithFixedBtn();
    }
  });
  // iOS focus 시 scroll 하면 input 초기화
  if (isiOS) {
    $('body').on('touchmove', function(e) {
      var el = e.target.classList;
      if (
        inp.is(':focus') 
        && !el.contains('inp') 
        && !el.contains('btn_ico_clear') 
        && (!$(e.target).parents('.section_bottom_fixed').length || !el.contains('.section_bottom_fixed')) ) {
          _resetInpWithFixedBtn();
        }
    });
  }
};

/**
  * @name _inpChkVal()
  * @description // 인풋 value에 따른 클래스
  * @param {string | Element} el 인풋 
  */
var _inpChkVal = function(el) {
  $(el).each(function(){
    if ($(this).val() !== '') {
      $(this).closest('.box_inp').addClass('hasVal');
      if ($(this).is(':focus')) {
        $(this).closest('.box_inp').addClass('show_btn');
      }
    } else {
      $(this).closest('.box_inp').removeClass('hasVal');
      $(this).closest('.box_inp').removeClass('show_btn');
    }
  });
};

var _inpDecimal = function() {
  $('.wrap_inp.type_decimal').each(function(){
    var $thisWrap = $(this);
    _inpDecimalChkVal($thisWrap.find('.inp'));
    
    $thisWrap.find('.inp').on('click',function(){
      $(this).val('').trigger('change');
    });
    $thisWrap.find('.inp').on('focus',function(){
      $(this).closest('.type_decimal').addClass('focus');
      $('.wrap_dropdown').removeClass('on');
      _quickSelCenter($('.wrap_quick_sel ul'), $('.wrap_quick_sel ul').outerHeight(true), 0);
      $('.wrap_quick_sel').removeClass('on').find('ul').hide();
    });
    $thisWrap.find('.inp').on('blur',function(){
      $(this).closest('.type_decimal').removeClass('focus');
      _inpDecimalChkVal($(this));
    });
    $thisWrap.find('.inp').on('keyup change',function(){
      _inpChkVal($(this));
      _inpDecimalChkVal($(this));
    });

    function _inpDecimalChkVal(el) {
      if ($(el).closest('.type_decimal').find('.hasVal').length < 1) {
        $(el).closest('.type_decimal').removeClass('hasVal');
      } else {
        $(el).closest('.type_decimal').addClass('hasVal');
      }
    }
  });
}

/**
  * @name _inpWon()
  * @description // 인풋 원화단위 입력에 따른 인터렉션
  */
var _inpWon = function() {
  $('.type_won .inp').each(function() {
    var inp = $(this);
    var unit = inp.siblings('.unit');
    unit.prepend('<span class="value"></span>');

    if (inp.val() !== '') {
      unit.find('.value').text(inp.val());
    }

    inp.on('input', function(){
      unit.find('.value').text($(this).val());
    })
  });
}

/**
  * @name _inpPreventEnter()
  * @description // textarea 엔터키 입력 방지
  */
var _inpPreventEnter = function() {
  $('.textarea.preventEnter').on('keypress', function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  });
}

/**
  * @name _selControl()
  * @description // selecbox status
  */
var _selControl = function() {
  $('.sel').each(function(idx, el){
    $(el).on('click', function(e){
      if (!$(this).hasClass('btn_sel_date')) {
        $(this).addClass('focus');
      }
    });
  });

  // custom option click
  $('.fnOpt').on('click', function(){
    $(this).closest('li').addClass('selected').siblings().removeClass('selected');

    // 하단고정버튼이 없는 경우 리스트 클릭시 닫기
    if ( !$(this).closest('.wrap_layer').hasClass('hasFixedBtn')) {
      setTimeout(function(){
        _closeSelList($(this));
      }.bind($(this)), 0);
    }
  });

  $('.fnCloseSel').on('click', function(){
    _closeSelList($(this));
  });
}
/**
  * @name _closeSelList()
  * @description // selecbox layer 닫을 시 선택값 체크
  * @param {el} // 클릭한 element
  */
var _closeSelList = function(el) {
  var popId = $(el).closest('.wrap_layer').attr('id');
  var $sel = $('[data-name="' + popId + '"]');
  var selected = $('#'+popId).find('.wrap_sel_list .selected');

  if ( selected.length ) {
    $sel.removeClass('default');
    $sel.find('.value').text(selected.find('.txt').text());
    $sel.next('.hiddenInp').val(selected.find('.fnOpt').attr('data-option'));
  } else {
    $sel.addClass('default');
    $sel.find('.value').text('');
    $sel.next('.hiddenInp').val('');
  }

  $sel.removeClass('focus');
  fnCloseLayerPop(popId, $sel);
}

var _quickSelControl = function(el) {
  $(el).each(function(){
    var $wrapSel = $(this);
    var $wrapList = $wrapSel.find('ul');
    var listH = $wrapList.height();
    _quickSelCenter($wrapList, listH, 0);
    $wrapSel.find('.btn_acco').on('click', function(){
      _quickSelCenter($wrapList,listH, 0);
      if ($wrapSel.hasClass('on')) {
        $wrapSel.removeClass('on').find('ul').slideUp(200);
      } else {
        $wrapSel.addClass('on');
        setTimeout(function(){
          $wrapSel.addClass('on').find('ul').slideDown(200);
        },100);
      }
    });
    $wrapSel.find('.fnOptQuick').on('click', function(){
      $(this).closest('li').addClass('selected').siblings().removeClass('selected');
      _quickSelCenter($wrapList, listH, 200);
    });
  });
}
function _quickSelCenter(list, height, duration) {
  var $list =$(list); 
  var selected = $list.find('.selected');
  var listH = height;
  var liH = selected.outerHeight(true);
  var idx = selected.index();
  var q = 0;
  var $item = $list.find('li');
  for(var i = 0; i < idx; i++){
    q+= $($item[i]).outerHeight(true);
  }
  $list.animate({
    scrollTop: (Math.max(0, q - (listH - liH)/2))
  }, duration);
}

/**
  * @name _dropDown()
  * @description // dropdown 선택. 리스트텍스트와 선택값 텍스트가 동일한 경우에만 선택값 노출기능
 */
var _dropDown = function() {
  $('.wrap_dropdown').each(function() {
    var $el = $(this);
    var $btnDropDown = $(this).find('.btn_dropdown');
    var $list = $(this).find('.list_dropdown');
    var $selBtn = $list.find('button');
    
    $btnDropDown.on('click', function() {
      if ($el.hasClass('on')) {
        $el.removeClass('on');
      } else {
        $el.addClass('on');
      }
    });
  
    $selBtn.on('click', function() {
      if ($($el).data('type') != 'exr') {
        var selected = $(this).find('span').text();
        $el.find('.current').text(selected);
      }
      if ($el.hasClass('on')) {
        $el.removeClass('on');
      } else {
        $el.addClass('on');
      }
    });
    
    // dropdown 외 영역 클릭 시 툴팁 닫기
    $(window).on('touchstart', function(e) {
      if ($('.wrap_dropdown.fnCloseOut.on').length && (!$(e.target).hasClass('wrap_dropdown') || !$(e.target).parents('.wrap_dropdown').length)) {
        setTimeout(function(){
          $('.wrap_dropdown.on').removeClass('on');
        },200);
      }
    });
  });
}

/**
  * @name _tabContents()
  * @description // 탭
  */
var _tabContents = function() {
  var $tabSection;
  var $tabBtn = $('.wrap_tab_btn').find('.btn_tab_box'); // 탭버튼
  var $tabFoldBtn = $('.section_tab').find('.btn_fold'); // 탭 전체메뉴 열기 버튼
  var $tabFoldList = $('.section_tab').find('.wrap_tab_all .btn_tab_list'); // 탭 전체메뉴 리스트버튼
  var tabPosX = [0];
  var tabLi = 0;

  // 스크롤탭 위치 저장
  if ($('.section_tab.type_scroll').length) {
    $('.section_tab.type_scroll').find('.wrap_tab_btn li').each(function(idx){
      tabLi += $(this).outerWidth(true);
      tabPosX[idx + 1] = tabLi;
    });
  }

  // 탭 클릭 시
  $tabBtn.on('click', function() {
    $tabSection = $(this).closest('.section_tab');
    var idx = $(this).closest('li').index(),
        $tabCont = $tabSection.find('.tab_cont'),
        $tabList = $(this).closest('.wrap_tab_btn');

    _activeScrollBtn($tabList, idx);
    $tabCont.eq(idx).addClass('on').siblings().removeClass('on');

    // TDL_006
    if ($tabSection.hasClass('type_fullpage')) {
      $(document).scrollTop(0);
    }

    // 스크롤 탭
    if ($tabSection.hasClass('type_scroll')) {
      var $foldList = $tabSection.find('.wrap_tab_all ul');

      _activeScrollBtn($foldList, idx);
      _scrollTab($tabList, idx);
    }

    // 열려 있는 툴팁 삭제
    if ($('.wrap_tooltip.show').length) {
      $('.wrap_tooltip.show').removeClass('show');
    }
  });

  // 탭 전체메뉴 클릭 시
  $tabFoldList.on('click', function(){
    var idx = $(this).closest('li').index();
    var $foldList = $(this).closest('.wrap_tab_all');

    $foldList.slideUp(200).siblings('.btn_fold').removeClass('on');
    _activeScrollBtn($foldList.find('ul'), idx);
    _activeScrollBtn($('.wrap_tab_btn'), idx);
    _scrollTab($('.wrap_tab_btn'), idx);
  });

  // 탭 전체메뉴 펼침
  $tabFoldBtn.on('click', function(){
    if ($(this).hasClass('on')) {
      $(this).removeClass('on')
        .next('.wrap_tab_all').slideUp(200);
    } else {
      $(this).addClass('on')
        .next('.wrap_tab_all').slideDown(200);
    }
  });

  function _scrollTab(el, idx) {
    el.animate({
      scrollLeft: tabPosX[idx],
    },200);
    $(document).scrollTop(0);
    $('.content_layer').scrollTop(0);
  }

  function _activeScrollBtn(el, idx) {
    el.find('li').eq(idx).addClass('on').siblings().removeClass('on');
  }
}

/**
  * @name _simpleAcco()
  * @description // 단일 아코디언 버튼
  */
var _simpleAcco = function() {
  var accoBtn = $('.fnSimpleAcco').find('.btn_acco');
  accoBtn.on('click',function(){
    var $accoCont = $(this).siblings('.wrap_acco');

    if ($(this).hasClass('on')) {
      $(this).removeClass('on');
      $accoCont.slideUp(300);
    } else {
      $(this).addClass('on');
      $accoCont.slideDown(300);
    }
  });
}

/**
  * @name _faqAcco()
  * @description // faq 아코디언
  */
var _faqAcco = function() {
  var accoBtn = $('.section_faq').find('.btn_acco');
  accoBtn.on('click',function(){
    var $item = $(this).closest('li');
    var $accoCont = $item.find('.wrap_acco');

    if ($item.hasClass('on')) {
      $item.removeClass('on');
      $accoCont.slideUp(300);
      $(this).attr('title', 'faq 상세 열기');
    } else {
      $item.addClass('on');
      $accoCont.slideDown(300);
      $(this).attr('title', 'faq 상세 닫기');
    }
  });
}

/**
  * @name _agreeAccoBtn()
  * @description // 약관동의 아코디언 버튼
  */
var _agreeAccoBtn = function() {
  var accoBtn = $('.section_terms .btn_acco');

  accoBtn.on('click', function(){
    var $this = $(this);
    var $accoCont = $(this).closest('.box_chk').siblings('.wrap_acco');

    if ($this.hasClass('on')) {
      _closeAgreeAcco($this, $accoCont);
    } else {
      _openAgreeAcco($this, $accoCont);
    }
  });

  var _openAgreeAcco = function(btn, acco){
    $(btn).addClass('on');
    if ($(acco).attr('data-show') !== 'required') {
      $(acco).slideDown(300);
    } else {
      $(acco).slideDown(0, function(){
        $(acco)[0].scrollIntoView({ behavior: 'smooth', block: 'center'});
      });
    }
  }

  var _closeAgreeAcco = function(btn, acco){
    $(btn).removeClass('on');
    $(acco).slideUp(300);
  }
}

/**
  * @name _agreeCheckAll()
  * @description // 약관전체동의
  */
var _agreeCheckAll = function() {
  $('.section_terms').each(function(){
    var $this = $(this);
    var chkAllBtn = $this.find('.wrap_chk_all input[type="checkbox"]');
    var chks = $this.find('.wrap_agree_list input[type="checkbox"]');
    var requiredChk = $this.find('.wrap_agree_list li > .box_chk input[required]')
    var submitBtn = $this.closest('.contents').find('.wrap_btn_full .btn_full_primary');
    var mustShowEl = $this.find('[data-show="required"]');

    // 팝업일 경우
    if ($this.parents('.wrap_layer').length) {
      submitBtn = $this.closest('.wrap_layer').find('.wrap_btn_full .btn_full_primary');
    }

    // 필수노출영역
    var _openMustShow = function() {
      if (mustShowEl.length) {
        mustShowEl.slideDown(0, function(){
          mustShowEl.siblings('.box_chk').find('.btn_acco').addClass('on');
          mustShowEl[0].scrollIntoView({ behavior: 'smooth', block: 'center'});
        });
      }
    }

    // submit 버튼 status
    var _activeSubmit = function(){
      if ($this.attr('data-terms') == 'false') { return; }
      submitBtn.prop('disabled',false);
    };
    var _inactiveSubmit = function(){
      if ($this.attr('data-terms') == 'false') { return; }
      submitBtn.prop('disabled',true);
    }

    var _checkedAll = function() {
      // 전체체크
      if( $this.find('.wrap_agree_list input[type="checkbox"]:checked').length == chks.length ){
        chkAllBtn.prop('checked',true);
      }else{
        chkAllBtn.prop('checked',false);
      }

      // 필수체크 확인
      if ( requiredChk.length !== $this.find('.wrap_agree_list input[required]:checked').length ) {
        _inactiveSubmit();
      } else {
        _activeSubmit();
      }
    }

    // 전체동의버튼 클릭
    chkAllBtn.on('change', function(){
      if( $(this).is(':checked') == false ){
        chks.prop('checked',false);
        _inactiveSubmit();
      }else{
        chks.prop('checked',true);
        _activeSubmit();
        _openMustShow();
      }   
    });

    chks.on('change', function(){
      var dep2 = $(this).closest('.box_chk').siblings('.wrap_acco');

      // 하위체크
      var sub = $(this).closest('li').find('input[type="checkbox"]');
      if( sub.length && $(this).is(':checked') == true ) {
        sub.prop('checked',true);
        if (dep2.length && dep2.attr('data-show') == 'required' ) {
          _openMustShow();
        }
      } else if ( sub.length && $(this).is(':checked') == false ){
        sub.prop('checked',false);
      }
      
      // 상위체크
      var parentChk = $(this).closest('.indent-box, .wrap_acco').siblings('.box_chk').find('input[type="checkbox"]');
      var checkLength = $(this).closest('.chk_list').children('li').find('input[type="checkbox"]:checked').length;
      if( checkLength <= 0 ) {
        parentChk.prop('checked',false);
      } else {
        parentChk.prop('checked',true);
      }

      // 체크에 따른 아코디언 닫힘 기능
      if ( dep2.length && dep2.attr('data-show') !== 'required' && dep2.find('input[type="checkbox"]:checked').length ) {
          $(this).closest('.box_chk').find('.btn_acco').removeClass('on');
          $(this).closest('.box_chk').siblings('.wrap_acco').slideUp(300);
      } else if ( !dep2.length && !$(this).closest('.wrap_acco').find('input[type="checkbox"]').not(':checked').length ) {
        $(this).closest('.wrap_acco').siblings('.box_chk').find('.btn_acco').removeClass('on');
        $(this).closest('.wrap_acco').slideUp(300);
      }
  
      _checkedAll();
    });
  });
}

/**
  * @name _tooltip()
  * @description // 툴팁
  */
var _tooltip = function() {
  var $focusEl;

  $('.fnOpenTooltip').on('click', function(){
    $focusEl = $(this);
    var $tooltip = $('#' + $(this).attr('data-name'));
    var winW = $(window).outerWidth();
    var width = $tooltip.outerWidth(true)/2;
    var posY = $focusEl.offset().top + $focusEl.outerHeight() + 5;
    var posX = winW/2 - width; // default center
    var btnX = 0;
    
    // inside pop
    if ($('.wrap_layer.show').length) {
      var current = $('.wrap_layer.show').css('z-index');
      var zIndex = parseInt(current) + 1;
      $tooltip.css({'z-index' : zIndex});
    }

    // get Btn position
    if ($focusEl.find('.ico_tooltip').length) {
      btnX = $focusEl.find('.ico_tooltip').offset().left + ($focusEl.find('.ico_tooltip').outerWidth(true)/2);
    } else {
      btnX = $focusEl.offset().left + $focusEl.outerWidth(true)/2;
    }

    // calc position left
    if ( btnX < winW/3 ) {
      posX = '2.4rem';
    } else if ( btnX > winW * 0.66 ) {
      posX = winW - $tooltip.outerWidth(true) - 24;
    }

    $tooltip.css({
      'top': posY,
      'left': posX,
    });
    $tooltip.addClass('show');
    $tooltip.find('.inner_tooltip').children(':first').focus();
  });

  $('.fnCloseTooltip').on('click', function(){
    var $closeTooltip = $(this).closest('.wrap_tooltip');
    $closeTooltip.removeClass('show');
    $focusEl.focus();
  });

  // 툴팁 외 영역 클릭 시 툴팁 닫기
  $(window).on('touchstart', function(e) {
    if ($('.wrap_tooltip.show').length && !$(e.target).hasClass('wrap_tooltip') && !$(e.target).parents('.wrap_tooltip').length ) {
      $('.wrap_tooltip').removeClass('show');
      $focusEl.focus();
    }
  });
};

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
    var popId = $(this).closest('.wrap_layer').attr('id');
    if ( !$focusBtn ) {
      $focusBtn = $('[data-name="' + popId + '"]');
    }
    fnCloseLayerPop(popId, $focusBtn);
  });
};

/**
  * @name _showBenefitList()
  * @description // 혜택리스트
  */
var _showBenefitList = function() {
  if ( parseInt(androidV(ua)) < 6 ) { return false; }
  var $el = $('.wrap_item_benefit');
  var tit = $el.find('.tit_wrap');
  var list = $el.find('.list_benefit li');

  if (!$el.is(':visible')) return;
  if ($el.parents('.wrap_layer').length && !$el.parents('.wrap_layer').hasClass('show')){
    // F-Pop 일 경우
    return;
  } else {
    if ( $('.section_top_visual.my_benefit').length ) {
      // VDB001 dom class change 감지 후 실행
      var target = $('.section_top_visual.my_benefit')[0];
      var config = { attributes: true };
      var callback = function(){
        _titShow();
        _listshow();
      }
      observeDomChanges(target, config, callback);
    } else {
      _titShow();
      _listshow();
    }
  }

  function _titShow() {
    tit.waypoint({
      handler: function() {
        $el.find('.tit_wrap').addClass('transform');
      },
      offset: '100%'
    });
  }

  function _listshow() {
    list.each(function(){
      var $this = $(this);
      $this.waypoint({
        element: this,
        handler: function() {
          $this.addClass('transform active');
          $('.list_benefit li.active').each(function(idx){
            var delay = 0.1 * idx + 's';
            $(this).css({
              'transition-delay': delay
            });
          });
          setTimeout(function(){
            list.removeClass('active');
          },100);
          
        },
        context: '.content_layer',
        offset: '100%'
      });
    });
  }
}
/**
  * @name _showBenefitLabel()
  * @description // 혜택리스트 라벨 애니메이션
  */
var _showBenefitLabel = function() {
  var $el = $('.list_benefit_label li');
  
  if (!$el.is(':visible')) return;
  // F-Pop 일 경우
  if ($el.parents('.wrap_layer').length && !$el.parents('.wrap_layer').hasClass('show')){
    return;
  }

  $el.each(function(){
    var $this = $(this);
    $this.waypoint({
      handler: function() {
        $this.addClass('transform');
      },
      context: '.content_layer',
      offset: '85%'
    });
  });
}

/**
  * @name _loopScrlCont()
  * @description // 무한 자동 스크롤 컨텐츠
  */
var _loopScrlCont = function(){
  var styles = '';
  $('.wrap_loop_scrl').find('ul').each(function(){
    var $list = $(this),
      listClass = $list.attr('class'),
      dir = $list.data('dir'),
      $slide = $list.find('li').clone(),
      length = $list.find('li').length,
      width = $list.find('li').outerWidth(true),
      left = -(width * length),
      duration = 2000 * length;

    if (dir === 'rtl') {
      styles += '.' + listClass + ' { animation: ' + listClass + ' ' + duration + 'ms linear reverse infinite ; }';
    } else {
      styles += '.' + listClass + ' { animation: ' + listClass + ' ' + duration + 'ms linear infinite; }';
    }
    
    $list.append($slide);
    $list.prepend($slide.clone());
    styles += '@keyframes ' + listClass + ' { ';
    styles += '0% { transform: translateX(0) }';
    styles += '100% { transform: translateX(' + left + 'px) }';
    styles += '}';
  });

  var styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerHTML = styles;
  document.getElementsByTagName('head')[0].appendChild(styleSheet);
}

/**
  * @name _textFitToCont()
  * @description // adjust font-size to fit 
  */
var _textFitToCont = function(){
  var $el = $('.fnFitToCont');

  var observer = new MutationObserver(function(e){
    resize();
  });

  $el.each(function(){
    observer.observe($(this).find('.txt_num')[0], {
      childList: true,
      characterData: true
    });
  });

  function resize() {
    $el.each(function(idx, el){
      $(this).removeAttr('style');
      var txt = $(this).find('.txt_num').text().replace(/,/g, '').length;
      var size = (parseInt($(this).css('font-size')) - 2) + 'px';
      if ( txt > 6 ) {
        $(this).css('font-size', size);
      } else {
        // VDB_001 동전차트영역 텍스트사이즈 줄어든 항목이 있을 경우 해당박스영역 텍스트 일괄변경
        if ($(this).closest('.wrap_vdb_list').find('.fnFitToCont').attr('style') ) {
          $(this).closest('.wrap_vdb_list').find('.fnFitToCont').css('font-size', size);
        }
      }
    });
  }
  resize();
}

/**
  * @name _barChartStacked()
  * @description // animate stacked bar chart
  */
var _barChartStacked = function(){
  $('.chart_bar_stacked').each(function(){
    fnAnimateBar($(this));
  });
}

/**
  * @name _bubbleAnimate()
  * @description // animate bubble
  */
var _bubbleAnimate = function(){
  $('.wrap_bubble[data-animate="trans"]').each(function(idx, el){
    $(el).waypoint({
      element: this,
      handler: function() {
        $(el).addClass('transform');
        this.destroy();
      },
      offset: '100%'
    });
  });
}

/**
  * @name _bubbleSetPosition();
  * @description // bubble overflow에 따른 position 조정
  */
var _bubbleSetPosition = function(){
  var side = 12;
  var windowW = $(window).width();

  $('.tooltip_bubble[data-width="flexable"]').each(function(idx, el){
    var width = $(el).width();
    var bubblePos = el.getBoundingClientRect().left > windowW 
                    ? el.getBoundingClientRect().left - windowW
                    : el.getBoundingClientRect().left;
    var caret = $(el).hasClass('size_m, size_s') ? 5 : 7;
    var relativeEl = $(el).attr('id') 
                    ? $('[aria-describedby="'+ $(el).attr('id') +'"]')
                    : $(el).parent();
    var relativePos = relativeEl[0].offsetLeft + relativeEl.width()/2;
    var bubbleWidth = bubblePos + width;

    if (bubblePos < 0) {
      // 왼쪽으로 넘치는 경우 조정
      $(el).css({
        'left': side * 0.1 + 'rem',
        'right': 'auto',
        'transform': 'none'
      });
      $(el).find('.bubble_caret').css({
        '-webkit-mask-position-x': (relativePos - side - caret) * 0.1 + 'rem'
      });
    } else if (bubbleWidth > windowW) {
      // 오른쪽으로 넘치는 경우 조정
      $(el).css({
        'left': 'auto',
        'right': side * 0.1 + 'rem',
        'transform': 'none'
      });
      $(el).find('.bubble_caret').css({
        '-webkit-mask-position-x': (width - relativePos) * 0.1 + 'rem'
      });
    }
  });
}

/**
  * @name fnOpenLayerPop()
  * @description 레이어팝업 열기
  * @param {string} popID 팝업ID 
  */
var fnOpenLayerPop = function(popID) {
  var $el = $('#' + popID);

  if ($('.wrap_layer.show').length) {
    var current = $('.wrap_layer.show').css('z-index');
    var zIndex = parseInt(current) + 1;
    $el.css('z-index', zIndex);
  }

  if ($el.find('.section_bottom_fixed').length) {
    $el.addClass('hasFixedBtn');
  }

  $('body').addClass('overflow');
  $el.addClass('show').trigger('layerOpened');
  $el.append(dim);

  if ($el.find('.tit_layer').length) {
    var tit = $el.find('.tit_layer');
    tit.focus();

    // 팝업 타이틀 영역보다 넘칠 경우 텍스트 사이즈 조정
    setTimeout(function(){
      if (tit[0].scrollWidth > tit.width()) {
        var fontSize = (parseInt(tit.width() / tit.text().replace(/ /g, '').length) * 1.1);
        if (fontSize < 1) { 
          return;
        } else {
          tit.css('font-size', fontSize + "px");
        }
      }
    },100);
  } else {
    $el.find('.inner_layer').children(':first').focus();
  }

  // 풀팝업인 경우 헤더스크롤 이벤트 실행
  if ($el.hasClass('type_full')) {
    _headerPopControl($el);
  }

  // 딤 클릭 시 해당 팝업 닫기
  $('.dim').on('click', function() {
    var popup = $(this).closest('.wrap_layer');
    var popupID = $(this).closest('.wrap_layer').attr('id');
    // bottom sheet를 제외한 레이어 dim 클릭시 닫힘 기능 없음
    if (popup.hasClass('type_alert') || popup.hasClass('type_center') || popup.hasClass('type_full') || popup.hasClass('fnBlockDimClose')) { 
      return;
    }
    // select option list 레이어 인 경우 닫을 시 선택값 체크
    if (popup.find('.fnOpt').length) {
      _closeSelList($(this));
    }
    fnCloseLayerPop(popupID);
  });
}

/**
  * @name fnCloseLayerPop()
  * @description 레이어팝업 닫기
  * @param {string} popID 팝업ID
  * @param {string | Element} focusEl focus보낼 element
  */
var fnCloseLayerPop = function(popID, focusEl){
  var $el = $('#' + popID);
  var $focusEl;

  if (!focusEl) {
    $focusEl = $('[data-name="' + popID + '"]');
  } else {
    $focusEl = $(focusEl);
  }

  $el.removeClass('show').addClass('closing');
  setTimeout(function(){
    $el.find('.dim').remove();
    $el.removeClass('closing').removeAttr('style');
    $('body').removeClass('overflow');
    $focusEl.focus();
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
  var fullPop = $('.wrap_layer.type_full.show');
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
  var popup = $('.wrap_layer');

  popup.on('layerOpened', function(e) {
    var $this = $(e.target);

    if ($this.find('.fnStickyTop').length) {
      setTimeout(function(){
        fnStickyTop.set();
      }, 300);
    }

    // wrap_item_benefit 
    if ($this.find('.wrap_item_benefit')) {
      setTimeout(function(){
        _showBenefitList();
      }, 300);
    }

    // list_benefit_label
    if ($this.find('.list_benefit_label')) {
      setTimeout(function(){
        _showBenefitLabel();
      }, 300);
    }

    // VDB_003
    if ($this.find('.list_benefit_tower')) {
      setTimeout(function(){
        $this.find('.list_benefit_tower li').addClass('transform');
      }, 300);
    }
    
    // USR_103 - 페이지전환으로 삭제
    // if ($this.find('.visual_usr_card')) {
    //   setTimeout(function(){
    //     $this.find('.visual_usr_card').addClass('transform');
    //   }, 200);
    // }

    // GSP_001
    if ($this.find('.visual_gsp_overseas')) {
      setTimeout(function(){
        $this.find('.visual_gsp_overseas').addClass('transform');
      }, 300);
    }

    // HMN207
    if ($this.find('.cov_update').length) {
      $('.tit_big').addClass('transform');
    }
  });
}

/**
  * @name skeletonLoading.start();
  * @description skeleton loading
  * @param {Element | string} el loading element
  */
var skeletonLoading = (function(){
  var $el;

  function _moneybagListLoading(el) {
    var list = $(el).find('.wrap_list_trans');
    var item = '<div class="list_trans skeleton">';
        item += '<div class="trans_info">';
        item += '<h4 class="skeleton-item"></h4>';
        item += '<ul><li class="skeleton-item"></li><li class="skeleton-item"></li></ul>';
        item += '</div>';
        item += '</div>';

    if ($(el).hasClass('skeletonLoading')) {
      list.prepend(item);
    } else {
      $('.list_trans.skeleton').remove();
    }
  }

  function start(el){
    $el = $(el);
    $el.addClass('skeletonLoading');

    // 조회리스트인 경우 (TDL_001)
    if (el == '.section_list_trans') {
      _moneybagListLoading($el);
    }
  }

  function end(el){
    $el = $(el);
    $el.removeClass('skeletonLoading');
    
    // 조회리스트인 경우 (TDL_001)
    if (el == '.section_list_trans') {
      _moneybagListLoading($el);
    }
  }

  return {
    start: start,
    end: end
  }
})();

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
  * @name fnCounterUp()
  * @description number counter up
  * @param {Element | string} el element 
  * @param {number} delay The delay in milliseconds per number count up
  * @param {number} time The total duration of the count up animation
  */
var fnCounterUp = function(el, delay, time) {
  var $el = $(el);

  $el.counterUp({
    delay: delay,
    time: time
  });
}

/**
  * @name fnAnimateBar()
  * @description bar chart animation
  * @param {Element | string} el bar chart element 
  */
var fnAnimateBar = function(el) {
  var $el = $(el),
      basis = 0,
      bar = $el.find('.bar');
  bar.each(function(){
    basis += parseInt( $(this).find('.txt_num').text().replace(/,/g, ''), 10 );
  })

  $el.waypoint({
    handler: function() {
      bar.each(function() {
        var amount = parseInt( $(this).find('.txt_num').text().replace(/,/g, ''), 10 );
        var rate = Math.round( ((amount / basis) * 100) );
        $(this).data('percent', rate);
        var percentage = $(this).data('percent') + '%';
        if ( amount == 0 ) {
          $(this).css('min-width','unset');
        }else {
          $(this).removeAttr('style');
        }
        $(this).css('width', percentage);
        
      });
    },
    offset: '90%'
  });
}

/**
  * @name fnVdbCoinChart.animate()
  * @description 내가받은 혜택 동전 애니메이션
  * @url VDB_001
  */
var fnVdbCoinChart = (function() {
  var $el, waypoint;

  function animate(el) {
    $el = $(el);
    $el.each(function(idx, el){
      if ( $(el).hasClass('transform') || !$(el).is(':visible') ) { 
        return;
      }
      $(el).find('li').each(function(listIdx, listEl){
        if ( !$(this).hasClass('empty') ) {
          var chart = $(this).find('.chart_coin');
          var coinH = 6;
          
          // 첫번째 카테고리 기준 비율 계산 data-percent 설정
          if ( listIdx > 0 ) {
            var basis = parseInt( $(el).find('li:first-child').find('.txt_num').text().replace(/,/g, ''), 10 );
            var currentVal = parseInt( $(this).find('.txt_num').text().replace(/,/g, ''), 10 );
            var rate = Math.round( ((currentVal / basis) * 100) );

            chart.data('percent', rate);
          }
          
          // data-percent 값을 가져와 coin 이미지 생성
          var percentage = chart.data('percent');
          var coinSize = parseInt( (chart.outerHeight(true) * percentage / 100) / coinH );
          if (coinSize < 6) {
            var coins = '<p class="img_coin"></p>';
          } else {
            var coins = new Array(coinSize).join('<p class="img_coin"></p>');
          };

          chart.find('.img_coin').remove();
          chart
            .append(coins)
            .find('.img_coin').last().addClass('last');
          // setTimeout(function(){
          //   $(el).addClass('transform');
          // },100);
        }
      });
      
      if ( fnCheckInView($(el).find('.chart_coin')) && fnCheckInView($(el).find('.txt_amount')) ) {
        _checkView($(el));
      }
      // 스크롤에 따른 animation 시작
      $(window).on('scroll', function(){
        _checkView($(el));
      });
    });
  }

  function _checkView(el) {
    if ( fnCheckInView($(el).find('.chart_coin'))) {
      $(el).addClass('transform');
    }
  }

  function reset() {
    $('.wrap_vdb_list').find('.img_coin').remove();
    $('.wrap_vdb_list').removeClass('transform');
    // Waypoint.refreshAll();
  }

  return {
    animate: animate,
    reset: reset
  }
})();

/**
  * @name fnHanamoneyGuideControl()
  * @description 하나머니 안내 트랜지션 컨트롤
  * @url UTL_001
 */
var fnHanamoneyGuideControl = function() {
  // 무한적립 swiper
  var accumSwiper = new Swiper('.utl_accum_swiper', {
    freeMode: true,
    loop: true,
    slidesPerView: 'auto',
    observeParents: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    on: {
      init: function(swiper) {
        this.slideTo(1);
      }
    }
  });

  // 수수료면제 swiper
  var chargeSwiper = new Swiper('.utl_charge_swiper', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
  });

  //포인트 swiper
  var pointSwiper = new Swiper('.utl_point_swiper', {
    direction: 'vertical',
    allowTouchMove: false,
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    effect: 'coverflow',
    coverflowEffect: {
        rotate: 0,
        stretch: 10,
        depth: 500,
        modifier: 1,
        slideShadows : false,
    },
    on: {
      init: function() {
        var wrapperEl = $(this.wrapperEl);
        
        wrapperEl.find('.swiper-slide-prev').prev().addClass('swiper-slide-first').prevAll().addClass('prevAll');
        wrapperEl.find('.swiper-slide-next').next().addClass('swiper-slide-last').nextAll().addClass('nextAll');
      },
      slideChange: function() {
        var wrapperEl = $(this.wrapperEl);
        wrapperEl.find('.swiper-slide').removeClass('prevAll nextAll swiper-slide-first swiper-slide-last');

        var $active = wrapperEl.find('.swiper-slide').eq(this.activeIndex);

        $active.prev().prev().addClass('swiper-slide-first').prevAll().addClass('prevAll');
        $active.next().next().addClass('swiper-slide-last').nextAll().addClass('nextAll');
      },
      slideChangeTransitionEnd: function() {
        var wrapperEl = $(this.wrapperEl);
        var $active = wrapperEl.find('.swiper-slide').eq(this.activeIndex);
        wrapperEl.find('.swiper-slide').removeClass('prevAll nextAll');
      }
    }
  });

  // 스크롤에 따른 animation 시작
  $(window).on('scroll', function(){
    $('.section_cont').each(function(idx, el){
      if ( fnCheckInView($(el))) {
        if ($(el).hasClass('guide_hanamoney_1')) { accumSwiper.autoplay.start(); }
        else if ($(el).hasClass('guide_hanamoney_3')) { chargeSwiper.params.autoplay.disableOnInteraction = false; chargeSwiper.autoplay.start(); }
        else if ($(el).hasClass('guide_hanamoney_4')) { pointSwiper.params.autoplay.delay = 1000; pointSwiper.autoplay.start(); }
        else { $(el).addClass('transform'); }
      } else {
        if ($(el).hasClass('guide_hanamoney_1')) { accumSwiper.autoplay.stop(); }
        else if ($(el).hasClass('guide_hanamoney_3')) { chargeSwiper.autoplay.stop(); }
        else if ($(el).hasClass('guide_hanamoney_4')) { pointSwiper.autoplay.stop(); }
        else { $(el).removeClass('transform'); }
      }
    });
  });
}


/**
  * @name _gspTravlogInfo()
  * @description 애니메이트 콘텐츠 트랜지션 공통 컨트롤
  * @url GSP_002
 */
var _gspTravlogInfo = function(){
  if ( parseInt(androidV(ua)) < 6 ) { return false; }
  var $el = $('.gsp_travlog_info').closest('[data-roll="GSP"]').find('[data-animate="trans"]');

  $el.each(function(){
    var $this = $(this);
    var $transCont = $this.find('[class^="visual_gsp_"]');

    if ( !$transCont.length ) {
      $transCont = $this;
    }

    $transCont.waypoint({
      element: this,
      handler: function() {
        $transCont.addClass('transform');
        this.destroy();
      },
      offset: '80%'
    });
  });
}

/**
  * @name _usrCardAnimate()
  * @description 카드신청 브릿지화면 애니메이션
  * @url USR_103
 */
var _usrCardAnimate = function(){
  $('.visual_usr_card').addClass('transform');
}

/**
  * @name _covGuideInfo()
  * @description 애니메이트 콘텐츠 트랜지션 공통 컨트롤
  * @url COV_002
 */
var _covGuideInfo = function(){
  if ( parseInt(androidV(ua)) < 6 ) { return false; }
  var $el = $('.section_top_visual.cov002').closest('[data-roll="COV"]').find('[data-animate="trans"]');

  $el.each(function(){
    var $this = $(this);
    var $transCont = $this.find('[class^="visual_"]');

    if ( !$transCont.length ) {
      $transCont = $this;
    }

    $transCont.waypoint({
      element: this,
      handler: function() {
        $transCont.addClass('transform');
        this.destroy();
      },
      offset: '90%'
    });
  });
}

/**
  * @name fnLayerScreenShot.set();
  * @description 레이어팝업 스크린샷을 위한 높이값 설정
  * @param {Element} el 해당팝업 element 
  */
var fnLayerScreenShot2 = (function() {
  var $el,
      scrlTop,
      page,
      status;

  function set(el) {
    status = 'set';
    $el = $(el);
    scrlTop = $(document).scrollTop(); // 현재 스크롤 위치 저장
    page = $el.siblings('.contents').find('section'); // 본 페이지
    
    $el.addClass('setScreenShot'); // 팝업 높이제한 해제 후 팝업 콘텐츠 높이값 계산
    var height = $el.find('.content_layer').outerHeight(true);
    $el
    .css({
      'height': height,
    });
    // 팝업 높이 만큼 콘텐츠 영역 높이 설정 후 본 페이지 hidden, 스크롤 최상단으로 올려 팝업만 보이도록 설정
    $('body')
    .css({
      'overflow-y': 'auto',
        'min-height': '100vh',
        'height': height,
      });
    page.hide();
    $(document).scrollTop(0);
  }

  function complete() {
    $el.removeClass('setScreenShot').removeAttr('style');
    $('body').removeAttr('style');
    page.show();
    $(document).scrollTop(scrlTop); // 팝업 열었을 때의 스크롤 위치로 다시 이동
    status = 'complete';
  }

  function reset(el) {
    if ( status == 'set' ) {
      // console.log('reset');
      $(el).removeClass('setScreenShot').removeAttr('style');
      $('body').removeAttr('style');
      $(el).siblings('.contents').find('section').show();
      $(document).scrollTop(scrlTop);
      status = '';
    }
  }

  return {
    set: set,
    complete: complete,
    reset: reset,
  }
})();

/**
  * @name disableUserScalable();
  * @description user scaling 막기
  */
var disableUserScalable = function() {
  var $viewport = $('meta[name="viewport"]');
  if (isiOS) {
    $viewport.attr('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, shrink-to-fit=no, user-scalable=no, viewport-fit=cover');
    $viewport.after('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />');
    $viewport.after('<meta name="apple-mobile-web-app-capable" content="yes" />');
  } else {
    $viewport.attr('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
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
  * @name observeDomChanges();
  * @description DOM 변경 감지 후 함수 실행
  * @param {Node} targetNode // 대상 Node
  * @param {object} config // 감지 속성 설정
  * @param {function} callback // 실행 함수
  */ 
  function observeDomChanges(targetNode, config, callback) {
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

function callNativeBridge(bridgeStr){
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.hanamoneyiosinterface) {
    window.webkit.messageHandlers.hanamoneyiosinterface.postMessage(bridgeStr);
  } else {
    location.href = bridgeStr;
  }
}