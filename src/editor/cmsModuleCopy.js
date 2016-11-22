import embedJs from './embedJs';
import $ from 'jquery';


function getClassName(nodeClassName,targetClassName='cpmodule-') {
  var classarr = nodeClassName.split(' ') || [];
  var targetModuleName;
  for (var j = 0; j < classarr.length; j++) {
    if (classarr[j].indexOf(targetClassName) > -1) {
      targetModuleName = classarr[j];
      break;
    }
  };
  return targetModuleName;
}

let cmsModuleCopy = function() {
  let $D = $(document);
  if (localStorage) {
    $D.on('click', '.cms-copy', function(e) {
      let $t = $(this);
      let $origin = $t.closest('.cms-module');
      $t.addClass('cms-icon-trans');
      // 保存html代码块到 localStorage
      let html = $origin.get(0).outerHTML;
      localStorage.setItem('cms-copy', html);
      // 清理掉之前保存的内容
      localStorage.setItem('cms-copy-style', '');
      localStorage.setItem('cms-copy-script', '');
      let classes = $origin.attr('class');

      if (classes.indexOf('cpmodule-') == -1) {
        // 以前错误的问题
        alert('您复制的模块不是标准模块，请尽量在本页使用，拷贝到其它页面可能会出现样式丢失。');
      } else {

        let cpmodule = getClassName(classes) || '';

        // 子模块处理逻辑，此处可删除
        if (cpmodule) {
          // 保存模块对应的 style 到 localStorage
          let headhtml = $('head').html();
          if (headhtml) {
            let relatedModules = [cpmodule];
            let styles = '';
            let inscript = '';
            // 寻找子模块
            $origin.find('.cms-module').each(function(i, el) {
              let $el = $(el);
              let classes = $el.attr('class');
              if (classes.indexOf('cpmodule-') != -1) {
                let cpChildenModule = getClassName(classes);
                if (cpChildenModule && !relatedModules.includes(cpChildenModule)) {
                  relatedModules.push(cpChildenModule);
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
}

export default cmsModuleCopy;