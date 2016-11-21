import embedJs from './embedJs';
import $ from 'jquery';
import popEditPanel from './popEditPanel';

export default function initModule(extendName) {
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
}
