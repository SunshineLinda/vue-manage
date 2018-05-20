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
					<el-input v-model="filters.name" placeholder="文章ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="发布人"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="value8" filterable placeholder="创作类型">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="statusvalue" filterable placeholder="状态">
					    <el-option v-for="item in statusoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					  </el-select>
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
					<el-select v-model="value8" filterable placeholder="频道">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="value8" filterable placeholder="标签">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-checkbox v-model="checked">显示首页推荐内容</el-checkbox>
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
			<el-table-column prop="name" label="推荐排序" width="120" sortable>
			</el-table-column>
			<el-table-column prop="title" label="内容标题" width="200">
			</el-table-column>
			<el-table-column prop="sex" label="所属频道" width="200">
			</el-table-column>
			<el-table-column prop="age" label="标签" width="100">
			</el-table-column>
			<el-table-column prop="age" label="类型" width="100">
			</el-table-column>
			<el-table-column prop="age" label="创作类型" width="120">
			</el-table-column>
			<el-table-column prop="state" label="状态" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.state==1">启用</span>
					<span v-if="scope.row.state==0">停用</span>
				</template>
			</el-table-column>
			<el-table-column prop="age" label="发布时间" width="120">
			</el-table-column>
			<el-table-column prop="age" label="发布人" width="100">
			</el-table-column>
			<el-table-column label="操作" width="260">
				<template  slot-scope="scope">
					<el-button size="small" @click="handleIntroduceEdit(scope.$index, scope.row)">预览</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row,routerLink)">编辑</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">复制链接</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button :disabled="this.sels.length===0">上架</el-button>
			<el-button type="danger" :disabled="this.sels.length===0">下架</el-button>
			<el-button :disabled="this.sels.length===0">审核通过</el-button>
			<el-button type="danger" :disabled="this.sels.length===0">审核未通过</el-button>
			<el-button :disabled="this.sels.length===0">首页推荐</el-button>
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
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false" style="width:80%">
			<span v-for="(i,ind) in options" :key="ind" >
				<el-button @click="handleType(i)" >{{i.label}}</el-button>
			</span>
			<el-form :inline="true" label-width="80px">
				<el-form-item label="标题">
					<el-input placeholder="标题"></el-input>
				</el-form-item>
			</el-form>

			<div v-if="tabType=='1'">

					<el-dialog  width="100%" :visible.sync="innerVisible" append-to-body>
					<Bydialog @childevent="childEventHandler"></Bydialog>
					</el-dialog>
				<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
					<el-form-item label="内容">
						<el-input
							type="textarea"
							:rows="2"
							placeholder="不超过100个汉字(200个字符)"
							v-model="textarea">
						</el-input>
					</el-form-item>

					<el-form-item label="所属频道">
						<el-button type="primary" @click="checkpd">选择频道</el-button>
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
				</el-form>

			</div>
			<div v-else>

				视频
			</div>



			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
	import Uediter from '@/components/ue.vue'
	import util from '../../common/js/util'
	import Bydialog from '../../components/dialog.vue'
	//import NProgress from 'nprogress'
	import { article ,articleAdd,carModel,tagGroup} from '../../api/api';
	const channelOptions = ['频道1', '频道2', '频道3', '频道4'];
	const labelOptions = ['标签1', '标签2', '标签3', '标签4'];
	export default {
		components: {Bydialog},
		data() {
			return {
				filters: {
					name: ''
				},
				imglist:[],
				CarSeries:[],
				taglist:[],
				innerVisible:false,
				value8:'',
				routerLink : '/graphicediting',
				users: [],
				listLoading: false,
				total:0,
				page:1,
				pagesize:20,
				radio: '1',
				value1: '',
				value6: '',
				imageUrl:'',
				checked: true,
				checke:true,
				textarea:'',
				sels: [],//列表选中列
				options: [ {
		          value: '2',
		          label: '视频'
		        }, {
		          value: '1',
		          label: '文章'
				}],
				tabType: 1,	


		        bizType: '',
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
		        },{
		          value: '选项4',
		          label: '草稿'
		        },{
		          value: '选项5',
		          label: '待审'
		        },{
		          value: '选项6',
		          label: '未通过审核'
		        }],
		        checkboxGroup1: ['频道1'],
		        channels: channelOptions,
		        checkboxGroup1: ['频道1'],
		        labels: labelOptions,
				
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {

				},
				//新增界面数据
				addForm: {
					bizType: '',
					title: '',
					brief:'',
					posters:'',
					source:'',
					duration:'',
					videoUrl:'',
					vid:''
				},
				
			}
		},
		watch: {
			imglist() {}
		},
		methods: {
			beforeAvatarUpload() {},
			handleAvatarSuccess() {},

			handleType(item) {
				//alert(`${item.value}:: ${item.label}`)
				this.tabType = item.value;
			},
			checkpd()　{
				alert(`打开模态窗`)
			},
			//获取标签
			getTagGroup(){
				let para = {
					pageNum: this.page,
					pageSize: this.pagesize
				};
				this.listLoading = true;
				//NProgress.start();
				tagGroup(para).then((res) => {
					this.total = res.data.result.total;
					this.CarSeries = res.data.result.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//获取车系
			getAboutCarSerie(){
				let para = {
					pageNum: this.page,
					pageSize: this.pagesize
				};
				this.listLoading = true;
				//NProgress.start();
				carModel(para).then((res) => {
					this.total = res.data.result.total;
					this.CarSeries = res.data.result.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			onSubmit() {
				console.log('submit!');
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			childEventHandler () {
				let _list = this.$store.state.imgItem;
				this.imglist = [];
				if(_list.length < 1) return;
				for (const i in _list) {
					this.imglist.push(_list[i])
				}
			},
			//获取用户列表
			getUsers() {
				let para = {
					pageNum: this.page,
					pageSize: this.pagesize
				};
				this.listLoading = true;
				let params = new URLSearchParams();
				//NProgress.start();
				article(para).then((res) => {
					this.total = res.data.result.total;
					this.users = res.data.result.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//跳转编辑界面
			handleEdit: function (index, row,routerLink) {
				this.$router.push(routerLink);
//				this.editFormVisible = true;
//				this.editForm = Object.assign({}, row);
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
			//新增
			addSubmit: function () {
				console.log(this.addForm.bizType)
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							let params = new URLSearchParams();
							if(this.addForm.bizType==2){
								params.append("bizType",this.addForm.bizType)
								params.append("title",this.addForm.title)
								params.append("videoUrl",this.addForm.videoUrl)
								params.append("posters",this.imglist[0])
								params.append("source",this.addForm.source)
								params.append("duration",this.addForm.duration)
								params.append("vid",this.addForm.vid)
//								params.append("brief",this.addForm.brief)
							}
							
							articleAdd(params).then((res) => {
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
			
		},
		created(){
			this.getAboutCarSerie();
			this.getTagGroup();
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style>
</style>