<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
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
			<el-table-column prop="pic" label="logo" width="100">
				<template slot-scope="scope">
			        <img  :src="scope.row.pic" alt="" style="width:100%;height:100%">
			    </template>
			</el-table-column>
			<el-table-column prop="age" label="状态" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.state==1">启用</span>
					<span v-if="scope.row.state==0">停用</span>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button :disabled="this.sels.length===0">启用</el-button>
			<el-button type="danger" :disabled="this.sels.length===0">停用</el-button>
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination
		      @current-change="handleCurrentChange"
		      :page-size="pagesize"
		      layout="prev, pager, next, jumper"
		      :total="total"
		      style="float: right;">
		   </el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="品牌名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="logo" prop="logo">
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
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-dialog  width="100%" :visible.sync="innerVisible" append-to-body>
		   	  <Bydialog v-on:listen="formChild" @childevent="childEventHandler"></Bydialog>
		    </el-dialog>
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="品牌名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="首字母" prop="letter">
					<el-input v-model="addForm.letter" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="logo" prop="logo">
					<p @click="innerVisible = true">+</p>
					<img :src="item" alt="" v-for="item in imglist" :key="item" style="width:50px;height:50px">
				</el-form-item>
				<el-form-item label="状态" prop="state">
					<el-select v-model="state" filterable placeholder="状态">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<!--<el-input v-model="addForm.state" auto-complete="off"></el-input>-->
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
	import Bydialog from '../../components/dialog.vue'
	//import NProgress from 'nprogress'

	import { getUserListPage,carBrand} from '../../api/api';
	export default {
		components: {Bydialog},
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				imglist:[],
				listLoading: false,
				total:0,
				page:1,
				pagesize:20,
				radio: '1',
				imageUrl:'',
				sels: [],//列表选中列
				options: [{
		          value: '1',
		          label: '启用'
		        }, {
		          value: '0',
		          label: '禁用'
		        }],
		        state: '',
		        editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入品牌名称', trigger: 'blur' }
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
				innerVisible:false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入品牌名称', trigger: 'blur' }
					],
					letter: [
						{ required: true, message: '请输入品牌首字母', trigger: 'blur' }
					],
					state:[{
						required:true, message:'请选择品牌状态', trigger: 'change'}
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					letter: '',
					state: ''
				}
			}
		},
		watch: {
			imglist() {
				console.log(this.imglist)
			}
		},
		methods: {
			childEventHandler () {
				this.imglist = this.$store.state.imgItem
			},
			onSubmit() {
				console.log('submit!');
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCarBrandList();
				
			},
			formChild(d){
				console.log(d)	
			},
			//获取用户列表
			getCarBrandList() {
				let para = {
					pageNum: this.page,
					pageSize: this.pagesize,
				};
				this.listLoading = true;
				//NProgress.start();
				setTimeout(()=>{
					this.listLoading = false;
				},2000)
				carBrand(para).then((res) => {
					this.total = res.data.result.total;
					this.users = res.data.result.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
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
			},
			handleAvatarSuccess:function(){
				
			},
			beforeAvatarUpload:function(){
				
			}
		},
		created(){
			this.getCarBrandList();
		},
		mounted() {
			
		}
	}

</script>

<style>
</style>