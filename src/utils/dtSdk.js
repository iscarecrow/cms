/*
@说明：产品级公用js文件，产品级公用js 方法，js调用原生Sdk
@作者：hugin<hxjlucky@gmail.com>
@时间：2015-08-09
*/
(function(){
  var globalbridge;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var DtSdk = {};
  DtSdk.VERSION = '1.2';
  DtSdk.cachedata = {};
  // sdk ready, 所有方法写在ready内部
  DtSdk.ready = function(callback) {
    if (isDuitang()){
        if (window.WebViewJavascriptBridge) {
        callback();
      } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
          callback();
        }, false);
      }
    } else {
      callback();
    }
  };


  DtSdk.notification = function(data, callback) {
    _callHandler('postNotification', data, callback);
  };
  /*
  描述：调用关闭url
  参数：data
  {
    "type": 'closeurl'
  }
  */
  DtSdk.closeUrl = function(data, callback) {
    _callHandler('closeURL', data, callback);
  };

  /*
  描述：调用原生webview前进方式
  参数：data
  {
    "type": 'present||push'
  }
  参数：
  */
  DtSdk.openUrl = function(data, callback) {
    if (isDuitang()) {
      var domain = window.location.origin;
      var http = /(http(s)?\:\/\/)/ig;
      if (!http.test(data.url)) data.url = domain + data.url;
      _callHandler('openURL', data, callback);
    } else {
      window.location.href = data.url;
    }
  };

  /*
  描述：调用原生支付宝
  参数：data
  {
    "order_string": ''
  }
  */
  DtSdk.alipay = function(data, callback) {
    _callHandler('alipay', data, callback);
  };
  /*
  描述：调用原生登陆
  参数：data
  {} || 不传参
  */
  DtSdk.isLogin = function(data, callback) {
    _callHandler('checkLogin', data, callback);
  };

  DtSdk.login = function(data, callback) {
    _callHandler('login', data, callback);
  };
  DtSdk.setNavigation = function(data, callback) {
    _callHandler('setNavigationBarRightButton', data, callback);
  };

  DtSdk.trc = function(data, callback) {
    var param = data.split(',');
    if( param.length >= 3 ){
      var name = param[0];
      var attrkey = param[1];
      var attrvalue = param.slice(2).join(',');
      var attributes = {};
      if (attrkey !== undefined)attributes[attrkey] = attrvalue;
      data = {
        "name":name,
        "attributes":attributes
      };
      _callHandler('dtraceEvent', data, callback);
    }
  };


  // 0.3 version start
  DtSdk.showAlertInfoView = function(data, callback) {
    _callHandler('showAlertInfoView', data, callback);
  };

  DtSdk.showAlertView = function(data, callback) {
    _callHandler('showAlertView', data, callback);
  };

  DtSdk.socialShare = function(data, callback) {
    _callHandler('socialShare', data, callback);
  };

  DtSdk.blogComment = function(data, callback) {
    _callHandler('blogComment', data, callback);
  };

  DtSdk.blogZan = function(data, callback) {
    _callHandler('blogZan', data, callback);
  };

  DtSdk.blogLike = function(data, callback) {
    _callHandler('blogLike', data, callback);
  };

  DtSdk.blogForward = function(data, callback) {
    _callHandler('blogForward', data, callback);
  };

  // 0.3 version end

  // 0.4 version start
  DtSdk.blogCreate = function(data, callback) {
    _callHandler('blogCreate', data, callback);
  };

  DtSdk.selectionAlbumFeedback = function(data, callback) {
    _callHandler('selectionAlbumFeedback', data, callback);
  };
  // 0.4 version end

  // 0.5 version start
  DtSdk.photoBrowse = function(data, callback) {
    _callHandler('photoBrowse', data, callback);
  };
  DtSdk.albumChoose = function(data,callback){
    _callHandler('albumChoose', data, callback);
  };
  DtSdk.titleChange = function(data, callback) {
    _callHandler('titleChange', data, callback);
  };
  // 0.5 version end

  // 0.6 version start
  DtSdk.httpRequest = function(data, callback) {
    _callHandler('httpRequest', data, callback);
  };
  // 0.6 version end


  // 0.7 version start 客户端5.9
  DtSdk.wxpay = function(data, callback) {
    _callHandler('wxpay', data, callback);
  };
  // 0.7 version end

  // 0.9 version start
  DtSdk.dtraceLog = function(data, callback) {
    _callHandler('dtraceLog', data, callback);
  };
  // 0.9 version end
  // 1.0 version start 客户端6.0
  DtSdk.getDeviceInfo = function(data, callback) {
    _callHandler('getDeviceInfo', data, callback);
  };
  DtSdk.setHandleBackButton = function(data, callback) {
    _callHandler('setHandleBackButton', data, callback);
  };
  DtSdk.getAddress = function(data, callback) {
    _callHandler('getAddress', data, callback);
  };
  // 1.0 version end
  // 1.1 version start
  // 客户端版本 6.2.1 IOS
  DtSdk.musicAction = function(data,callback){
    _callHandler('musicAction', data, callback);
  };

  DtSdk.commentMoreAction= function(data,callback){
    _callHandler('commentMoreAction', data, callback);
  };
  //
  DtSdk.responseCheckInfo = function(data,callback){
    _callHandler('responseCheckInfo', data, callback);
  };
  // 1.1 version end

  //1.2 version start
  // 客户端版本 ios 6.2.2 ; andriod 6.2.6(84)
  // 弹出html 弹窗
  DtSdk.showHtmlDialog = function(data,callback){
    _callHandler('showHtmlDialog', data, callback);
  };
  // 关闭html 弹窗
  DtSdk.hideHtmlDialog= function(data,callback){
    _callHandler('hideHtmlDialog', data, callback);
  };
  DtSdk.setNavigationButtons = function(data, callback) {
    _callHandler('setNavigationBarButtons', data, callback);
  };
  //1.2 version end

  DtSdk.responseNotification = [ ];

  //1.2 version start
  DtSdk.responseNavigationButtonsClick = function(params) {
  };
   //1.2 version end

  // Native call js function start
  function _callHandler(method, data, callback) {
    if (typeof data !== 'object') {
      if (typeof callback !== 'function') {
        callback = data;
        data = {
          "method": method
        };
      }
    } else {
      if (isEmpty(data)) {
        data = {
          "method": method,
        };
      } else {
        var cacheData = data;
        data = {
          "method": method,
          "params": cacheData
        };
      }
    }
    var dataString = JSON.stringify(data);
    if (globalbridge) {
      globalbridge.callHandler('duitangSDKHandler', dataString, function(response) {
        var jsn = isObject(response) ? response : JSON.parse(response);
        callback(jsn);
      });
    } else {
      console.log('sdk is not ready');
    }

  }
  // Native call js function end


  function isEmpty(obj) {
    if (obj === null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  }

  function isObject(item) {
    return (typeof item === "object" && !Array.isArray(item) && item !== null);
  }

  function isDuitang() {
    var ua, r;
    ua = navigator.userAgent.toLowerCase();
    r = /(duitang)/ig;
    return r.test(ua) ? true : false;
  }

  // connect to iOS
  function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge);
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function() {
        callback(WebViewJavascriptBridge);
      }, false);
    }
  }

  connectWebViewJavascriptBridge(function(bridge) {
    globalbridge = bridge;
    bridge.init(function(message, responseCallback) {
      var data = {
        'Javascript Responds': 'init!'
      };
      responseCallback(data);
    });
    bridge.registerHandler("_callNavtiveHandler", function(response) {
      var jsn = isObject(response) ? response : JSON.parse(response);
      var method = jsn.method || '';
      var params = jsn.params;
      var _data;
      switch (method) {
        case 'init':
          DtSdk.cachedata = params.data;
          break;
        case 'postNotification':
          if(typeof(DtSdk.responseNotification) === 'function'){
            DtSdk.responseNotification(params);
          }else if(typeof(DtSdk.responseNotification) === 'object'){
             for (var i = DtSdk.responseNotification.length - 1; i >= 0; i--) {
              DtSdk.responseNotification[i](params);
             }
          }
          break;
        case 'onNavigationBarRightButtonClick':
          DtSdk.responseNavigationClick(params);
          break;
          //1.2 version start
        case 'onNavigationBarButtonsClick':
          DtSdk.responseNavigationButtonsClick(params);
          break;
          //1.2 version end
        default:

      }
    });
  });

  if (typeof define === 'function' && define.amd) {
    define('DtSdk', [], function() {
      //因为dttrac打点的需要，dtsdk挂载到window下
      window.DtSdk = DtSdk;
      return DtSdk;
    });
  } else {
    window.DtSdk = DtSdk;
  }

}.call(this));