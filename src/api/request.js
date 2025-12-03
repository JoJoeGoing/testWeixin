import axios from "axios";

const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 20000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  }
});

export default service;
