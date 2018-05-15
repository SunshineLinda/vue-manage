<template>
	<section>
<!--工具条-->
		<!--<el-col :span="6" class="toolbar">
			<el-button  :disabled="this.sels.length===0">恢复</el-button>
			<el-button type="danger"  :disabled="this.sels.length===0">禁用</el-button>
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>-->
		<!--列表-->
			<!--工具条-->
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
					<el-button type="primary" v-on:click="getData">查询</el-button>
				</el-form-item>
			</el-form>
		<!--列表-->
			<el-col class="toolbar">
				<el-button size="small">全选</el-button>
			</el-col>
			<el-col class="toolbar" :span="24" :data="picData">
				<div class="picList" v-for="(item,ind) in picData" :key="ind">
					<input type="checkbox" class="checks"/>
					<!--<el-checkbox-group v-model="checkList" class="checks">
				   		<el-checkbox label=""></el-checkbox>
				  	</el-checkbox-group>-->
					<div class="picBox">
						<img :src="item.link" alt="展示图" />
						<span class="del" @click="delImg(ind,item.rId)">删除</span>
					</div>
					<div class="picInfo">
						<p>图片名称</p>
						<p>发布人</p>
					</div>
				</div>
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
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false">
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
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import axios from 'axios';
	import {picSource,picSourceupload, delPic,removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	
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
		formData: [], 
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
		handleCurrentChange(val) {
			this.page = val;
			this.getData();
		},
		//显示新增界面
		handleAdd() {
			this.addFormVisible = true;
			this.addForm = {
				piclabel:"",
				pictype:"",
			};
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
					this.getData();
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
				this.total = res.data.result.total;
				this.picData=res.data.result.list;
				
			})
		},
		fileImage(e){
			let len= e.target.files.length; 
			for(var i=0;i<len;i++){
				this.formData.push(e.target.files[i])
			}
	        // formData.append('rType', '1');
	        // formData.append('rTag', 'cc');
	        // console.log((e.target.files).length)
	        //     let config = {  
            //     'Content-Type': 'multipart/form-data'  
            // }  
			// let var_this = this;
			console.log(this.formData)
//             axios.post('http://47.104.208.252/spi/resourceLib/add', formData, config)  
//                 .then((res) => {
//                 	this.getData()
// //                      if (!response.data.success) {  
// //                          var_this.$message({  
// //                              message: response.data.message,  
// //                              type: 'error'  
// //                          });  
// //                      }  
//                 })  
//                 .catch(function(error) {   
//                 })  
// 	        let file =e.target.files[0];
// 	    		for(var i=0;i<file.length;i++){
// 	        		let imgSize=file[i].size/1024;
// 	        		if(imgSize>500){
// 	        			alert('请上传大小不超过500KB的图片')
// 	        		}else{
// 	        			this.filedata=file;
// 	        		}
// 	    		}
	},
			//新增
	addSubmit: function () {
		let formData = new FormData(); 
		for (const i of this.formData) {
			formData.append('files',this.formData[i]);

			formData.append(`test${i}`, this.formData[i]);
			
		}
		formData.append('rType', '1');
		formData.append('rTag', 'cc');
		let config = {  
			'Content-Type': 'multipart/form-data'  
		}
		this.$refs.addForm.validate((valid) => {
			if (valid) {
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.addLoading = true;
//							let para = Object.assign({}, this.addForm);
					let config = {  
	                    'Content-Type': 'multipart/form-data'  
					} 
					console.log(formData.has('files')) //检测是否添加成功 
					axios.post('http://47.104.208.252/spi/resourceLib/add', formData, config) 
					// picSourceupload({
					// 	"rType":this.addForm.pictype,"files":this.filedata,"rTag":this.addForm.piclabel
					// }).then((res) => {
					// 	console.log(res)
					// 	this.addLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: '提交成功',
					// 		type: 'success'
					// 	});
					// 	this.$refs['addForm'].resetFields();
					// 	this.addFormVisible = false;
					// 	this.getData();
					// });
				});
			}
		});
	},
			//删除
	delImg(ind,v){
		this.$confirm('确认删除该图片吗?', '提示', {
			type: 'warning'
		}).then(() => {
			console.log(v)
			this.listLoading = true;
			let para = { "rId":v};
			delPic({"rId":v}).then((res) => {
				this.listLoading = false;
				this.$message({
					message: '删除成功',
					type: 'success'
				});
				this.getData();
			});
		}).catch(() => {

		});
	},
    },
    created(){
//  		this.getData();
    },
    mounted() {
		this.getData();
	}
  };
</script>

<style scoped lang="scss">
	.picList{
		width:20%;
		height:auto;
		float: left;
		padding-right:5%;
		position:relative;
		margin-bottom: 30px;
		.checks{
			position: absolute;
			left:0;
			top:0;
			z-index:11;
			width:20px;
			height:20px;
		}
		.addWaterMark{
			float:right;
		}
		
		.picBox{
			width:100%;
			height:200px;
			position: relative;
			img{
				height:100%;
				width:100%;
				float: left;
			}
			.del{
				position: absolute;
				bottom:0;
				right:0;
			}
		}
	}
	.clear:after{content:'';display:block;clear:both;height:0;overflow:hidden;visibility:hidden;}
</style>