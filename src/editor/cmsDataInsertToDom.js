import $ from 'jquery';
import embedParent from './embedParent';

let cmsDataInsertToDom = function() {
  let back = [];
  let $cont = $('#cms-unitedit');
  let $form = $cont.find('form');
  let iframe = $("#embed-iframe");
  let iframewin = iframe[0].contentWindow;
  let iframedoc = iframewin.document;

  if ($form.length) {
    let formmap = {};
    $form.find('input[name],select[name],textarea[name]').each(function(i, el) {
      let $el = $(el);
      let key = $el.attr('name');
      let tagnm = $el.get(0).tagName.toLowerCase();
      if ($el.attr('type') == 'checkbox') {
        formmap[key] = $el.prop('checked');
      } else if ($el.attr('type') == 'text') {
        formmap[key] = $el.val().replace(/>/g, '&gt;');
      } else if (tagnm == 'select' || tagnm == 'textarea') {
        formmap[key] = $el.val();
      }
    });
    let $target = $form.attr('dtform');
    let formtype = $form.attr('dtformtype');
    back.push({
      "el": $target,
      "type": formtype,
      "val": formmap
    });
  } else {
    // toggle 状态
    let $selToggle = $cont.find('select[dttoggle]');
    if ($selToggle.length) {
      let $toggleel = $selToggle.attr('dttoggle');
      let toggleclass = $selToggle.val();
      back.push({
        "el": $toggleel,
        "type": "toggle",
        "val": toggleclass
      });
    }

    // img src
    let $imgipt = $cont.find('input[dtsrc]');
    if ($imgipt.length) {
      let $imgel = $imgipt.attr('dtsrc');
      // 截图正方形
      let crop = $('#cms-check-crop').prop('checked');
      // 使用原图
      let useorigin = $('#cms-check-useorigin').prop('checked');

      let isbackground = $imgipt.attr('isbackground') != undefined;
      back.push({
        "el": $imgel,
        "type": "src",
        "val": $imgipt.val(),
        "width": $imgipt.attr('dtsrcwidth'),
        "height": $imgipt.attr('dtsrcheight'),
        "crop": crop,
        "useorigin": useorigin,
        "isbackground": isbackground
      });
      // $imgel.attr('src',$imgipt.val());
    }
    // img alt
    let $imgaltipt = $cont.find('input[dtalt]');

    if ($imgaltipt.length) {
      let $imgaltel = $imgaltipt.attr('dtalt');
      back.push({
        "el": $imgaltel,
        "type": "alt",
        "val": $imgaltipt.val()
      });
      // $imgaltel.attr('alt',$imgaltipt.val());
    }

    // link
    let $hrefipt = $cont.find('input[dthref]');
    if ($hrefipt.length) {
      let $hrefel = $hrefipt.attr('dthref');
      let pageweb = $('#cms-check-pageweb').val();
      back.push({
        "el": $hrefel,
        "type": "href",
        "val": $hrefipt.val(),
        "pageweb": pageweb
      });
      // $hrefel.attr('href',$hrefipt.val());
    }

    // word 多个
    let $textipts = $cont.find('input[dttext]');
    $textipts.each(function(i, el) {
      let $el = $(el);
      let $textel = $el.attr('dttext');
      back.push({
        "el": $textel,
        "type": "text",
        "val": $el.val()
      });
      // $textel.text($el.val());
    });

    // 自定义属性修改
    let $customs = $cont.find('input[dtcustom]');
    $customs.each(function(i, el) {
      let $el = $(el);
      let $customel = $el.attr('dtcustom');
      let customtype = $el.attr('dtcustomtype');
      back.push({
        "el": $customel,
        "type": customtype,
        "val": $el.val()
      });
      // $textel.text($el.val());
    });
  }

  // 调用父亲窗口的 popout 弹框方法
  embedParent.popClose();

  // 将处理结果push back 回iframe
  let hideroot = !$('#cms-editvisible').prop('checked');
  let dtrace = $('#cms-gaq-wrap').find('input').val() || '';
  
  if (iframewin && iframewin.embedJs.cmsReturnBack) {
    iframewin.embedJs.cmsReturnBack(back, {
      "hideroot": hideroot,
      "dtrace": dtrace
    });
  }

}

export default cmsDataInsertToDom;