/**
 *
 * @author:qiuye
 * @param 秋叶UI，
 * @param Version 1.0.1
 * @param VUE版本号 3.x
 * @param Time 2021-09-24
 * @param Email：yjk100@vip.qq.com
 * @param CopyRight qiuye
 *
 * */
import { app } from "../main";
import Alert from "./module/Alert";
import Msg from "./module/Msg";
import Open from "./module/Open";
import Table from "./module/Table";
import Page from "./module/page";
import "./css/qiuui.scss";
import "font-awesome/css/font-awesome.min.css";

//导出插件
export default function qiuui(app) {
  app.use(Alert);
  app.use(Msg);
  app.use(Open);
  app.use(Table);
  app.use(Page);
}

/**
 * @params title String
 * @params content String
 * @params okText String
 * @params okTextColor String
 * @params cancleText String
 * @params cancleTextColor String
 * @return promise
 */
export function qiuAlert(a, params) {
  const Alert = {};
  if (!params) {
    if (typeof a == "string") {
      Alert.content = a;
      return new Promise(() => {
        app.config.globalProperties.$qiuAlert({
          ...Alert,
        });
      }).catch(() => {});
    }
  } else {
    return new Promise(() => {
      params.content = a;
      app.config.globalProperties.$qiuAlert({
        ...params,
      });
    }).catch(() => {});
  }
}
export function qiuClose(a) {
  const close = document.getElementById(a);
  document.body.removeChild(close);
}

/**
 * @params title String
 * @params content String
 * @params time Number
 * @params skin String
 */
export function qiuMsg(a, params) {
  const Msg = {};
  if (!params) {
    if (typeof a == "string") {
      Msg.msg = a;
      Msg.info = true;
      return new Promise(() => {
        app.config.globalProperties.$qiuMsg({
          ...Msg,
        });
      }).catch(() => {});
    }
  } else {
    return new Promise(() => {
      params.msg = a;
      params.info = false;
      app.config.globalProperties.$qiuMsg({
        ...params,
      });
    }).catch(() => {});
  }
}

/**
 * @params title String
 * @params content String，Boolean
 * @params okText String
 * @params okTextColor String
 * @params cancleText String
 * @params cancleTextColor String
 * @return promise
 */
export function qiuOpen(params) {
  return new Promise(() => {
    app.config.globalProperties.$qiuOpen({
      ...params,
    });
  }).catch(() => {});
}

/**
 * @params elem String
 * @params content String，Boolean
 * @params okText String
 * @params okTextColor String
 * @params cancleText String
 * @params cancleTextColor String
 * @return promise
 */
export function qiuTable(params) {
  return new Promise(() => {
    app.config.globalProperties.$qiuTable({
      ...params,
    });
  }).catch(() => {});
}

/**
 * @params elem String
 * @params content String，Boolean
 * @params okText String
 * @params okTextColor String
 * @params cancleText String
 * @params cancleTextColor String
 * @return promise
 */
export function qiuPage(params) {
  return new Promise(() => {
    app.config.globalProperties.$qiuPage({
      ...params,
    });
  }).catch(() => {});
}
