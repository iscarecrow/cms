let DtPlatform = {
  isDuiTang: function() {
    var r = /(duitang)/ig;
    return this.testUa(r);
  },
  isWeiXin: function() {
    var r = /(micromessenger)/ig;
    return this.testUa(r);
  },
  isWeiBo: function() {
    var r = /(weibo)/ig;
    return this.testUa(r);
  },
  testUa: function(r) {
    var ua = navigator.userAgent.toLowerCase();
    return r.test(ua) ? true : false;
  },
  isMEIZU: function() {
    var ua = navigator.userAgent;
    var m = ua.match(";\s?([^;]+?)\s?(Build)?/");
    var model = m[1];
    var meizuReg = /\b[M]\d{3}\b/;
    if (meizuReg.test(model)) {
      return true;
    } else {
      return false;
    }
  },
  sdkVersion: function() {
    var ua = navigator.userAgent.toLowerCase();
    var jssdk = /(jssdk)[ \/]([\w.]+)/;
    var match = jssdk.exec(ua);
    var version;
    if (match === null) {
      version = '0';
      return parseFloat(version);
    } else {
      version = match[2] || '0.1';
      return parseFloat(version);
    }
  }
}

export default DtPlatform;