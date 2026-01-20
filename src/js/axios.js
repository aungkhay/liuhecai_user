import axios from "axios";

let BASEURL = '/';
let API = axios.create({
    baseURL: BASEURL,
    timeout: 20000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
});

API.interceptors.response.use(
    response => {
        var res = response.data;
        return Promise.resolve(res);
    },
    error => {
        console.log(error);
        return Promise.resolve(error);
    }
);

export default API