<template>
	<section style="width:100%">
		<!--列表-->
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
				 <input type="checkbox" v-model='checked' v-on:click='checkedAll'> 全选
			</el-col>
			<el-col class="toolbar" :span="24" :data="picData">
				<div class="picList" v-for="(item,ind) in picData" :key="ind">
					<input type='checkbox' name='checkboxinput' class='input-checkbox checks' :checked="item.checked" disabled>
					<div class="picBox">
						<img :src="item.link" @click="getPic(item,ind)" alt="展示图" />
						<span class="del" @click="delImg(ind,item.rId)">删除</span>
					</div>
					<div class="picInfo">
						<p>{{item.rTag}}</p>
					</div>
				</div>
			</el-col>
			<el-col :span="24" class="toolbar">
				<el-button type="danger" @click="batchRemove" :disabled="this.selectArr.length===0">批量删除</el-button>
				<el-pagination
			      @current-change="handleCurrentChange"
			      :page-size="pagesize"
			      layout="prev, pager, next, jumper"
			      :total="total"
			      style="float: right;margin-top: 10px;">
			    </el-pagination>
		    </el-col>
		</el-col>
		<el-dialog append-to-body title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false">
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
	import util from '../common/js/util';
	import axios from 'axios';
	import Qs from 'qs';
	import {picSource,picSourceupload, delPic,removeUser, batchRemoveUser, editUser, addUser } from '../api/api';

	export default {
		name:'bydialog',
		props:[],
		//props:['list'],
			
//          picLink:item.link,
//          listType:Number,
//          index:Number,
//          length:Number,
//          list:Array,
//          industryIds:Array,
//          PromiseLists:Array,
//          PromiseListIndex:Array
      
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
			imgItem:[],
			checked:true,
		  	rId:"",
		  	picArr:[],
		  	picType:"",
		  	picData: [],
			sels: [],//列表选中列
			checkboxModel:[],
			selectArr:[],
			checke:false,
		    checked: false, //全选框
		    checkList: [],
			filelen:0,
			files:"",
			filters:{
				name:'',
			},
			listLoading: false,
			total: 0,
			page: 1,
			pagesize:30,
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
				
				}
		  };
	},
    methods: {
		checkedAll() {
            if(!event.currentTarget.checked) {
                this.selectArr = [];
            } else { //实现全选
                this.selectArr = [];
                this.picData.forEach((item, i) => {
                    this.selectArr.push(item.rId);
                });
            }
		},
        getPic(item,ind){
			let _mData =JSON.parse( JSON.stringify(this.picData));
				_mData[ind].checked = _mData[ind].checked ? false :'checked'
				this.picData = _mData;
				if(_mData[ind].checked) {
					this.imgItem.push(item.link)
				}else {
					var index = this.imgItem.indexOf(item.link);
					if (index > -1) {
						this.imgItem.splice(index, 1);
					}
				}
				this.$emit('childevent' , this.imgItem)
				this.$store.state.imgItem = this.imgItem;

        },
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
		batchRemove() {
			this.$confirm('确认删除该图片吗?', '提示', {
				type: 'warning'
			}).then(() => {
				let delInput=document.getElementsByName("checkboxinput");
				let arr=[];
				for(var i=0;i<delInput.length;i++){
					if(delInput[i].checked){
						arr.push(delInput[i].getAttribute("Value"));
						let para = { "ids":arr};
						let params = new URLSearchParams();
						params.append('ids',arr);
						delPic(params).then((res) => {
							this.listLoading = false;
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getData();
						});
					}
				}
			}).catch(() => {
//
			});
			
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		getData(){

			let mock = {
				"code":200,
				"msg":"",
				"result":{
					"endRow":25,
					"firstPage":1,
					"hasNextPage":false,
					"hasPreviousPage":false,
					"isFirstPage":true,
					"isLastPage":true,
					"lastPage":1,
					"list":[
						{
							"cTime":1526461590000,
							"link":"http://s.img.owlcar.com/20180516/1526461590615.png",
							"rId":186,
							"rTag":"3",
							"rType":1,
							"sysUserId":1
						},
						{
							"cTime":1526462939000,
							"link":"http://s.img.owlcar.com/20180516/1526462939682.png",
							"rId":190,
							"rTag":"嗯嗯",
							"rType":1,
							"sysUserId":1
						},
						{
							"cTime":1526462939000,
							"link":"http://s.img.owlcar.com/20180516/1526462939706.png",
							"rId":192,
							"rTag":"嗯嗯",
							"rType":1,
							"sysUserId":1
						},
						{
							"cTime":1526462939000,
							"link":"http://s.img.owlcar.com/20180516/1526462939728.png",
							"rId":194,
							"rTag":"嗯嗯",
							"rType":1,
							"sysUserId":1
						},
						{
							"cTime":1526462939000,
							"link":"http://s.img.owlcar.com/20180516/1526462939739.jpg",
							"rId":195,
							"rTag":"嗯嗯",
							"rType":1,
							"sysUserId":1
						},
						{
							"cTime":1526464276000,
							"link":"http://s.img.owlcar.com/20180516/1526464276524.jpg",
							"rId":196,
							"rTag":"333",
							"rType":1,
							"sysUserId":1
						}
					]
				}
			}	
		this.total = mock.result.total;
		this.picData = mock.result.list
		this.picData.map((i,v)=>{
			i.checked = false;
		})
			// picSource(
			// 	{"pageNum":this.page,"pageSize":this.pagesize,"rType":1}
			// ).then(res => {
			// 	this.total = res.data.result.total;
			// 	this.picData=res.data.result.list;
				
			// })
		},
		fileImage(e){
			this.filelen= e.target.files.length; 
			this.files=e.target.files;
	},
		//新增
		addSubmit: function (tg) {
			console.log(this.filelen)
			let formData = new FormData(); 
			for (var i=0;i<this.filelen;i++) {
				formData.append('files',this.files[i]);
				
			}
			formData.append('rType', this.addForm.pictype);
			formData.append('rTag', this.addForm.piclabel);
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
							picSourceupload(formData,config).then((res)=>{
	//							console.log(res)
						 	this.addLoading = false;
						 	//NProgress.done();
						 	this.$message({
						 		message: '提交成功',
						 		type: 'success'
						 	});
						 	this.$refs['addForm'].resetFields();
						 	this.addFormVisible = false;
						 	this.getData();
						})
					});
				}
			});
		},
			//删除
		delImg(ind,v){
			this.$confirm('确认删除该图片吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				let arr=[];
				arr.push(v);
				let para = { "ids":arr};
			    let params = new URLSearchParams();
			    params.append('ids',arr);
				delPic(params).then((res) => {
					this.listLoading = false;
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getData();
				});
			}).catch(() => {
		//
			});
},
    },
	watch : {    
        selectArr(curVal){    
            if(curVal.length == this.picData.length){    
                this.checked = true    
            }else{    
                this.checked = false    
            }    
		} ,
		picData() {
			console.log('操作图片')
		}   
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
		width:8%;
		height:auto;
		float: left;
		padding-right:2%;
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
		.picInfo{
			p{
				line-height:36px;
				width:100%;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				color:grey;
			}
		}
		.picBox{
			width:100%;
			height:auto;
			position: relative;
			img{
				height:100%;
				width:100%;
				float: left;
			}
			.del{
				position: absolute;
				top:60px;
				right:0;
				font-size: 12px;
			}
		}
	}
	.clear:after{content:'';display:block;clear:both;height:0;overflow:hidden;visibility:hidden;}
</style>