import $ from 'jquery';
import popEditPanel from './popEditPanel';
import buildFocusWithImageAndWords from './buildFocusWithImageAndWords';

let cmsModuleElementEvents = function() {

  let $D = $(document);
  
  // 链接点击事件处理
  // 纯链接点击事件处理，注意如果链接下包含图片，点击事件会被 img.click 消费掉,兼容富文本编辑器，暂时注释掉
  $D.on('click', 'a', function(e) {
    e.preventDefault();
    e.stopPropagation();
  });

  $D.on('dblclick', 'a', function(e) {
    e.preventDefault();
    e.stopPropagation();
    let cmsFocus = embedJs.cmsFocus;
    let $t = $(this);
    let alnk = $t.attr('href');
    let atxt = $t.children().length === 0 ? $t.text() : null;
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

  // 图片点击事件处理
  $D.on('click', 'img', function(e) {
    let $t = $(this);
    let imgsrc = $t.attr('data-src') || $t.attr('src');
    let imgalt = $t.attr('alt');
    let $a = $t.closest('a');
    let cmsFocus = embedJs.cmsFocus;
    cmsFocus.clear();
    cmsFocus._root = $t;
    // image的数据模型
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
      // href的数据模型
      let alnk = $a.attr('href');
      cmsFocus.set("link", {
        "elem": $a,
        "href": alnk
      });
    } 
    popEditPanel();
  });

  // video点击事件处理
  $D.on('click', 'video', function(e) {
    let $t = $(this);
    let videoSrc = $t.attr('data-src') || $t.attr('src');
    let posterImg = $t.attr('poster');
    let cmsFocus = embedJs.cmsFocus;
    cmsFocus.clear();
    cmsFocus._root = $t;
    cmsFocus.set("video", {
      "elem": $t,
      "src": videoSrc,
      "poster": posterImg
    });
    popEditPanel();
  });

};

export default cmsModuleElementEvents;