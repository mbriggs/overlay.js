/* global Spinner */
jQuery(function($) {
  jQuery.fn.overlay = function(show) {
    var target = this,
        overlay = overlayFor(target);

    show ? overlay.start() : overlay.stop();
  }

  function overlayFor(target) {
    if (target.data("overlay")) return target.data("overlay");

    var overlay = new Overlay(),
        adjustDimensions = _.bind(overlay.adjustDimensions, overlay);

    overlay.applyTo(target);
    $(window).resize( _.debounce(adjustDimensions, 500, true) )

    return overlay;
  }

  //// Overlay

  function Overlay(){
    this.$el = $('<div></div>');
    this.el = this.$el.get()[0];
    this.spinner = createSpinner();
    this.visible = false;
  }

  _.extend(Overlay.prototype, {
    start: function() {
      var spinner = this.spinner,
          overlay = this;

      this.visible = true;
      this.$el.fadeIn('fast', function() {
        spinner.spin(overlay.el);
      });
    },

    stop: function() {
      var overlay = this,
          spinner = this.spinner;

      this.visible = false;
      this.$el.fadeOut('fast', function() {
        spinner.stop();
      });
    },

    applyTo: function(target){
      this.target = target;
      var position = this.target.css("position");

      if(!_.include(['absolute', 'fixed', 'relative'], position)){
        this.target.css({ position: 'relative' });
      }

      this.setStyle();

      this.target.
        append(this.el).
        data('overlay', this);
    },

    setStyle: function(){
      this.$el.css({
        display: 'none',
        zIndex: 95,
        opacity: 0.8,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0
      });

      this.adjustDimensions();
    },

    adjustDimensions: function(){
      this.$el.css({
        width: this.target.width(),
        height: this.target.height()
      });

      if(this.visible){
        this.spinner.stop();
        this.spinner.spin(this.el);
      }
    }
  })

  //// Spinner

  var spinDefaults = $.fn.overlay.defaults = {
    lines: 12, // The number of lines to draw
    length: 7, // The length of each line
    width: 4, // The line thickness
    radius: 10, // The radius of the inner circle
    color: '#000', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: true // Hardware Acceleration
  }

  function createSpinner(){
    return new Spinner(spinDefaults);
  }
});
