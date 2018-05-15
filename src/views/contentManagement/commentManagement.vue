<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="文章ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="内容标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="评论人"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker
				      v-model="value6"
				      type="daterange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
			
		</el-col>
		
		<!--列表-->
		<el-table :data="users" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" label="ID" width="60">
			</el-table-column>
			<el-table-column prop="name" label="评论/回复内容" width="200">
			</el-table-column>
			<el-table-column prop="sex" label="评论/回复人" width="100">
			</el-table-column>
			<el-table-column prop="name" label="内容标题">
			</el-table-column>
			<el-table-column prop="name" label="类型">
			</el-table-column>
			<el-table-column prop="name" label="发布人">
			</el-table-column>
			<el-table-column prop="age" label="状态">
			</el-table-column>
			<el-table-column label="操作" width="400">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看历史</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button @click="" :disabled="this.sels.length===0">审核通过</el-button>
			<el-button type="danger" @click="" :disabled="this.sels.length===0">审核未通过</el-button>
			<el-pagination
			  @current-change="handleCurrentChange"
		      :page-size="pagesize"
		      layout="prev, pager, next, jumper"
		      :total="total"
		      style="float: right;">
		    </el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="历史对话" v-model="editFormVisible" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<span>这是一段信息</span>
				<p>回复内容回复回复稻盛和夫 i 额福额未婚夫我非 i 未婚夫额外和 i记得回复我哈额 u 我很负IE我</p>
				<span>这是一段信息</span>
				<p>回复内容回复回复稻盛和夫 i 额福额未婚夫我非 i 未婚夫额外和 i记得回复我哈额 u 我很负IE我</p>
				<span>这是一段信息</span>
				<p>回复内容回复回复稻盛和夫 i 额福额未婚夫我非 i 未婚夫额外和 i记得回复我哈额 u 我很负IE我</p>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">确认</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				radio: '1',
				total: 0,
				page: 1,
				pagesize:20,
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
		        value8: '',
				value6:"",
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入频道名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

			}
		},
		methods: {
			//分页
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
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
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该频道吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>