<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="用户名"></el-input>
				</el-form-item>
				<el-select v-model="value8" filterable placeholder="状态">
				    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				  </el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" label="ID" width="60">
			</el-table-column>
			<el-table-column prop="name" label="用户名" width="120">
			</el-table-column>
			<el-table-column prop="sex" label="手机号" width="100">
			</el-table-column>
			<el-table-column prop="age" label="用户登录方式" width="120">
			</el-table-column>
			<el-table-column prop="birth" label="上次登录时间" width="120">
			</el-table-column>
			<el-table-column prop="addr" label="注册时间" min-width="180">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">禁用</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">恢复</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="addr" label="状态" min-width="180">
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage } from '../../api/api';
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				options: [{
		          value: '选项1',
		          label: '全部'
		        }, {
		          value: '选项2',
		          label: '禁用'
		        }, {
		          value: '选项3',
		          label: '正常'
		        }],
		        value8: ''
			}
		},
		methods: {
			batchRemove(){},
			selsChange(){},
			onSubmit() {
				console.log('submit!');
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			handleEdit(){
				
			},
			handleDel(){
				
			},
		},
		mounted() {
			this.getUsers();
		}
	}

</script>