import embedJs from './embedJs';
import $ from 'jquery';

let cmsModuleDelete = function() {
  // 添加
  let $D = $(document);
  $D.on('click', '.cms-delete', function(e) {
    e.preventDefault();
    e.stopPropagation();
    let $origin = $(this).closest('.cms-module');
    // 如果删除掉此 .cms-module 之后，页面上没有其它的 .cms-module
    // 则阻止此次删除
    $origin.addClass('cms-module-tobedelete'); 
    let $moduleremain = $('.cms-module').not('.cms-module-tobedelete,.cms-module-tobedelete .cms-module');
    if ($moduleremain.length === 0) {
      alert('最后一个模块不可删除！');
      $origin.removeClass('cms-module-tobedelete');
      return;
    }
    $origin.fadeOut(function() {
      $origin.remove();
      embedJs.cmsSetSelfHeight();
      let _name = $origin.data('name');
      //是否是重复模块
      if ($D.find('[data-name="' + _name + '"]').length === 0) {
        $('[for-mod="' + _name + '"]').remove();
      }
    });
  });
}

export default cmsModuleDelete;