<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">搜索</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" border style="width: 100%;">
				<el-table-column type="selection" width="60">
				</el-table-column>
				<el-table-column type="index" label="ID" width="60">
				</el-table-column>
				<el-table-column prop="name" label="用户名" width="120">
				</el-table-column>
				<el-table-column prop="organization" label="所属组织" width="120">
				</el-table-column>
				<el-table-column prop="age" label="操作模块" width="120">
				</el-table-column>
				<el-table-column prop="birth" label="操作功能" width="180">
				</el-table-column>
				<el-table-column prop="addr" label="操作时间" min-width="180">
				</el-table-column>
			</el-table>
			<!--工具条-->
			<!--<el-col class="toolbar">
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
				</el-pagination>
			</el-col>-->
			   <el-pagination
		      @current-change="handleCurrentChange"
		      :page-size="pagesize"
		      layout="prev, pager, next, jumper"
		      :total="total"
		      style="float: right;margin-top: 10px;">
		    </el-pagination>
		</template>

	</section>
</template>
<script>
	import util from '../../common/js/util'
	import { getUserList ,getUserListPage} from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				currentPage4:1,
				pagesize:20,
				listLoading: false,
				sels: [],//列表选中列
				pageSizes :[20, 40, 60, 80]
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUser();
			},
			handleSizeChange(val) {
		        this.pagesize=20
		     },
			//获取用户列表
			getUser() {
				console.log(this.page)
				console.log(this.filters.name)
				let para = {
					page: this.page,
					name: this.filters.name,
					
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					console.log(res);
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			
		},
		mounted() {
			this.getUser();
		}
	};

</script>

<style scoped>
	.block{
		margin-top:20px;
		text-align: right;
	}
</style>