import axios from "axios";
import store from "../store/index";
import qs from 'qs'
import router from "../router";

export var BaseURL = "http://localhost:8888/api";
axios.defaults.headers.Authorization = `Bearer ${store.state.token}`;
// 添加响应拦截器
axios.interceptors.response.use(
    function (response) {
        // 对响应数据进行操作
        return response;
    },
    function (error) {
        // 对响应错误进行操作
        console.log(error.response.status);
        if (error.response.status == 401) {
            router.push({ name: "Login" });
        }
        return Promise.reject(error);
    }
);


export async function post(url, data, id) {
    var temp = qs.parse(data);
    var config = {
        method: "post",
        baseURL: BaseURL,
        headers: {
            Authorization: `Bearer ${store.state.token}`,
            //"Content-type": "application/json"

        },
    };
    if (id == 1) {
        config.headers = {
            Authorization: `Bearer ${store.state.token}`,
            "Content-Type": "multipart/form-data",
        };
        temp = data;
    }
    // qs.parse(data)
    let result = await axios.post(url, temp, config);
    return result;
}

export async function get(url, data) {
    let param = {
        baseURL: BaseURL,
        params: qs.stringify(data, { arrayFormat: 'repeat' }),
        method: "get",
    };

    let result = await axios.get(url, param);

    return result;
}