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
					<el-input v-model="filters.name" placeholder="ID"></el-input>
				</el-form-item>
				<el-form-item prop="brandName">
					<el-select v-model="filters.brandName" filterable placeholder="品牌名">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="seriesName">
					<el-select v-model="filters.seriesName" filterable placeholder="品牌名">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="structureName">
					<el-input v-model="filters.structureName" placeholder="结构名"></el-input>
				</el-form-item>
				<el-form-item prop="status">
					<el-select v-model="filters.status" filterable placeholder="状态">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<!--<el-form-item prop="status">
					<el-select :model="filters.status" filterable placeholder="状态">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>-->
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
			<el-table-column prop="brandname" label="品牌名" width="120">
			</el-table-column>
			<el-table-column prop="serisename" label="系列名" width="100">
			</el-table-column>
			<el-table-column prop="structure" label="车身结构" width="200">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="100">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="handleIntroduceEdit(scope.$index, scope.row)">编辑说明书</el-button>
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
				<el-form-item label="品牌名" prop="brandname">
					<el-col :span="8">
						<el-select v-model="editForm.brandname" filterable placeholder="品牌">
						    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-col>
				</el-form-item>
				<el-form-item label="系列名" prop="serisename">
					<el-col :span="8">
						<el-select v-model="editForm.serisename" filterable placeholder="系列名">
						    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-col>
				</el-form-item>
				<el-form-item label="车身结构" prop="structure">
					<el-col :span="8">
						<el-input v-model="editForm.structure" auto-complete="off"></el-input>
					</el-col>
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
				<el-form-item label="长" prop="length">
					<el-col :span="4">
						<el-input v-model="editForm.length" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="2" style="text-align: center;">
						mm
					</el-col>
				</el-form-item>
				<el-form-item label="宽" prop="width">
					<el-col :span="4">
						<el-input v-model="editForm.width" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="2" style="text-align: center;">
						mm
					</el-col>
				</el-form-item>
				<el-form-item label="高" prop="height">
					<el-col :span="4">
						<el-input v-model="editForm.height" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="2" style="text-align: center;">
						mm
					</el-col>
				</el-form-item>
				<el-form-item label="轴距" prop="wheelbase">
					<el-col :span="4">
						<el-input v-model="editForm.wheelbase" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="2" style="text-align: center;">
						mm
					</el-col>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancel">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
			    <el-form-item label="品牌名" prop="brandname">
			    		<el-col :span="8">
			    			<el-select v-model="addForm.brandname" filterable placeholder="品牌名">
						    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
			    		</el-col>
				</el-form-item>
				<el-form-item label="系列名" prop="serisename">
					<el-col :span="8">
						<el-select v-model="addForm.serisename" filterable placeholder="系列名">
						    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-col>
				</el-form-item>
				<el-form-item label="车身结构" prop="structure">
					<el-col :span="8">
						<el-input v-model="addForm.structure" auto-complete="off"></el-input>
					</el-col>
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
				</el-form-item>
				<el-form-item label="长" prop="length">
					<el-col :span="4">
						<el-input v-model="addForm.length" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="2" style="text-align: center;">
						mm
					</el-col>
				</el-form-item>
				<el-form-item label="宽" prop="width">
					<el-col :span="4">
						<el-input v-model="addForm.width" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="2" style="text-align: center;">
						mm
					</el-col>
				</el-form-item>
				<el-form-item label="高" prop="height">
					<el-col :span="4">
						<el-input v-model="addForm.height" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="2" style="text-align: center;">
						mm
					</el-col>
				</el-form-item>
				<el-form-item label="轴距" prop="wheelbase">
					<el-col :span="4">
						<el-input v-model="addForm.wheelbase" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="2" style="text-align: center;">
						mm
					</el-col>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="cancel">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑说明书-->
		<el-dialog title="编辑说明书" v-model="IntroduceFormVisible" :visible.sync="IntroduceFormVisible" :close-on-click-modal="false">
			<el-form :model="IntroduceForm" label-width="80px" :rules="IntroduceFormRules" ref="IntroduceForm">
				<el-form-item label="品牌名" prop="brandname">
					<el-select v-model="IntroduceForm.brandname" filterable placeholder="品牌名">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="系列名" prop="serisename">
					<el-select v-model="IntroduceForm.serisename" filterable placeholder="系列名">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车身结构" prop="structure">
					<el-select v-model="IntroduceForm.structure" filterable placeholder="车身结构">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="区域" prop="erea">
					<el-select v-model="IntroduceForm.erea" filterable placeholder="区域">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="标题" prop="title">
					<el-input v-model="IntroduceForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="小图">
					<el-upload
					  class="avatar-uploader"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="imageUrl" :src="imageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="视频链接" prop="videoLink">
					<el-input v-model="IntroduceForm.videoLink" auto-complete="off"></el-input>
				</el-form-item>
					<!--<el-input v-model="editForm.headImg" auto-complete="off"></el-input>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancel">取消</el-button>
				<el-button type="primary" @click.native="introduceSubmit" :loading="editLoading">提交</el-button>
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
					name: '',
					seriesName:'',
					brandName:'',
					structureName:'',
					status:''
					
				},
				users: [],
				listLoading: false,
				total:0,
				page:1,
				pagesize:20,
				radio: '1',
				imageUrl:'',
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
					brandname: [
						{ required: true, message: '请输入品牌名', trigger: 'change' }
					],
					serisename: [
						{ required: true, message: '请输入系列名', trigger: 'change' }
					],
					structure: [
						{ required: true, message: '请输入车身结构', trigger: 'blur' }
					],
					length: [
						{ required: true, message: '请输入长度', trigger: 'blur' }
					],
					width: [
						{ required: true, message: '请输入宽度', trigger: 'blur' }
					],
					height: [
						{ required: true, message: '请输入高度', trigger: 'blur' }
					],
					wheelbase: [
						{ required: true, message: '请输入轴距', trigger: 'blur' }
					],
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
					brandname: [
						{ required: true, message: '请选择品牌名', trigger: 'change' }
					],
					serisename: [
						{ required: true, message: '请选择系列名', trigger: 'change' }
					],
					structure: [
						{ required: true, message: '请输入车身结构', trigger: 'blur' }
					],
					length: [
						{ required: true, message: '请输入长度', trigger: 'blur' }
					],
					width: [
						{ required: true, message: '请输入宽度', trigger: 'blur' }
					],
					height: [
						{ required: true, message: '请输入高度', trigger: 'blur' }
					],
					wheelbase: [
						{ required: true, message: '请输入轴距', trigger: 'blur' }
					],
				},
				IntroduceFormVisible:false,//说明书编辑是否显示
				IntroduceForm: {
					brandname:"",
					serisename:'',
					structure:'',
					title:'',
					erea:''
				},
				IntroduceFormRules:{
					brandname: [
						{ required: true, message: '请输入品牌名', trigger: 'change' }
					],
					serisename: [
						{ required: true, message: '请输入系列名', trigger: 'change' }
					],
					structure: [
						{ required: true, message: '请输入车身结构', trigger: 'change' }
					],
					erea: [
						{ required: true, message: '请输入区域', trigger: 'change' }
					],
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
				},
				//新增界面数据
				addForm: {
					brandname:'',
					serisename:'',
					structure:'',
					length:'',
					width:'',
					height:'',
					wheelbase:'',
				},
			}
		},
		methods: {
			onSubmit() {
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
				this.IntroduceForm = Object.assign({}, row);
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
			introduceSubmit: function(){
				this.$refs.IntroduceForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.IntroduceForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['IntroduceForm'].resetFields();
								this.IntroduceFormVisible = false;
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
			cancel:function(){
				if(this.addFormVisible ==true){
					
					this.addFormVisible = false;
					this.$refs['addForm'].resetFields();
					
				}else if(this.editFormVisible ==true){
					
					this.editFormVisible =false;
					this.$refs['editForm'].resetFields();
					
				}else if(this.IntroduceFormVisible ==true){
						this.IntroduceFormVisible =false;
						this.$refs['IntroduceForm'].resetFields();
				}
				
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
		mounted() {
			this.getUsers();
		}
	}

</script>

<style>
</style>