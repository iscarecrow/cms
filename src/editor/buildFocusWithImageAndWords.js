// 传入根节点，构建FOCUS，只负责构建图片和文字节点
let buildFocusWithImageAndWords = function($t) {
  // 目前 integral 整体修改，只支持修改第一张图
  var $imgs = $t.find('img');
  var $img, cmsFocus = embedJs.cmsFocus;
  $imgs.each(function(i, el) {
    var $el = $(el);
    if ($img && $img.width() < $el.width() || !$img) {
      $img = $el;
    }
  });

  if ($img && $img.length) {
    var imgsrc = $img.attr('data-src') || $img.attr('src');
    cmsFocus.set("img", {
      "elem": $img,
      "src": imgsrc,
      "width": $img.width(),
      "height": $t.height()
    });
  }

  $t.find('*').not('.cms-embed,.cms-embed *,img').each(function(i, el) {
    var $el = $(el);

    if ($el.children().length === 0) {
      var txt = $el.text().replace(/^ *| *$/ig, '');
      if (txt) {
        var hid = !$el.width();
        cmsFocus.word.push({
          "elem": $el,
          "text": txt,
          "hidden": hid
        });
      }
    }
  });
}

export default buildFocusWithImageAndWords;