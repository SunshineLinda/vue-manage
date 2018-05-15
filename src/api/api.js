import axios from 'axios';

//axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded';
let list = '/api';  //这个是代理到本地的 ，本地运行需要，打包之前置空
//																									


let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };
//export const picSource = params => {
//	return _fetch({url: list+'/spi/resourceLib/list',method: 'get', params :params  }).then(res => res);
//};
//export const picSourceupload = data => {
//	return _fetch({url: list+'/spi/resourceLib/add',method: 'post', data :data  }).then(res => res);
//};
export const picSource = params => { return axios.get(`${list}/spi/resourceLib/list`, { params: params }); };
export const picSourceupload = params => { return axios.post(`${list}/spi/resourceLib/add`, params).then(res => res.data); };
export const delPic = params => { return axios.post(`${list}/spi/resourceLib/del`, params).then(res => res.data); };
export const carBrand = params => { return axios.get(`${list}/spi/carBrand/list`, { params: params }); };
export const carModel = params => { return axios.get(`${list}/spi/carModel/list`, { params: params }); };
export const tagGroup = params => { return axios.get(`${list}/spi/tagGroup/list`, { params: params }); };