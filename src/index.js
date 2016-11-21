(function ($, doc) {
   $.fn.VideoPlayer = function( options ) {
      var settings = $.extend({
        src: this.attr("src")
      }, options );
      this.addClass("lv-container")

      var $video = $("<video class='lv-player'/>");

      $video.attr("src",  settings.src);

      var $control = $("<div class='lv-controls'></div>");

      var $play = $("<div class='lv-controls-play'/>")

      var $progress = $("<div class='lv-controls-progress'/>")

      var $volume = $("<div class='lv-controls-volume'></div>")

      $control.append($play, $progress, $volume)

      this.append($video, $control);

      return this;
  };
})(jQuery, document)
