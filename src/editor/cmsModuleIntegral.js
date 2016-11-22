import embedJs from './embedJs';
import $ from 'jquery';
import buildFocusWithImageAndWords from './buildFocusWithImageAndWords';
import popEditPanel from './popEditPanel';
import dataPopEditPanel from './dataPopEditPanel';

let cmsModuleIntegral = function() {
  let $D = $(document);
  $D.on('click', '.cms-integral', function(e) {
    e.preventDefault();
    e.stopPropagation();
    let $integral = $(this);
    let $t = $(this).closest('.cms-module');
    //判断是数据类型
    let _isData = $t.attr('js-data');

    if (_isData) {
      let config = $t.data(_isData);
      if (typeof config == 'object') {
        let _cmsFocus = embedJs.cmsFocus;
        _cmsFocus.clear();
        _cmsFocus.set(_isData, config);
        _cmsFocus._root = $t;
        _cmsFocus._customtype = _isData;
        _cmsFocus._callback = function($el, type, val) {
          if (val && typeof val == 'object') {
            // 修改 data-[modulename] 值，然后重新加载子页面
            //保留之前的所有的config
            let _oldConfig = $el.data(_cmsFocus._customtype);
            for(let key in val){
              if(_oldConfig[key].hasOwnProperty('value')){
                _oldConfig[key].value = val[key];
              }else{
                _oldConfig[key] = val[key];
              }
            }
            $el.attr('data-' + _cmsFocus._customtype, JSON.stringify(_oldConfig));
            embedJs.cmsReloadModifiedPage();
          }
        };
        dataPopEditPanel(_isData);
      }
    } else {
      //对有料的3个数据请求
      if ($integral.closest('[data-cardtype]').length > 0) {
        let _ele = $integral.closest('[data-cardtype]'),
          _typeId = _ele.data('cardtype');
        localStorage.setItem('data-cardtype', _typeId);
      }

      let cmsFocus = embedJs.cmsFocus;
      cmsFocus.clear();
      cmsFocus._root = $t;
      cmsFocus.set("word", []);
      let insert = $integral.data('insert');
      if (insert) {
        cmsFocus.set('insert', insert);
      }

      let toggles = $t.attr('cms-toggle');
      if (toggles) {
        cmsFocus.set("toggle", {
          "elem": $t,
          "class": toggles
        });
      }

      // 目前 integral 整体修改，只支持修改第一个链接
      let $link = $t.find('a').eq(0);
      if ($link.length) {
        cmsFocus.set("link", {
          "elem": $link,
          "href": $link.attr('href')
        });
      }

      // 目前 integral 整体修改，只支持修改第一个链接
      let $video = $t.find('video').eq(0);
      if ($video.length) {
        cmsFocus.set("video", {
          "elem": $video,
          "src": $video.attr('src'),
          "poster": $video.attr('poster')
        });
      }

      buildFocusWithImageAndWords($t);

      // 寻找节点上有通过 style= 设置背景图片的
      // 优先级比 cmsFocus.img 更高，直接覆盖掉
      $t.find('[style]').eq(0).each(function(i, el) {
        let $el = $(el);
        let styval = $el.attr('style');
        styval.replace(/background-image\s*:\s*url\s*\([^\)]*(http:\/\/[^\)'"]*)[^\)]*\)/ig, function(a, b) {
          cmsFocus.set("img", {
            "elem": $el,
            "src": b,
            "width": $el.width(),
            "height": $el.height(),
            "background": true
          });
        });
      });
      popEditPanel();
    }
  });
}

export default cmsModuleIntegral;