<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
				<!--<img src="../assets/WechatIMG1.jpeg" alt="logo" width="460" height="120"/>-->
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="gocenter">个人中心</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<el-menu 
					default-active="$route.path"
					background-color="#545c64"
					text-color="#fff"
					unique-opened 
					v-show="!collapsed"
					>
					<template v-for="(item,index) in routerData" v-if="!item.hidden">
					<el-submenu  :keys="item.name" :index="index+''" >
						<template slot="title" @click="handleselect(item.path)"><i :class="item.iconCls"></i>{{item.name}}</template>
						<template v-for="(child,ind) in item.children" >
							<el-menu-item-group v-if="!child.children">
								<el-menu-item :index="index+'-'+ind" @click="handleselect(child.path)">{{child.name}}</el-menu-item>
							</el-menu-item-group>
							<el-submenu :index="index+'-'+ind" v-else>
								<template slot="title">{{child.name}}</template>
								<template v-for="(j,_ind) in child.children">
									<el-menu-item :index="index+'-'+ind+'-'+_ind" @click="handleselect(j.path)">{{j.name}}</el-menu-item>
								</template>
							</el-submenu>
						</template>	

					</el-submenu>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in routerData" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				routerData : [
				{"name":"系统设置","iconCls": 'el-icon-setting',"path":"/","children":[
					{"name":"组织架构","path":"/organizational"},
					{"name":"角色管理","path":"/roleManagement"},
					{"name":"作者管理","path":"/authorManagement"},
					{"name":"日志管理","path":"/logManagement"},
					{"name":"用户表","path":"/userForm"}]
				},
				{"name":"内容管理","iconCls": 'el-icon-edit',"path":"/","children":[
					{"name":"焦点图","path":"/banner"},
					{"name":"首页频道管理","path":"/channelManagement"},
					{"name" :'推荐管理', "path": '/recommendedmanagement',},
           			{"name" :'推荐焦点图管理', "path": '/recommendedbannermanagement'},
					{"name":"内容发布管理","path":"/contentpublish"},
					{"name":"评论管理","path":"/commentManagement"},
					{"name":"热门搜索管理","path":"/hotSearchManagement"}]
				},
				{"name":"汽车管理","iconCls": 'el-icon-view',"path":"/","children":[
					{ "path": '/carbrandManagement',  "name": '汽车品牌管理' },
		            { "path": '/scarSeriesManagement', "name": '汽车车系管理' },
		            { "path": '/automobileStructureManagement', "name": '车身结构管理' },
		            { "path": '/carTypeManagement',  "name": '汽车车款管理' },
		            { "path": '/storeLocation',  "name": '门店位置' },
		            { "path": '/carRecommend', "name": '汽车推荐' }
					]
				},
				{"name":"365管理","iconCls": 'el-icon-star-off',"path":"/","children":[
					 { "path": '/addrManagement', "name": '地址管理' },
          			  { "path": '/contentReleaseManagement', "name": '内容发布管理' }
					]
				},
				{"name":"素材管理","iconCls": 'el-icon-picture',"path":"/","children":[
					{ "path": '/picDepository', "name": '图片库' },
		            { "path": '/videoDepository',  "name": '视频库' },
		            { "path": '/labelManagement',  "name": '标签管理' }
					]
				},
				
				],
				routerLink : '/PersonalCenter',
				sysName:'VUEADMIN',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				routes: this.$router.options.routes,
			}
		},
		watch:{
			routes(){
				var _item =this.$router.options.routes;
				var newItem = []
				for(var i in _item) {
					if(_item[i].path =="/"){
						newItem.push(_item[i])
					}
				}
				this.routes = newItem;
			}	
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a) {
				this.$router.push(a)
				
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
			//个人中心
			gocenter:function(){
				var _this = this;
				_this.$router.push('/PersonalCenter');
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			init() {
				var user = sessionStorage.getItem('user');
				if (user) {
					user = JSON.parse(user);
					this.sysUserName = user.name || '';
					this.sysUserAvatar = user.avatar || '';
				}
			}
		},
		mounted() {
			this.init();

		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
				overflow-y: scroll
			}
			 .menu-expanded::-webkit-scrollbar {/*滚动条整体样式*/
				width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
				height: 4px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
	.a{
		width: auto !important;
	}
	.loginImg{
		width: 160px!important;
		height: 40px;
	}
</style>