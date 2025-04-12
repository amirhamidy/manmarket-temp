(function ($) {
  ("use strict");

  /*----------  Menu sticky and scroll top  ----------*/

  var windows = $(window);
  var screenSize = windows.width();
  var sticky = $(".header-sticky");
  var sliderBottomHeader = $(".slider-bottom-header-sticky");
  var $html = $("html");
  var $body = $("body");

  windows.on("scroll", function () {
    var scroll = windows.scrollTop();

    var headerHeight = sticky.height();
    var sliderBottomHeaderHeight = sliderBottomHeader.height();
    var sliderHeight = $(".header-bottom-slider-area").height();

    var headerPosition = sliderBottomHeaderHeight + sliderHeight;

    if (screenSize >= 992) {
      if (scroll < headerHeight) {
        sticky.removeClass("is-sticky");
      } else {
        sticky.addClass("is-sticky");
      }
    }

    if (screenSize >= 300) {
      if (scroll < headerPosition) {
        sliderBottomHeader.removeClass("is-sticky");
      } else {
        sliderBottomHeader.addClass("is-sticky");
      }
    }

    //code for scroll top

    if (scroll >= 400) {
      $(".scroll-top").fadeIn();
    } else {
      $(".scroll-top").fadeOut();
    }
  });

  /*----------  Scroll to top  ----------*/

  $(".scroll-top").on("click", function () {
    $("html,body").animate(
      {
        scrollTop: 0
      },
      2000
    );
  });

  /* active and deactive about overlay */

  $("#offcanvas-about-icon").on("click", function () {
    $("#about-overlay").addClass("active-about-overlay");
    $(".overlay-close").addClass("active").removeClass("inactive");
    $("body").addClass("active-body-search-overlay");
  });

  $("#about-close-icon, .overlay-close").on("click", function () {
    $("#about-overlay").toggleClass("active-about-overlay");
    $(".overlay-close").addClass("inactive").removeClass("active");
    $("body").removeClass("active-body-search-overlay");
  });

  /* active and deactive wishlist overlay */

  $("#offcanvas-wishlist-icon, #offcanvas-wishlist-icon-2").on(
    "click",
    function () {
      $("#wishlist-overlay").addClass("active-wishlist-overlay");
      $(".wishlist-overlay-close").addClass("active").removeClass("inactive");
      $("body").addClass("active-body-search-overlay");
    }
  );

  $("#wishlist-close-icon, .wishlist-overlay-close").on("click", function () {
    $("#wishlist-overlay").removeClass("active-wishlist-overlay");
    $(".wishlist-overlay-close").addClass("inactive").removeClass("active");
    $("body").removeClass("active-body-search-overlay");
  });

  // close on press 'esc' button

  $(document).keyup(function (e) {
    if (e.keyCode == 27) {
      //for search overlay
      if ($(".active-search-overlay").length) {
        $("#search-overlay").removeClass("active-search-overlay");
      }

      //for cart
      if ($(".active-cart-overlay").length) {
        $("#cart-overlay").removeClass("active-cart-overlay");
        $(".cart-overlay-close").addClass("inactive").removeClass("active");
      }

      //for wishlist
      if ($(".active-wishlist-overlay").length) {
        $("#wishlist-overlay").removeClass("active-wishlist-overlay");
        $(".wishlist-overlay-close").addClass("inactive").removeClass("active");
      }

      $("body").removeClass("active-body-search-overlay");

      //for quick view
      if ($(".cd-quick-view.is-visible").length) {
        var id = $("body").find(".cd-quick-view.add-content");
        closeQuickView(id, sliderFinalWidth, maxQuickWidth);
      }
    }
  });

  /* active and deactive cart overlay */

  $("#offcanvas-cart-icon, #offcanvas-cart-icon-2").on("click", function () {
    $("#cart-overlay").addClass("active-cart-overlay");
    $(".cart-overlay-close").addClass("active").removeClass("inactive");
    $("body").addClass("active-body-search-overlay");
  });

  $("#cart-close-icon, .cart-overlay-close").on("click", function () {
    $("#cart-overlay").removeClass("active-cart-overlay");
    $(".cart-overlay-close").addClass("inactive").removeClass("active");
    $("body").removeClass("active-body-search-overlay");
  });

  /* activate and deactivate search overlay*/

  $("#search-icon, #search-icon-2").on("click", function () {
    $("#search-overlay").addClass("active-search-overlay");
    $("body").addClass("active-body-search-overlay");
  });

  $("#search-close-icon").on("click", function () {
    $("#search-overlay").removeClass("active-search-overlay");
    $("body").removeClass("active-body-search-overlay");
  });

  /*----------  multilevel menu  ----------*/

  $("#dl-menu").dlmenu({
    animationClasses: {
      classin: "dl-animate-in-2",
      classout: "dl-animate-out-2"
    }
  });

  /*----------  overlay menu   ----------*/

  /*Variables*/
  var $verticalCollapsibleMenu = $("#vertical-collapsible-menu"),
    $verticalCollapsibleSubMenu = $verticalCollapsibleMenu.find(".sub-menu");

  /*Close Off Canvas Sub Menu*/
  $verticalCollapsibleSubMenu.slideUp();

  /*Category Sub Menu Toggle*/
  $verticalCollapsibleMenu.on("click", "li a", function (e) {
    var $this = $(this);
    if ($this.siblings(".sub-menu").length) {
      e.preventDefault();
      if ($this.siblings("ul:visible").length) {
        $this.siblings("ul").slideUp();
      } else {
        $this.closest("li").siblings("li").find("ul:visible").slideUp();
        $this.siblings("ul").slideDown();
      }
    }
  });

  $("#overlay-menu-icon").on("click", function () {
    $("#overlay-navigation-menu")
      .removeClass("overlay-navigation-inactive")
      .addClass("overlay-navigation-active");
  });

  $("#overlay-menu-close-icon").on("click", function () {
    $("#overlay-navigation-menu")
      .removeClass("overlay-navigation-active")
      .addClass("overlay-navigation-inactive");
  });

  /*----------  vertical menu icon  ----------*/

  $("#vertical-menu-icon").on("click", function () {
    $(this).toggleClass("active");
    $("#vertical-menu-dark").toggleClass("active");
  });

  /*----------   Mailchimp  ----------*/
  $("#mc-form").ajaxChimp({
    language: "en",
    callback: mailChimpResponse,
    // ADD YOUR MAILCHIMP URL BELOW HERE!
    url:
      "https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef"
  });

  function mailChimpResponse(resp) {
    if (resp.result === "success") {
      $(".mailchimp-success")
        .html("" + resp.msg)
        .fadeIn(900);
      $(".mailchimp-error").fadeOut(400);
    } else if (resp.result === "error") {
      $(".mailchimp-error")
        .html("" + resp.msg)
        .fadeIn(900);
    }
  }

  $("#mc-form-2").ajaxChimp({
    language: "en",
    callback: mailChimpResponse2,
    // ADD YOUR MAILCHIMP URL BELOW HERE!
    url:
      "https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef"
  });

  function mailChimpResponse2(resp) {
    if (resp.result === "success") {
      $(".mailchimp-success-2")
        .html("" + resp.msg)
        .fadeIn(900);
      $(".mailchimp-error-2").fadeOut(400);
    } else if (resp.result === "error") {
      $(".mailchimp-error-2")
        .html("" + resp.msg)
        .fadeIn(900);
    }
  }

  /*----------  slick slider activation  ----------*/
  var $lezadaSlickSlider = $(".lezada-slick-slider");

  /*For RTL*/
  if ($html.attr("dir") == "rtl" || $body.attr("dir") == "rtl") {
    $lezadaSlickSlider.attr("dir", "rtl");
  }

  $lezadaSlickSlider.each(function () {
    /*Setting Variables*/
    var $this = $(this),
      $setting = $this.data("slick-setting"),
      $autoPlay = $setting.autoplay ? $setting.autoplay : false,
      $autoPlaySpeed = parseInt($setting.autoplaySpeed, 10) || 2000,
      $speed = parseInt($setting.speed, 10) || 2000,
      $asNavFor = $setting.asNavFor ? $setting.asNavFor : null,
      $appendArrows = $setting.appendArrows ? $setting.appendArrows : $this,
      $appendDots = $setting.appendDots ? $setting.appendDots : $this,
      $arrows = $setting.arrows ? $setting.arrows : false,
      $prevArrow = $setting.prevArrow
        ? '<button class="' +
          $setting.prevArrow.buttonClass +
          '"><i class="' +
          $setting.prevArrow.iconClass +
          '"></i></button>'
        : '<button class="slick-prev">previous</button>',
      $nextArrow = $setting.nextArrow
        ? '<button class="' +
          $setting.nextArrow.buttonClass +
          '"><i class="' +
          $setting.nextArrow.iconClass +
          '"></i></button>'
        : '<button class="slick-next">next</button>',
      $centerMode = $setting.centerMode ? $setting.centerMode : false,
      $centerPadding = $setting.centerPadding ? $setting.centerPadding : "50px",
      $dots = $setting.dots ? $setting.dots : false,
      $fade = $setting.fade ? $setting.fade : false,
      $focusOnSelect = $setting.focusOnSelect ? $setting.focusOnSelect : false,
      $infinite = $setting.infinite ? $setting.infinite : true,
      $pauseOnHover = $setting.pauseOnHover ? $setting.pauseOnHover : true,
      $rows = parseInt($setting.rows, 10) || 1,
      $slidesToShow = parseInt($setting.slidesToShow, 10) || 1,
      $slidesToScroll = parseInt($setting.slidesToScroll, 10) || 1,
      $swipe = $setting.swipe ? $setting.swipe : true,
      $swipeToSlide = $setting.swipeToSlide ? $setting.swipeToSlide : false,
      $variableWidth = $setting.variableWidth ? $setting.variableWidth : false,
      $vertical = $setting.vertical ? $setting.vertical : false,
      $verticalSwiping = $setting.verticalSwiping
        ? $setting.verticalSwiping
        : false,
      $rtl =
        $setting.rtl || $html.attr('dir="rtl"') || $body.attr('dir="rtl"')
          ? true
          : false;

    /*Responsive Variable, Array & Loops*/
    var $responsiveSetting =
        typeof $this.data("slick-responsive") !== "undefined"
          ? $this.data("slick-responsive")
          : "",
      $responsiveSettingLength = $responsiveSetting.length,
      $responsiveArray = [];
    for (var i = 0; i < $responsiveSettingLength; i++) {
      $responsiveArray[i] = $responsiveSetting[i];
    }

    /*Slider Start*/
    $this.slick({
      autoplay: $autoPlay,
      autoplaySpeed: $autoPlaySpeed,
      speed: $speed,
      asNavFor: $asNavFor,
      appendArrows: $appendArrows,
      appendDots: $appendDots,
      arrows: $arrows,
      dots: $dots,
      centerMode: $centerMode,
      centerPadding: $centerPadding,
      fade: $fade,
      focusOnSelect: $focusOnSelect,
      infinite: $infinite,
      pauseOnHover: $pauseOnHover,
      rows: $rows,
      slidesToShow: $slidesToShow,
      slidesToScroll: $slidesToScroll,
      swipe: $swipe,
      swipeToSlide: $swipeToSlide,
      variableWidth: $variableWidth,
      vertical: $vertical,
      verticalSwiping: $verticalSwiping,
      rtl: $rtl,
      prevArrow: $prevArrow,
      nextArrow: $nextArrow,
      responsive: $responsiveArray
    });
  });

  /*----------  Masonry Activation  ----------*/

  var $masonry = $(".masonry-category-layout");
  var $grid = $(".grid-item");
  $grid.hide();

  $masonry.imagesLoaded(function () {
    $grid.fadeIn();
    $masonry.masonry({
      itemSelector: ".grid-item",
      columnWidth: ".grid-item--width2",
      percentPosition: true
      //gutter: 10
    });
  });

  /*----------  creative home masonry  ----------*/

  var $masonryCreativeHome = $(".masonry-category-layout--creativehome");
  var $gridCreativeHome = $(".grid-item");
  $grid.hide();

  var $masonryCreativeHome = $(".masonry-category-layout--creativehome");
  $masonryCreativeHome.imagesLoaded(function () {
    $gridCreativeHome.fadeIn();
    $masonryCreativeHome.masonry({
      itemSelector: ".grid-item",
      columnWidth: ".grid-item--width2",
      percentPosition: true
      //gutter: 30
    });
  });

  /*----------  blog post masonry  ----------*/

  var $masonryBlogPost = $(".blog-post-wrapper--masonry");
  var $gridBlogPost = $(".grid-item");
  $grid.hide();

  var $masonryBlogPost = $(".blog-post-wrapper--masonry");
  $masonryBlogPost.imagesLoaded(function () {
    $gridBlogPost.fadeIn();
    $masonryBlogPost.masonry({
      itemSelector: ".grid-item",
      columnWidth: ".grid-item",
      percentPosition: true
      //gutter: 30
    });
  });

  /*----------  WOW JS activation  ----------*/

  //new WOW().init();

  /*----------  paraxify active  ----------*/

  var parallaxActive = ".single-lookbook-section",
    myParaxify;
  if (parallaxActive.length) {
    myParaxify = paraxify(parallaxActive, {
      speed: 1,
      boost: 1
    });
  }

  /*----------  countdown activate  ----------*/

  $("[data-countdown]").each(function () {
    var $this = $(this),
      finalDate = $(this).data("countdown");
    $this.countdown(finalDate, function (event) {
      $this.html(
        event.strftime(
          '<div class="single-countdown"><span class="single-countdown__time">%D</span><span class="single-countdown__text">Days</span></div><div class="single-countdown"><span class="single-countdown__time">%H</span><span class="single-countdown__text">Hours</span></div><div class="single-countdown"><span class="single-countdown__time">%M</span><span class="single-countdown__text">Minutes</span></div><div class="single-countdown"><span class="single-countdown__time">%S</span><span class="single-countdown__text">Seconds</span></div>'
        )
      );
    });
  });

  /*----------  instagram image slider  ----------*/

  jQuery(window).on("load", function () {

    $(".instagram-carousel").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: false,
      dots: false,
      arrows: true,
      prevArrow:
        '<button type="button" class="slick-prev"><i class="ti-angle-left"></i></button>',
      nextArrow:
        '<button type="button" class="slick-next"><i class="ti-angle-right"></i></button>',
      responsive: [
        {
          breakpoint: 1499,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 479,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });

    $(".instagram-carousel-type2").slick({
      slidesToShow: 6,
      slidesToScroll: 1,
      autoplay: false,
      dots: false,
      arrows: true,
      prevArrow:
        '<button type="button" class="slick-prev"><i class="ti-angle-left"></i></button>',
      nextArrow:
        '<button type="button" class="slick-next"><i class="ti-angle-right"></i></button>',
      responsive: [
        {
          breakpoint: 1500,
          settings: {
            slidesToShow: 6
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 479,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });

    $(".instagram-carousel-type3").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: false,
      dots: false,
      arrows: true,
      prevArrow:
        '<button type="button" class="slick-prev"><i class="ti-angle-left"></i></button>',
      nextArrow:
        '<button type="button" class="slick-next"><i class="ti-angle-right"></i></button>',
      responsive: [
        {
          breakpoint: 1500,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 479,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });

    /*----------  newsletter popup  ----------*/

    if (screenSize >= 767) {
      $("#newsletter-popup-body").addClass("newsletter-overlay-active");

      setTimeout(function () {
        $("#newsletter-content").addClass("show-popup");
      }, 1000);
    }
  });

  /*----------  cloth tag positioning  ----------*/

  var clothTag = $(".cloth-tag");

  clothTag.each(function () {
    var $this = $(this),
      topValue = $this.data("top"),
      leftValue = $this.data("left");

    $this.css({ top: topValue, left: leftValue });
  });

  $(".cloth-tag__content").addClass("inactive");

  $(".cloth-tag__icon").on("click", function () {
    $(this).siblings(".cloth-tag__content").toggleClass("active inactive");
  });

  /*----------  magnific popup  ----------*/

  $(".popup-video").magnificPopup({
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  $(".instagram-feed").magnificPopup({
    type: "image",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  /*----------  smooth scroll on shoppable home  ----------*/

  $("#smooth-scroll-section").on("click", function (event) {
    event.preventDefault();

    $("html, body").animate(
      {
        scrollTop: $($.attr(this, "href")).offset().top - sticky.height() - 50
      },
      500
    );
  });

  /*----------   Quantity Counter  ----------*/

  $(".pro-qty").append('<a href="#" class="inc qty-btn">+</a>');
  $(".pro-qty").prepend('<a href="#" class= "dec qty-btn">-</a>');
  $(".qty-btn").on("click", function (e) {
    e.preventDefault();
    var $button = $(this);
    var oldValue = $button.parent().find("input").val();
    if ($button.hasClass("inc")) {
      var newVal = parseFloat(oldValue) + 1;
    } else {
      // Don't allow decrementing below zero
      if (oldValue > 0) {
        var newVal = parseFloat(oldValue) - 1;
      } else {
        newVal = 0;
      }
    }
    $button.parent().find("input").val(newVal);
  });

  /*---------- custom quick view  ----------*/

  //final width --> this is the quick view image slider width
  //maxQuickWidth --> this is the max-width of the quick-view panel
  var sliderFinalWidth = 400,
    maxQuickWidth = 900;

  //open the quick view panel
  $(".cd-trigger").on("click", function (event) {
    event.preventDefault();
    var selectedImage = $(this)
        .closest(".single-product__image")
        .find(".image-wrap")
        .children("img")
        .eq(0),
      id = $(this).attr("href"),
      slectedImageUrl = selectedImage.attr("src");

    $("body").addClass("overlay-layer");
    animateQuickView(
      id,
      selectedImage,
      sliderFinalWidth,
      maxQuickWidth,
      "open"
    );

    //update the visible slider image in the quick view panel
    //you don't need to implement/use the updateQuickView if retrieving the quick view data with ajax
    //updateQuickView(slectedImageUrl);
  });

  //close the quick view panel
  $("body").on("click", function (event) {
    if (
      $(event.target).is(".cd-close") ||
      $(event.target).is("body.overlay-layer")
    ) {
      event.preventDefault();
      var id = $(this).find(".cd-quick-view.add-content");
      closeQuickView(id, sliderFinalWidth, maxQuickWidth);
    }
  });
  // $(document).keyup(function(event){
  // 	if(event.which=='27'){
  //         var id = $('body').find('.cd-quick-view.add-content');
  // 		closeQuickView(id, sliderFinalWidth, maxQuickWidth);
  // 	}
  // });

  //quick view slider Update On Navigation
  $(".cd-quick-view").on("click", ".cd-slider-navigation a", function (event) {
    event.preventDefault();
    var $this = $(this);
    updateSliderNav($this);
  });

  //quick view slider Update On Pagination
  $(".cd-quick-view").on("click", ".cd-slider-pagination a", function (event) {
    event.preventDefault();
    var $this = $(this),
      $li = $this.parents("li");

    $li.addClass("active").siblings().removeClass("active");

    updateSliderPage($this);
  });

  //center quick-view on window resize
  $(window).on("resize", function () {
    if ($(".cd-quick-view").hasClass("is-visible")) {
      window.requestAnimationFrame(resizeQuickView);
    }
  });

  /*Update Quick View Slider With Navigation*/
  function updateSliderNav(navigation) {
    var sliderConatiner = navigation
        .parents(".cd-slider-wrapper")
        .find(".cd-slider"),
      activeSlider = sliderConatiner.children(".selected"),
      sliderPanilation = navigation
        .parents(".cd-slider-wrapper")
        .children(".cd-slider-pagination");

    sliderPanilation.children("li").removeClass("active");

    activeSlider.removeClass("selected");
    if (navigation.hasClass("cd-next")) {
      if (!activeSlider.is(":last-child")) {
        activeSlider.next().addClass("selected");
        sliderPanilation
          .children("li")
          .eq(activeSlider.next().index())
          .addClass("active");
      } else {
        sliderConatiner.children("li").eq(0).addClass("selected");
        sliderPanilation
          .children("li")
          .eq(sliderConatiner.children("li").eq(0).index())
          .addClass("active");
      }
    } else {
      if (!activeSlider.is(":first-child")) {
        activeSlider.prev().addClass("selected");
        sliderPanilation
          .children("li")
          .eq(activeSlider.prev().index())
          .addClass("active");
      } else {
        sliderConatiner.children("li").last().addClass("selected");
        sliderPanilation
          .children("li")
          .eq(sliderConatiner.children("li").last().index())
          .addClass("active");
      }
    }
  }

  /*Update Quick View Slider With Pagination*/
  function updateSliderPage(pagination) {
    var sliderConatiner = pagination
        .parents(".cd-slider-wrapper")
        .find(".cd-slider"),
      sliderItem = sliderConatiner.children("li"),
      paginationIndex = pagination.parent("li").index();

    sliderItem.removeClass("selected");
    sliderItem.eq(paginationIndex).addClass("selected");
  }

  /*Update Quick View Slider & Product Image On Close*/
  function updateSliderClose(close) {
    var sliderConatiner = close
        .siblings(".cd-slider-wrapper")
        .find(".cd-slider"),
      sliderItem = sliderConatiner.children("li");

    sliderItem.removeClass("selected");
    sliderItem.eq(0).addClass("selected");
  }

  /*UpdatePagination On Close*/
  function updatePaginationClose(close) {
    var paginationConatiner = close
        .siblings(".cd-slider-wrapper")
        .find(".cd-slider-pagination"),
      paginationItem = paginationConatiner.children("li");

    paginationItem.removeClass("active");
    paginationItem.eq(0).addClass("active");
  }

  //    /*Update Quick View Slide Item*/
  //	function updateQuickView(url) {
  //		$('.cd-quick-view .cd-slider li').removeClass('selected').find('img[src="'+ url +'"]').parent('li').addClass('selected');
  //	}

  /*Resize Quick View*/
  function resizeQuickView() {
    var quickViewLeft = ($(window).width() - $(".cd-quick-view").width()) / 2,
      quickViewTop = ($(window).height() - $(".cd-quick-view").height()) / 2;
    $(".cd-quick-view").css({
      top: quickViewTop,
      left: quickViewLeft
    });
  }

  function closeQuickView(id, finalWidth, maxQuickWidth) {
    var close = $(".cd-quick-view.is-visible .cd-close"),
      updateSliderImage = updateSliderClose(close),
      updateSliderPage = updatePaginationClose(close),
      activeSliderUrl = close
        .siblings(".cd-slider-wrapper")
        .find(".selected img")
        .attr("src"),
      selectedImage = $(".empty-box").find("img").eq(0);
    //update the image in the gallery
    if (
      !$(".cd-quick-view").hasClass("velocity-animating") &&
      $(".cd-quick-view").hasClass("add-content")
    ) {
      selectedImage.attr("src", activeSliderUrl);
      animateQuickView(id, selectedImage, finalWidth, maxQuickWidth, "close");
    } else {
      closeNoAnimation(id, selectedImage, finalWidth, maxQuickWidth);
    }
  }

  /*Open Quick View*/
  function animateQuickView(
    id,
    image,
    finalWidth,
    maxQuickWidth,
    animationType
  ) {
    //store some image data (width, top position, ...)
    //store window data to calculate quick view panel position
    var parentListItem = image.parent(".image-wrap"),
      topSelected = image.offset().top - $(window).scrollTop(),
      leftSelected = image.offset().left,
      widthSelected = image.width(),
      heightSelected = image.height(),
      windowWidth = $(window).width(),
      windowHeight = $(window).height(),
      finalLeft = (windowWidth - finalWidth) / 2,
      finalHeight = (finalWidth * heightSelected) / widthSelected,
      finalTop = (windowHeight - finalHeight) / 2,
      quickViewWidth =
        windowWidth * 0.8 < maxQuickWidth ? windowWidth * 0.8 : maxQuickWidth,
      quickViewLeft = (windowWidth - quickViewWidth) / 2;

    if (animationType == "open") {
      //hide the image in the gallery
      parentListItem.addClass("empty-box");
      //place the quick view over the image gallery and give it the dimension of the gallery image
      $(id)
        .css({
          top: topSelected,
          left: leftSelected,
          width: widthSelected
        })
        .velocity(
          {
            //animate the quick view: animate its width and center it in the viewport
            //during this animation, only the slider image is visible
            top: finalTop + "px",
            left: finalLeft + "px",
            width: finalWidth + "px"
          },
          1000,
          [400, 20],
          function () {
            //animate the quick view: animate its width to the final value
            $(id)
              .addClass("animate-width")
              .velocity(
                {
                  left: quickViewLeft + "px",
                  width: quickViewWidth + "px"
                },
                300,
                "ease",
                function () {
                  //show quick view content
                  $(id).addClass("add-content");
                }
              );
          }
        )
        .addClass("is-visible");
    } else {
      //close the quick view reverting the animation
      $(id)
        .removeClass("add-content")
        .velocity(
          {
            top: finalTop + "px",
            left: finalLeft + "px",
            width: finalWidth + "px"
          },
          300,
          "ease",
          function () {
            $("body").removeClass("overlay-layer");
            $(id)
              .removeClass("animate-width")
              .velocity(
                {
                  top: topSelected,
                  left: leftSelected,
                  width: widthSelected
                },
                500,
                "ease",
                function () {
                  $(id).removeClass("is-visible");
                  parentListItem.removeClass("empty-box");
                }
              );
          }
        );
    }
  }
  /*Close Quick View*/
  function closeNoAnimation(id, image, finalWidth, maxQuickWidth) {
    var parentListItem = image.parent(".image-wrap"),
      topSelected = image.offset().top - $(window).scrollTop(),
      leftSelected = image.offset().left,
      widthSelected = image.width();

    $("body").removeClass("overlay-layer");
    parentListItem.removeClass("empty-box");

    id.velocity("stop")
      .removeClass("add-content animate-width is-visible")
      .css({
        top: topSelected,
        left: leftSelected,
        width: widthSelected
      });
  }

  /*----------  perfect scroll bar active  ----------*/

  $(".ps-scroll").each(function () {
    if ($(".ps-scroll").length) {
      const ps = new PerfectScrollbar($(this)[0]);
    }
  });

  /*----------  sticky sidebar   ----------*/

  $(".sidebar-sticky").stickySidebar({
    topSpacing: 90,
    bottomSpacing: -90,
    minWidth: 768
  });

  /*----------  isotope  ----------*/

  var activeId = $(".product-filter-menu li");

  activeId.on("click", function () {
    var $this = $(this),
      filterValue = $this.data("filter");

    $(".product-isotope").isotope({
      filter: filterValue,
      layoutMode: "fitRows"
    });

    activeId.removeClass("active");
    $this.addClass("active");
  });

  /*----------   Nice Select  ----------*/

  $(".nice-select").niceSelect();

  /*----------  sidebar category dropdown  ----------*/

  var sidebarCategoryParent = $(
    ".single-filter-widget--list--category li.has-children, .single-sidebar-widget--list--category li.has-children"
  );
  sidebarCategoryParent.append('<a href="#" class="expand-icon">+</a>');

  var expandIcon = $(".expand-icon");
  expandIcon.on("click", function (e) {
    e.preventDefault();
    $(this).prev("ul").slideToggle();
    var htmlAfter = "-";
    var htmlBefore = "+";

    if ($(this).html() == htmlBefore) {
      $(this).html(htmlAfter);
    } else {
      $(this).html(htmlBefore);
    }
  });

  /*----------  shop advance filter area toggle  ----------*/

  $("#advance-filter-active-btn").on("click", function () {
    $(this).toggleClass("active");
    $("#shop-advance-filter-area").slideToggle();
  });

  /*----------  price filter  ----------*/

  $("#price-range").slider({
    range: true,
    min: 25,
    max: 350,
    values: [25, 350],
    slide: function (event, ui) {
      $("#price-amount").val(
        "Price: " + "$" + ui.values[0] + " - $" + ui.values[1]
      );
    }
  });
  $("#price-amount").val(
    "Price: " +
      "$" +
      $("#price-range").slider("values", 0) +
      " - $" +
      $("#price-range").slider("values", 1)
  );

  /*----------  product view mode  ----------*/

  $(".grid-icons a").on("click", function (e) {
    e.preventDefault();

    var shopProductWrap = $(".shop-product-wrap");
    var viewMode = $(this).data("target");

    /*----------  reinitialize isotope  ----------*/

    shopProductWrap.isotope();
    shopProductWrap.isotope("destroy");

    $(".grid-icons a").removeClass("active");
    $(this).addClass("active");
    shopProductWrap
      .removeClass("three-column four-column five-column list")
      .addClass(viewMode);

    if (viewMode == "three-column") {
      shopProductWrap
        .children()
        .addClass("col-lg-4")
        .removeClass("col-lg-3 col-lg-is-5");
    }

    if (viewMode == "four-column") {
      shopProductWrap
        .children()
        .addClass("col-lg-3")
        .removeClass("col-lg-4 col-lg-is-5");
    }

    if (viewMode == "five-column") {
      shopProductWrap
        .children()
        .addClass("col-lg-is-5")
        .removeClass("col-lg-3 col-lg-4");
    }
  });

  /*----------  single product big image slider  ----------*/

  $(".shop-product__big-image-gallery-slider").each(function () {
    var $this = $(this);
    var $row = $this.attr("data-row")
      ? parseInt($this.attr("data-row"), 10)
      : 1;
    $this.slick({
      infinite: false,
      arrows: true,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      rows: $row,
      prevArrow:
        '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
      nextArrow:
        '<button class="slick-next"><i class="ti-angle-right"></i></button>',

      responsive: [
        {
          breakpoint: 1499,
          settings: {
            slidesToShow: 1
          }
        },
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 1
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 1
          }
        },
        {
          breakpoint: 479,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  });

  /*----------  single product small image slider  ----------*/

  $(".shop-product__small-image-gallery-slider").each(function () {
    var $this = $(this);
    var $row = $this.attr("data-row")
      ? parseInt($this.attr("data-row"), 10)
      : 1;
    $this.slick({
      infinite: true,
      arrows: true,
      dots: false,
      slidesToShow: 5,
      centerMode: true,
      centerPadding: "15px",
      slidesToScroll: 1,
      rows: $row,
      prevArrow:
        '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
      nextArrow:
        '<button class="slick-next"><i class="ti-angle-right"></i></button>',
      asNavFor: ".shop-product__big-image-gallery-slider",
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 1499,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 6
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 479,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });
  });

  /*----------  single product small image slider vertical  ----------*/

  $(".shop-product__small-image-gallery-slider--vertical").each(function () {
    var $this = $(this);
    var $row = $this.attr("data-row")
      ? parseInt($this.attr("data-row"), 10)
      : 1;
    $this.slick({
      infinite: true,
      arrows: true,
      dots: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      vertical: true,
      centerMode: true,
      rows: $row,
      prevArrow:
        '<button class="slick-prev"><i class="ti-angle-left"></i></button>',
      nextArrow:
        '<button class="slick-next"><i class="ti-angle-right"></i></button>',
      asNavFor: ".shop-product__big-image-gallery-slider",
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 1499,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 3,
            vertical: false,
            arrows: false,
            centerMode: true,
            centerPadding: "15px"
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 3,
            vertical: false,
            arrows: false,
            centerMode: true,
            centerPadding: "15px"
          }
        },
        {
          breakpoint: 479,
          settings: {
            slidesToShow: 2,
            vertical: false,
            arrows: false,
            centerMode: true,
            centerPadding: "15px"
          }
        }
      ]
    });
  });

  /*----------  lightgallery and zoom activation  ----------*/

  //zoom
  $(".shop-product__big-image-gallery-slider .single-image").zoom();
  $(".shop-product__big-image-gallery-sticky .single-image").zoom();

  //lightgallery
  var productThumb = $(
      ".shop-product__big-image-gallery-slider .single-image img, .shop-product__big-image-gallery-sticky .single-image img"
    ),
    imageSrcLength = productThumb.length,
    images = [];
  for (var i = 0; i < imageSrcLength; i++) {
    images[i] = { src: productThumb[i].src };
  }

  $(".btn-zoom-popup").on("click", function () {
    $(this).lightGallery({
      thumbnail: false,
      dynamic: true,
      autoplayControls: false,
      download: false,
      actualSize: false,
      share: false,
      hash: false,
      index: 0,
      dynamicEl: images
    });
  });

  /*----------  video background	 ----------*/

  var videoBg = $(".video-bg");

  videoBg.each(function (index, elem) {
    var element = $(elem),
      videoUrl = element.data("url");

    videoBg.YTPlayer({
      videoURL: videoUrl,
      showControls: false,
      showYTLogo: false,
      mute: true,
      quality: "highres",
      containment: ".video-area",
      ratio: "auto"
    });
  });

  /*----------  newsletter overlay close  ----------*/

  if (screenSize >= 767) {
    $("#newsletter-popup-close-icon").on("click", function () {
      $("body")
        .removeClass("newsletter-overlay-active")
        .addClass("newsletter-overlay-inactive");
      $("#newsletter-content").removeClass("show-popup").addClass("hide-popup");
    });
  }

  /*----------   Payment method select  ----------*/

  $('[name="payment-method"]').on("click", function () {
    var $value = $(this).attr("value");

    $(".single-method p").slideUp();
    $('[data-method="' + $value + '"]').slideDown();
  });

  /*----------   Shipping form toggle  ----------*/

  $("[data-shipping]").on("click", function () {
    if ($("[data-shipping]:checked").length > 0) {
      $("#shipping-form").slideDown();
    } else {
      $("#shipping-form").slideUp();
    }
  });

  /*=============================================
    =            background image            =
    =============================================*/

  var bgSelector = $(".bg-img");
  bgSelector.each(function (index, elem) {
    var element = $(elem),
      bgSource = element.data("bg");
    element.css("background-image", "url(" + bgSource + ")");
  });

  /*=====  End of background image  ======*/
})(jQuery);
