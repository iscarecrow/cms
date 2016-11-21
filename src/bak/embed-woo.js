/************* 扩展功能 woo-single 单列瀑布流 **************/
;(function($){

  // extands  woo-single
  $(function(){
    var EXTEND_NAME = "woo";
    var $module = $('['+EXTEND_NAME+']');

    $module.find('.cms-module-div .cms-integral').on('click',function(e){
      e.preventDefault();
      e.stopPropagation();

      var $t = $(this).closest('.cms-module');
      var wooNewTopicID = $t.find('form#woo-form-new [name=topic_id]').val();
      var wooHotFilterID = $t.find('form#woo-form-hot [name=filter_id]').val();
      var wooHotKeyword = $t.find('#woo-upload-btn').attr('title') || wooHotFilterID;

      CMS_FOCUS.clear();
      CMS_FOCUS.set(EXTEND_NAME, {
        "wooColumn": parseInt($t.attr(EXTEND_NAME)),
        "wooNewTopicID": wooNewTopicID || '',
        "wooHotFilterID": wooHotFilterID || '',
        "wooHotKeyword": wooHotKeyword || ''
      });
      CMS_FOCUS._root = $t;
      CMS_FOCUS._customtype = EXTEND_NAME;
      CMS_FOCUS._callback = function($el,type,val){
        if(val && typeof val == 'object'){
          $el.attr(EXTEND_NAME,val.column)
          $el.find('form#woo-form-new [name=topic_id]').val(val.topicid);
          $el.find('form#woo-form-hot [name=filter_id]').val(val.filterid);

          // duitang://www.duitang.com/blog/create/?desc=%23%E5%8F%A3%E7%A2%91%E6%8A%A4%E8%82%A4%E5%8D%95%E5%93%81%23&__dtac=%7B%22topic_id%22%3A%2255acaf0b5ce014fe42a4bfc1%22%7D
          $el.find('#woo-upload-btn').attr('title',val.keyword).attr('href','duitang://www.duitang.com/blog/create/?desc='+encodeURIComponent('#'+val.keyword+'#')+'&__dtac='+encodeURIComponent('{"topic_id":"'+val.topicid+'"}'));


          window.CMS_RELOAD_MODIFIED_PAGE();
          // parent.$('#htmlframe').get(0).contentWindow.$('#woo-holder').find('.woo-cur').click()
          // parent && parent.popClose();
        }
        // share 初始化
        // TODO
      }

      popEditPanel();
    })

    function popEditPanel(){
      var $lis = $('\<li><u>瀑布流列数</u>\
          <select name="column">\
            ' + optionCreate('1', '1 单列瀑布流', CMS_FOCUS[EXTEND_NAME].wooColumn) + '\
            ' + optionCreate('2', '2 双列瀑布流', CMS_FOCUS[EXTEND_NAME].wooColumn) + '\
            ' + optionCreate('3', '3 三列瀑布流', CMS_FOCUS[EXTEND_NAME].wooColumn) + '\
          </select>\
        </li> \
        <li><u>主题ID</u><input type="text" name="topicid" value="' + CMS_FOCUS[EXTEND_NAME].wooNewTopicID + '"/></li> \
        <li><u>数据源</u><input type="text" name="filterid" value="' + CMS_FOCUS[EXTEND_NAME].wooHotFilterID + '"/></li> \
        <li><u>关键词</u><input type="text" name="keyword" value="' + CMS_FOCUS[EXTEND_NAME].wooHotKeyword + '"/></li>');

      // 调用父亲窗口的 popout 弹框方法
      CMS_POP_EDIT_PANEL($lis, EXTEND_NAME);
    }


    function optionCreate(value_, text_, selected_) {
      var selectAttr = selected_ == value_ ? ' selected' : '';
      var returnHtml = '<option value="' + value_ + '"' + selectAttr + '>' + text_ + '</option>';
      return returnHtml;
    }
  })
})(jQuery)
