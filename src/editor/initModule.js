import embedJs from './embedJs';

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
