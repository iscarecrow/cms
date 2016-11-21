import $ from 'jquery';
import embedJs from './editor/embedJs';
import DtPlatform from './utils/dtPlatform';
// 前台展示
import setNavigationShoppingCar from './part/setNavigationShoppingCar';
import setNavigationShare from './part/setNavigationShare';
import expireTime from './part/expireTime';


// 模块初始化
import cmsModuleInit from './editor/cmsModuleInit';
// 模块添加
import cmsModuleAdd from './editor/cmsModuleAdd';
// 模块拷贝
import cmsModuleCopy from './editor/cmsModuleCopy';
// 模块删除
import cmsModuleDelete from './editor/cmsModuleDelete';
// 模块数据修改
import cmsModuleIntegral from './editor/cmsModuleIntegral';
// 编辑器初始化
import cmsEditorInit from './editor/cmsEditorInit';

// 模块上元素监听，唤起数据写入
import cmsModuleElementEvents from './editor/cmsModuleElementEvents';

window.embedJs = embedJs;
window.$ = $;
window.DtPlatform = DtPlatform;

window.DtPart = {
  setNavigationShoppingCar: setNavigationShoppingCar,
  setNavigationShare: setNavigationShare,
  expireTime: expireTime
};

$(function(){
  // 模块初始化
  cmsModuleInit();
  // 添加
  cmsModuleAdd();
  // 复制
  cmsModuleCopy();
  // 删除
  cmsModuleDelete();
  // 修改
  cmsModuleIntegral();
  // 数据写入唤起
  cmsModuleElementEvents();
  // 编辑器
  cmsEditorInit();
});