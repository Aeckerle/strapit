//https://github.com/Gild/bootstrap-tour
//Bootstrap Tour is an easy to configure site tour wizard based on Twitter Boostrap and inspired by Joyride.
//Bootstrap Tour is MIT-licensed and absolutely free to use.

(function() {
  var $, cookie;

  $ = jQuery;

  cookie = function(key, value, options) {
    var days, decode, result, t;
    if (arguments.length > 1 && String(value) !== "[object Object]") {
      options = jQuery.extend({}, options);
      if (value == null) {
        options.expires = -1;
      }
      if (typeof options.expires === "number") {
        days = options.expires;
        t = options.expires = new Date();
        t.setDate(t.getDate() + days);
      }
      value = String(value);
      return (document.cookie = [encodeURIComponent(key), "=", (options.raw ? value : encodeURIComponent(value)), (options.expires ? "; expires=" + options.expires.toUTCString() : ""), (options.path ? "; path=" + options.path : ""), (options.domain ? "; domain=" + options.domain : ""), (options.secure ? "; secure" : "")].join(""));
    }
    options = value || {};
    result = void 0;
    decode = (options.raw ? function(s) {
      return s;
    } : decodeURIComponent);
    return ((result = new RegExp("(?:^|; )" + encodeURIComponent(key) + "=([^;]*)").exec(document.cookie)) ? decode(result[1]) : null);
  };

  $.fn.extend({
    featureTour: function(options) {
      var currentStep, log, setCookieStep, settings;
      settings = {
        tipContent: '#featureTourTipContent',
        cookieMonster: false,
        cookieName: 'bootstrapFeatureTour',
        cookieDomain: false,
        postRideCallback: $.noop,
        postStepCallback: $.noop,
        nextOnClose: false,
        debug: false
      };
      settings = $.extend(settings, options);
      log = function(msg) {
        if (settings.debug) {
          return typeof console !== "undefined" && console !== null ? console.log('[bootstrap-tour]', msg) : void 0;
        }
      };
      currentStep = function() {
        var current_cookie;
        if (settings.cookieMonster == null) {
          return 1;
        }
        current_cookie = cookie(settings.cookieName);
        if (current_cookie == null) {
          return 1;
        }
        try {
          return parseInt(current_cookie);
        } catch (e) {
          return 1;
        }
      };
      setCookieStep = function(step) {
        if (settings.cookieMonster) {
          return cookie(settings.cookieName, "" + step, {
            expires: 365,
            domain: settings.cookieDomain
          });
        }
      };
      return this.each(function() {
        var $tipContent, $tips, first_step;
        $tipContent = $(settings.tipContent).first();
        if ($tipContent == null) {
          log("can't find tipContent from selector: " + settings.tipContent);
        }
        $tips = $tipContent.find('li');
        first_step = currentStep();
        log("first step: " + first_step);
        if (first_step > $tips.length) {
          log('tour already completed, skipping');
          return;
        }
        $tips.each(function(idx) {
          var $li, $target, target, tip_data;
          if (idx < (first_step - 1)) {
            log("skipping step: " + (idx + 1));
            return;
          }
          $li = $(this);
          tip_data = $li.data();
          if ((target = tip_data['target']) == null) {
            return;
          }
          if (($target = $(target).first()) == null) {
            return;
          }
          $target.popover({
            trigger: 'manual',
            title: tip_data['title'] != null ? "" + tip_data['title'] + " <a class=\"tour-tip-close close\" data-touridx=\"" + (idx + 1) + "\">&times;</a>" : null,
            content: "<p>" + ($li.html()) + "</p><p style=\"text-align: right\"><a href=\"#\" class=\"tour-tip-next btn btn-success\" data-touridx=\"" + (idx + 1) + "\">" + ((idx + 1) < $tips.length ? 'Next <i class="icon-chevron-right icon-white"></i>' : '<i class="icon-ok icon-white"></i> Done') + "</a></p>",
            placement: tip_data['placement'] || 'right'
          });
          $li.data('target', $target);
          if (idx === (first_step - 1)) {
            return $target.popover('show');
          }
        });
        $('a.tour-tip-close').live('click', function() {
          var current_step;
          current_step = $(this).data('touridx');
          $(settings.tipContent).first().find("li:nth-child(" + current_step + ")").data('target').popover('hide');
          if (settings.nextOnClose) {
            return setCookieStep(current_step + 1);
          }
        });
        return $('a.tour-tip-next').live('click', function() {
          var current_step, next_tip, _ref;
          current_step = $(this).data('touridx');
          log("current step: " + current_step);
          $(settings.tipContent).first().find("li:nth-child(" + current_step + ")").data('target').popover('hide');
          if (settings.postStepCallback !== $.noop) {
              settings.postStepCallback($(this).data('touridx'));
          }
          next_tip = (_ref = $(settings.tipContent).first().find("li:nth-child(" + (current_step + 1) + ")")) != null ? _ref.data('target') : void 0;
          setCookieStep(current_step + 1);
          if (next_tip != null) {
              var next_tip_id = '#' + next_tip.attr('id');
              var targetOffset = $(next_tip_id).offset().top - 300;
              $('html, body').animate({scrollTop: targetOffset}, 1000);
              next_tip.popover('show');
              return false;  //so that href will get ignored
          } else {
              if (settings.postRideCallback !== $.noop) {
                  return settings.postRideCallback();
              }
              return false;

          }
      });
      });
    }
  });

}).call(this);