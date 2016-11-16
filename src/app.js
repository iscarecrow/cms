// import $ from 'jquery';
// import 'whatwg-fetch';
// import _ from 'lodash';

let modConfig = [];
let pageConifg = [];

function getModConfig() {
  fetch('/javascripts/config/modconfig.json')
  .then((response) => {
    return response.json()
  }).then((json) => {
    for (let item of json) {
      for (let value of item.inner_mods) {
        modConfig.push(value);
      }
    }
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  });
}

function getPageConfig() {
  fetch('/javascripts/config/pageconfig.json')
  .then((response) => {
    return response.json()
  }).then((json) => {
    // console.log(json);
    pageConifg = json;
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  });
}

function insertIframeEditor(htmlStr) {
   
}

// 模块配置加载
function modulesLoad() {
  getModConfig();
  getPageConfig();
}

function init() {
  modulesLoad();  
}

init();