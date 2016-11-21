// 文本节点，可编辑
import embedJs from './embedJs';
import $ from 'jquery';

function optionCreate(value_, text_, selected_) {
  var selectAttr = selected_ == value_ ? ' selected' : '';
  var returnHtml = '<option value="' + value_ + '"' + selectAttr + '>' + text_ + '</option>';
  return returnHtml;
}

// 弹出，写入要编辑的内容
let popEditPanel = function() {
  let $lis = $(null);
  let $li;
  let cmsFocus = embedJs.cmsFocus;

  if (cmsFocus.toggle) {
    console.log('toggle');
    let keytoggle = embedJs.cmsDomCache.randomString('toggle');
    embedJs.cmsDomCache[keytoggle] = cmsFocus.toggle.elem;
    let classarr = cmsFocus.toggle.class.split(',');
    $li = $('<li><u>状态切换</u><select>' + (function() {
      let ret = '';
      let len = classarr.length;
      for (let i = 0; i < len; i++) {
        let selected = cmsFocus.toggle.elem.hasClass(classarr[i]) ? 'selected' : '';
        ret += '<option value="' + classarr[i] + '" ' + selected + '>' + classarr[i] + '</option>';
      }
      return ret;
    })() + '</select></li>');

    $li.find('select')
      .attr("dttoggle", keytoggle);
    $lis = $lis.add($li);
  }

  if (cmsFocus.insert) {
    console.log('insert');
    $li = $('<li class="clr"><u>' + cmsFocus.insert.name + '</u><input id="poped-insert-text" type="text" value="' + cmsFocus.insert.text + '" style="width:140px;float:left;"/><button class="btn" style="float:left;margin-left:8px" id="poded-insert-button" method-name="' + cmsFocus.insert.method_name + '">' + cmsFocus.insert.button + '</button></li>');
    $lis = $lis.add($li);
  }

  // 图片弹窗内容
  if (cmsFocus.img) {
    let hascroped = false;
    cmsFocus.img.src.replace(/\.thumb\.(\d+)_(\d+)_c/ig, function(a, w, h) {
      if (w == h) {
        hascroped = true;
      }
    });

    $li = $('<li><div class="cms-imgcrop"><img src="' + cmsFocus.img.src + '"/></div><u>图片地址</u><input id="poped-src" type="text" value="' + cmsFocus.img.src + '" ' + (cmsFocus.img.background ? 'isbackground' : '') + '/><div class="cms-check"><input id="cms-check-crop" type="checkbox" ' + (hascroped ? 'checked' : '') + '/><label for="cms-check-crop">截取方形</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id="cms-check-useorigin" type="checkbox" /><label for="cms-check-useorigin">使用原图</label></div></li>');

    let keysrc = embedJs.cmsDomCache.randomString('src');
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

  // 链接
  if (cmsFocus.link) {
    let href = cmsFocus.link.href || 'javascript:;';
    let sp = "__urlopentype=";
    let arrsp = href.split(sp);
    let opentp = '';
    if (arrsp.length > 1) {
      opentp = arrsp[1].split('&')[0];
    };

    $li = $('<li><u>链接</u><select id="cms-check-pageweb">\
        ' + optionCreate('', '默认', opentp) + '\
        ' + optionCreate('pageweb', 'pageweb 应用内打开', opentp) + '\
        ' + optionCreate('inweb', 'inweb 应用浏览器打开', opentp) + '\
        ' + optionCreate('outweb', 'outweb 系统浏览器打开', opentp) + '\
      </select>\
      <input id="poped-link" type="text" value="' + href + '"/></li>');

    let keyhref = embedJs.cmsDomCache.randomString('href');

    embedJs.cmsDomCache[keyhref] = cmsFocus.link.elem;

    $li.find('input').attr("dthref", keyhref);

    $lis = $lis.add($li);
  }

  if (cmsFocus.word && Array.isArray(cmsFocus.word)) {
    let len = cmsFocus.word.length;
    for (let j = 0; j < len; j++) {
      let disabled = cmsFocus.word[j].hidden ? 'disabled' : '';
      $li = $('<li style="display:none;"><u>文案' + (j > 0 ? j + 1 : '') + '</u><input id="poped-word-' + (j + 1) + '" type="text" ' + disabled + ' value="' + cmsFocus.word[j].text + '"/></li>');
      let keytext = embedJs.cmsDomCache.randomString('text');
      embedJs.cmsDomCache[keytext] = cmsFocus.word[j].elem;
      $li.find('input').attr("dttext", keytext);
      $lis = $lis.add($li);
    }
  }

  if (cmsFocus.video) {
    $li = $('<li><div><u>视频地址</u><input id="poped-src" type="text" value="' + cmsFocus.video.src + '"/></div><div><u>封面图片</u><input id="poped-src" type="text" value="' + cmsFocus.video.poster + '"/></div></li>');
    let keysrc = embedJs.cmsDomCache.randomString('src');
    let keyposter = embedJs.cmsDomCache.randomString('poster');
    embedJs.cmsDomCache[keysrc] = cmsFocus.video.elem;

    $lis = $lis.add($li);
  }

  // 调用父亲窗口的 popout 弹框方法
  embedJs.cmsPopEditPanel($lis);
}

export default popEditPanel;