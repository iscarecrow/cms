import $ from 'jquery';
import embedJs from './embedJs';
import jqueryUi from '../plugin/jquery-ui.min';

let cmsModuleInit = function() {
  let $D = $(document);
  // 拖拽功能 module 注入可操作panel，此行代码要先于 jsmodule
  $('.cms-module').parent().sortable({ handle: ".cms-show-tool" });

  $('.cms-show-tool').disableSelection();

  //显示隐藏模块
  $('.cms-attribute-hidden').each(function(index, el) {
    var _style = $(el).attr('style');
    $(el).removeAttr('style');
    $(el).attr('cms-attribute-style', _style);
  });
 
  // 模块工具栏
  $D.on('mouseenter', '.cms-module-div', function(e) {
    $(this).find('.cms-tools').show();
  });

  $D.on('mouseleave', '.cms-module-div', function(e) {
    $(this).find('.cms-tools').hide();
  });

  // 功能按钮插入到原始dom
  $('.cms-module').each(function(index, el) {
    let $this = $(this);
    embedJs.cmsBuildPanel($this, {
      "add": true,
      "copy": true,
      "integral": true
    });
  });

  // jsmodule 初始化，如果jsmodule 没有对应的html，则为其配备一个
  $('.cms-module[js-require="true"]').each(function(i, el) {
    let $t = $(el);
    let _mod = $t.attr('data-name');
    // 同时生成临时html模块
    let $jsm = $('<section class="cms-embed cpmodule-jsmodule-occupy"><p class="cms-jsmodule-occupy">JS Module: ' + _mod + '</p></section>');
    if($t.find('.cpmodule-jsmodule-occupy').length === 0){
      $jsm.prependTo($t);
    }
    //js 数据模块
    let _isData = $t.attr('js-data') || '';
    if (_isData) {
      initModule(_isData);
    }
  });

  //页面加载自动高度
  embedJs.setSelfHeightAuto();

}

export default cmsModuleInit;