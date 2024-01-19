import store from "@/store";
import moment from "moment";

export const weiToMbd = (wei) => {
  if (!wei) {
    return wei;
  }
  return Number(wei) / Math.pow(10, 8);
};

// Wallet address thumbnail display
export const omitAddress = (val) => {
  if (!val) {
    return val;
  }
  if (val.length <= 7) {
    return val;
  }
  const prefix = val.substring(0, 7);
  const suffix = val.substring(val.length - 5);
  return prefix + "..." + suffix;
};

export const omitTxHash = (val) => {
  if (!val) {
    return val;
  }
  if (val.length <= 7) {
    return val;
  }
  const prefix = val.substring(0, 10);
  const suffix = val.substring(val.length - 5);
  return prefix + "..." + suffix;
};

export const ipfsUri = (val) => {
  if (!val) {
    return val;
  }
  const index = val.lastIndexOf("/");
  return val.substring(index + 1);
};

// Format decimal places
export const decimalPlace2 = (val) => {
  return parseFloat((Math.floor(val * 100) / 100).toFixed(2)).toString();
};
export const decimalPlace3 = (val) => {
  return parseFloat((Math.floor(val * 1000) / 1000).toFixed(3)).toString();
};
export const decimalPlace4 = (val) => {
  return parseFloat((Math.floor(val * 10000) / 10000).toFixed(4)).toString();
};

export const decimalPlace8 = (val) => {
  return parseFloat(
    (Math.floor(val * 100000000) / 100000000).toFixed(8)
  ).toString();
};

export const array2String = (arr) => {
  if (arr && arr.length) {
    return arr.join(",");
  } else {
    return arr;
  }
};

export const arrayOne = (arr) => {
  if (arr && arr.length) {
    return arr[0];
  } else {
    return arr;
  }
};

export const arrayMax1 = (arr) => {
  if (arr && arr.length) {
    return arr.length > 1 ? arr[0] + "/..." : arr[0];
  } else {
    return arr;
  }
};

export const toLocalString = (num) => {
  if (!num) {
    return num;
  }
  return num.toString().replace(/\d+/, function (n) {
    return n.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  });
};

export const toFixedString = (x) => {
  if (!x) return x;
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var b = parseInt(x.toString().split("+")[1]);
    if (b > 20) {
      b -= 20;
      x /= Math.pow(10, b);
      x += new Array(b + 1).join("0");
    }
  }
  return x;
};

// 1699934223
export const stamp2Time = (timestamp) => {
  if (!timestamp) return "";
  return moment(timestamp * 1000).format("YYYY/MM/DD HH:mm:ss");
};

export const fee2Percent = (fee) => {
  if (!fee) return "";
  return (fee / 100).toFixed(2) + "%";
};

export const rate2Percent = (r) => {
  if (!r && r != 0) return "";
  if (r == "-") return "-";
  return (r >= 0 ? "+" : "") + (r * 100).toFixed(2) + "%";
};

export const sptType2Name = (type) => {
  if (!type) {
    return type;
  }
  switch (type) {
    case "0":
      return "BEP-20";
    case "1":
      return "BEP-721";
    case "2":
      return "BEP-1155";
    default:
      return type;
  }
};

function zeroPadding(num, length) {
  var len = num.toString().length;
  while (len < length) {
    num = "0" + num;
    len++;
  }
  return num;
}

export const zeroPadding2 = (num) => {
  return zeroPadding(num, 2);
};

export const readSecondsFormat = (seconds) => {
  if (!seconds) return "00:00:00";
  const d = moment.duration(seconds, "seconds");
  return (
    zeroPadding(d.hours(), 2) +
    ":" +
    zeroPadding(d.minutes(), 2) +
    ":" +
    zeroPadding(d.seconds(), 2)
  );
};

export const localTimeFormat = (date) => {
  if (store.state.common.language == "en") {
    moment.locale("en");
  } else {
    moment.locale("zh-hk");
  }
  return moment(date).format("LL");
};

//  秒数转化为时分秒
export const formatSeconds = (value) => {
  //  秒
  let second = parseInt(value);
  //  分
  let minute = 0;
  //  小时
  let hour = 0;
  //  天
  //  let day = 0
  //  如果秒数大于60，将秒数转换成整数
  if (second > 60) {
    //  获取分钟，除以60取整数，得到整数分钟
    minute = parseInt(second / 60);
    //  获取秒数，秒数取佘，得到整数秒数
    second = parseInt(second % 60);
    //  如果分钟大于60，将分钟转换成小时
    if (minute > 60) {
      //  获取小时，获取分钟除以60，得到整数小时
      hour = parseInt(minute / 60);
      //  获取小时后取佘的分，获取分钟除以60取佘的分
      minute = parseInt(minute % 60);
    }
  }
  if (hour > 0) {
    return (
      " " +
      parseInt(hour) +
      " Hour" +
      (minute > 0 ? " " + parseInt(minute) + " Min" : "")
    );
  }
  return " " + parseInt(minute) + " Min";
};

/** 截取字符串前n位 */
export const cutString = (str, len) => {
  if (str.length > len) {
    return str.substring(0, len) + "...";
  } else {
    return str;
  }
};

/** 根据语言返回不同的遮罩背景 */
export const maskByTheme = (theme) => {
  if (theme == "dark") {
    return "rgba(0, 0, 0, 0.3)";
  } else {
    return "rgba(0, 0, 0, 0.1)";
  }
};

/** 去除字符串末尾的零 */
export const removeEndZero = (str) => {
  if (!str) {
    return str;
  }
  if (str.indexOf(".") > -1) {
    return str.replace(/0+$/, "").replace(/\.$/, "");
  } else {
    return str;
  }
};
