import templateStr from './editor/templateStr';
import $ from 'jquery';
import sugarPop from './utils/sugarPop';
import embedParent from './editor/embedParent';
import cmsDataInsertToDom from './editor/cmsDataInsertToDom';

window.$ = $;
window.sugarPop = sugarPop;
window.embedParent = embedParent;

$(function() {
  let originModConfig = [];
  let modConfig = [];
  let pageConifg = [];
  let iframe = $("#embed-iframe");
  let iframewin = iframe[0].contentWindow;
  let iframedoc = iframewin.document;
  let $D = $(document);

  function renderModMenu(data) {
    let templateStr = '';
    for (let val of data) {
      templateStr += `<div class="cms_cnt_l_inner"><div class="cms_module_items"><h1>${val.name}</h1><ul>`
      for (let inner_mod of val.inner_mods) {
        templateStr += `<li data-id="${inner_mod.id}" class="menu-modues">${inner_mod.name}</li>`
      }
      templateStr += '</ul></div><div>';
    }
    $('.cms_cnt_l').html(templateStr);
  }

  function getModConfig() {
    fetch('/javascripts/config/modconfig.json')
    .then((response) => {
      return response.json()
    }).then((json) => {
      // 渲染左侧栏目
      renderModMenu(json);
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

    let editorStatic = ['<link class="cms-embed" rel="stylesheet" type="text/css" href="/stylesheets/embed.css"/>','<link class="cms-embed" rel="stylesheet" type="text/css" href="/stylesheets/medium-editor.css"/>','<link class="cms-embed" rel="stylesheet" type="text/css" href="/stylesheets/medium-default.css"/>','<script class="cms-embed" src="https://a.dtstatic.com/static/guide2/js/cms/base-lazyload-ga.0378ef68.js"></script>','<script class="cms-embed" src="/javascripts/editor.js"></script>'];

    let embedStr = '';

    for (let val of editorStatic) {
      embedStr += val + '\n';
    }
    
    let iframeStr = templateStr.replace('</head>', embedStr + '</head>' + '\n');
    iframedoc.write(iframeStr);
    iframedoc.close();
  }

  // 记载静态资源
  function moduleSaticLoad(module) {
    fetch(module.url)
    .then((response) => {
      return response.text()
    }).then((body) => {
      module.htmlStr = body;
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    });

    if (module.css && !module.cssLink) {
      module.cssLink = '<link rel="stylesheet" class="cms-embed"  href="'+ module.css + '" data-css="' + module.css + '" for-mod="' + module.id + '">'; 
    };
    //js 是数组
    if (module.js && !module.jsLink) {
      module.jsLink = '';
      for (let val of module.js) {
        module.jsLink += '<script  class="cms-embed" src="' + val + '" data-js="' + val + '" for-mod="' + module.id + '"></script>\n';
      }
    }

  }

  function moduleHover(moduleId) {
    let htmlStr = '';
    // 从数组中查找对象
    let currentModule = $.grep(modConfig, function(e){ return e.id == moduleId;})[0];
    console.log('currentModule');
    console.log(currentModule);
    if (currentModule.htmlStr) {
      // console.log('good');
    } else {
      moduleSaticLoad(currentModule);
    }
  }

  // 模块选择
  function moduleSelect(moduleId) {
    let currentModule = $.grep(modConfig, function(e){ return e.id == moduleId;})[0];
    console.log('dddddddd');
    if (currentModule.htmlStr) {
      // 此处应该是 iframe insert module方法， iframe内部完成
      let $mod = $('<div></div>').append(currentModule.htmlStr);
      let $children = $mod.find('.cms-module');
      if (iframewin && iframewin.embedJs.cmsBuildPanel) {
        $children.each((index,elem) => {
          iframewin.embedJs.cmsBuildPanel($(elem), {
            "add": true,
            "copy": true,
            "integral": true
          });
        })
      };

      localStorage.setItem('cms-copy', $mod.html());
      localStorage.setItem('cms-copy-style', currentModule.cssLink || '');
      localStorage.setItem('cms-copy-script', currentModule.jsLink || '');
      // 模块选择成功
      const message = `<div class="prompt"><h3>选择[<span style="color:red">${currentModule.name}</span>]模块成功</h3></div>`;
      console.log(message);
      sugarPop.alert(message);
      setTimeout(function(){
        sugarPop.closeMask();
      },1000);
    }
  }

  // 模块配置加载
  function modulesConfigLoad() {
    getModConfig();
    getPageConfig();
    insertIframeEditor();
  }

  function init() {
    modulesConfigLoad();  
  }

  init();

  $D.on('click','#cms-uniteditsub',(e)=>{
    console.log(e.target);
    cmsDataInsertToDom();
  });

  $D.on('mouseenter','.menu-modues', function(){
    let $this = $(this);
    let moduleId = $this.data('id');
    moduleHover(moduleId);
  });

  $D.on('click','.menu-modues', function(){
    let $this = $(this);
    let moduleId = $this.data('id');
    moduleSelect(moduleId);
  });

  $D.on('click', '.cms-addmodule-new', function(){
    let attr = $(this).attr('direction');
    if (iframewin && iframewin.embedJs.cmsReturnBack) {
      iframewin.embedJs.cmsReturnBack(null, {
        "addquickly": "storage",
        "addquicklydir": attr
      });
    }
    embedParent.popClose();
  });
});

