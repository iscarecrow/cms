import $ from 'jquery';

let embedParent = {
  popOut: function(pm, n, opt) {
    sugarPop.alert(pm, 'l', opt);
    $('#win-house').empty();
  },
  popClose: function() {
    sugarPop.closeMask();
  },
  setIframeHeight: function(ht) {
    let iframe = $("#embed-iframe");
    iframe.css('height', ht);
  },
  reloadModifiedPage: function() {
    let iframe = $("#embed-iframe");
    let iframewin = iframe[0].contentWindow;
    let iframedoc = iframewin.document;
    let _htmlStr = removeEditAttr(iframedoc.body.parentNode.outerHTML);
    iframedoc.write(_htmlStr);
    iframedoc.close();
  } 
}

export default embedParent;