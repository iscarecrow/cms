// 文本节点，可编辑
import embedJs from './embedJs';

let popEditPanel = function() {
  var $lis = $(null);
  var $li, cmsFocus = embedJs.cmsFocus;
  if (cmsFocus.toggle) {
    var keytoggle = embedJs.cmsDomCache.randomString('toggle');
    embedJs.cmsDomCache[keytoggle] = cmsFocus.toggle.elem;

    var classarr = cmsFocus.toggle.class.split(',');
    $li = $('<li><u>状态切换</u><select>' + (function() {
      var ret = '';
      var len = classarr.length;
      for (var i = 0; i < len; i++) {
        var selected = cmsFocus.toggle.elem.hasClass(classarr[i]) ? 'selected' : '';
        ret += '<option value="' + classarr[i] + '" ' + selected + '>' + classarr[i] + '</option>';
      }
      return ret;
    })() + '</select></li>');

    $li.find('select')
      .attr("dttoggle", keytoggle);
    $lis = $lis.add($li);
  }

  if (cmsFocus.insert) {
    $li = $('<li class="clr"><u>' + cmsFocus.insert.name + '</u><input id="poped-insert-text" type="text" value="' + cmsFocus.insert.text + '" style="width:140px;float:left;"/><button class="btn" style="float:left;margin-left:8px" id="poded-insert-button" method-name="' + cmsFocus.insert.method_name + '">' + cmsFocus.insert.button + '</button></li>');

    $lis = $lis.add($li);
  }

  if (cmsFocus.img) {
    var hascroped = false;
    cmsFocus.img.src.replace(/\.thumb\.(\d+)_(\d+)_c/ig, function(a, w, h) {
      if (w == h) {
        hascroped = true;
      }
    });

    $li = $('<li><div class="cms-imgcrop"><img src="' + cmsFocus.img.src + '"/></div><u>图片地址</u><input id="poped-src" type="text" value="' + cmsFocus.img.src + '" ' + (cmsFocus.img.background ? 'isbackground' : '') + '/><div class="cms-check"><input id="cms-check-crop" type="checkbox" ' + (hascroped ? 'checked' : '') + '/><label for="cms-check-crop">截取方形</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id="cms-check-useorigin" type="checkbox" /><label for="cms-check-useorigin">使用原图</label></div></li>');
    var keysrc = embedJs.cmsDomCache.randomString('src');
    embedJs.cmsDomCache[keysrc] = cmsFocus.img.elem;

    $li.find('input')
      .attr("dtsrc", keysrc)
      .attr("dtsrcwidth", cmsFocus.img.width)
      .attr("dtsrcheight", cmsFocus.img.height);
    $lis = $lis.add($li);

    if (cmsFocus.img.alt !== undefined) {
      $li = $('<li><u>图片注释</u><input type="text" value="' + cmsFocus.img.alt + '"/></li>');
      var keyalt = embedJs.cmsDomCache.randomString('alt');
      embedJs.cmsDomCache[keyalt] = cmsFocus.img.elem;
      $li.find('input').attr("dtalt", keyalt);
      $lis = $lis.add($li);
    }
  }
  if (cmsFocus.link) {
    var href = cmsFocus.link.href || 'javascript:;';
    var sp = "__urlopentype=";
    var arrsp = href.split(sp);
    var opentp = '';
    if (arrsp.length > 1) {
      opentp = arrsp[1].split('&')[0];
    }
    $li = $('<li><u>链接</u><select id="cms-check-pageweb">\
        ' + optionCreate('', '默认', opentp) + '\
        ' + optionCreate('pageweb', 'pageweb 应用内打开', opentp) + '\
        ' + optionCreate('inweb', 'inweb 应用浏览器打开', opentp) + '\
        ' + optionCreate('outweb', 'outweb 系统浏览器打开', opentp) + '\
      </select>\
      <input id="poped-link" type="text" value="' + href + '"/></li>');
    var keyhref = embedJs.cmsDomCache.randomString('href');
    embedJs.cmsDomCache[keyhref] = cmsFocus.link.elem;
    $li.find('input').attr("dthref", keyhref);
    $lis = $lis.add($li);
  }
  if (cmsFocus.word && $.isArray(cmsFocus.word)) {
    var len = cmsFocus.word.length;
    for (var j = 0; j < len; j++) {
      var disabled = cmsFocus.word[j].hidden ? 'disabled' : '';
      $li = $('<li style="display:none;"><u>文案' + (j > 0 ? j + 1 : '') + '</u><input id="poped-word-' + (j + 1) + '" type="text" ' + disabled + ' value="' + cmsFocus.word[j].text + '"/></li>');
      var keytext = embedJs.cmsDomCache.randomString('text');
      embedJs.cmsDomCache[keytext] = cmsFocus.word[j].elem;
      $li.find('input').attr("dttext", keytext);
      $lis = $lis.add($li);
    }
  }

  if (cmsFocus.video) {

    $li = $('<li><div><u>视频地址</u><input id="poped-src" type="text" value="' + cmsFocus.video.src + '"/></div><div><u>封面图片</u><input id="poped-src" type="text" value="' + cmsFocus.video.poster + '"/></div></li>');
    var keysrc = embedJs.cmsDomCache.randomString('src');
    var keyposter = embedJs.cmsDomCache.randomString('poster');
    embedJs.cmsDomCache[keysrc] = cmsFocus.video.elem;

    // $li.find('input')
    //   .attr("dtsrc", keysrc)
    //   .attr("dtsrcwidth", cmsFocus.video.width)
    //   .attr("dtsrcheight", cmsFocus.video.height);
    $lis = $lis.add($li);

  }

  // 调用父亲窗口的 popout 弹框方法
  embedJs.cmsPopEditPanel($lis);
}

export default popEditPanel;