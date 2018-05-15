<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-select v-model="value8" filterable placeholder="品牌名">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="关键词"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="statusvalue" filterable placeholder="状态">
					    <el-option v-for="item in statusoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
			<el-table-column prop="name" label="品牌名" width="120">
			</el-table-column>
			<el-table-column prop="storeName" label="门店名称" width="100">
			</el-table-column>
			<el-table-column prop="location" label="门店地址" width="100">
			</el-table-column>
			<el-table-column prop="tel" label="电话" width="100">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="100">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row,routerLink)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button :disabled="this.sels.length===0">上架</el-button>
			<el-button type="danger" :disabled="this.sels.length===0">下架</el-button>
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination
		      @current-change="handleCurrentChange"
		      :page-size="pagesize"
		      layout="prev, pager, next, jumper"
		      :total="total"
		      style="float: right;">
		    </el-pagination>
		</el-col>
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
			    <el-form-item label="品牌" prop="brand">
					<el-select v-model="value8" filterable placeholder="品牌">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="坐标" prop="coordinate">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="addr">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
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
	export default{
		data(){
			return{
				routerLink:"/map",
				filters: {
					name: ''
				},
				users:[],
				sels:[],//列表选中列
				listLoading:false,
				page:1,
				total:0,
				pagesize:20,
				value8:"",
				options:[{
				value: '选项1',
		          label: '全部'
		        }, {
		          value: '选项2',
		          label: '宝马'
		        }, {
		          value: '选项3',
		          label: '奥迪'
		        },{
		        	   value:"选项4",
		        	   label:"大众"
		        }],
		        statusvalue:"",
		        statusoptions:[{
				value: '选项1',
		          label: '全部'
		        }, {
		          value: '选项2',
		          label: '上架'
		        }, {
		          value: '选项3',
		          label: '下架'
		        }],
		        addFormVisible:false,
		        addLoading: false,
				addFormRules: {
					brand: [
						{ required: true, message: '请输入品牌名称', trigger: 'blur' }
					],
					slogan: [
						{ required: true, message: '请输入标语', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					birth: '',
					addr: ''
				}
		        
			}
		},
		methods:{
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
			selsChange: function (sels) {
				this.sels = sels;
			},
			//跳转编辑界面
			handleEdit: function (index, row,routerLink){
				this.$router.push(routerLink);
//				this.editFormVisible = true;
//				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					addr: ''
				};
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
			},
		},
		mounted() {
			this.getUsers();
		}
	}
</script>

<style>
</style>