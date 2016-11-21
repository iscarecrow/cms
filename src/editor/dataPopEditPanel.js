//数据类型的弹窗
import embedJs from './embedJs';
import $ from 'jquery';

let dataPopEditPanel = function(extendName) {
  var htmlstr = '',
    _cmsFocus = embedJs.cmsFocus;
  for (var name in _cmsFocus[extendName]) {
    var itemval = _cmsFocus[extendName][name];
    var showname = name;
    if($.isPlainObject(itemval)){
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

export default dataPopEditPanel;