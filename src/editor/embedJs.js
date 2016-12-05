import cmsTools from '../utils/cmsTools';
import addNewNode from './addNewNode';
import initModule from './initModule';

let embedJs = {
  /**
   * [cmsFocus 记录focus位置]
   * @type {Object}
   */
  cmsFocus: {
    clear: function() {
      for (var item in this) {
        if (item != 'set' && item != 'clear') {
          this[item] = null;
        }
      }
    },
    set: function(name, value) {
      this[name] = value;
    }
  },
  /**
   * [cmsDomCache 缓存节点]
   * @type {Object}
   */
  cmsDomCache: {
    clear: function() {
      for (var item in this) {
        if (item != 'randomString' && item != 'clear') {
          this[item] = null;
        }
      }
    },
    randomString: function(head) {
      var len = 10;
      var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      var maxPos = $chars.length;
      var pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return head + '-' + new Date().getTime() + '-' + pwd;
    }
  },
  setSelfHeightAuto: function() {
    embedJs.cmsSetSelfHeight();
    window.setTimeout(embedJs.setSelfHeightAuto, 2000);
  },
  cmsSetSelfHeight: function() {
    if (parent && parent.embedParent.setIframeHeight) {
      let _height = 10;
      for (let i = document.body.children.length; i > 0; i--) {
        _height += document.body.children[i - 1].offsetHeight;
      }
      parent.embedParent.setIframeHeight(_height);
    }
  },
  cmsReloadModifiedPage: function() {
    if (parent && parent.embedParent.reloadModifiedPage) {
      parent.embedParent.reloadModifiedPage();
    }
  },
  cmsProperateImageWidth: function(oldwidth) {
    let width = 900;
    for (let i = 1; i < 10; i++) {
      if (oldwidth < i * 100) {
        width = i * 100;
        break;
      }
    }
    return width + 100;
  },
  // 添加模版
  cmsBuildPanel: function($module, opt) {
    if ($module.find('.cms-module-div').length === 0) {
      $('<div class="cms-embed cms-module-div" contenteditable="false"><i class="cms-icon cms-show-tool">T</i><div class="cms-tools l">' + (opt.add ? '<i class="cms-icon cms-add">+</i>' : '') + (opt.copy ? '<i class="cms-icon cms-copy">c</i>' : '') + (opt.integral ? '<i class="cms-icon cms-integral">i</i>' : '') + '<i class="cms-icon cms-delete">x</i>' + '</div></div>').prependTo($module);
    }
  },
  appendAfter: function(node) {
    var $newhtml = $(node);
    this.cmsBuildPanel($newhtml, {
      "add": true,
      "copy": true,
      "integral": true
    });
    $newhtml && $.isFunction(this.cmsFocus._callback) && this.cmsFocus._callback($newhtml, '', '', 'down');
    this.cmsDomCache.clear();
  },
  cmsReturnBack: function(arr, opt) {
    $(arr).each(function(i, obj) {
      var elem = embedJs.cmsDomCache[obj.el];
      if (elem) {
        switch (obj.type) {
          case "toggle":
            var toggleclass = obj.val;
            var backclass = elem.attr('cms-toggle').split(',');
            for (var j = 0; j < backclass.length; j++) {
              elem.removeClass(backclass[j]);
            }
            elem.addClass(toggleclass);
            break;
          case "src":
            var imgsrc = obj.val;
            var useorigin = obj.useorigin;
            if (useorigin) {
              imgsrc = cmsTools.dtImageTrans(imgsrc);
            } else {
              var crop = obj.crop;
              var imgw = parseInt(obj.width);
              var imgh = parseInt(obj.height);
              var pimgw = 0;
              if (imgw && !crop) {
                pimgw = embedJs.cmsProperateImageWidth(imgw);
                imgsrc = cmsTools.dtImageTrans(imgsrc, true, pimgw);
              } else if (imgw && imgh && crop) {
                pimgw = embedJs.cmsProperateImageWidth(imgw);
                imgsrc = cmsTools.dtImageTrans(imgsrc, true, pimgw, pimgw, "c");
              }
            }

            if (obj.isbackground) { // 如果是设置图片背景
              elem.css({
                "background-image": "url(" + imgsrc + ")"
              });
            } else { // 如果是普通图片
              elem.attr('src', imgsrc);
              // 如果使用图片延迟加载组件，则修改 data-src
              if (elem.attr('data-src')) {
                elem.attr('data-src', imgsrc);
              }
              if (elem.attr('data-img')) {
                elem.attr('data-img', imgsrc);
              }
            }

            break;
          case "alt":
            elem.attr('alt', obj.val);
            break;
          case "href":
            var nhref = $.trim(obj.val) || 'javascript:;';
            var pageweb = obj.pageweb;
            // 链接在应用内的打开方式，通过参数  __urlopentype=outweb|inweb|webpage 设置
            // 默认情况下 pageweb 为空，不设置此参数
            var paramname = '__urlopentype';
            if (pageweb) {
              nhref = cmsTools.addParam(nhref, paramname, pageweb);
            } else {
              nhref = cmsTools.removeParam(nhref, paramname);
            }
            elem.attr('href', nhref);
            break;
          case "text":
            var tx = $.trim(obj.val);
            elem.html(obj.val || '　');
            break;
          case "video":
            var videoSrc = obj.videoSrc;
            var posterImg = obj.poster;
            elem.attr('src', videoSrc);
            elem.attr('poster', posterImg);
            break;
        };

        if (embedJs.cmsFocus._customtype && obj.type == embedJs.cmsFocus._customtype) {
          $.isFunction(embedJs.cmsFocus._callback) && embedJs.cmsFocus._callback(elem, embedJs.cmsFocus._customtype, obj.val);
        }
      }
    });
    // 此次编辑的root 节点
    if (this.cmsFocus._root) {
      var _cmsFocusRoot = this.cmsFocus._root;
      if (opt && opt.dtrace) {
        _cmsFocusRoot.attr('onmousedown', "DtTools.trace('" + opt.dtrace + "')");
      } else {
        var msdown = _cmsFocusRoot.attr('onmousedown');
        if (msdown) {
          msdown = msdown.replace(/\$\.G\.trace\([^\)]*\);?/ig, '');
          _cmsFocusRoot.attr('onmousedown', msdown);
        }
      }
      if (opt && opt.hideroot !== undefined) {
        if (opt.hideroot) {
          _cmsFocusRoot.addClass('cms-attribute-hidden')
            .attr('cms-attribute-style', 'display:none;');
        } else {
          _cmsFocusRoot.removeClass('cms-attribute-hidden')
            .removeAttr('cms-attribute-style');
        }
      }

      // 添加module 回调
      if (opt && opt.addquickly !== undefined) {
        var $newhtml;
        var newstyle;
        var newscript;

        var dir = opt.addquicklydir;
        if (opt.addquickly == 'storage' && localStorage && localStorage["cms-copy"]) {
          $newhtml = $(localStorage["cms-copy"]);
          newstyle = localStorage["cms-copy-style"] || '';
          newscript = localStorage["cms-copy-script"] || '';
        } else if (opt.addquickly == 'current') {
          $newhtml = $(_cmsFocusRoot.get(0).outerHTML);
        } else if ($.isNumeric(opt.addquickly)) {
          $newhtml = $('<div class="cms-module cpmodule-space"><div style="height:' + opt.addquickly + 'px"></div></div>');
          embedJs.cmsBuildPanel($newhtml, {
            "add": true,
            "copy": true
          });
        }

        // 新增加的html 传入 _callback
        $newhtml && $.isFunction(embedJs.cmsFocus._callback) && embedJs.cmsFocus._callback($newhtml, newstyle, newscript, dir);
      }
    }
    this.cmsDomCache.clear();
  },
  cmsPopAddPanel: function() {
    var $pop = $('<div class="cms-prompt"><div id="cms-addmodule-quickly" style="padding: 10px"><a class="cms-addmodule-new" direction="up" href="javascript:;">在当前模块前添加新模块</a><a class="cms-addmodule-new" direction="down" href="javascript:;">在当前模块后添加新模块</a><br><a id="cms-addmodule-current" href="javascript:;">复制添加当前模块</a>' + (localStorage && localStorage["cms-copy"] ? '<br><a class="cms-addmodule-storage" direction="up" href="javascript:;">添加拷贝模块↑ </a><a class="cms-addmodule-storage" direction="down" href="javascript:;">添加拷贝模块↓ </a>' : '') + '<br><a class="cms-addmodule-space" href="javascript:;" ht="24">添加空行(小)</a><a class="cms-addmodule-space" href="javascript:;" ht="40">添加空行(中)</a><a class="cms-addmodule-space" href="javascript:;" ht="60">添加空行(大)</a></div></div>');
    // 调用父亲窗口的 popout 弹框方法
    parent && parent.embedParent.popOut && parent.embedParent.popOut(['添加', $pop]);
  },
  cmsPopEditPanel: function($cont, extendName) {
    // 如果 _root 是隐藏状态，则显示 checkbox 不勾选
    var hideroot = 'checked';
    if (this.cmsFocus._root && this.cmsFocus._root.hasClass('cms-attribute-hidden')) {
      hideroot = '';
    }
    var $pop = $('<div class="cms-prompt"><div id="cms-unitedit" class="cms-unitedit"></div><div class="cms-uniteditbot cms-clr"><button id="cms-uniteditsub" class="btn">修改</button><div id="cms-editvisible-wrap"><input id="cms-editvisible" type="checkbox" ' + hideroot + '/><label for="cms-editvisible">显示</label></div><div id="cms-gaq-wrap"><span>/_trc/../../</span><input type="text" /></div></div></div>');
    if (this.cmsFocus._root && this.cmsFocus._root.attr('onmousedown')) {
      var moused = this.cmsFocus._root.attr('onmousedown');
      var splitarr = moused.split("'");
      var action = '';
      if (splitarr.length > 2) {
        action = splitarr[1];
      }

      var $gaq = $pop.find('#cms-gaq-wrap');
      $gaq.find('input').val(action);
    }


    var $out = $pop.find('#cms-unitedit');
    if (extendName) {
      var focusExtend = this.cmsFocus[extendName];
      var keyExtend = embedJs.cmsDomCache.randomString(extendName);
      var $form = $('<form></from>');
      $form.attr('dtform', keyExtend).attr('dtformtype', extendName);
      this.cmsDomCache[keyExtend] = this.cmsFocus._root;
      $out.append($form);
      $out = $form;
    }
    $out.append($('<ul></ul>').append($cont));

    // 调用父亲窗口的 popout 弹框方法
    parent && parent.embedParent.popOut && parent.embedParent.popOut(['编辑', $pop]);
  },
  cmsHtmlRepairBeforeGenerate: function() {
    // 隐藏区块设置 cms-attribute-style
    $('.cms-attribute-hidden').attr('cms-attribute-style', 'display:none;');
  },
  cmsCreatePage: function(_root) {
    var cmsFocus = this.cmsFocus;
    cmsFocus.clear();
    cmsFocus._root = _root;
    cmsFocus._callback = function($newhtml, newstyle, newscript, dir) {
      if ($newhtml.attr('id') && $('#' + $newhtml.attr('id')).length) {
        alert('要添加的模块为唯一模块，该唯一模块已经存在，不能再添加了.');
        return;
      }

      addNewNode(cmsFocus._root, $newhtml, dir);

      if (newstyle) {
        var $head = $('head');
        var headhtml = $head.html();
        var _reg = new RegExp(newstyle, 'ig');
        // 如果当前页面没有找到匹配的模块style，则将newstyle 添加到头部
        if (!_reg.test(headhtml)) {
          $(newstyle).appendTo($head);
        }
      }
      if (newscript) {
        var _bodyHtml = $('body').html();
        var _jsArr = newscript.split(',');
        _jsArr.forEach(function(_v) {
          var _reg = new RegExp(_v, 'ig');
          if (!_reg.test(_bodyHtml)) {
            $('body').append(_v);
          }
          //js 数据模块
          var _mod = $(_v).attr('for-mod');
          var $jspgmd = $('[data-name="' + _mod + '"]');
          if ($jspgmd.length === 0) {
            // 同时生成临时html模块
            var $jsm = $('<section class="cms-embed cpmodule-jsmodule-occupy"><p class="cms-jsmodule-occupy">JS Module: ' + _mod + '</p></section>');
            this.cmsBuildPanel($jsm, {
              "copy": true,
            });
            $jsm.prependTo('body');
          } else {
            var _ispartJs = $jspgmd.attr('js-require');
            var node = $jspgmd.find('.cms-embed').eq(0);
            if (_ispartJs) {
              node.siblings('.cms-embed').remove();
              $('<section class="cms-embed cpmodule-jsmodule-occupy"><p class="cms-jsmodule-occupy">JS Module: ' + _mod + '</p></section>').insertBefore(node);
            }
          }
          //js 数据模块
          var _isData = $jspgmd.attr('js-data');
          if (_isData) {
            initModule(_isData);
          }
        });
      }
      if (_root.data('first') === 'init') {
        _root.remove();
      }
    };
  }
};

export default embedJs;