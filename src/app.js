// import _ from 'lodash';
import templateStr from './editor/template';
import $ from 'jquery';

window.$ = $;

/**
 * [embedParent embedJs调用]
 * @type {Object}
 */
window.embedParent = {
  popOut: function(pm, n, opt) {
    // SUGAR.PopOut.alert(pm, 'l', opt);
    $('#win-house').empty();
  },
  popClose: function() {
    // SUGAR.PopOut.closeMask();
  },
  setIframeHeight: function(ht) {
    iframe.css('height', ht);
  },
  reloadModifiedPage: function() {
    var _htmlStr = removeEditAttr(iframedoc.body.parentNode.outerHTML);
    iframedoc.write(_htmlStr);
    iframedoc.close();
  }
};

$(function() {
  let modConfig = [];
  let pageConifg = [];
  let iframe = $("#embed-iframe");
  let iframewin = iframe[0].contentWindow;
  let iframedoc = iframewin.document;
  let $D = $(document);


  function getModConfig() {
    fetch('/javascripts/config/modconfig.json')
    .then((response) => {
      return response.json()
    }).then((json) => {
      for (let item of json) {
        for (let value of item.inner_mods) {
          modConfig.push(value);
        }
      }
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    });
  }

  function getPageConfig() {
    fetch('/javascripts/config/pageconfig.json')
    .then((response) => {
      return response.json()
    }).then((json) => {
      pageConifg = json;
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    });
  }
  // 初始化编辑器
  function insertIframeEditor(htmlStr) {
    let editorStatic = ['<link class="cms-embed" rel="stylesheet" type="text/css" href="/stylesheets/embed.css"/>','<link class="cms-embed" rel="stylesheet" type="text/css" href="/stylesheets/medium-editor.css"/>','<link class="cms-embed" rel="stylesheet" type="text/css" href="/stylesheets/medium-default.css"/>','<script class="cms-embed" src="/javascripts/editor.js"></script>'];
    let embedStr = '';
    for (let val of editorStatic) {
      embedStr += val + '\n';
    }
    
    let iframeStr = templateStr.replace('</head>', embedStr + '</head>' + '\n');

    iframedoc.write(iframeStr);
    iframedoc.close();
  }


  // 模块选择
  function moduleSelect() {

  }

  // 模块配置加载
  function modulesLoad() {
    getModConfig();
    getPageConfig();
    insertIframeEditor();
  }

  function init() {
    modulesLoad();  
  }

  init();

  $D.on('click','.menu-modues',function(){
    console.log(this);
  });


});

