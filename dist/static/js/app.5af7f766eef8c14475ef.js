webpackJsonp([1],{"+wRz":function(t,e){},"/z0M":function(t,e){t.exports={Reno:"宇宙","Kazakus/Highlander":"宇宙",Highlander:"宇宙",Renoolock:"宇宙",Aggro:"快攻",Control:"控制",control:"控制",Beast:"野兽",Secret:"奥秘",Dragon:"龙",Purify:"净化",Jade:"青玉",Malygos:"蓝龙",Tempo:"节奏",Odd:"奇数",Zoo:"动物园",Midrange:"中速",Murloc:"鱼人",MidHunter:"中速",Deathrattle:"亡语",Even:"偶数",Miracle:"奇迹",Mill:"爆牌","N'Zoth":"恩佐斯",Token:"铺场",Big:"大哥",Giants:"巨人",Combo:"Combo","N’Zoth":"恩佐斯",Renolock:"宇宙",Quest:"任务",Freeze:"冰",Anyfin:"死鱼",Face:"打脸",Egg:"蛋",Spell:"法术","Mid-Range":"中速",Shudderwock:"战吼",Patron:"奴隶",Mech:"机械",Togwaggle:"换家",Dude:"报告",Aluneth:"橙武",Cublock:"魔块",Cubelock:"魔块",Cube:"魔块",Keleseth:"二王子",Kingsbane:"弑君",Taunt:"嘲讽",Classic:"传统",Inspire:"激励",Reincarnate:"先祖",Resurrect:"复活",Demon:"恶魔",Oil:"刀油",Evolve:"进化",Aligner:"群星",Kathrena:"东灵",Handlock:"手牌",Ramp:"跳费",Zoolock:"动物园","Zoolock,":"动物园",pirate:"海盗",Astral:"星界",Hybrid:"混合",Pirate:"海盗",Peddler:"剽窃",Discard:"弃牌",Discolock:"弃牌",Totem:"图腾",Exodia:"OTK",OTK:"OTK","Mecha’thun":"机械克苏恩","Mecha'thun":"机械克苏恩","Big-Spell":"控制","Odd-Taunt":"奇数嘲讽",Recruit:"招募",Giantslock:"巨人",odd:"奇数",DMH:"无限",APM:"手速",Apm:"手速",Rush:"突袭","Tempo/Secret":"节奏奥秘","Burn/Tempo":"快攻节奏",Burn:"快攻",dragon:"龙",Spiteful:"恶毒",Treant:"树人",Overload:"过载",Mid:"中速",Elemental:"元素","Günther/Control":"控制","Secret-Odd":"奥秘奇数",TempoMiracle:"节奏奇迹","(Mech)":"机械"}},"084W":function(t,e){},KAPB:function(t,e){},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("7+uW"),a=n("Au9i"),r=n.n(a),s=(n("d8/S"),n("uMhA"),n("r7R4"),{render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]});var o=n("VU/8")({name:"App"},s,!1,function(t){n("eKVN")},null,null).exports,c=n("/ocq"),u={name:"PageHeader",props:["title","noBack"],data:function(){return{}},methods:{goBack:function(){window.history.length>1?this.$router.go(-1):this.$router.push("/")}}},l={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"page-header"},[this.noBack?this._e():e("i",{staticClass:"mintui mintui-back",on:{click:this.goBack}}),this._v(" "),e("h1",[this._v(this._s(this.title))])])},staticRenderFns:[]};var d=n("VU/8")(u,l,!1,function(t){n("+wRz")},"data-v-0eb4936c",null).exports,f=n("f62j"),m=n.n(f),p={name:"Home",components:{PageHeader:d},watch:{selected:function(t){localStorage.setItem("selected",t)}},data:function(){return{Const:m.a,selected:localStorage.getItem("selected")||"1"}}},h={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"home"},[n("page-header",{attrs:{title:"TF套牌库",noBack:"true"}}),t._v(" "),n("mt-navbar",{model:{value:t.selected,callback:function(e){t.selected=e},expression:"selected"}},[n("mt-tab-item",{attrs:{id:"1"}},[t._v("狂野模式")]),t._v(" "),n("mt-tab-item",{attrs:{id:"2"}},[t._v("标准模式")])],1),t._v(" "),n("div",{staticClass:"list",class:"1"===t.selected?"wild-list":"standard-list"},[n("router-link",{staticClass:"item",attrs:{to:{path:"/ReportList",query:{type:"1"===t.selected?"wild":"standard",form:"vicious-syndicate"}}}},[n("div",{staticClass:"type-icon"}),t._v("\n      VS战报\n    ")]),t._v(" "),n("router-link",{staticClass:"item",attrs:{to:{path:"/ReportList",query:{type:"1"===t.selected?"wild":"standard",form:"tempo-storm"}}}},[n("div",{staticClass:"type-icon"}),t._v("\n      TS战报\n    ")]),t._v(" "),"1"===t.selected?n("router-link",{staticClass:"item",attrs:{to:{path:"/ReportList",query:{type:"1"===t.selected?"wild":"standard",form:"shengerkuangye"}}}},[n("div",{staticClass:"type-icon"}),t._v("\n      生而狂野战报\n    ")]):t._e(),t._v(" "),"1"===t.selected?n("router-link",{staticClass:"item",attrs:{to:{path:"/ReportList",query:{type:"1"===t.selected?"wild":"standard",form:"fengtian"}}}},[n("div",{staticClass:"type-icon"}),t._v("\n      奉天狂野战报\n    ")]):t._e()],1),t._v(" "),t._m(0)],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"mini-code-content"},[e("p",[this._v("更多新功能，更流畅请体验小程序版：")]),this._v(" "),e("img",{attrs:{src:n("onnC")}})])}]};var v=n("VU/8")(p,h,!1,function(t){n("SB/T")},"data-v-18215008",null).exports,y=n("d7EF"),g=n.n(y),k=n("//Fk"),j=n.n(k),b=n("PJh5"),w=n.n(b),C=n("mtWM"),_=n.n(C),E={name:"TempoStorm",components:{PageHeader:d},data:function(){return{reportTitleMap:{"vicious-syndicate":"VS","tempo-storm":"TS",shengerkuangye:"生而",fengtian:"奉天"},typeTitleMap:{wild:"狂野",standard:"标准"},reportList:[],timeNode:f.timeNode}},computed:{reportGroup:function(){if(this.reportList&&this.reportList.length){var t=this.reportList.filter(function(t){return!t.jumpUrl}).sort(function(t,e){return e.time-t.time}),e=t[t.length-1].time,n=t.concat(f.timeNode).sort(function(t,e){return new Date(e.time).getTime()-new Date(t.time).getTime()});return n.filter(function(t,i){return!!t.name||(new Date(n[i].time).getTime()>e||new Date(n[i-1].time).getTime()===e)})}return[]}},created:function(){this.init()},methods:{isNew:function(t){return w()().diff(w()(t),"days")<=3},init:function(){var t=this;if(a.Indicator.open(),"wild"===this.$route.query.type)_.a.get("/my-h5-page/storage/"+this.$route.query.form+"/wild/report/list.json").then(function(e){var n=e.data;a.Indicator.close(),n&&(t.reportList=n)});else{var e=_.a.get("/my-h5-page/storage/"+this.$route.query.form+"/standard/report/newest-list.json"),n=_.a.get("/my-h5-page/storage/"+this.$route.query.form+"/standard/report/old-list.json");j.a.all([e,n]).then(function(e){var n=g()(e,2),i=n[0].data,r=n[1].data;a.Indicator.close(),i&&r&&(t.reportList=i.concat(r))})}},formatTime:function(t){return w()(t).format("YYYY-MM-DD")}}},x={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("page-header",{attrs:{title:t.reportTitleMap[t.$route.query.form]+t.typeTitleMap[t.$route.query.type]+"战报"}}),t._v(" "),n("div",{staticClass:"list"},t._l(t.reportGroup,function(e,i){return n("div",{key:i,staticClass:"item-box"},[e.jumpUrl?n("a",{staticClass:"item",attrs:{target:"_blank",href:e.jumpUrl}},[n("span",{staticClass:"has-time-title"},[t._v(t._s(e.name))]),t._v(" "),n("span",{staticClass:"time-text"},[t._v(t._s(t.formatTime(e.time)))])]):e.name?n("router-link",{staticClass:"item",attrs:{to:{path:"/OccupationList",query:{page:e.name,form:t.$route.query.form,type:t.$route.query.type,time:e.time}}}},[n("span",{staticClass:"has-time-title"},[t._v(t._s(e.name))]),t._v(" "),t.isNew(e.time)?n("span",{staticClass:"new-icon"},[t._v("new!")]):t._e(),t._v(" "),n("span",{staticClass:"time-text"},[t._v(t._s(t.formatTime(e.time)))])]):n("div",{staticClass:"time-node-text"},[n("div",{staticClass:"title",domProps:{innerHTML:t._s(e.title)}}),t._v(" "),n("div",{staticClass:"time"},[t._v(t._s(e.time))])])],1)}),0)],1)},staticRenderFns:[]};var T=n("VU/8")(E,x,!1,function(t){n("084W")},"data-v-194f77ce",null).exports,N={name:"OccupationList",components:{PageHeader:d},data:function(){return{Const:m.a,time:this.$route.query.time,page:this.$route.query.page,type:this.$route.query.type,form:this.$route.query.form}},mounted:function(){this.init()},methods:{init:function(){}}},S={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("page-header",{attrs:{title:t.page}}),t._v(" "),n("div",{staticClass:"list"},t._l(t.Const.occupationInfo,function(e,i){return n("router-link",{key:i,staticClass:"item",attrs:{occupation:i,to:{path:"/DeckList",query:{form:t.form,page:t.page,type:t.type,occupation:i,time:t.time}}}},[n("div",{staticClass:"occupation-icon"}),t._v("\n      "+t._s(e.cnName)+"\n    ")])}),1)],1)},staticRenderFns:[]};var A=n("VU/8")(N,S,!1,function(t){n("KAPB")},"data-v-75468fc7",null).exports,L=n("/z0M"),R=n.n(L),q=n("Wjre"),I=n.n(q),M={name:"DeckList",components:{PageHeader:d},data:function(){return{weakenArr:[],time:parseInt(this.$route.query.time),isInit:!1,occupation:this.$route.query.occupation,deckList:[]}},created:function(){this.init()},methods:{init:function(){var t=this;f.timeNode.filter(function(e){return w()(e.time).isAfter(w()(new Date(t.time)))&&e.weakenCardArr}).forEach(function(e){t.weakenArr=t.weakenArr.concat(e.weakenCardArr)}),a.Indicator.open(),_.a.get("/my-h5-page/storage/"+this.$route.query.form+"/"+this.$route.query.type+"/deck/"+this.$route.query.page+".json").then(function(e){var n=e.data;a.Indicator.close(),t.isInit=!0,n&&(t.deckList=n[t.occupation])})},cardsSort:function(t,e){return t.cost-e.cost},formatDeckName:function(t,e){return function(t,e,n){var i="",a=e.map(function(t){return t.dbfId}),r=!1;if(t.split(" ").forEach(function(t){R.a[t]&&(i+=R.a[t],r=!0)}),!r){var s=function(t){if(I.a[t].occupation&&I.a[t].occupation.length&&!I.a[t].occupation.includes(n))return"continue";var e=void 0;return I.a[t].anyOneId?(e=!1,I.a[t].ids.forEach(function(t){e=e||a.includes(t)})):(e=!0,I.a[t].ids.forEach(function(t){e=e&&a.includes(t)})),e?(i=I.a[t].name,"break"):void 0};t:for(var o=0;o<I.a.length;o++)switch(s(o)){case"continue":continue;case"break":break t}}return i?i+f.occupationInfo[n].simpleName:f.occupationInfo[n].cnName}(t,e,this.occupation)},isWeaken:function(t){return this.weakenArr.includes(t)}}},z={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("page-header",{attrs:{title:t.$route.query.page}}),t._v(" "),t.deckList&&t.deckList.length&&t.isInit?n("div",{staticClass:"list"},t._l(t.deckList,function(e,i){return n("div",{key:i,staticClass:"deck-item"},[n("div",{staticClass:"deck-info-box",attrs:{occupation:t.occupation}},[n("div",{staticClass:"occupation-icon"}),t._v(" "),n("span",{staticClass:"deck-name-content"},[t._v(t._s(e.alreadyFormatName?e.name:t.formatDeckName(e.name,e.cards)))])]),t._v(" "),n("div",{staticClass:"card-box"},t._l(e.cards.slice().sort(t.cardsSort),function(e,i){return n("div",{key:i,staticClass:"card-item clearfix"},[t.isWeaken(e.dbfId)?n("div",{staticClass:"is-weaken-text"},[t._v("已削弱")]):t._e(),t._v(" "),n("div",{staticClass:"fl card-cost"},[t._v(t._s(e.cost))]),t._v(" "),n("div",{staticClass:"fl card-name"},[t._v(t._s(e.cnName))]),t._v(" "),n("div",{staticClass:"fr card-quantity"},["Legendary"===e.rarity?n("i",{staticClass:"fa fa-star"}):n("span",[t._v(t._s(e.quantity))])]),t._v(" "),n("img",{staticClass:"fr card-img",attrs:{src:"https://cdn.tempostorm.com/cards/"+e.img}})])}),0),t._v(" "),n("button",{staticClass:"btn clipboard-btn",attrs:{"data-clipboard-text":e.code}},[t._v("复制卡组")])])}),0):t.isInit?n("div",{staticClass:"no-data-content"},[t._v("\n    暂无数据\n  ")]):t._e()],1)},staticRenderFns:[]};var O=n("VU/8")(M,z,!1,function(t){n("pQUX")},"data-v-015fea1e",null).exports;i.default.use(c.a);var F=new c.a({routes:[{path:"/",name:"Home",component:v},{path:"/ReportList",name:"ReportList",component:T},{path:"/OccupationList",name:"OccupationList",component:A},{path:"/DeckList",name:"DeckList",component:O}]});n("ZDwP"),n("f6VX"),n("tRmi");n("v5o6").attach(document.body),i.default.use(r.a),i.default.config.productionTip=!1,window.addEventListener("touchstart",function(){}),window.onload=function(){var t=new Clipboard(".clipboard-btn");t.on("success",function(t){r.a.Toast({message:"复制卡组成功",iconClass:"mintui mintui-success"})}),t.on("error",function(t){r.a.Toast({message:"复制卡组失败",iconClass:"mintui mintui-field-error"})})},new i.default({el:"#app",router:F,components:{App:o},template:"<App/>"})},"SB/T":function(t,e){},Wjre:function(t,e){t.exports=[{name:"奇数",ids:[48158]},{name:"偶数",ids:[47693]},{name:"机械克苏恩",ids:[48625]},{name:"宇宙",ids:[2883]},{name:"换家",ids:[46589,46874]},{name:"弑君",ids:[47035]},{name:"蓝龙",ids:[436]},{name:"奴隶",ids:[2279]},{name:"克苏恩",ids:[38857]},{name:"星界",ids:[2785]},{name:"贡克",ids:[49985]},{name:"恶毒",ids:[46551]},{name:"瓦王",ids:[2760]},{name:"元气",ids:[435]},{name:"巨人",ids:[2910,211]},{name:"复活",anyOneId:!0,ids:[42597,2298]},{name:"冰",ids:[587]},{name:"心火",ids:[1361]},{name:"冰",ids:[43072]},{name:"小明",ids:[38461]},{name:"铺场",anyOneId:!0,ids:[381,47063,41094]},{name:"无限巨人",ids:[38848,39426]},{name:"奥秘",ids:[49447]},{name:"中速",anyOneId:!0,ids:[50212]},{name:"天启",ids:[43406,186,46403]},{name:"龙",ids:[40378,2596,39554]},{name:"任务",ids:[41222]},{name:"王子",ids:[45340]},{name:"蛋",ids:[41259]},{name:"快攻",ids:[48487]},{name:"墙",ids:[43439]},{name:"青海",ids:[40465,40529,40455,40596]},{name:"铺场",ids:[1029]},{name:"海鲜",ids:[40465,1063]},{name:"鱼人",ids:[1063]},{name:"海盗",ids:[680]},{name:"青玉",anyOneId:!0,ids:[40596,40372]},{name:"极巴",occupation:["Hunter"],ids:[38312,39941]},{name:"亡语",occupation:["Rogue"],ids:[38496]},{name:"兔子",ids:[48471]},{name:"大哥",anyOneId:!0,occupation:["Druid"],ids:[41096,834,38312]},{name:"任务",anyOneId:!0,ids:[41168]},{name:"报告",anyOneId:!0,ids:[2028]},{name:"奇迹",ids:[932]},{name:"招募",ids:[46077]},{name:"奇迹",occupation:["Rogue"],ids:[630,43228]},{name:"防",anyOneId:!0,ids:[1023,810,75,546]}]},ZDwP:function(t,e,n){"use strict";(function(t,e){var i,a=n("Zx67"),r=n.n(a),s=n("kiBT"),o=n.n(s),c=n("OvRC"),u=n.n(c),l=n("C4MV"),d=n.n(l),f=n("Zzip"),m=n.n(f),p=n("5QVw"),h=n.n(p),v=n("pFYg"),y=n.n(v);!function(i){if("object"==("undefined"==typeof exports?"undefined":y()(exports))&&void 0!==t)t.exports=i();else if("function"==typeof define&&n("nErl"))define([],i);else{("undefined"!=typeof window?window:void 0!==e?e:"undefined"!=typeof self?self:this).Clipboard=i()}}(function(){return function t(e,n,a){function r(o,c){if(!n[o]){if(!e[o]){if(!c&&("function"==typeof i&&i))return i(o,!0);if(s)return s(o,!0);var u=new Error("Cannot find module '"+o+"'");throw u.code="MODULE_NOT_FOUND",u}var l=n[o]={exports:{}};e[o][0].call(l.exports,function(t){return r(e[o][1][t]||t)},l,l.exports,t,e,n,a)}return n[o].exports}for(var s="function"==typeof i&&i,o=0;o<a.length;o++)r(a[o]);return r}({1:[function(t,e,n){var i=9;if("undefined"!=typeof Element&&!Element.prototype.matches){var a=Element.prototype;a.matches=a.matchesSelector||a.mozMatchesSelector||a.msMatchesSelector||a.oMatchesSelector||a.webkitMatchesSelector}e.exports=function(t,e){for(;t&&t.nodeType!==i;){if("function"==typeof t.matches&&t.matches(e))return t;t=t.parentNode}}},{}],2:[function(t,e,n){function i(t,e,n,i){return function(n){n.delegateTarget=a(n.target,e),n.delegateTarget&&i.call(t,n)}}var a=t("./closest");e.exports=function(t,e,n,a,r){var s=i.apply(this,arguments);return t.addEventListener(n,s,r),{destroy:function(){t.removeEventListener(n,s,r)}}}},{"./closest":1}],3:[function(t,e,n){n.node=function(t){return void 0!==t&&t instanceof HTMLElement&&1===t.nodeType},n.nodeList=function(t){var e=Object.prototype.toString.call(t);return void 0!==t&&("[object NodeList]"===e||"[object HTMLCollection]"===e)&&"length"in t&&(0===t.length||n.node(t[0]))},n.string=function(t){return"string"==typeof t||t instanceof String},n.fn=function(t){return"[object Function]"===Object.prototype.toString.call(t)}},{}],4:[function(t,e,n){var i=t("./is"),a=t("delegate");e.exports=function(t,e,n){if(!t&&!e&&!n)throw new Error("Missing required arguments");if(!i.string(e))throw new TypeError("Second argument must be a String");if(!i.fn(n))throw new TypeError("Third argument must be a Function");if(i.node(t))return function(t,e,n){return t.addEventListener(e,n),{destroy:function(){t.removeEventListener(e,n)}}}(t,e,n);if(i.nodeList(t))return function(t,e,n){return Array.prototype.forEach.call(t,function(t){t.addEventListener(e,n)}),{destroy:function(){Array.prototype.forEach.call(t,function(t){t.removeEventListener(e,n)})}}}(t,e,n);if(i.string(t))return function(t,e,n){return a(document.body,t,e,n)}(t,e,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}},{"./is":3,delegate:2}],5:[function(t,e,n){e.exports=function(t){var e;if("SELECT"===t.nodeName)t.focus(),e=t.value;else if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName){var n=t.hasAttribute("readonly");n||t.setAttribute("readonly",""),t.select(),t.setSelectionRange(0,t.value.length),n||t.removeAttribute("readonly"),e=t.value}else{t.hasAttribute("contenteditable")&&t.focus();var i=window.getSelection(),a=document.createRange();a.selectNodeContents(t),i.removeAllRanges(),i.addRange(a),e=i.toString()}return e}},{}],6:[function(t,e,n){function i(){}i.prototype={on:function(t,e,n){var i=this.e||(this.e={});return(i[t]||(i[t]=[])).push({fn:e,ctx:n}),this},once:function(t,e,n){function i(){a.off(t,i),e.apply(n,arguments)}var a=this;return i._=e,this.on(t,i,n)},emit:function(t){for(var e=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),i=0,a=n.length;i<a;i++)n[i].fn.apply(n[i].ctx,e);return this},off:function(t,e){var n=this.e||(this.e={}),i=n[t],a=[];if(i&&e)for(var r=0,s=i.length;r<s;r++)i[r].fn!==e&&i[r].fn._!==e&&a.push(i[r]);return a.length?n[t]=a:delete n[t],this}},e.exports=i},{}],7:[function(t,e,n){!function(i,a){if(void 0!==n)a(e,t("select"));else{var r={exports:{}};a(r,i.select),i.clipboardAction=r.exports}}(this,function(t,e){var n=function(t){return t&&t.__esModule?t:{default:t}}(e),i="function"==typeof h.a&&"symbol"==y()(m.a)?function(t){return void 0===t?"undefined":y()(t)}:function(t){return t&&"function"==typeof h.a&&t.constructor===h.a&&t!==h.a.prototype?"symbol":void 0===t?"undefined":y()(t)},a=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),d()(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=function(){function t(e){(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")})(this,t),this.resolveOptions(e),this.initSelection()}return a(t,[{key:"resolveOptions",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action=t.action,this.container=t.container,this.emitter=t.emitter,this.target=t.target,this.text=t.text,this.trigger=t.trigger,this.selectedText=""}},{key:"initSelection",value:function(){this.text?this.selectFake():this.target&&this.selectTarget()}},{key:"selectFake",value:function(){var t=this,e="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return t.removeFake()},this.fakeHandler=this.container.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[e?"right":"left"]="-9999px";var i=window.pageYOffset||document.documentElement.scrollTop;this.fakeElem.style.top=i+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,this.container.appendChild(this.fakeElem),this.selectedText=(0,n.default)(this.fakeElem),this.copyText()}},{key:"removeFake",value:function(){this.fakeHandler&&(this.container.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(this.container.removeChild(this.fakeElem),this.fakeElem=null)}},{key:"selectTarget",value:function(){this.selectedText=(0,n.default)(this.target),this.copyText()}},{key:"copyText",value:function(){var t=void 0;try{t=document.execCommand(this.action)}catch(e){t=!1}this.handleResult(t)}},{key:"handleResult",value:function(t){this.emitter.emit(t?"success":"error",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})}},{key:"clearSelection",value:function(){this.trigger&&this.trigger.focus(),window.getSelection().removeAllRanges()}},{key:"destroy",value:function(){this.removeFake()}},{key:"action",set:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"copy";if(this._action=t,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function(){return this._action}},{key:"target",set:function(t){if(void 0!==t){if(!t||"object"!==(void 0===t?"undefined":i(t))||1!==t.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&t.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(t.hasAttribute("readonly")||t.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=t}},get:function(){return this._target}}]),t}();t.exports=r})},{select:5}],8:[function(t,e,n){!function(i,a){if(void 0!==n)a(e,t("./clipboard-action"),t("tiny-emitter"),t("good-listener"));else{var r={exports:{}};a(r,i.clipboardAction,i.tinyEmitter,i.goodListener),i.clipboard=r.exports}}(this,function(t,e,n,i){function a(t){return t&&t.__esModule?t:{default:t}}function s(t,e){var n="data-clipboard-"+t;if(e.hasAttribute(n))return e.getAttribute(n)}var c=a(e),l=a(n),f=a(i),p="function"==typeof h.a&&"symbol"==y()(m.a)?function(t){return void 0===t?"undefined":y()(t)}:function(t){return t&&"function"==typeof h.a&&t.constructor===h.a&&t!==h.a.prototype?"symbol":void 0===t?"undefined":y()(t)},v=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),d()(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),g=function(t){function e(t,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var i=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=(void 0===e?"undefined":y()(e))&&"function"!=typeof e?t:e}(this,(e.__proto__||r()(e)).call(this));return i.resolveOptions(n),i.listenClick(t),i}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+(void 0===e?"undefined":y()(e)));t.prototype=u()(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(o.a?o()(t,e):t.__proto__=e)}(e,l.default),v(e,[{key:"resolveOptions",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof t.action?t.action:this.defaultAction,this.target="function"==typeof t.target?t.target:this.defaultTarget,this.text="function"==typeof t.text?t.text:this.defaultText,this.container="object"===p(t.container)?t.container:document.body}},{key:"listenClick",value:function(t){var e=this;this.listener=(0,f.default)(t,"click",function(t){return e.onClick(t)})}},{key:"onClick",value:function(t){var e=t.delegateTarget||t.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new c.default({action:this.action(e),target:this.target(e),text:this.text(e),container:this.container,trigger:e,emitter:this})}},{key:"defaultAction",value:function(t){return s("action",t)}},{key:"defaultTarget",value:function(t){var e=s("target",t);if(e)return document.querySelector(e)}},{key:"defaultText",value:function(t){return s("text",t)}},{key:"destroy",value:function(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)}}],[{key:"isSupported",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],e="string"==typeof t?[t]:t,n=!!document.queryCommandSupported;return e.forEach(function(t){n=n&&!!document.queryCommandSupported(t)}),n}}]),e}();t.exports=g})},{"./clipboard-action":7,"good-listener":4,"tiny-emitter":6}]},{},[8])(8)})}).call(e,n("f1Eh")(t),n("DuR2"))},"d8/S":function(t,e){},eKVN:function(t,e){},f62j:function(t,e){t.exports={occupationInfo:{Druid:{cnName:"德鲁伊",simpleName:"德",dbfId:[274,50484]},Hunter:{cnName:"猎人",simpleName:"猎",dbfId:[31,2826]},Mage:{cnName:"法师",simpleName:"法",dbfId:[637,2829,39117]},Paladin:{cnName:"骑士",simpleName:"骑",dbfId:[671,2827,46116,53187]},Priest:{cnName:"牧师",simpleName:"牧",dbfId:[813,41887]},Rogue:{cnName:"盗贼",simpleName:"贼",dbfId:[930,40195]},Shaman:{cnName:"萨满",simpleName:"萨",dbfId:[1066,40183,53237]},Warlock:{cnName:"术士",simpleName:"术",dbfId:[893,47817,51834]},Warrior:{cnName:"战士",simpleName:"战",dbfId:[7,2828]}},timeNode:[{time:"2019-02-06",title:"冷血、火舌图腾、生而平等、猎人印记、法术翡翠削弱",weakenCardArr:[268,1008,756,141,43363]},{time:"2018-12-20",title:"吸血药膏、野性成长、滋养、萨隆苦囚、等级提升削弱",weakenCardArr:[42665,1124,95,42395,45877]},{time:"2018-12-05",title:"《拉斯塔哈的大乱斗》上线"},{time:"2018-10-19",title:"欢乐的发明家、法力浮龙、艾维娜削弱",weakenCardArr:[48226,405,2796]},{time:"2018-08-08",title:"《砰砰计划》上线"},{time:"2018-05-23",title:"纳迦海巫、恶毒的召唤师、黑暗契约、着魔男仆、战斗号角、探索地下洞穴削弱",weakenCardArr:[2910,46551,43128,45820,43384,41222]},{time:"2018-04-13",title:"《女巫森林》上线、冰箱、寒光智者、熔核巨人进入荣誉室、《古神的低语》、《卡拉赞之夜》、《龙争虎斗加基森》退环境"},{time:"2018-02-07",title:"通道爬行者、海盗帕奇斯、缚链者拉兹、骨魇削弱",weakenCardArr:[43515,40465,40323,42790]},{time:"2017-12-08",title:"《狗头人与地下世界》上线"},{time:"2017-09-19",title:"激活、炽炎战斧、妖术、鱼人领军、传播瘟疫削弱",weakenCardArr:[254,401,766,1063,42656]},{time:"2017-08-11",title:"《冰封王座的骑士》上线"},{time:"2017-07-11",title:"探索地下洞穴削弱",weakenCardArr:[41222]},{time:"2017-04-07",title:"《勇闯安戈洛》上线、碧蓝幼龙、希尔瓦娜斯·风行者、炎魔之王拉格纳罗斯、力量的代价、冰枪术、隐藏、老瞎眼、船长的鹦鹉、精英牛头人酋长、格尔宾·梅卡托克进入荣誉室、《黑石山的火焰》、《冠军的试炼》、《探险家协会》退环境"},{time:"2017-03-01",title:"蹩脚海盗、幽灵之爪削弱",weakenCardArr:[40608,39694]},{time:"2016-12-02",title:"《龙争虎斗加基森》上线"},{time:"2016-10-04",title:"兽群呼唤、斩杀、石化武器、海象人图腾师、叫嚣的中士、冲锋、尤格萨隆削弱",weakenCardArr:[38727,785,239,2513,242,344,38505]},{time:"2016-08-12",title:"《卡拉赞之夜》上线"},{time:"2016-04-27",title:"《古神的低语》上线、知识古树、自然之力、丛林守护者、铁喙猫头鹰、王牌猎人、猎人印记、剑刃乱舞、飞刀杂耍者、麻疯侏儒、奥术傀儡、熔核巨人、伪装大师削弱、《纳克萨玛斯的诅咒》、《地精大战侏儒》退环境"}]}},f6VX:function(t,e){!function(t,e,n){t=t||750,e=e||100,n=n||0;var i=document.documentElement,a=document.querySelector("body");Number(n)?a.style.maxWidth=n/e+"rem":a.style.maxWidth=t/e+"rem",a.style.margin="auto";var r=window.screen.width,s=window.screen.height,o=r>s?s:r,c=window.orientation,u=window.document.createElement("div");u.style.width="1rem",u.style.display="none",window.document.getElementsByTagName("head")[0].appendChild(u);var l=parseFloat(window.getComputedStyle(u,null).getPropertyValue("width"));function d(){a.style.height=i.clientHeight+"px",i.style.fontSize=o/t*e/l*100+"%"}u.remove(),window.onresize=function(){setTimeout(function(){if(void 0===c){var t=window.screen.width;t!=r&&(r=t,d())}else c!=window.orientation&&(c=window.orientation,d())},100)},d(),document.body.classList.remove("vhidden")}(750,100,750)},onnC:function(t,e,n){t.exports=n.p+"static/img/mini-code.001bc5f.jpg"},pQUX:function(t,e){},r7R4:function(t,e){},tRmi:function(t,e,n){t.exports=n.p+"static/fonts/fontawesome-webfont.4b5a84a.woff2"},uMhA:function(t,e){},uslO:function(t,e,n){var i={"./af":"3CJN","./af.js":"3CJN","./ar":"3MVc","./ar-dz":"tkWw","./ar-dz.js":"tkWw","./ar-kw":"j8cJ","./ar-kw.js":"j8cJ","./ar-ly":"wPpW","./ar-ly.js":"wPpW","./ar-ma":"dURR","./ar-ma.js":"dURR","./ar-sa":"7OnE","./ar-sa.js":"7OnE","./ar-tn":"BEem","./ar-tn.js":"BEem","./ar.js":"3MVc","./az":"eHwN","./az.js":"eHwN","./be":"3hfc","./be.js":"3hfc","./bg":"lOED","./bg.js":"lOED","./bm":"hng5","./bm.js":"hng5","./bn":"aM0x","./bn.js":"aM0x","./bo":"w2Hs","./bo.js":"w2Hs","./br":"OSsP","./br.js":"OSsP","./bs":"aqvp","./bs.js":"aqvp","./ca":"wIgY","./ca.js":"wIgY","./cs":"ssxj","./cs.js":"ssxj","./cv":"N3vo","./cv.js":"N3vo","./cy":"ZFGz","./cy.js":"ZFGz","./da":"YBA/","./da.js":"YBA/","./de":"DOkx","./de-at":"8v14","./de-at.js":"8v14","./de-ch":"Frex","./de-ch.js":"Frex","./de.js":"DOkx","./dv":"rIuo","./dv.js":"rIuo","./el":"CFqe","./el.js":"CFqe","./en-au":"Sjoy","./en-au.js":"Sjoy","./en-ca":"Tqun","./en-ca.js":"Tqun","./en-gb":"hPuz","./en-gb.js":"hPuz","./en-ie":"ALEw","./en-ie.js":"ALEw","./en-il":"QZk1","./en-il.js":"QZk1","./en-nz":"dyB6","./en-nz.js":"dyB6","./eo":"Nd3h","./eo.js":"Nd3h","./es":"LT9G","./es-do":"7MHZ","./es-do.js":"7MHZ","./es-us":"INcR","./es-us.js":"INcR","./es.js":"LT9G","./et":"XlWM","./et.js":"XlWM","./eu":"sqLM","./eu.js":"sqLM","./fa":"2pmY","./fa.js":"2pmY","./fi":"nS2h","./fi.js":"nS2h","./fo":"OVPi","./fo.js":"OVPi","./fr":"tzHd","./fr-ca":"bXQP","./fr-ca.js":"bXQP","./fr-ch":"VK9h","./fr-ch.js":"VK9h","./fr.js":"tzHd","./fy":"g7KF","./fy.js":"g7KF","./gd":"nLOz","./gd.js":"nLOz","./gl":"FuaP","./gl.js":"FuaP","./gom-latn":"+27R","./gom-latn.js":"+27R","./gu":"rtsW","./gu.js":"rtsW","./he":"Nzt2","./he.js":"Nzt2","./hi":"ETHv","./hi.js":"ETHv","./hr":"V4qH","./hr.js":"V4qH","./hu":"xne+","./hu.js":"xne+","./hy-am":"GrS7","./hy-am.js":"GrS7","./id":"yRTJ","./id.js":"yRTJ","./is":"upln","./is.js":"upln","./it":"FKXc","./it.js":"FKXc","./ja":"ORgI","./ja.js":"ORgI","./jv":"JwiF","./jv.js":"JwiF","./ka":"RnJI","./ka.js":"RnJI","./kk":"j+vx","./kk.js":"j+vx","./km":"5j66","./km.js":"5j66","./kn":"gEQe","./kn.js":"gEQe","./ko":"eBB/","./ko.js":"eBB/","./ku":"kI9l","./ku.js":"kI9l","./ky":"6cf8","./ky.js":"6cf8","./lb":"z3hR","./lb.js":"z3hR","./lo":"nE8X","./lo.js":"nE8X","./lt":"/6P1","./lt.js":"/6P1","./lv":"jxEH","./lv.js":"jxEH","./me":"svD2","./me.js":"svD2","./mi":"gEU3","./mi.js":"gEU3","./mk":"Ab7C","./mk.js":"Ab7C","./ml":"oo1B","./ml.js":"oo1B","./mn":"CqHt","./mn.js":"CqHt","./mr":"5vPg","./mr.js":"5vPg","./ms":"ooba","./ms-my":"G++c","./ms-my.js":"G++c","./ms.js":"ooba","./mt":"oCzW","./mt.js":"oCzW","./my":"F+2e","./my.js":"F+2e","./nb":"FlzV","./nb.js":"FlzV","./ne":"/mhn","./ne.js":"/mhn","./nl":"3K28","./nl-be":"Bp2f","./nl-be.js":"Bp2f","./nl.js":"3K28","./nn":"C7av","./nn.js":"C7av","./pa-in":"pfs9","./pa-in.js":"pfs9","./pl":"7LV+","./pl.js":"7LV+","./pt":"ZoSI","./pt-br":"AoDM","./pt-br.js":"AoDM","./pt.js":"ZoSI","./ro":"wT5f","./ro.js":"wT5f","./ru":"ulq9","./ru.js":"ulq9","./sd":"fW1y","./sd.js":"fW1y","./se":"5Omq","./se.js":"5Omq","./si":"Lgqo","./si.js":"Lgqo","./sk":"OUMt","./sk.js":"OUMt","./sl":"2s1U","./sl.js":"2s1U","./sq":"V0td","./sq.js":"V0td","./sr":"f4W3","./sr-cyrl":"c1x4","./sr-cyrl.js":"c1x4","./sr.js":"f4W3","./ss":"7Q8x","./ss.js":"7Q8x","./sv":"Fpqq","./sv.js":"Fpqq","./sw":"DSXN","./sw.js":"DSXN","./ta":"+7/x","./ta.js":"+7/x","./te":"Nlnz","./te.js":"Nlnz","./tet":"gUgh","./tet.js":"gUgh","./tg":"5SNd","./tg.js":"5SNd","./th":"XzD+","./th.js":"XzD+","./tl-ph":"3LKG","./tl-ph.js":"3LKG","./tlh":"m7yE","./tlh.js":"m7yE","./tr":"k+5o","./tr.js":"k+5o","./tzl":"iNtv","./tzl.js":"iNtv","./tzm":"FRPF","./tzm-latn":"krPU","./tzm-latn.js":"krPU","./tzm.js":"FRPF","./ug-cn":"To0v","./ug-cn.js":"To0v","./uk":"ntHu","./uk.js":"ntHu","./ur":"uSe8","./ur.js":"uSe8","./uz":"XU1s","./uz-latn":"/bsm","./uz-latn.js":"/bsm","./uz.js":"XU1s","./vi":"0X8Q","./vi.js":"0X8Q","./x-pseudo":"e/KL","./x-pseudo.js":"e/KL","./yo":"YXlc","./yo.js":"YXlc","./zh-cn":"Vz2w","./zh-cn.js":"Vz2w","./zh-hk":"ZUyn","./zh-hk.js":"ZUyn","./zh-tw":"BbgG","./zh-tw.js":"BbgG"};function a(t){return n(r(t))}function r(t){var e=i[t];if(!(e+1))throw new Error("Cannot find module '"+t+"'.");return e}a.keys=function(){return Object.keys(i)},a.resolve=r,t.exports=a,a.id="uslO"}},["NHnr"]);
//# sourceMappingURL=app.5af7f766eef8c14475ef.js.map