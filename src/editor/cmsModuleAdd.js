import embedJs from './embedJs';
import $ from 'jquery';

let cmsModuleAdd = function() {
  // 添加
  let $D = $(document);
  $D.on('click', '.cms-add', function(e) {
    e.preventDefault();
    e.stopPropagation();
    let $origin = $(this).closest('.cms-module');
    embedJs.cmsCreatePage($origin);
    embedJs.cmsPopAddPanel();
  });
}

export default cmsModuleAdd;