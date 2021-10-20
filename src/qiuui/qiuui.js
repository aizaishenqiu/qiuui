// 将金额转换为人民币
export function RMB(money) {
  //汉字的数字
  let cnNums = new Array(
    "零",
    "壹",
    "贰",
    "叁",
    "肆",
    "伍",
    "陆",
    "柒",
    "捌",
    "玖"
  );
  //基本单位
  let cnIntRadice = new Array("", "拾", "佰", "仟");
  //对应整数部分扩展单位
  let cnIntUnits = new Array("", "万", "亿", "兆");
  //对应小数部分单位
  let cnDecUnits = new Array("角", "分", "毫", "厘");
  //整数金额时后面跟的字符
  let cnInteger = "整";
  //整型完以后的单位
  let cnIntLast = "元";
  //最大处理的数字,只处理两位小数点
  let maxNum = 999999999999999.99;
  //金额整数部分
  let integerNum;
  //金额小数部分
  let decimalNum;
  //输出的中文金额字符串
  let chineseStr = "";
  //分离金额后用的数组，预定义
  let parts;
  if (money == "") {
    return "";
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return "";
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf(".") == -1) {
    integerNum = money;
    decimalNum = "";
  } else {
    parts = money.split(".");
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    let IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != "") {
    let decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1);
      if (n != "0") {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == "") {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == "") {
    chineseStr += cnInteger;
  }
  return chineseStr;
}

/*
 * 将数字格式化为金钱显示
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 * NFM(1234567.089, 2, ".", ",");//1,234,567.09
 * */
export function NFM(number, decimals, dec_point, thousands_sep) {
  number = (number + "").replace(/[^0-9+-Ee.]/g, "");
  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    FM = "",
    toFixedFix = function (n, prec) {
      let k = Math.pow(10, prec);
      return "" + Math.ceil(n * k) / k;
    };

  FM = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  let res = /(-?\d+)(\d{3})/;
  while (res.test(FM[0])) {
    FM[0] = FM[0].replace(res, "$1" + sep + "$2");
  }

  if ((FM[1] || "").length < prec) {
    FM[1] = FM[1] || "";
    FM[1] += new Array(prec - FM[1].length + 1).join("0");
  }
  return FM.join(dec);
}

export function OnlyID(n) {
  n = 1; // 生成一个唯一id，包含数字和字母
  var random = function () {
    // 生成10-12位不等的字符串
    return Number(Math.random().toString().substr(2)).toString(36); // 转换成十六进制
  };
  var arr = [];
  function createId() {
    var num = random();
    var _bool = false;
    arr.forEach((v) => {
      if (v === num) _bool = true;
    });
    if (_bool) {
      createId();
    } else {
      arr.push(num);
    }
  }
  var i = 0;
  while (i < n) {
    createId();
    i++;
  }
  return arr[0];
}
