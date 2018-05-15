<template>
	<el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" :close-on-click-modal="false">
		<el-col class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
			<!--编辑界面-->
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="关键词"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-checkbox v-model="checke">仅显示我的图片</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		<!--列表-->
			<el-col class="toolbar">
				<el-button @click="" size="small">全选</el-button>
				<el-button size="small" @click="">禁用</el-button>
				<el-button size="small" @click="">禁用</el-button> 
			</el-col>
			<el-col class="toolbar " :data="picData">
				<el-col class="imgDiv" :span="6" v-for="item in picData" >
					<img :src="item.link" v-model="item.rId" alt="展示图" />
					<el-checkbox-group v-model="checkList">
				    <el-checkbox label=""></el-checkbox>
				  </el-checkbox-group>
				  <el-col class="operation clear">
					<el-col class="del"  @click.native="delImg">删除</el-col>
				  </el-col>
					
				</el-col>
				<el-col class="toolbar">
						<el-col>图片名称</el-col>
						<el-col>发布人</el-col>
						 <el-checkbox label="加水印"></el-checkbox>
					</el-col>
			</el-col>
			<el-col :span="24" class="toolbar">
				<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
				<el-pagination
			      @current-change="handleCurrentChange"
			      :page-size="pagesize"
			      layout="prev, pager, next, jumper"
			      :total="total"
			      style="float: right;margin-top: 10px;">
			    </el-pagination>
		    </el-col>
		</el-col>
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false" append-to-body>
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item prop="files" id="uploadForm">
					<input 
						type="file"
						multiple
						@change="fileImage"
					/>
				</el-form-item>
				<el-form-item prop="pictype">
					<el-select v-model="addForm.pictype" placeholder="请选择图片类型">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="piclabel">
					<el-input placeholder="label" v-model="addForm.piclabel"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</el-dialog>
</template>

<script>
	import util from '../../common/js/util';
	import axios from 'axios';
	import { getUserListPage,picSource,picSourceupload, delPic,removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	
	export default {
		    data() {
      return {
      	options:[{
      		value:"1",
      		label:"图片"
      	},{
      		value:"2",
      		label:"视频"
      	}
      		
      	],
      	rId:"",
      	picType:"",
      	filedata:"",
      	picData: [],
		sels: [],//列表选中列
		checkList:[],
		filters:{
			name:'',
		},
		listLoading: false,
		total: 0,
		page: 1,
		pagesize:20,
		checke:true,
		addForm:{
			files:"",
      		pictype:"",
      		piclabel:"",
      	},
      	addLoading:false,
      	addFormVisible:false,
      	addFormRules:{
//    		files:[{required: true, message: '请选择选择图片', trigger: 'change'}],
      		pictype:[
				{ required: true, message: '请输入选择图片分类', trigger: 'change' }
			],
      		piclabel:[
				{ required: true, message: '请输入标签名称', trigger: 'blur' }
			]
			
			},
//      handleAdd:function(){
////			this.addFormVisible = true;
//			this.addForm = {
//				name: '',
//				sex: -1,
//				age: 0,
//				birth: '',
//				addr: ''
//			};
//		}
      };
    },
    methods: {
		handleRemove(file, fileList) {
			console.log(1)
	        console.log(file, fileList);
	    },
	    handlePreview(file) {
	        console.log(file);
//	        this.$refs.upload.clearFiles();
	    },
	    tirggerFile(event){
	    		var file = event.target.files; // (利用console.log输出看结构就知道如何处理档案资料)
	    		console.log(file)
	    },
		handleCurrentChange(val) {
			this.page = val;
			this.getUsers();
		},
		//显示新增界面
		handleAdd() {
			this.addFormVisible = true;
			this.addForm = {
				piclabel:"",
				pictype:"",
			};
		},
		fileImage(e){
			let len = e.target.files.length;
			let formData = new FormData;  
			for(var i=0;i<len;i++){
				formData.append('files',e.target.files[i]); 
			}
	        formData.append('rType', '1');
	        formData.append('rTag', 'cc');
	        console.log((e.target.files).length)
                let config = {  
                    'Content-Type': 'multipart/form-data'  
                }  
                let var_this = this;  
                axios.post('http://47.104.208.252/spi/resourceLib/add', formData, config)  
                    .then(function(response) {  
                    this.getData()
//                      if (!response.data.success) {  
//                          var_this.$message({  
//                              message: response.data.message,  
//                              type: 'error'  
//                          });  
//                      }  
                    })  
                    .catch(function(error) {  
//                      console.log(error);  
                    })  

//			var that=this;
            let file =e.target.files[0];
            console.log(file)
        		for(var i=0;i<file.length;i++){
            		let imgSize=file[i].size/1024;
            		if(imgSize>500){
            			alert('请上传大小不超过500KB的图片')
            		}else{
            			this.filedata=file;
            		}
        		}
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
					console.log(res);
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
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
			selsChange: function (sels) {
				this.sels = sels;
			},
			getData(){
				picSource(
					{"pageNum":this.page,"pageSize":this.pagesize,"rType":1}
				).then(res => {
					this.total = res.data.total;
					this.picData=res.data.result.list;
				})
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							console.log(this.filedata)
//							let para = Object.assign({}, this.addForm);
							let config = {  
							                    'Content-Type': 'multipart/form-data'  
							                }  
							picSourceupload({
								"rType":this.addForm.pictype,"files":this.filedata,"rTag":this.addForm.piclabel
							}).then((res) => {
								console.log(res)
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getData();
							});
						});
					}
				});
			},
			//删除
			delImg(){
				console.log(1)
				console.log(this.item.rId)
				this.$confirm('确认删除该图片吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					console.log(this.item.rId)
//					let para = { "rId":this.item.rId };
//					delPic(para).then((res) => {
//						this.listLoading = false;
//						//NProgress.done();
//						this.$message({
//							message: '删除成功',
//							type: 'success'
//						});
//						this.getUsers();
//					});
				}).catch(() => {

				});
			},
    },
    created(){
    		this.getData();
    },
    mounted() {
//		this.getUsers();
	}
  };
</script>

<style>
</style>