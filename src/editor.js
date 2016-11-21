import $ from 'jquery';
import jQuery from 'jquery';
import embedJs from './editor/embedJs';
import a from './plugin/jquery-ui.min';
import MediumEditor from './plugin/medium-editor/medium-editor';
import DtPlatform from './utils/dtPlatform';
import initModule from './editor/initModule';
// 前台展示
import setNavigationShoppingCar from './part/setNavigationShoppingCar';
import setNavigationShare from './part/setNavigationShare';
import expireTime from './part/expireTime';

// 模块添加
import cmsModuleAdd from './editor/cmsModuleAdd';
// 模块拷贝
import cmsModuleCopy from './editor/cmsModuleCopy';
// 模块删除
import cmsModuleDelete from './editor/cmsModuleDelete';
// 模块数据修改
import cmsModuleIntegral from './editor/cmsModuleIntegral';
import buildFocusWithImageAndWords from './editor/buildFocusWithImageAndWords';
import popEditPanel from './editor/popEditPanel';


window.embedJs = embedJs;
window.$ = $;
window.DtPlatform = DtPlatform;

window.DtPart = {
  setNavigationShoppingCar: setNavigationShoppingCar,
  setNavigationShare: setNavigationShare,
  expireTime: expireTime
};

$(function(){

  var $D = $(document);
  // 拖拽功能 module 注入可操作panel，此行代码要先于 jsmodule
  $('.cms-module').parent().sortable({ handle: ".cms-show-tool" });

  //页面加载自动高度
  embedJs.setSelfHeightAuto();

  $('.cms-show-tool').disableSelection();

  // 模块工具栏
  $D.on('mouseenter', '.cms-module-div', function(e) {
    $(this).find('.cms-tools').show();
  });

  $D.on('mouseleave', '.cms-module-div', function(e) {
    $(this).find('.cms-tools').hide();
  });

  function init() {
    ////////////////// 模块基础功能绑定 ////////////////////
    // 添加
    cmsModuleAdd();
    // 复制
    cmsModuleCopy();
    // 删除
    cmsModuleDelete();
    // 修改
    cmsModuleIntegral();
    ////////////////// 模块基础功能绑定结束 ////////////////////

    
    // 功能按钮插入到原始dom
    $('.cms-module').each(function(index, el) {
      var $this = $(this);
      embedJs.cmsBuildPanel($this, {
        "add": true,
        "copy": true,
        "integral": true
      });
    });

    //显示隐藏模块
    $('.cms-attribute-hidden').each(function(index, el) {
      var _style = $(el).attr('style');
      $(el).removeAttr('style');
      $(el).attr('cms-attribute-style', _style);
    });

    // jsmodule 初始化，如果jsmodule 没有对应的html，则为其配备一个
    $('.cms-module[js-require="true"]').each(function(i, el) {
      var $t = $(el);
      var _mod = $t.attr('data-name');
      // 同时生成临时html模块
      var $jsm = $('<section class="cms-embed cpmodule-jsmodule-occupy"><p class="cms-jsmodule-occupy">JS Module: ' + _mod + '</p></section>');
      if($t.find('.cpmodule-jsmodule-occupy').length===0){
        $jsm.prependTo($t);
      }
      //js 数据模块
      var _isData = $t.attr('js-data') || '';
      if (_isData) {
        initModule(_isData);
      }
    });
    // 富文本编辑
    var editor = new MediumEditor('.cms-module', {
      toolbar: {
        buttons: ['colorPicker', 'fontsize', 'bold', 'italic', 'underline', 'strikethrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'removeFormat']
      },
      extensions: {
        'colorPicker': new MediumEditor.ColorPickerExtension()
      }
    });
  }

  init();


  // 纯链接点击事件处理，注意如果链接下包含图片，点击事件会被 img.click 消费掉,兼容富文本编辑器，暂时注释掉
  $D.on('click', 'a', function(e) {
    e.preventDefault();
    e.stopPropagation();
  });


  $D.on('dblclick', 'a', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var cmsFocus = embedJs.cmsFocus;
    var $t = $(this);
    var alnk = $t.attr('href');
    var atxt = $t.children().length === 0 ? $t.text() : null;
    cmsFocus.clear();
    cmsFocus._root = $t;
    cmsFocus.set("link", {
      "elem": $t,
      "href": alnk
    });
    cmsFocus.set("word", []);
    if (atxt !== null) {
      cmsFocus.word.push({
        "elem": $t,
        "text": atxt
      });
    }
    buildFocusWithImageAndWords($t);
    popEditPanel();
  });

  // video点击事件处理
  $D.on('click', 'video', function(e) {
    var $t = $(this);
    var videoSrc = $t.attr('data-src') || $t.attr('src');
    var posterImg = $t.attr('poster');
    var cmsFocus = embedJs.cmsFocus;
    cmsFocus.clear();
    cmsFocus._root = $t;
    cmsFocus.set("video", {
      "elem": $t,
      "src": videoSrc,
      "poster": posterImg
    });

    popEditPanel();
  });

  // 图片点击事件处理
  $D.on('click', 'img', function(e) {
    var $t = $(this);
    var imgsrc = $t.attr('data-src') || $t.attr('src');
    var imgalt = $t.attr('alt');
    var $a = $t.closest('a');
    var alnk = null;
    var cmsFocus = embedJs.cmsFocus;
    cmsFocus.clear();
    cmsFocus._root = $t;
    cmsFocus.set("img", {
      "elem": $t,
      "src": imgsrc,
      "alt": imgalt,
      "width": $t.width(),
      "height": $t.height()
    });


    if ($a.length) {
      // 有链接的图片，消费掉click 事件，不让a click事件触发
      // 由于是 .on on 模式，会先触发 外层的 a.onclick
      // 故而这里的 e.stopPropagation 实际是无效的
      e.preventDefault();
      e.stopPropagation();
      alnk = $a.attr('href');

      cmsFocus.set("link", {
        "elem": $a,
        "href": alnk
      });
      // do sth to modify imgsrc , imgalt and alnk;
      // todo
    } else {

      // do sth to modify imgsrc , imgalt
      // todo
    }

    popEditPanel();
  });

  function optionCreate(value_, text_, selected_) {
    var selectAttr = selected_ == value_ ? ' selected' : '';
    var returnHtml = '<option value="' + value_ + '"' + selectAttr + '>' + text_ + '</option>';
    return returnHtml;
  }

});