let embedJs = {};

embedJs.cmsFocus = {
  clear: function() {
    for (var item in this) {
      if (item != 'set' && item != 'clear') {
        this[item] = null;
      }
    }
  },
  set: function(name, value) {
    this[name] = value;
  }
};

embedJs.cmsDomCache = {
  clear: function() {
    for (var item in this) {
      if (item != 'randomString' && item != 'clear') {
        this[item] = null;
      }
    }
  },
  randomString: function(head) {
    var len = 10;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return head + '-' + new Date().getTime() + '-' + pwd;
  } 
}

embedJs.setSelfHeightAuto = function() {
  this.cmsSetSelfHeight();
  setTimeout(this.setSelfHeightAuto, 2000);
}

embedJs.cmsSetSelfHeight = function() {
  if (parent && parent.embedParent.setIframeHeight) {
    var _height = 50;
    for (var i = document.body.children.length; i > 0; i--) {
      _height += document.body.children[i - 1].offsetHeight;
    }
    parent.embedParent.setIframeHeight(_height);
  }
}


embedJs.cmsReloadModifiedPage = function() {
  if (parent && parent.embedParent.reloadModifiedPage) {
    parent.embedParent.reloadModifiedPage();
  }
}


embedJs.addParam = function() {

} 


embedJs.removeParam = function() {

}

embedJs.cmsProperateImageWidth = function() {

}


embedJs.cmsBuildPanel = function() {

}


embedJs.appendAfter= function() {
  
}


embedJs.cmsReturnBack= function() {
  
}



embedJs.cmsPopAddPanel = function() {
  
}


embedJs.cmsPopEditPanel = function() {
  
}


embedJs.cmsHtmlRepairBeforeGenerate = function() {
  
}


embedJs.cmsCreatePage = function() {
  
}


export default embedJs;
