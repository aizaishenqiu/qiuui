const $ = (str) => {
  return document.querySelector(str);
};
const setRotate = (dom, rotate) => {
  dom.style.webkitTransform = "rotate(" + rotate + "deg)";
};
let roateBox = $("#rotateBox");

// 旋转按钮代码
// 获取方形中心坐标点即坐标轴原点
let centerPointX =
  roateBox.getBoundingClientRect().left +
  roateBox.getBoundingClientRect().width / 2;
let centerPointY =
  roateBox.getBoundingClientRect().top +
  roateBox.getBoundingClientRect().height / 2;
// 鼠标移动事件
const moveEvent = (e) => {
  let X = e.clientX;
  let Y = e.clientY;
  e.stopPropagation();
  let oY = Math.abs(Y - centerPointY);
  let oX = Math.abs(X - centerPointX);
  // 避免水平和垂直位置的就相当于和坐标轴相交的时候设置除数为0或者不知道为360度还是180度
  oY === 0 && (oY = 0.01);
  oX === 0 && (oX = 0.01);
  let degEnd = (Math.atan(oX / oY) / (2 * Math.PI)) * 360;

  // 第一象限
  if (X > centerPointX && Y < centerPointY) {
    console.log("第一象限");
    setRotate(roateBox, degEnd);
  }
  // 第二象限
  if (X > centerPointX && Y > centerPointY) {
    console.log("第二象限");
    setRotate(roateBox, 180 - degEnd);
  }
  // 第三象限
  if (X < centerPointX && Y > centerPointY) {
    console.log("第三象限");
    setRotate(roateBox, degEnd + 180);
  }
  // 第四象限
  if (X < centerPointX && Y < centerPointY) {
    console.log("第四象限");
    setRotate(roateBox, 360 - degEnd);
  }
};

$("#rotateBox .point").addEventListener(
  "mousedown",
  function (e) {
    e.stopPropagation();
    document.addEventListener("mousemove", moveEvent, false);
  },
  false
);

document.addEventListener(
  "mouseup",
  function () {
    document.removeEventListener("mousemove", moveEvent);
  },
  false
);

// 释放文档按下事件
document.onmouseup = function () {
  document.onmousemove = null;
};

// 右下角拉伸点
let startX, startY, owidth, oheight, oleft, otop;
const MAXWIDTH = 50; // 限制最大宽度
const MAXHEIGHT = 50; // 限制最大高度
$("#rotateBox .rb-point").addEventListener(
  "mousedown",
  function (e) {
    let that = this;
    startX = e.clientX;
    startY = e.clientY;
    oleft = this.parentNode.getBoundingClientRect().left;
    owidth = this.parentNode.getBoundingClientRect().width;
    oheight = this.parentNode.getBoundingClientRect().height;
    e.stopPropagation();
    document.onmousemove = function (e) {
      let moveX = e.clientX;
      let moveY = e.clientY;
      let mWidth = moveX - startX;
      let mHeight = moveY - startY;
      console.log(mWidth, mHeight);
      that.parentNode.style.left = oleft + "px";
      that.parentNode.style.width =
        (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) + "px";
      that.parentNode.style.height =
        (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) + "px";
    };
  },
  false
);

// 左下角拉伸点
$("#rotateBox .lb-point").addEventListener(
  "mousedown",
  function (e) {
    let that = this;
    startX = e.clientX;
    startY = e.clientY;
    oleft = this.parentNode.getBoundingClientRect().left;
    owidth = this.parentNode.getBoundingClientRect().width;
    oheight = this.parentNode.getBoundingClientRect().height;
    e.stopPropagation();
    document.onmousemove = function (e) {
      let moveX = e.clientX;
      let moveY = e.clientY;
      let mWidth = startX - moveX;
      let mHeight = moveY - startY;
      console.log(mWidth, mHeight);
      that.parentNode.style.left = moveX + "px";
      that.parentNode.style.width =
        (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) + "px";
      that.parentNode.style.height =
        (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) + "px";
    };
  },
  false
);

// 左上角拉伸点
$("#rotateBox .lt-point").addEventListener(
  "mousedown",
  function (e) {
    let that = this;
    startX = e.clientX;
    startY = e.clientY;
    oleft = this.parentNode.getBoundingClientRect().left;
    otop = this.parentNode.getBoundingClientRect().top;
    owidth = this.parentNode.getBoundingClientRect().width;
    oheight = this.parentNode.getBoundingClientRect().height;
    e.stopPropagation();
    document.onmousemove = function (e) {
      let moveX = e.clientX;
      let moveY = e.clientY;
      let mWidth = startX - moveX;
      let mHeight = startY - moveY;
      console.log(mWidth, mHeight);
      that.parentNode.style.left = moveX + "px";
      that.parentNode.style.top = moveY + "px";
      that.parentNode.style.width =
        (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) + "px";
      that.parentNode.style.height =
        (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) + "px";
    };
  },
  false
);

// 右上角拉伸点
$("#rotateBox .rt-point").addEventListener(
  "mousedown",
  function (e) {
    let that = this;
    startX = e.clientX;
    startY = e.clientY;
    oleft = this.parentNode.getBoundingClientRect().left;
    otop = this.parentNode.getBoundingClientRect().top;
    owidth = this.parentNode.getBoundingClientRect().width;
    oheight = this.parentNode.getBoundingClientRect().height;
    e.stopPropagation();
    document.onmousemove = function (e) {
      let moveX = e.clientX;
      let moveY = e.clientY;
      let mWidth = moveX - startX;
      let mHeight = startY - moveY;
      console.log(mWidth, mHeight);
      that.parentNode.style.left = oleft + "px";
      that.parentNode.style.top = moveY + "px";
      that.parentNode.style.width =
        (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) + "px";
      that.parentNode.style.height =
        (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) + "px";
    };
  },
  false
);

// 中上拉伸点
$("#rotateBox .ct-point").addEventListener(
  "mousedown",
  function (e) {
    let that = this;
    startX = e.clientX;
    startY = e.clientY;
    oleft = this.parentNode.getBoundingClientRect().left;
    otop = this.parentNode.getBoundingClientRect().top;
    owidth = this.parentNode.getBoundingClientRect().width;
    oheight = this.parentNode.getBoundingClientRect().height;
    e.stopPropagation();
    document.onmousemove = function (e) {
      let moveY = e.clientY;
      let mHeight = startY - moveY;
      that.parentNode.style.top = moveY + "px";
      that.parentNode.style.height =
        (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) + "px";
    };
  },
  false
);

// 中下拉伸点
$("#rotateBox .cb-point").addEventListener(
  "mousedown",
  function (e) {
    let that = this;
    startX = e.clientX;
    startY = e.clientY;
    oleft = this.parentNode.getBoundingClientRect().left;
    otop = this.parentNode.getBoundingClientRect().top;
    owidth = this.parentNode.getBoundingClientRect().width;
    oheight = this.parentNode.getBoundingClientRect().height;
    e.stopPropagation();
    document.onmousemove = function (e) {
      let moveY = e.clientY;
      let mHeight = moveY - startY;
      that.parentNode.style.height =
        (oheight + mHeight > MAXHEIGHT ? oheight + mHeight : MAXHEIGHT) + "px";
    };
  },
  false
);

// 左中拉伸点
$("#rotateBox .cl-point").addEventListener(
  "mousedown",
  function (e) {
    let that = this;
    startX = e.clientX;
    startY = e.clientY;
    oleft = this.parentNode.getBoundingClientRect().left;
    otop = this.parentNode.getBoundingClientRect().top;
    owidth = this.parentNode.getBoundingClientRect().width;
    oheight = this.parentNode.getBoundingClientRect().height;
    e.stopPropagation();
    document.onmousemove = function (e) {
      let moveY = e.clientY;
      let moveX = e.clientX;
      let mWidth = startX - moveX;
      that.parentNode.style.left = moveX + "px";
      that.parentNode.style.width =
        (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) + "px";
    };
  },
  false
);

// 右中拉伸点
$("#rotateBox .cr-point").addEventListener(
  "mousedown",
  function (e) {
    let that = this;
    startX = e.clientX;
    startY = e.clientY;
    oleft = this.parentNode.getBoundingClientRect().left;
    otop = this.parentNode.getBoundingClientRect().top;
    owidth = this.parentNode.getBoundingClientRect().width;
    oheight = this.parentNode.getBoundingClientRect().height;
    e.stopPropagation();
    document.onmousemove = function (e) {
      let moveY = e.clientY;
      let moveX = e.clientX;
      let mWidth = moveX - startX;
      that.parentNode.style.width =
        (owidth + mWidth > MAXWIDTH ? owidth + mWidth : MAXWIDTH) + "px";
    };
  },
  false
);
const $Dragble = {
  dom: "",
  isMove: false,
  left: "",
  top: "",
  mouseStartX: "",
  mouseStartY: "",
  positionType: "",
  mousemove: function (maxleft, maxtop) {
    $Dragble.dom.style.top =
      $Dragble.top + (window.event.pageY - $Dragble.mouseStartY) + "px";
    $Dragble.dom.style.left =
      $Dragble.left + (window.event.pageX - $Dragble.mouseStartX) + "px";
    // 这两行必须要有，为了移动的时候重置中心点的坐标
    centerPointX =
      $Dragble.dom.getBoundingClientRect().left +
      $Dragble.dom.getBoundingClientRect().width / 2;
    centerPointY =
      $Dragble.dom.getBoundingClientRect().top +
      $Dragble.dom.getBoundingClientRect().height / 2;
  },
  mouseup: function () {
    document.removeEventListener("mousemove", this.mousemove);
  },
  // 初始化数据
  intData: function (dom, type, maxLeft, maxTop) {
    this.dom = dom;
    this.isMove = true;
    this.positionType = type;
    this.dom.style.position = type;
    this.mouseStartX = window.event.pageX;
    this.mouseStartY = window.event.pageY;
    this.left = Number.parseFloat(this.dom.style.left);
    this.top = Number.parseFloat(this.dom.style.top);
    this.dom.style.left ? this.dom.style.left : (this.dom.style.left = 0);
    this.dom.style.top ? this.dom.style.top : (this.dom.style.top = 0);
  },
  mousedown: function (dom, type, maxLeft, maxTop) {
    this.intData(dom, type, maxLeft, maxTop);
    document.addEventListener("mousemove", this.mousemove, false);
    document.removeEventListener("mouseup", this.mousemove);
  },
};
