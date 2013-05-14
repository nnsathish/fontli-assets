// document ready events
$(document).ready(function() {
 //popup
	$('.bigpic, .collapse, .likes_cnt, .comments_cnt, .fonts_cnt').live('click', function() {
		$('.popup').toggleClass('closed open');
	});
  $('.popup .cross').live('click', function() {
    $('#popup_container').html('').hide();
    $('#popup_loader').hide(); // just in case
    $("body").css("overflow", "inherit");
  });
  $(document).keyup(function(e) {
    if (e.keyCode == 27) { //ESC key
      $('#popup_container').html('').hide();
      $('#popup_loader').hide(); // just in case
      $("body").css("overflow", "inherit");
      $('#qr_pop').hide();
    }
  });
  // signup
  $('#join_fontli').click(function() {
    location.href = $(this).attr('href');
  });
  if(typeof($('#slider1').lemmonSlider) != 'undefined') {
    $('#slider1').lemmonSlider({
      infinite: true
    });
  }
  $('li[rel=popitup],div[rel=popitup]').live('click', function() {
    var url = $(this).attr('href');
    var id  = $(this).attr('data-id');
    showAjaxLoader(true);
    if(interval) clearInterval(interval);
    clearTimeout(timeout);
    spottedContentLoaded = false;
    $.ajax({
      url: url,
      data: {id:id},
      success: function(data, textStatus) {
        hideAjaxLoader(true);
        //$("body").css("overflow", "hidden");
        $('#popup_container').html(data);
        centerPopup('.popup');
        setTypetalkHeight();
        enableScrollBars('.aa-typetalk');
        setupPopupNavLinks(id);
      },
      error: function() {
        hideAjaxLoader(true);
        alert('Oops, An error occured!');
        $('#popup_container').hide();
      }
    });
  });
  $('a.set4, a.set5').live('click', function() {
    var url = $(this).attr('data-href');
    var id = $(this).attr('data-id');
    var elem = $(this);
    elem.hide(); // avoid further clicks
    // bring the popup to closed state, if opened
    if($('.popup').hasClass('open')) {
      $('.popup').toggleClass('open closed');
      setTimeout(function() { $('#popup_loader').show(); }, 500);
    }else $('#popup_loader').show();
    spottedContentLoaded = false;

    $.ajax({
      url: url,
      data: {id:id},
      success: function(data, textStatus) {
        var leftPop = $(data).first().find('.left-pop').html();
        var rightPop1 = $(data).first().find('.right-pop.typetalk').html();
        var rightPop2 = $(data).first().find('.right-pop.spotted').html();
        $('#popup_container .right-pop').hide();
        $('#popup_container .left-pop').fadeOut(0, function() {
          hideAjaxLoader(true);
          $('#popup_container .left-pop').html(leftPop);
          $('#popup_container .right-pop.typetalk').html(rightPop1);
          $('#popup_container .right-pop.spotted').html(rightPop2);
        }).fadeIn(400, function() {
          $('#popup_container .right-pop.typetalk').show();
          setTypetalkHeight();
          setupPopupNavLinks(id);
          enableScrollBars('.aa-typetalk');
        });
        elem.show();
      },
      error: function() {
        hideAjaxLoader(true);
        alert('Oops, An error occured!');
        $('#popup_container').hide();
      }
    });
    return false;
  });
  $('li.banner-cta, .notifications-count-box').live('click', function() {
    var url = $(this).attr('href');
    location.href = url;
  });
  // ajax request links with remote=true
  $('a[remote=true]').live('click', function() {
    var url = $(this).attr('data-href');
    showAjaxLoader();
    $.ajax({
      url: url,
      dataType: 'script',
      complete: hideAjaxLoader
    });
  });
  spottedContentLoaded = false;
  $('.popup .bottom-nav .view-spotted, .popup .fonts_cnt').live('click', function() {
    var url = $(this).attr('data-url');
    if(spottedContentLoaded) {
      animateSpottedPopup();
    }else {
      $(this).attr('disabled', true);
      $.ajax({
        url: url,
        success: function(data, textStatus) {
          $('.popup .right-pop.spotted').html(data);
          spottedContentLoaded = true;
          $(this).attr('disabled', false);
          animateSpottedPopup();
          enableScrollBars('.aa-spotted');
        }
      });
    }
  });
  $('.popup .bottom-nav .view-typetalk').live('click', function() {
    animateTypetalkPopup();
  });
  $('.qrcode a, .qrcode-links a').click(function() {
    var klass = $(this).attr('class');
    var offset = $(window).scrollTop();
    $('#qr_pop .img-qrcode').hide(); // hide both codes
    $('#qr_pop .img-qrcode.'+klass).show(); //show relavant
    //$("body").css("overflow", "hidden");
    centerPopup('.ipad-landing-popup');
    $('#qr_pop').show();
  });
  $('#qr_pop a.close-icon').click(function() {
    $('#qr_pop').hide();
    $("body").css("overflow", "inherit");
  });
});

// window load events
$(window).load(function() {
  // load images async
  $('img[xsrc]').each(function() {
    var elem = $(this);
    var src = elem.attr("xsrc");
    elem.removeAttr('xsrc').attr('src', src).load(function() {
      if(elem.get(0).complete && elem.get(0).className != 'hidden-img')
        elem.show(); // its already visible
    });
  });
  userCountdownTimer = 0;
  $('.user-countdown strong').each(function() {
    var countArray = $.map($('.user-countdown').attr('data-count').split(''), Number);
    var elem = $(this);
    var digit = countArray[parseInt(elem.attr('class'))];
    for(var i=1; i <= digit; i++) { updateCounter(i, digit, elem) }
  });
  timeout = setTimeout(function() {
    $('.controls .next-page').trigger('click');
  }, userCountdownTimer + 7000);
  interval = null;
  setInterval(function() {
    if('#slideshow') slideSwitch();
  }, userCountdownTimer + 8000);
  $('.controls a').click(function() {
    clearTimeout(timeout);
    clearInterval(interval);
  });
});


function showAjaxLoader(popup) {
  if(popup) {
    centerPopup('.popup');
    $('#popup_container').html($('#popup_loader').html());
    $('#popup_container').show(); }
  else {
    $('#ajax_loader').show();
  }
}
function hideAjaxLoader(popup) {
  if(popup) $('#popup_loader').hide();
  else $('#ajax_loader').hide();
}
function centerPopup(selector) {
  var elem = $(selector);
  var windowHeight = $(window).height();
  var popupHeight = elem.height();
  var marginTop = (windowHeight - popupHeight) / 2
  elem.css('margin-top', marginTop + 'px');
}
function getDocHeight() {
  var D = document;
  return Math.max(
    Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
    Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
    Math.max(D.body.clientHeight, D.documentElement.clientHeight)
  );
}
function animateSpottedPopup() {
  $('.popup .right-pop.spotted').fadeIn(1000);
  $('.popup .right-pop.typetalk').hide();
}
function animateTypetalkPopup() {
  $('.popup .right-pop.typetalk').fadeIn(1000);
  $('.popup .right-pop.spotted').hide();
}
function setupPopupNavLinks(id) {
  //excepts photoIds variable set on the main page
  var i = photoIds.indexOf(id);
  var last = photoIds.length - 1;
  var nextID = photoIds[i+1];
  var prevID = photoIds[i-1];
  //cycle through the list if its last or first
  if(i == last) nextID = photoIds[0];
  else if(i == 0) prevID = photoIds[last];
  $('.popup .set5').attr('data-id', nextID);
  $('.popup .set4').attr('data-id', prevID);
}
function enableScrollBars(selector) {
  if(typeof($(selector).mCustomScrollbar) == 'undefined') return true;
  $(selector).mCustomScrollbar({
	  scrollButtons:{
			enable:true
		}
 	});
}
function slideSwitch() {
  var $active = $('#slideshow DIV.active');
  if ( $active.length == 0 ) $active = $('#slideshow DIV:last');
  // use this to pull the divs in the order they appear in the markup
  var $next =  $active.next().length ? $active.next() : $('#slideshow DIV:first');
  // uncomment below to pull the divs randomly
  // var $sibs  = $active.siblings();
  // var rndNum = Math.floor(Math.random() * $sibs.length );
  // var $next  = $( $sibs[ rndNum ] );
  $active.addClass('last-active');
  $next.css({opacity: 0.0})
    .addClass('active')
    .animate({opacity: 1.0}, 1000, function() {
      $active.removeClass('active last-active');
    });
}
// use this to position the view spotted/view typetalk link at the bottom of the popup.
function setTypetalkHeight() {
  var totalHeight = 465; // 40px padding
  captionHeight = $('.right-pop .content-a').height();
  $('.right-pop .content-b').css('height', (totalHeight - captionHeight) + 'px');
}
function updateCounter(val,digit,elem) {
  var klass = elem.attr('class');
  var slot = $('<strong></strong>');
  slot.html(val);
  slot.css({opacity:0,position:'relative',left:'0px','top':'-10px'});
  slot.attr('class', klass + 'a');

  userCountdownTimer += 150;
  setTimeout(function() {
    elem.after(slot);
    $('.'+klass).fadeOut(0);
    slot.animate({opacity:1, top:0}, 50);
    slot.attr('class', klass);
  }, userCountdownTimer);
}
