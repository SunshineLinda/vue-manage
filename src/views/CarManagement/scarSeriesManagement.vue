<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="value8" filterable placeholder="品牌名">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="系列名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="value8" filterable placeholder="状态">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getcarModelList">查询</el-button>
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
			<el-table-column prop="sex" label="系列名" width="100">
			</el-table-column>
			<el-table-column prop="price" label="指导价" width="100">
				
			</el-table-column>
			<el-table-column prop="state" label="状态" width="100">
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
				<el-form-item label="品牌" prop="brand">
					<el-select v-model="value8" filterable placeholder="品牌">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="系列名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="标语" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
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
				<el-form-item label="海报" prop="poster">
					<el-upload
					  class="avatar-uploader"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="imageUrl" :src="imageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<el-form-item label="价格" prop="name">
						<el-input v-model="editForm.name" auto-complete="off" width="60" :span="4"></el-input>
						<span>-</span>
						<el-input v-model="editForm.name" auto-complete="off" width="60" :span="4"></el-input>
					</el-form-item>
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
		   	  <Bydialog @childevent="childEventHandler"></Bydialog>
		    </el-dialog>
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="ID" prop="brandId">
			    		<el-col :span="9">
						<el-input v-model="addForm.brandId" auto-complete="off"></el-input>
					</el-col>
				    	<!--<el-col :span="9">
						<el-select v-model="value8" filterable placeholder="品牌">
						    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-col>-->
				</el-form-item>
			    <el-form-item label="品牌" prop="brandName">
			    		<el-col :span="9">
						<el-input v-model="addForm.brandName" auto-complete="off"></el-input>
					</el-col>
				    	<!--<el-col :span="9">
						<el-select v-model="value8" filterable placeholder="品牌">
						    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-col>-->
				</el-form-item>
				<el-form-item label="系列名" prop="seriesName">
					<el-col :span="9">
						<el-input v-model="addForm.seriesName" auto-complete="off"></el-input>
					</el-col>
					
				</el-form-item>
				<el-form-item label="标语" prop="slogan">
					<el-input v-model="addForm.slogan" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="图标" prop="logo">
					<p @click="innerVisible = true">+</p>
					<img :src="item" alt="" v-for="item in imglist" :key="item" style="width:50px;height:50px;padding-right:10px;">
					<!--<el-input v-model="editForm.headImg" auto-complete="off"></el-input>-->
				</el-form-item>
				<el-form-item label="海报" prop="poster">
					<p @click="innerVisible = true">+</p>
					<img :src="item" alt="" v-for="item in imglist" :key="item" style="width:50px;height:50px;padding-right:10px;">
				</el-form-item>
					<el-form-item label="价格" prop="">
						<el-col :span="5">
							<el-input v-model="addForm.downprice" auto-complete="off"></el-input>
						</el-col>
						<el-col class="line" :span="1" style="text-align: center;">-</el-col>
						<el-col :span="5">
							<el-input v-model="addForm.upprice" auto-complete="off"></el-input>
						</el-col>
						<el-col :span="1" style="text-align: center;">
							万 
						</el-col>
					</el-form-item>
					<el-form-item label="状态" prop="state">
						<el-select v-model="addForm.state" filterable placeholder="状态">
						    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<!--<el-input v-model="addForm.state" auto-complete="off"></el-input>-->
					</el-form-item>
					<!--<el-form-item label="价格" required>
    <el-col :span="5">
      <el-form-item prop="price">
        <el-input v-model="editForm.price" auto-complete="off"></el-input>
      </el-form-item>
    </el-col>
    <el-col class="line" :span="1" style="text-align: center;">-</el-col>
    <el-col :span="5">
      <el-form-item prop="price">
        <el-input v-model="editForm.price" auto-complete="off"></el-input>
      </el-form-item>
    </el-col>
  </el-form-item>-->
					<!--<el-input v-model="editForm.headImg" auto-complete="off"></el-input>-->
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
	import { carModel, carModelAdd} from '../../api/api';
	export default {
		components: {Bydialog},
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				imglist:[],
				innerVisible:false,
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
		        value8: '',
		        editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入车系名称', trigger: 'blur' }
					],
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
						{ required: true, message: '请输入车系名称', trigger: 'blur' }
					],
					brandId: [
						{ required: true, message: '请输入品牌名称', trigger: 'blur' }
					],
					slogan: [
						{ required: true, message: '请输入标语', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					],
					icon: [
						{ required: true, message: '请选择车系图标', trigger: 'change' }
					],
					posters: [
						{ required: true, message: '选择海报图片', trigger: 'change' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					brandId: '',
					state: '',
					price:'',
					slogan:'',
					icon:'',
					posters:''
				}
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
				this.getcarModelList();
			},
			//获取用户列表
			getcarModelList() {
				let para = {
					pageNum: this.page,
					pageSize: this.pagesize
				};
				this.listLoading = true;
				//NProgress.start();
				carModel(para).then((res) => {
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
					brandId: '',
					state: '',
					price:'',
					slogan:'',
					icon:'',
					posters:''
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
								this.getcarModelList();
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
							let params = new URLSearchParams();
							//NProgress.start();
//							let para = Object.assign({}, this.addForm);
							params.append("posters",'http://s.img.owlcar.com/20180516/1526462939739.jpg');
							params.append("state",this.addForm.state);
							params.append("price","20");
							params.append("brandId",this.addForm.brandId);
							params.append("slogan",this.addForm.slogan);
							params.append("icon",'http://s.img.owlcar.com/20180516/1526462939739.jpg');
							params.append("name",this.addForm.brandName);
							carModelAdd(params).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getcarModelList();
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
						this.getcarModelList();
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
			this.getcarModelList();
		}
	}

</script>

<style>
</style>