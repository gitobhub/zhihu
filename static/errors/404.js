var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-20961733-1']);
_gaq.push(['_setSampleRate', '0.1']);
_gaq.push(['_trackPageview', "/404" + document.location.pathname + document.location.search ]);

(function() {
 var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
 ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
 var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function() {
  var backButton = document.getElementById('js-history-back')
  backButton.onclick = function() {
    history.go(-1)
  }
}());

(function() {
  if (zap) {
    zap.config({
      'apiHost': 'https://zhihu-web-analytics.zhihu.com/api/v1',
      'product': 'Zhihu',
    })
    zap.trackPageShow()
    zap.trackMonitor({}, {
      'monitor': {
        'statusCode': 404
      }
    })
  }
}());

