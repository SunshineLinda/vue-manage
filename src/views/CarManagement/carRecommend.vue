<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="关键词"></el-input>
				</el-form-item>
				<el-select v-model="value8" filterable placeholder="品牌名">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>	
				<el-form-item>
					<el-select v-model="value8" filterable placeholder="系列名">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>	
				</el-form-item>
				<el-form-item>
					<el-select v-model="value8" filterable placeholder="状态">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>	
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
			<el-table-column type="index" label="排序" width="60">
			</el-table-column>
			<el-table-column prop="name" label="品牌名" width="120">
			</el-table-column>
			<el-table-column prop="sex" label="系列名" width="100">
			</el-table-column>
			<el-table-column prop="sex" label="车款名" width="100">
			</el-table-column>
			<el-table-column prop="age" label="状态" width="120">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button :disabled="this.sels.length===0">上架</el-button>
			<el-button type="danger" :disabled="this.sels.length===0">下架</el-button>
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page.sync="currentPage3"
		      :page-size="pagesize"
		      layout="prev, pager, next, jumper"
		      :total="total"
		      style="float: right;">
		    </el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="品牌名" prop="brand">
					<el-select v-model="value8" filterable placeholder="品牌">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="系列名" prop="name">
					<el-select v-model="value8" filterable placeholder="系列">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车身结构" prop="name">
					<el-select v-model="value8" filterable placeholder="车身结构">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车款" prop="name">
					<el-select v-model="value8" filterable placeholder="车款">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="图标" prop="logo">
					<el-upload
					  class="avatar-uploader"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="imageUrl" :src="imageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<!--<el-input v-model="editForm.headImg" auto-complete="off"></el-input>-->
				</el-form-item>
				<el-form-item label="状态" prop="price">
					<el-radio v-model="status" label="1">上架</el-radio>
  					<el-radio v-model="status" label="2">下架</el-radio>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
			    <el-form-item label="品牌名" prop="brand">
					<el-select v-model="value8" filterable placeholder="品牌">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="系列名" prop="name">
					<el-select v-model="value8" filterable placeholder="系列">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车身结构" prop="name">
					<el-select v-model="value8" filterable placeholder="车身结构">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车款" prop="name">
					<el-select v-model="value8" filterable placeholder="车款">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="图标" prop="logo">
					<el-upload
					  class="avatar-uploader"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="imageUrl" :src="imageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<!--<el-input v-model="editForm.headImg" auto-complete="off"></el-input>-->
				</el-form-item>
				<el-form-item label="状态" prop="price">
					<el-radio v-model="status" label="1">上架</el-radio>
  					<el-radio v-model="status" label="2">下架</el-radio>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

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
				listLoading: false,
				total:0,
				page:1,
				pagesize:20,
				radio: '1',
				status:"1",
				sels: [],//列表选中列
				options: [{
		          value: '选项1',
		          label: '全部'
		        }, {
		          value: '选项2',
		          label: '上架'
		        }, {
		          value: '选项3',
		          label: '下架'
		        }],
		        value8: '',
		        editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入作者名称', trigger: 'blur' }
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

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入作者名称', trigger: 'blur' }
					]
				},
				IntroduceFormVisible:false,//说明书编辑是否显示
				IntroduceForm:[],
				IntroduceFormRules:[],
				//新增界面数据
				addForm: {
					name: '',
					birth: '',
					addr: ''
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
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
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示说明书编辑界面
			handleIntroduceEdit: function (index, row) {
				this.IntroduceFormVisible = true;
//				this.IntroduceForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
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
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			handleDel(){
				
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
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
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style>
</style>