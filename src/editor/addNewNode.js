export default function addNewNode($target, html, dir) {
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
      // embedJs.cmsSetSelfHeight();
    });
  // 拖拽功能 module 注入可操作panel，此行代码要先于 jsmodule
  $('.cms-module').parent().sortable({ handle: ".cms-show-tool" });
  $('.cms-show-tool').disableSelection();

  // if(editor.elements.length>0){
  //   editor.addElements('.cms-module');
  // }else{
  //   editor = new MediumEditor('.cms-module',{
  //     toolbar: {
  //       buttons: ['colorPicker', 'fontsize', 'italic', 'underline', 'strikethrough', 'anchor', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'removeFormat']
  //     },
  //     extensions: {
  //       'colorPicker': new MediumEditor.ColorPickerExtension()
  //     }
  //   });
  // }
  
}
