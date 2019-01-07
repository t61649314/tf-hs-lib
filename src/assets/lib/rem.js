;(function(designWidth, rem2px, fixedWidth) {
  //容错
  designWidth = designWidth || 750;//传入设计稿的宽度
  rem2px = rem2px || 100;//rem to px 的关系
  fixedWidth = fixedWidth || 0;//固定最大宽度
  //获取当前html文档
  var docEl = document.documentElement;
  //获取body
  var body = document.querySelector("body");
  //设置固定宽度的大小
  if (!Number(fixedWidth)) {
    //不存在固定值，或者固定值为0
    body.style.maxWidth = designWidth / rem2px + 'rem';
  } else {
    body.style.maxWidth = fixedWidth / rem2px + 'rem';
  }
  body.style.margin = 'auto';
  //这里不设置body的position，为了底部存在可以让positon:absolute的可以吸在键盘上
  //屏幕的宽度
  var tempWidth = window.screen.width;
  var tempHeight = window.screen.height;
  //最小的宽度，以这个宽度来渲染，可以保证旋转的时候字体大小不变 为什么不用文档的宽度， 因为浏览器或者默认的app有时候会占用导航栏，
  //这个时候宽度和高度就会被裁剪一部分，但是这个时候屏幕的宽高是不会因为浏览器或者app的导航栏而被裁剪
  var minWidth = tempWidth > tempHeight ? tempHeight : tempWidth;
  //手机方向
  var orientation = window.orientation;
  //获取当前默认字体的大小，因为安卓可以设置默认字体的大小来进行计算
  var tempDom = window.document.createElement('div');
  tempDom.style.width = '1rem';
  tempDom.style.display = "none";
  var head = window.document.getElementsByTagName('head')[0];
  head.appendChild(tempDom);
  var defaultFontSize = parseFloat(window.getComputedStyle(tempDom, null).getPropertyValue('width'));
  tempDom.remove();
  //设置字体的大小
  window.onresize = function() {
    //延时是因为屏幕旋转获取新的高度需要一定的时间去重新获取高度和宽度
    setTimeout(function() {
      if (typeof(orientation) == "undefined") {
        //如果不支持orientation 那么就根据屏幕的宽高来判断
        var newWidth = window.screen.width;
        if (newWidth != tempWidth) {
          tempWidth = newWidth
          //如果屏幕的宽度值改变了
          ReSetFontSize();
        }
      }
      else {
        if (orientation != window.orientation) {
          //设置最新的屏幕方向 为什么要延迟，因为文档去重新并且渲染高度是有一个时间段的
          orientation = window.orientation;
          ReSetFontSize();
        }
      }
    }, 100);
  };
  function ReSetFontSize() {
    //设置body的高度，body的高度不能直接设置成100%会导致重绘，同时为了防止fiex的bug(键盘弹出)
    body.style.height = docEl.clientHeight + "px";
    //设置字体大小
    docEl.style.fontSize = minWidth / designWidth * rem2px / defaultFontSize * 100 + "%";
  }
  ReSetFontSize();
  document.body.classList.remove('vhidden');
})(750, 100, 750);
