import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import PersonalCenter from './views/PersonalCenter.vue'

import Organizational from './views/SystemSetup/organizational.vue'
import RoleManagement from './views/SystemSetup/roleManagement.vue'
import LogManagement from './views/SystemSetup/logManagement.vue'
import AuthorManagement from './views/SystemSetup/authorManagement.vue'
import UserForm from './views/SystemSetup/userForm.vue'

import Channelmanagement from './views/contentManagement/channelManagement.vue'
import Contentpublish from './views/contentManagement/contentpublish.vue'
import CommentManagement from './views/contentManagement/commentManagement.vue'
import HotSearchManagement from './views/contentManagement/hotSearchManagement.vue'
import Banner from './views/contentManagement/banner.vue'
import Graphicediting from './views/contentManagement/graphicediting.vue'
import Recommendedmanagement from './views/contentManagement/recommendedmanagement.vue'
import Recommendedbannermanagement from './views/contentManagement/recommendedbannermanagement.vue'

import CarbrandManagement from './views/CarManagement/carbrandManagement.vue'
import ScarSeriesManagement from './views/CarManagement/scarSeriesManagement.vue'
import AutomobileStructureManagement from './views/CarManagement/automobileStructureManagement.vue'
import CarTypeManagement from './views/CarManagement/carTypeManagement.vue'
import CarRecommend from './views/CarManagement/carRecommend.vue'
import StoreLocation from './views/CarManagement/storeLocation.vue'
import Map from './views/CarManagement/map.vue'

import CddrManagement from './views/365Management/addrManagement.vue'
import ContentReleaseManagement from './views/365Management/contentReleaseManagement.vue'

import PicDepository from './views/SourceManagement/picDepository.vue'
import VideoDepository from './views/SourceManagement/videoDepository.vue'
import LabelManagement from './views/SourceManagement/labelManagement.vue'

let routes = [
    {
        path: '/',
        component: Home,
        name: '系统设置',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/PersonalCenter', component: PersonalCenter, name: '个人信息'},
            { path: '/organizational', component: Organizational, name: '组织架构' },
            { path: '/roleManagement', component: RoleManagement, name: '角色管理' },
            { path: '/authorManagement', component: AuthorManagement, name: '作者管理' },
            { path: '/logManagement', component: LogManagement, name: '日志管理' },
            { path: '/userForm', component: UserForm, name: '用户表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '内容管理',
        iconCls: 'el-icon-edit',
        children: [
        		{ path: '/banner', component: Banner, name: '焦点图' },
            { path: '/channelManagement', component: Channelmanagement, name: '首页频道管理' },
            { path: '/graphicediting', component: Graphicediting, name: '图文编辑' },
            { path: '/contentpublish', component: Contentpublish, name: '内容发布管理' },
            { path: '/commentManagement', component: CommentManagement, name: '评论管理' },
            { path: '/recommendedmanagement', component: Recommendedmanagement, name :'推荐管理'},
            { path: '/recommendedbannermanagement', component: Recommendedbannermanagement, name :'推荐焦点图管理'},
            { path: '/hotSearchManagement', component: HotSearchManagement, name: '热门搜索管理' }
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '汽车管理',
        iconCls: 'el-icon-view',
        children: [
            { path: '/carbrandManagement', component: CarbrandManagement, name: '汽车品牌管理' },
            { path: '/scarSeriesManagement', component: ScarSeriesManagement, name: '汽车车系管理' },
            { path: '/automobileStructureManagement', component: AutomobileStructureManagement, name: '车身结构管理' },
            { path: '/carTypeManagement', component: CarTypeManagement, name: '汽车车款管理' },
            { path: '/storeLocation', component: StoreLocation, name: '门店位置' },
            { path: '/map', component: Map, name: '门店位置编辑' },
            { path: '/carRecommend', component: CarRecommend, name: '汽车推荐' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '365管理',
        iconCls: 'el-icon-star-off',
        children: [
            { path: '/addrManagement', component: CddrManagement, name: '地址管理' },
            { path: '/contentReleaseManagement', component: ContentReleaseManagement, name: '内容发布管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '素材管理',
        iconCls: 'el-icon-picture',//图标样式class
        children: [
            { path: '/picDepository', component: PicDepository, name: '图片库' },
            { path: '/videoDepository', component: VideoDepository, name: '视频库' },
            { path: '/labelManagement', component: LabelManagement, name: '标签管理' }
        ]
    },
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
    		path: '/PersonalCenter',
        component: PersonalCenter,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;