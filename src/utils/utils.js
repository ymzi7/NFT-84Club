// 时间格式转化
const timestampToTime = function (timestamp) {
  var d = new Date(timestamp);
  let year = d.getFullYear() + "-";
  let M =
    (d.getMonth() + 1 < 10 ?
      "0" + (d.getMonth() + 1) :
      d.getMonth() + 1) + "-";
  //let day=d.getDate()+' '
  let day = (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + " ";
  let H = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ":";
  let mm =
    (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + ":";
  let ss = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
  return year + M + day + H + mm + ss
}
//  减法函数
const accSub = function (arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
//  获取token
const getToken =  function () {

   /*获取cookie参数*/
   var getCookie = document.cookie.replace(/[ ]/g, ""); //获取cookie，并且将获得的cookie格式化，去掉空格字符
   var arrCookie = getCookie.split(";") //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
   var tips ; //声明变量tips
   for (var i = 0; i < arrCookie.length; i++) { //使用for循环查找cookie中的tips变量
  
     var arr = arrCookie[i].split("="); //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
     if ("token" == arr[0]) { //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
       tips = arr[1]; //将cookie的值赋给变量tips
       return tips;
     }

   }
}
export {
  timestampToTime,
  accSub,
  getToken
}