import blockUI from '../plugin/jquery.blockUI';
// import broswer from '../plugin/browser';


function store ($d){
  var $whouse = $('#win-house');

  //判断有无win-house，没有则添加
  if( !$whouse.length ){
    $whouse = $('<div id="win-house" class="h0"></div>').appendTo('body');
  }

  $d && $whouse.append($d);

  return $whouse;
};

// let ie = $.browser.msie;
// let ff = $.browser.mozilla,
// let ie6 = ie && $.browser.version === '6.0',
// let ie7 = ie && $.browser.version === '7.0',
// let ie8 = ie && $.browser.version === '8.0',
// let ie9 = ie && $.browser.version === '9.0',
// let opera = $.browser.opera;

let sugarPop = {
  fnCloseMask : function (){
    this.closeMask();
  },
  poptorylen : 10,
  poptory : [],  // pop历史节点记录，最多记录十个

  WD : [400,484,660],  // 三种尺寸的弹出框
  STR : [
    '<a href="javascript:;" target="_self" class="abtn l" onclick="sugarPop.closeMask();"><button type="button"><u>关闭</u></button></a>', // 0 关闭按钮
    '<a href="javascript:;" target="_self" class="abtn l" onclick="sugarPop.closeMask();"><button type="button"><u>取消</u></button></a>' // 1 取消按钮
  ],

  /*
  描述：历史弹出记录， go(0) 表示当前弹出框，go(-1) 表示回退一个
  历史弹出的调用不会产生新的历史记录
  */
  go : function (hnm){
    hnm = -hnm;
    // hnm=-1 表示回退一个  hnm 必须小于等于0
    if( hnm < 0 || hnm > 9 ){
      return
    }

    var _t = this,
        tg;
    if( tg = _t.poptory[hnm] ){
      var $cont = _t.setCont([tg.head,tg.cont],tg.n);
      _t.blockPop($cont,tg.n,tg.ht,tg.opt);
    }
  },

  /*
  描述：在已经弹出的情况下，更新弹出框内容
  参数： pm[0] - (Str) 弹出层标题
      pm[1] - (Str) 弹出层内容  不支持 selector，请先 $() 再传入
      n     - (Num) 0为 默认小框
  */
  alert : function (pm,n,opt){
    var _t = this,
      n = n === 's' ? 0 : n === 'm' ? 1 : n === 'l' ? 2 : n,
      n = n || 0, // 默认小号尺寸
      wd = _t.WD,
      $whouse = store();  // store()  可以创建  #win-house 节点


    if( $.type(pm) === 'string' || $.type(pm) === 'number' ){
      pm = ['', pm + ''];
    }
    pm[0] = pm[0];
    pm[1] = pm[1] || '';

    // 之所以不支持 selector 是因为字符串将被特殊处理
    var ismess = $.type(pm[1]) === 'string',
        $cont = _t.setCont(pm,n);

    // 得到 $cont 的高度，同时将 $cont 部署到 win-house 容器中
    var ht = $cont.outerHeight();

    if( ismess ){
      // 如果是弹出 message 非dom 节点，则不需要保存cont 节点
      var messhtml = $cont.html();
      // 从dom树种删除 $cont 节点
      $cont.remove();

      // 重新生成 $cont 对象，这里是字符串
      $cont = '<div class="mask-body">' + messhtml + '</div>';
    }else{
      // 如果是dom 节点，则会被存入 win-house 中供将来使用
      _t.poptory = [{"head":pm[0],"cont":$(pm[1]),"n":n,"ht":ht,"opt":opt}].concat(_t.poptory),
      _t.poptory.length = _t.poptorylen;
    }

    _t.blockPop($cont,n,ht,opt);
  },


  /*
  描述：计算 $cont 高度，采用 win-house 隐藏容器计算
  */
  setCont : function (pm,n){
    var _t = this,
        wd = _t.WD,
        $whouse = store(),
        $head,
        $cont;

    // 以下代码通过置入 win-house 节点计算 $cont 的高度，不要改动逻辑
    // 通过判断 pm[0] == null 来控制是否显示 head 标题头
    // sugarPop.alert('22') 和 sugarPop.alert([null,'22']) 后者没有标题头
    $head = pm[0] == null ? '' : $('<div class="tt-s"><span>'+pm[0]+'</span><a class="mask-close" target="_self" href="javascript:;" onclick="sugarPop.closeMask();">关闭</a></div>'),

    $cont = $('<div class="mask-body"></div>').css("width",wd[n]).appendTo($whouse),

    $cont.append($head).append(
    $('<div class="mask-cont"></div>').append(pm[1]));

    // 得到 $cont 的高度
    return $cont;
  },

  /*
  描述：设置非全屏遮罩。最小号弹出框，不做全屏遮罩，重新定义overlay 的样式
  */
  blockPop : function ($cont,n,ht,opt){
    var _t = this,
        wd = _t.WD,
        $whouse = store();  // store()  可以创建  #win-house 节点

    opt = $.extend({
      position: 'fixed'
    }, opt);

    // 弹出层使用何种定位， fixed or absolute
    var isfixed = false, $W, WT, WH;
    if( opt.position === 'fixed' ){
      isfixed = true;
    }else{
      // 如果使用 absolute
      $W = $(window),
      WT = $W.scrollTop(),
      WH = $W.height();
    }

    $.blockUI({    //当点击事件发生时调用弹出层
      message: $cont,    //要弹出的元素box
      baseZ: 9000, //should be lower than @at
      focusInput : (opt && opt.focus !== undefined) ? opt.focus : true, //focus 到第一个input 输入框
      onUnblock : function (){
        // 去除多余的 mask-body
        $whouse.find('.mask-cont:empty').closest('.mask-body').remove();
        if( opt && $.isFunction(opt.fn) ){
          opt.fn();
        }
      },
      css: {    //弹出元素的CSS属性
        position: opt.position,
        top: (isfixed ? '50%' : WT),
        left: '50%',
        textAlign: 'left',
        marginLeft: -(wd[n]/2),
        marginTop: isfixed ? -(ht/2)-20 : (ht >= WH ? 0 : (WH - ht) / 2),
        width: wd[n],
        height: ht,
        border: 'none',
        background: 'none'
      },
      fadeIn : $('.blockOverlay:visible').length ? 0 : 200
    });


    // 控制尺寸  wd = [400,480,660] 最小号的框不是全屏遮罩
    if( n < 1 ){
      _t.setOverLay();
    }
  },

  /*
  描述：设置非全屏遮罩。最小号弹出框，不做全屏遮罩，重新定义overlay 的样式
  */
  setOverLay : function (){
    // if(ie6) return;
    var $blk = $('div.blockPage'),
      w = $blk.outerWidth(),
      h = $blk.outerHeight(),
      mgt = parseInt($blk.css("marginTop")),
      mgl = parseInt($blk.css("marginLeft"));

    $('div.blockOverlay').css({
      "width" : w + 24,
      "height" : h + 24,
      "top" : "50%",
      "left" : "50%",
      "marginTop" : mgt - 12,
      "marginLeft" : mgl - 12,
      "border-radius" : "8px",
      "-moz-border-radius" : "8px",
      "-webkit-border-radius" : "8px"
    })
  },

  closeMask : function (){
    $.unblockUI()
  }
}

export default sugarPop;
