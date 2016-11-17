import $ from 'jquery';
import jQuery from 'jquery';
import embedJs from './editor/embedJs';
import a from './plugin/jquery-ui.min';
import MediumEditor from './editor/medium-editor/medium-editor';
import DtPlatform from './utils/dtPlatform';
import initModule from './editor/initModule';


// 前台展示
import setNavigationShoppingCar from './part/setNavigationShoppingCar';
import setNavigationShare from './part/setNavigationShare';
import expireTime from './part/expireTime';

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

  // 功能按钮事件绑定 复制当前节点
  $D.on('click', '.cms-add', function(e) {
    e.preventDefault();
    e.stopPropagation();
    let $origin = $(this).closest('.cms-module');
    embedJs.cmsCreatePage($origin);
    embedJs.cmsPopAddPanel();
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
    // embedJs.cmsBuildPanel($jsm, {
    //   "copy": true,
    // });
    if($t.find('.cpmodule-jsmodule-occupy').length===0){
      $jsm.prependTo($t);
    }
    //js 数据模块
    var _isData = $t.attr('js-data');
    if (_isData) {
      initModule(_isData);
    }
  });

  // 功能按钮事件绑定 复制当前节点
  $D.on('click', '.cms-add', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $origin = $(this).closest('.cms-module');
    embedJs.cmsCreatePage($origin);
    embedJs.cmsPopAddPanel();
  });

  // 功能按钮事件绑定 复制当前节点
  if (localStorage) {
    $D.on('click', '.cms-copy', function(e) {
      var $t = $(this);
      var $origin = $t.closest('.cms-module');
      $t.addClass('cms-icon-trans');
      // 保存html代码块到 localStorage
      var html = $origin.get(0).outerHTML;

      //富文本编辑class滤掉
      // html = html.replace(/<[a-zA-Z0-9]+ [^>]*\bclass=[\'\"][^\'\"]*\bmedium-editor-element\b[^\'\"]*[\'\"][^>]*>/ig, function(a, b) {//富文本编辑属性全部去掉
      //   var ret = a.replace(/ contenteditable=[\'\"][\w\W]*?[\'\"]/ig, '')
      //   .replace(/ spellcheck=[\'\"][\w\W]*?[\'\"]/ig, '')
      //   .replace(/ data-medium-editor-element=[\'\"][\w\W]*?[\'\"]/ig, '')
      //   .replace(/ role=[\'\"][\w\W]*?[\'\"]/ig, '')
      //   .replace(/ aria-multiline=[\'\"][\w\W]*?[\'\"]/ig, '')
      //   .replace(/ data-medium-editor-editor-index=[\'\"][\w\W]*?[\'\"]/ig, '')
      //   .replace(/ medium-editor-index=[\'\"][\w\W]*?[\'\"]/ig, '')
      //   .replace(/ data-placeholder=[\'\"][\w\W]*?[\'\"]/ig, '')
      //   .replace(/ data-medium-focused=[\'\"][\w\W]*?[\'\"]/ig, '')
      //   .replace(/medium-editor-placeholder/ig, '');

      //   return ret;
      // }).replace(/([^>]*\bclass=[\'\"][^\'\"]*)\bmedium-editor-element\b/ig,'$1')

      localStorage.setItem('cms-copy', html);
      // 清理掉之前保存的内容
      localStorage.setItem('cms-copy-style', '');
      localStorage.setItem('cms-copy-script', '');

      var classes = $origin.attr('class');
      if (classes.indexOf('cpmodule-') == -1) {
        alert('您复制的模块不是标准模块，请尽量在本页使用，拷贝到其它页面可能会出现样式丢失。');
      } else {
        var classarr = classes.split(' ');
        var cpmodule;
        for (var j = 0; j < classarr.length; j++) {
          if (classarr[j].indexOf('cpmodule-') > -1) {
            cpmodule = classarr[j];
            break;
          }
        }
        if (cpmodule) {
          // 保存模块对应的 style 到 localStorage
          var headhtml = $('head').html();
          if (headhtml) {
            var relatedModules = [cpmodule];
            var styles = '';
            var inscript = '';
            // 寻找子模块
            $origin.find('.cms-module').each(function(i, el) {
              var $el = $(el);
              var classes = $el.attr('class');
              if (classes.indexOf('cpmodule-') != -1) {
                var classarr = classes.split(' ');
                var cpmodule;
                for (var j = 0; j < classarr.length; j++) {
                  if (classarr[j].indexOf('cpmodule-') > -1) {
                    cpmodule = classarr[j];
                    break;
                  }
                }
                if (cpmodule && $.inArray(cpmodule, relatedModules) == -1) {
                  relatedModules.push(cpmodule);
                }
              }
            });

            for (var i = 0; i < relatedModules.length; i++) {
              var reg = new RegExp("\\." + relatedModules[i] + "\\b(\\.[a-zA-Z0-9_-]+)?( [^{ ]+)* *{[^}]*}", "ig");
              headhtml.replace(reg, function(a) {
                styles += a;
              });
            }

            // 保存module对应的 styles到 localStorage
            localStorage.setItem('cms-copy-style', styles);

            // 检查所有script标签，无用的jsmodule 删除
            $('script[id]').each(function(i, el) {
              var $el = $(el);
              var id = $el.attr('id');
              var modulename;
              id.replace(/^jsmodule-(.*)/ig, function(a, b) {
                modulename = b;
              });

              // 如果当前根模块是js模块
              if (modulename && $origin.attr(modulename) !== undefined || $origin.find('[' + modulename + ']').length) {
                // 寻找module 依赖的js  <script for="woo" src="..." >
                var $scfor = $("script[for=" + modulename + "]");
                for (var i = 0; i < $scfor.length; i++) {
                  inscript += $scfor.get(i).outerHTML;
                }
                inscript += el.outerHTML;
              }
            });

            $('script[id]').each(function(i, el) {
              var $t = $(el);
              var id = $t.attr('id');
              var modulename;
              id.replace(/^jsmodule-(.*)/ig, function(a, b) {
                modulename = b;
              });
            });
            // jsmodule 初始化，如果jsmodule 没有对应的html，则为其配备一个
            localStorage.setItem('cms-copy-script', inscript);
          } else {
            alert('没有找到<head>节点，请联系前端。');
          }
        }
      }

      window.clearTimeout($.data($t, 'timer'));
      $.data($t, 'timer', window.setTimeout(function() {
        $t.removeClass('cms-icon-trans');
      }, 2000));

    });
  } else {
    $D.on('click', '.cms-copy', function(e) {
      alert('您使用的浏览器不支持复制功能，请换成webkit内核比如chrome浏览器。');
    });
  }


  // 功能按钮事件绑定 删除当前节点
  $D.on('click', '.cms-delete', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $origin = $(this).closest('.cms-module');

    // 如果删除掉此 .cms-module 之后，页面上没有其它的 .cms-module
    // 则阻止此次删除
    $origin.addClass('cms-module-tobedelete');
    var $moduleremain = $('.cms-module').not('.cms-module-tobedelete,.cms-module-tobedelete .cms-module');
    if ($moduleremain.length === 0) {
      alert('最后一个模块不可删除！');
      $origin.removeClass('cms-module-tobedelete');
      return;
    }

    $origin.fadeOut(function() {
      $origin.remove();
      // embedJs.cmsSetSelfHeight();
      var _name = $origin.data('name');
      //是否是重复模块
      if ($D.find('[data-name="' + _name + '"]').length === 0) {
        $('[for-mod="' + _name + '"]').remove();
      }
    });

  });

  $D.on('click', '.cms-integral', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $integral = $(this);
    var $t = $(this).closest('.cms-module');
    //判断是数据类型
    var _isData = $t.attr('js-data');
    if (_isData) {
      var config = $t.data(_isData);
      if (typeof config == 'object') {
        var _cmsFocus = embedJs.cmsFocus;
        _cmsFocus.clear();
        _cmsFocus.set(_isData, config);
        _cmsFocus._root = $t;
        _cmsFocus._customtype = _isData;
        _cmsFocus._callback = function($el, type, val) {
          if (val && typeof val == 'object') {
            // 修改 data-[modulename] 值，然后重新加载子页面
            //保留之前的所有的config
            var _oldConfig = $el.data(_cmsFocus._customtype);
            for(var key in val){
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
        var _ele = $integral.closest('[data-cardtype]'),
          _typeId = _ele.data('cardtype');
        localStorage.setItem('data-cardtype', _typeId);
      }

      var cmsFocus = embedJs.cmsFocus;
      cmsFocus.clear();
      cmsFocus._root = $t;
      cmsFocus.set("word", []);
      var insert = $integral.data('insert');
      if (insert) {
        cmsFocus.set('insert', insert);
      }

      var toggles = $t.attr('cms-toggle');
      if (toggles) {
        cmsFocus.set("toggle", {
          "elem": $t,
          "class": toggles
        });
      }

      // 目前 integral 整体修改，只支持修改第一个链接
      var $link = $t.find('a').eq(0);
      if ($link.length) {
        cmsFocus.set("link", {
          "elem": $link,
          "href": $link.attr('href')
        });
      }

      // 目前 integral 整体修改，只支持修改第一个链接
      var $video = $t.find('video').eq(0);
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
        var $el = $(el);
        var styval = $el.attr('style');
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

  // 传入根节点，构建FOCUS，只负责构建图片和文字节点
  function buildFocusWithImageAndWords($t) {
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

  // function addNewNode($target, html, dir) {
  //   var $copy = $(html);
  //   var $copywrap = $('<div></div>');
  //   if (dir == 'down') {
  //     $target.after('\n');
  //     $target.after($copywrap);
  //   } else {
  //     $target.before($copywrap);
  //     $target.before('\n');
  //   }
  //   $copywrap.css({
  //     "overflow": "hidden",
  //     "height": 0
  //   });
  //   $copy.appendTo($copywrap);
  //   var opheight = $copy.height();
  //   $copywrap.addClass('cms-animating')
  //     .css({
  //       "opacity": 0
  //     })
  //     .animate({
  //       "opacity": 1,
  //       "height": opheight
  //     }, function() {
  //       $copy.removeClass('cms-animating').unwrap();
  //       // embedJs.cmsSetSelfHeight();
  //     });
  //   // 拖拽功能 module 注入可操作panel，此行代码要先于 jsmodule
  //   $('.cms-module').parent().sortable({ handle: ".cms-show-tool" });
  //   $('.cms-show-tool').disableSelection();
  //   if(editor.elements.length>0){
  //     editor.addElements('.cms-module');
  //   }else{
  //     editor = new MediumEditor('.cms-module',{
  //       toolbar: {
  //         buttons: ['colorPicker', 'fontsize', 'italic', 'underline', 'strikethrough', 'anchor', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'removeFormat']
  //       },
  //       extensions: {
  //         'colorPicker': new MediumEditor.ColorPickerExtension()
  //       }
  //     });
  //   }
  // }
  // window.addNewNode = addNewNode;

  // 文本节点，可编辑
  function popEditPanel() {
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

  //数据类型的弹窗
  function dataPopEditPanel(extendName) {
    var htmlstr = '',
      _cmsFocus = embedJs.cmsFocus;
    for (var name in _cmsFocus[extendName]) {
      var itemval = _cmsFocus[extendName][name];
      var showname = name;
      if(jQuery.isPlainObject(itemval)){
        var propertyStr = '';
        for (var name in itemval) {
          propertyStr += '" '+name+'="'+ itemval[name];
        }
        htmlstr += [
          '<li><u>', showname, '</u><input type="text" name="', showname, propertyStr, '"/></li>'
        ].join('');
      }else{
        htmlstr += [
          '<li><u>', showname, '</u><input type="text" name="', name, '" value="', itemval, '"/></li>'
        ].join('');
      }

    }

    var $lis = $(htmlstr);

    // 调用父亲窗口的 popout 弹框方法
    embedJs.cmsPopEditPanel($lis, extendName);
  }
  
  function optionCreate(value_, text_, selected_) {
    var selectAttr = selected_ == value_ ? ' selected' : '';
    var returnHtml = '<option value="' + value_ + '"' + selectAttr + '>' + text_ + '</option>';
    return returnHtml;
  }

});