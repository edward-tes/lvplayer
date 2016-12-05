(function($, doc) {

  var methods = {
    init: function(options) {
      return this.each(function() {
        var $this = $(this);
        var settings = $.extend({
          src: $this.attr("src")
        }, options);

        var state = {
          play: false
        };

        $this.addClass("lv-container")
        var data = $this.data('player')
        var $video = $("<video class='lv-player'/>");
        $video.attr("src", settings.src);
        $video.on('loadeddata.player', methods.onMediaLoaded_.bind(this));
        $video.on('timeupdate.player', methods.onTimeUpdate_.bind(this));



        var $control = $("<div class='lv-controls'></div>");

        var $rightControl = $("<div class='lv-right-controls'></div>");
        var $leftControl = $("<div class='lv-left-controls'></div>");

        var $play = $("<div class='lv-controls-play'><i class='icon icon-play'></i></div>")

        $play.bind('click.control', methods.onPlayClick_.bind(this))

        var $time = $("<div class='lv-controls-time'><span class='lv-controls-currenttime'>00:00</span> / <span class='lv-controls-duration'>00:00</span></div>")

        var $progress = $("<div class='lv-controls-progress'><div class='lv-controls-progress-completed'><div class='lv-controls-progress-toucher'></div></div></div>")

        var $volume = $("<div class='lv-controls-volume'><i class='icon icon-volume'></i></div>");

				var $volumeSlider = $("<div class='lv-controls-volume-slider'><div class='lv-controls-volume-progress'>" + 
															"<div class='lv-controls-volume-progress-completed'></div></div></div>");
				$volume.append($volumeSlider);


        var $type = $("<div class='lv-controls-type'>高清</div>")

        var $setting = $("<div class='lv-controls-setting'><i class='icon icon-setting'></i></div>")

        var $pagefull = $("<div class='lv-controls-pagefull'><i class='icon icon-page-full'></i></div>");

        $pagefull.on('click.pagefull', methods.onPageFullClick_.bind(this));

        var $full = $("<div class='lv-controls-full'><i class='icon icon-fullscreen'></i></div>")

        $full.on('click.full', methods.onFullClick_.bind(this));

        if (!data) {
          $(this).data('player', {
            target: $this,
            video: $video,
            play: $play,
            time: $time,
            progress: $progress,
            isPagefull: false,
            isfull: false,
          })
        }

        $rightControl.append($volume, $type, $setting, $pagefull, $full)
        $leftControl.append($play, $time)
        $control.append($progress, $leftControl, $rightControl)
        $this.append($video, $control);
      });
    },
    destroy: function() {},
    show: function() {},
    hide: function() {},
    update: function(content) {},
    onPlayClick_: function() {
      var player = $(this).data('player').video.get(0);
      player.paused ? player.play() : player.pause();
      var $play = $(this).data('player').play;
      $play.html(player.paused ? '<i class="icon icon-play"></i>' : '<i class="icon icon-pause"></i>')
    },
    onMediaLoaded_: function() {
      var player = $(this).data('player').video.get(0);
      var $time = $(this).data('player').time;
      $time.find('.lv-controls-duration').text(methods.formatProgress(player.duration));
    },
    onTimeUpdate_: function() {
      var player = $(this).data('player').video.get(0);
      var $progress = $(this).data('player').progress;
      var $time = $(this).data('player').time;
			var currentTime = player.currentTime;
			var duration = player.duration;
			var completeProgress = (currentTime / duration) * 100 + '%';
      $time.find('.lv-controls-currenttime').text(methods.formatProgress(player.currentTime));
			$progress.find('.lv-controls-progress-completed').css('width', completeProgress);
    },
    onPageFullClick_: function() {
      var isPageFull = $(this).data('player').isPageFull;
      var isFull = $(this).data('player').isFull;
      !isPageFull ? $(this).addClass('lv-page-full') : $(this).removeClass('lv-page-full');
      if (isFull) {
        methods.exitFullScreen();
        $(this).data('player').isFull = !isFull;
      }
      $(this).data('player').isPageFull = !isPageFull;
    },
    onFullClick_: function() {
      var isFull = $(this).data('player').isFull;
      var player = $(this).data('player').video.get(0);
      //isFull ? methods.fullScreen_(player)
      methods.toggleFullScreen(player)
      $(this).data('player').isFull = !isFull;

    },
    toggleFullScreen: function(ele) {
      if (!document.fullscreenElement && // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) { // current working methods
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullscreen) {
          ele.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        methods.exitFullScreen();
      }
    },
    exitFullScreen: function() {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    },
    twoDigits: function(x) {
      return x < 10 ? `0${x}` : `${x}`
    },

    formatProgress: function(seconds) {
      const hrs = ~~(seconds / 60 / 60)
      const mins = ~~(seconds / 60 % 60)
      const secs = ~~(seconds % 60)
      return `${hrs > 0 ? methods.twoDigits(hrs) : ""}${hrs > 0 ? ":" : ""}${methods.twoDigits(mins)}:${methods.twoDigits(secs)}`
    }
  };

  $.fn.VideoPlayer = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.tooltip');
    }



  };
})(jQuery, document)
