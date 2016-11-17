/**
 * @description 基础工具库
 * @author      hugin<hxjlucky@gmail.com>
 * @updateTime  2016-02-17T14:47:51+0800
 */
;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return (root.DtTools = factory());
    });

  } else if (typeof exports === 'object') {
    module.exports = factory();

  } else {
    root.DtTools = factory();
  }
}(this || global, function() {
  var DtTools = {};
  DtTools.VERSION = '0.0.1';
  /**
   * [dtImageTrans description]
   * @param       {[string]}                 url [图片url]
   * @param       {[boolean]}                t   [是否裁剪]
   * @param       {[string]}                 w   [宽度]
   * @param       {[string]}                 h   [高度]
   * @param       {[string]}                 c   [裁剪区域, c中间, a上面，b下面]
   * @return      {[string]}                     [裁剪后的图片]
   * @description
   * @author      hugin
   * @updateTime  2016-02-03T13:58:54+0800
   */
  DtTools.dtImageTrans = function(url, t, w, h, c) {
    var pathn = url.trim().replace(/^http(s)?:\/\//ig, '');
    var pathn_array = pathn.split('/');
    var domain = pathn_array[0];
    var path = pathn_array[1];
    if (t) {
      w = w || 0;
      h = h || 0;
      c = c ? '_' + c : '';
      return this.dtImageTrans(url).replace(/(\.[a-z_]+)$/ig, '.thumb.' + w + '_' + h + c + '$1');
    } else {
      return url.replace(/(?:\.thumb\.\w+|\.[a-z]+!\w+)(\.[a-z_]+)$/ig, '$1');
    }
  };

  /**
   * [dtUriTrans description]
   * @param       {[string]}                 uri  [不带参数api]
   * @param       {[string]}                 data [参数]
   * @return      {[string]}                      [带参数的api]
   * @description
   * @author      hugin
   * @updateTime  2016-02-03T14:22:39+0800
   */
  DtTools.dtUriTrans = function(uri, data) {
    if (data == undefined) {
      return uri;
    } else {
      var uriParamArray = [];
      for (var key in data) {
        var a = key+'='+data[key]
        uriParamArray.push(a);
      }
      var uriParam = uriParamArray.join('&');
      var newUri = (uri+'?'+uriParam)||'';
      return newUri;
    }
  };

  /**
   * [getParams description]
   * @param       {[string]}                 url [可传可不传]
   * @return      {[object]}                     [参数对象]
   * @description  获取url的参数
   * @author      hugin<hxjlucky@gmail.com>
   * @updateTime  2016-02-17T14:19:40+0800
   */
  DtTools.getParams = function(url) {
    if (!url) url = window.location.href;
    var opts = {},
      name, value, i;
    url = url.split('#')[0];
    var idx = url.indexOf('?'),
      search = idx > -1 ? url.substr(idx + 1) : '',
      arrtmp = search.split('&');
    for (var i = 0; i < arrtmp.length; i++) {
      var paramCount = arrtmp[i].indexOf('=');
      if (paramCount > 0) {
        name = arrtmp[i].substring(0, paramCount);
        value = arrtmp[i].substr(paramCount + 1);
        try {
          if (value.indexOf('+') > -1) {
            value = value.replace(/\+/g, ' ');
          }
          opts[name] = decodeURIComponent(value);
        } catch (exp) {}
      }
    }
    return opts;
  };

  DtTools.addParam = function(url, param, value) {
    var re = new RegExp('([&\\?])' + param + '=[^& ]*', 'g');

    url = url.replace(re, function(a, b) {
      return b == '?' ? '?' : ''
    })
    var idx = url.indexOf('?');
    url += (idx > -1 ? idx + 1 != url.length ? '&' : '' : '?') + param + '=' + value;
    return url
  };
  return DtTools;

}));
