/* cms embed.js
区分 cmsupload 和 cmsedit 之后，
可视化编辑功能只在 cmsedit 页面拥有
*/
(function($) {
  window.embedJs = (function() {
    return {
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
          for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
          }
          return head + '-' + new Date().getTime() + '-' + pwd;
        }
      },
      /**
       * [setSelfHeightAuto description]
       * @description  设置iframe的高度
       * @author  johnnyjiang
       * @email                                 johnnyjiang813@gmail.com
       * @createTime   2016-02-23T11:45:13+0800
       */
      setSelfHeightAuto: function() {
        embedJs.cmsSetSelfHeight();
        window.setTimeout(embedJs.setSelfHeightAuto, 2000);
      },
      cmsSetSelfHeight: function() {
        if (parent && parent.embedParent.setIframeHeight) {
          var _height = 50;
          for (var i = document.body.children.length; i > 0; i--) {
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
      /**
       * [addParam description]
       * @param       {[type]} url                      [url]
       * @param       {[type]} param                    [参数]
       * @param       {[type]} value                    [parm值]
       * @description 增加一个参数，如果已经存在，替换原参数值
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-02-23T11:12:38+0800
       */
      addParam: function(url, param, value) {
        var re = new RegExp('([&\\?])' + param + '=[^& ]*', 'g');
        url = url.replace(re, function(a, b) {
          return b == '?' ? '?' : '';
        });

        var idx = url.indexOf('?');
        url += (idx > -1 ? idx + 1 != url.length ? '&' : '' : '?') + param + '=' + value;
        return url;
      },
      /**
       * [removeParam description]
       * @param       {[type]} url                      [url]
       * @param       {[type]} pnm                      [参数名]
       * @description  search字符串，删除其中的某一个参数
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-02-23T11:13:33+0800
       */
      removeParam: function(url, pnm) {
        var reg1 = new RegExp('\\?' + pnm + '(=[^&]*)?'),
          reg2 = new RegExp('\\&' + pnm + '(=[^&]*)?');

        return url.replace(reg1, '?').replace(reg2, '').replace(/\?&/, '?').replace(/\?$/, '');
      },
      /**
       * [cmsProperateImage description]
       * @param       {[type]} url                      [待处理的url地址]
       * @param       {[type]} t                        [转换类型  默认0-返回原图  1-返回缩略图]
       * @param       {[type]} w                        [返回缩略图的宽]
       * @param       {[type]} h                        [返回缩略图的高]
       * @param       {[type]} c                        [是否截取正方形 a-左边截图  b-右边截图 c-中间截图]
       * @description
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-02-23T10:25:13+0800
       */
      cmsProperateImage: function(url, t, w, h, c) {
        var pathn = $.trim(url).replace(/^http(s)?:\/\//ig, ''),
          pathn = pathn.split('/'),
          domain = pathn[0],
          pathn = pathn[1];

        // 只有堆糖域名下 uploads misc 目录下的图片可以缩略
        if (domain.indexOf('duitang.com') == -1 || !pathn || pathn != 'uploads' && pathn != 'misc') {
          return url;
        }
        if (t) {
          w = w || 0;
          h = h || 0;
          c = c ? '_' + c : '';
          return this.cmsProperateImage(url).replace(/(\.[a-z_]+)$/ig, '.thumb.' + w + '_' + h + c + '$1');
        } else {
          return url.replace(/(?:\.thumb\.\w+|\.[a-z]+!\w+)(\.[a-z_]+)$/ig, '$1');
        }
      },
      /**
       * [cmsProperateImageWidth description]
       * @param       {[type]} oldwidth                 [description]
       * @return      {[type]}                          [description]
       * @description   图片宽度转换
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-02-23T11:14:15+0800
       */
      cmsProperateImageWidth: function(oldwidth) {
        var width = 900;
        for (var i = 1; i < 10; i++) {
          if (oldwidth < i * 100) {
            width = i * 100;
            break;
          }
        }
        return width + 100;
      },
      /**
       * [cmsBuildPanel description]
       * @param       {[type]} $module                  [选择模块]
       * @param       {[type]} opt                      [支持的选项]
       * @description 创建模板
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-02-23T10:27:20+0800
       */
      cmsBuildPanel: function($module, opt) {
        if ($module.find('.cms-module-div').length === 0) {
          $('<div class="cms-embed cms-module-div" contenteditable="false"><i class="cms-icon cms-show-tool">T</i><div class="cms-tools l">' + (opt.add ? '<i class="cms-icon cms-add">+</i>' : '') + (opt.copy ? '<i class="cms-icon cms-copy">c</i>' : '') + (opt.integral ? '<i class="cms-icon cms-integral">i</i>' : '') + '<i class="cms-icon cms-delete">x</i>' + '</div></div>').prependTo($module);
        }
      },
      /**
       * [appendAfter description]
       * @param       {[type]} node                     [模块节点]
       * @description 指定位置添加
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-02-23T11:11:20+0800
       */
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
      /**
       * [cmsReturnBack description]
       * @param       {[type]} arr                      [description]
       * @param       {[type]} opt                      [description]
       * @return      {[type]}                          [description]
       * @description  添加模块后回调
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-02-23T11:16:28+0800
       */
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
                  imgsrc = embedJs.cmsProperateImage(imgsrc);
                } else {
                  var crop = obj.crop;
                  var imgw = parseInt(obj.width);
                  var imgh = parseInt(obj.height);
                  var pimgw = 0;
                  if (imgw && !crop) {
                    pimgw = embedJs.cmsProperateImageWidth(imgw);
                    imgsrc = embedJs.cmsProperateImage(imgsrc, true, pimgw);
                  } else if (imgw && imgh && crop) {
                    pimgw = embedJs.cmsProperateImageWidth(imgw);
                    imgsrc = embedJs.cmsProperateImage(imgsrc, true, pimgw, pimgw, "c");
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
                  nhref = embedJs.addParam(nhref, paramname, pageweb);
                } else {
                  nhref = embedJs.removeParam(nhref, paramname);
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
            }

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
      /**
       * [cmsPopAddPanel description]
       * @return      {[type]} [description]
       * @description 弹出添加框
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-02-23T11:20:46+0800
       */
      cmsPopAddPanel: function() {
        var $pop = $('<div class="cms-prompt"><div id="cms-addmodule-quickly" style="padding: 10px"><a id="cms-addmodule-new" direction="up" href="javascript:;">在当前模块前添加新模块</a><a id="cms-addmodule-new" direction="down" href="javascript:;">在当前模块后添加新模块</a><br><a id="cms-addmodule-current" href="javascript:;">复制添加当前模块</a>' + (localStorage && localStorage["cms-copy"] ? '<br><a class="cms-addmodule-storage" direction="up" href="javascript:;">添加拷贝模块↑ </a><a class="cms-addmodule-storage" direction="down" href="javascript:;">添加拷贝模块↓ </a>' : '') + '<br><a class="cms-addmodule-space" href="javascript:;" ht="24">添加空行(小)</a><a class="cms-addmodule-space" href="javascript:;" ht="40">添加空行(中)</a><a class="cms-addmodule-space" href="javascript:;" ht="60">添加空行(大)</a></div></div>');

        // 调用父亲窗口的 popout 弹框方法
        parent && parent.embedParent.popOut && parent.embedParent.popOut(['添加', $pop]);
      },
      /**
       * [cmsPopEditPanel description]
       * @param       {[type]} $cont                    [description]
       * @param       {[type]} extendName               [description]
       * @return      {[type]}                          [description]
       * @description 弹出编辑框 调用父窗口
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-02-23T11:22:07+0800
       */
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
      /**
       * [cmsHtmlRepairBeforeGenerate description]
       * @return      {[type]} [description]
       * @description 生成页面之前处理
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-02-23T11:30:07+0800
       */
      cmsHtmlRepairBeforeGenerate: function() {
        // 隐藏区块设置 cms-attribute-style
        $('.cms-attribute-hidden').attr('cms-attribute-style', 'display:none;');
      },
      /**
       * [cmsCreatePage]
       * @return      {[type]} [description]
       * @param       {[object]} _root                    [根节点]
       * @description  创建页面
       * @author  johnnyjiang
       * @email                                         johnnyjiang813@gmail.com
       * @createTime           2016-03-17T01:36:53+0800
       */
      cmsCreatePage: function(_root) {
        var cmsFocus = embedJs.cmsFocus;
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
                embedJs.cmsBuildPanel($jsm, {
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
  })();


  $(function() {
    var $D = $(document);
    // 拖拽功能 module 注入可操作panel，此行代码要先于 jsmodule
    $('.cms-module').parent().sortable({ handle: ".cms-show-tool" });
    $('.cms-show-tool').disableSelection();
    // 富文本编辑
    var editor = new MediumEditor('.cms-module',{
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


    //页面加载自动高度
    window.onload = function() {
      embedJs.setSelfHeightAuto();
    };

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
        html = html.replace(/<[a-zA-Z0-9]+ [^>]*\bclass=[\'\"][^\'\"]*\bmedium-editor-element\b[^\'\"]*[\'\"][^>]*>/ig, function(a, b) {//富文本编辑属性全部去掉
          var ret = a.replace(/ contenteditable=[\'\"][\w\W]*?[\'\"]/ig, '')
          .replace(/ spellcheck=[\'\"][\w\W]*?[\'\"]/ig, '')
          .replace(/ data-medium-editor-element=[\'\"][\w\W]*?[\'\"]/ig, '')
          .replace(/ role=[\'\"][\w\W]*?[\'\"]/ig, '')
          .replace(/ aria-multiline=[\'\"][\w\W]*?[\'\"]/ig, '')
          .replace(/ data-medium-editor-editor-index=[\'\"][\w\W]*?[\'\"]/ig, '')
          .replace(/ medium-editor-index=[\'\"][\w\W]*?[\'\"]/ig, '')
          .replace(/ data-placeholder=[\'\"][\w\W]*?[\'\"]/ig, '')
          .replace(/ data-medium-focused=[\'\"][\w\W]*?[\'\"]/ig, '')
          .replace(/medium-editor-placeholder/ig, '');

          return ret;
        }).replace(/([^>]*\bclass=[\'\"][^\'\"]*)\bmedium-editor-element\b/ig,'$1')//富文本编辑class滤掉
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
        embedJs.cmsSetSelfHeight();
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

    /**
     * [addNewNode description]
     * @param       {[type]} $target                  [位置]
     * @param       {[type]} html                     [添加的内容]
     * @param       {[type]} dir                      [添加的方向]
     * @description  添加节点
     * @author  johnnyjiang
     * @email                                         johnnyjiang813@gmail.com
     * @createTime           2016-02-23T11:50:23+0800
     */
    function addNewNode($target, html, dir) {
      var $copy = $(html);
      var $copywrap = $('<div></div>');

      if (dir == 'down') {
        $target.after('\n');
        $target.after($copywrap);
      } else {
        $target.before($copywrap);
        $target.before('\n');
      }
      $copywrap.css({
        "overflow": "hidden",
        "height": 0
      });
      $copy.appendTo($copywrap);
      var opheight = $copy.height();
      $copywrap.addClass('cms-animating')
        .css({
          "opacity": 0
        })
        .animate({
          "opacity": 1,
          "height": opheight
        }, function() {
          $copy.removeClass('cms-animating').unwrap();
          embedJs.cmsSetSelfHeight();
        });
      // 拖拽功能 module 注入可操作panel，此行代码要先于 jsmodule
      $('.cms-module').parent().sortable({ handle: ".cms-show-tool" });
      $('.cms-show-tool').disableSelection();
      if(editor.elements.length>0){
        editor.addElements('.cms-module');
      }else{
        editor = new MediumEditor('.cms-module',{
          toolbar: {
            buttons: ['colorPicker', 'fontsize', 'italic', 'underline', 'strikethrough', 'anchor', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'removeFormat']
          },
          extensions: {
            'colorPicker': new MediumEditor.ColorPickerExtension()
          }
        });
      }

    }
    window.addNewNode = addNewNode;

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
  });

  function optionCreate(value_, text_, selected_) {
    var selectAttr = selected_ == value_ ? ' selected' : '';
    var returnHtml = '<option value="' + value_ + '"' + selectAttr + '>' + text_ + '</option>';
    return returnHtml;
  }

})(jQuery);



/**
 * [description]
 * @param       {[type]} $                        [description]
 * @return      {[type]}                          [description]
 * @description   时间倒计时扩展
 * @author  johnnyjiang
 * @email                                         johnnyjiang813@gmail.com
 * @createTime           2016-03-16T15:24:43+0800
 */
(function($) {
  // extands  expiretime
  $(function() {
    var extendName = "expiretime",
      $D = $(document);
    var cmsFocus = embedJs.cmsFocus;
    $D.on('click', '[' + extendName + ']', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var $t = $(this);
      var _time = $t.attr(extendName);
      cmsFocus.clear();
      cmsFocus._root = $t;
      cmsFocus.set(extendName, {
        "elem": $t,
        "val": _time
      });

      popEditPanel();
    });
    $D.on('mouseenter', '[' + extendName + ']', function(e) {
      $(this).addClass('cms-editable-hover');
    })
    $D.on('mouseleave', '[' + extendName + ']', function(e) {
      $(this).removeClass('cms-editable-hover');
    });


    function popEditPanel() {
      var $lis = $(null);
      var $li;

      var focusExtend = cmsFocus[extendName];
      var keyExtend = embedJs.cmsDomCache.randomString(extendName);
      embedJs.cmsDomCache[keyExtend] = focusExtend.elem;

      $li = $('<li><u>截团时间</u><input type="text" value="' + focusExtend.val + '"/></li>');
      $li.find('input').attr("dtcustom", keyExtend)
        .attr("dtcustomtype", extendName);
      $lis = $lis.add($li);

      cmsFocus._customtype = extendName;
      cmsFocus._callback = function($el, type, val) {
        $el.attr(type, val);
        // 倒计时初始化
      };
      // 调用父亲窗口的 popout 弹框方法
      embedJs.cmsPopEditPanel($lis);
    }
  });

  function optionCreate(value_, text_, selected_) {
    var selectAttr = selected_ == value_ ? ' selected' : '';
    var returnHtml = '<option value="' + value_ + '"' + selectAttr + '>' + text_ + '</option>';
    return returnHtml;
  }
})(jQuery);

/**
 * [description]
 * @param       {[type]} $                        [description]
 * @return      {[type]}                          [description]
 * @description  页面分享组件
 * @author  johnnyjiang
 * @email                                         johnnyjiang813@gmail.com
 * @createTime           2016-03-16T16:12:56+0800
 */
;
(function($) {
  var extendName = "share";
  var cmsFocus = embedJs.cmsFocus;
  // extands  share
  $(function() {
    $(document).on('click', '[' + extendName + '] a', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $t = $(this);

      var shareIconStyle = $t.find('.icon').attr('class');
      var sharePanelName = $t.find('.text').text();
      var shareUrl = $t.attr('href');
      var params = getParams(shareUrl);


      cmsFocus.clear();
      cmsFocus.set(extendName, {
        "shareIconStyle": shareIconStyle || '',
        "sharePanelName": sharePanelName,
        "shareSite": params.site || '',
        "shareTitle": params.title || '',
        "shareContentType": params.contenttype || '',
        "shareScene": params.scene || '',
        "shareDesc": params.desc || '',
        "shareImgUrl": params.imgurl || '',
        "shareUrl": params.url || ''
      });
      cmsFocus._root = $t;
      cmsFocus._customtype = extendName;
      cmsFocus._callback = function($el, type, val) {
        if (val && typeof val == 'object') {
          $el.find('.icon').attr('class', val.iconstyle);
          $el.find('.text').text(val.panelname);

          var shareLink = 'duitang://www.duitang.com/share/?site=' + val.site + '&title=' + encodeURIComponent(val.title) + '&desc=' + encodeURIComponent(val.desc) + '&scene=' + val.scene + '&contenttype=' + val.contenttype + '&imgurl=' + encodeURIComponent(val.imgurl) + '&url=' + encodeURIComponent(val.url);
          $el.get(0).href = shareLink;
        }
        // share 初始化
        // TODO
      }
      popEditPanel();
    })
  })


  function popEditPanel() {
    var $lis = $('<li><u>图标样式</u>\
          <select name="iconstyle">\
            ' + optionCreate('icon icon-wechat', 'icon icon-wechat 微信分享给好友', cmsFocus[extendName].shareIconStyle) + '\
            ' + optionCreate('icon icon-wechat-link', 'icon icon-wechat-link 微信分享朋友圈', cmsFocus[extendName].shareIconStyle) + '\
          </select>\
        </li>\
        <li><u>文本</u><input type="text" name="panelname" value="' + cmsFocus[extendName].sharePanelName + '"/></li>\
        <li><u>分享客户端</u>\
          <select name="site">\
            ' + optionCreate('weixin', 'weixin 微信', cmsFocus[extendName].shareSite) + '\
            ' + optionCreate('weibo', 'weibo 微博', cmsFocus[extendName].shareSite) + '\
          </select>\
        </li>\
        <li><u>分享标题</u><input type="text" name="title" value="' + cmsFocus[extendName].shareTitle + '"/></li>\
        <li><u>分享内容类型</u>\
          <select name="contenttype">\
            ' + optionCreate('link', 'link 分享链接', cmsFocus[extendName].shareContentType) + '\
            ' + optionCreate('app', 'app 分享app', cmsFocus[extendName].shareContentType) + '\
          </select>\
        </li>\
        <li><u>微信分享类型</u>\
          <select name="scene">\
            ' + optionCreate('session', 'session 微信分享给好友', cmsFocus[extendName].shareScene) + '\
            ' + optionCreate('timeline', 'timeline 微信分享朋友圈', cmsFocus[extendName].shareScene) + '\
          </select>\
        </li>\
        <li><u>分享描述</u><input type="text" name="desc" value="' + cmsFocus[extendName].shareDesc + '"/></li>\
        <li><u>分享图片url</u><input type="text" name="imgurl" value="' + cmsFocus[extendName].shareImgUrl + '"/></li>\
        <li><u>分享url</u><input type="text" name="url" value="' + cmsFocus[extendName].shareUrl + '"/></li>');

    // 调用父亲窗口的 popout 弹框方法
    CMS_POP_EDIT_PANEL($lis, extendName);
  }


  function getParams(url) {
    var opts = {},
      name, value, i,
      url = url.split('#')[0],
      idx = url.indexOf('?'),
      search = idx > -1 ? url.substr(idx + 1) : '',
      arrtmp = search.split('&');
    for (i = 0, len = arrtmp.length; i < len; i++) {
      var paramCount = arrtmp[i].indexOf('=');
      if (paramCount > 0) {
        name = arrtmp[i].substring(0, paramCount);
        value = arrtmp[i].substr(paramCount + 1);
        try {
          if (value.indexOf('+') > -1) {
            value = value.replace(/\+/g, ' ')
          }
          opts[name] = decodeURIComponent(value);
        } catch (exp) {}
      }
    }
    return opts;
  }

  function optionCreate(value_, text_, selected_) {
    var selectAttr = selected_ == value_ ? ' selected' : '';
    var returnHtml = '<option value="' + value_ + '"' + selectAttr + '>' + text_ + '</option>';
    return returnHtml;
  }
})(jQuery)

/**
 * [initModule description]
 * @param       {[type]} extendName               [description]
 * @return      {[type]}                          [description]
 * @description 商品数据处理
 * @author  johnnyjiang
 * @email                                         johnnyjiang813@gmail.com
 * @createTime           2016-03-16T17:11:32+0800
 */
function initModule(extendName) {
  var extendNameWithData = "data-" + extendName;
  var $module = $('[' + extendNameWithData + ']');
  var _cmsFocus = embedJs.cmsFocus;
  $module.find('.cms-module-div .cms-integral').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $t = $(this).closest('.cms-module');
    var config = $t.data(extendName);
    if (typeof config == 'object') {
      _cmsFocus.clear();
      _cmsFocus.set(extendName, config);
      _cmsFocus._root = $t;
      _cmsFocus._customtype = extendName;
      _cmsFocus._callback = function($el, type, val) {
        if (val && typeof val == 'object') {
          // 修改 data-[modulename] 值，然后重新加载子页面
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
      }
      popEditPanel(extendName);
    }
  });

  function popEditPanel(extendName) {
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
}

/**
 * [description]
 * @param       {String}                          [description]
 * @return      {[type]}                          [description]
 * @description  获取数据内容
 * @author  johnnyjiang
 * @email                                         johnnyjiang813@gmail.com
 * @createTime           2016-03-16T16:49:09+0800
 */
;
parent && (function($) {

  // extands  woo-single
  $(function() {
    var EXTEND_NAME = "inventory";
    var EXTEND_NAME_WITH_DATA = "data-" + EXTEND_NAME;
    var $module = $('[' + EXTEND_NAME_WITH_DATA + ']');

    window[EXTEND_NAME] = {
      "request": function(id, callback) {
        if (parent) {
          $.ajax({
              type: "GET",
              url: "https://buy.duitang.com/napi/inventory/detail/?id=" + id,
              success: function(jsn, h) {
                if (jsn.status == 1 || jsn.success) {
                  var dat = jsn.data;
                  parent.$('#poped-src').val(dat.pictures[0]);
                  parent.$('#poped-link').val("http://buy.duitang.com/buy/item/detail/?id=" + dat.id + "&__urlopentype=pageweb");
                  //服务于youliao的两套模板 标题问题
                  // var _hash=['#/cmsedit/?cate=cms_examples&urid=youliao_list1','#/cmsedit/?cate=cms_examples&urid=youliao'];
                  var _type = localStorage.getItem('data-cardtype');
                  if (_type === "0") {
                    //youliaolist
                    parent.$('#poped-word-1').val(dat.inventory_name);
                    parent.$('#poped-word-2').val('¥' + dat.origin_price);
                    parent.$('#poped-word-3').val('¥' + dat.market_price);
                    parent.$('#poped-word-4').val(Math.round(10 * dat.origin_price / dat.market_price) + '折');
                  } else if (_type === "1") {
                    //youliaoList1
                    parent.$('#poped-word-1').val(dat.inventory_caption);
                    parent.$('#poped-word-2').val(dat.inventory_name);
                    parent.$('#poped-word-3').val('¥' + dat.origin_price);
                    parent.$('#poped-word-4').val('¥' + dat.market_price);
                    parent.$('#poped-word-5').val(Math.round(10 * dat.origin_price / dat.market_price) + '折');
                  } else if (_type === "2") {
                    //youliao
                    parent.$('#poped-word-2').val(dat.inventory_name);
                    parent.$('#poped-word-3').val(dat.inventory_caption);
                    parent.$('#poped-word-4').val('¥' + dat.origin_price);
                    parent.$('#poped-word-5').val('¥' + dat.market_price);
                  } else if (_type === "3") {
                    parent.$('#poped-word-2').val(dat.inventory_name);
                    parent.$('#poped-word-5').val('¥' + dat.origin_price);
                    parent.$('#poped-word-4').val('¥' + dat.market_price);
                  }
                }
              }
            })
            .always(function() {
              callback();
            });
        }
      }
    };

    $(document).on('mouseover', '[' + EXTEND_NAME_WITH_DATA + '] .cms-integral', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $t = $(this);
      var insert = $t.data('insert');
      var $md = $(this).closest('.cms-module')
      var id = $md.data(EXTEND_NAME)["id"] || '';
      $t.data('insert', {
        "name": "获取详情",
        "text": "" + id,
        "button": "请求",
        "method_name": EXTEND_NAME + ".request"
      })
    })

    //小工具显隐
    $(document).on('mouseenter', '.cms-module-div', function(e) {
      $(this).find('.cms-tools').show();
    })
    $(document).on('mouseleave', '.cms-module-div', function(e) {
      $(this).find('.cms-tools').hide();
    })

  });

  function optionCreate(value_, text_, selected_) {
    var selectAttr = selected_ == value_ ? ' selected' : '';
    var returnHtml = '<option value="' + value_ + '"' + selectAttr + '>' + text_ + '</option>';
    return returnHtml;
  }

})(jQuery)