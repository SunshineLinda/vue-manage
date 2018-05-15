<template>
	<section>
		<!--编辑界面-->
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="封面图" prop="logo">
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
				<el-form-item>
				    <Uediter :value="ueditor.value" :config="ueditor.config" ref="ue"></Uediter>
				    <input type="button" value="显示编辑器内容（从控制台查看）" @click="returnContent">
				</el-form-item>
				<el-form-item label="所属频道" prop="channel">
				    <el-checkbox-group v-model="checkboxGroup1">
				        <el-checkbox-button v-for="city in channels" :label="city" :key="city">{{city}}</el-checkbox-button>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="选择标签" prop="label">
				    <el-checkbox-group v-model="checkboxGroup1">
				        <el-checkbox-button v-for="city in labels" :label="city" :key="city">{{city}}</el-checkbox-button>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="创作类型" prop="type">
				    <el-select v-model="value8" filterable placeholder="创作类型">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="来源" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="关联车系" prop="bael">
				    <el-checkbox-group v-model="checkboxGroup1">
				        <el-checkbox-button v-for="city in labels" :label="city" :key="city">{{city}}</el-checkbox-button>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="相关内容" prop="bael">
				    <el-checkbox-group v-model="checkboxGroup1">
				        <el-checkbox-button v-for="city in labels" :label="city" :key="city">{{city}}</el-checkbox-button>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="发布时间" prop="bael">
				    <el-date-picker
				      v-model="value1"
				      type="datetime"
				      placeholder="选择日期时间">
				    </el-date-picker>
				    <el-checkbox v-model="checke">即时发布</el-checkbox>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">保存草稿</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">预览</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">发布</el-button>
			</div>
	</section>
</template>

<script>
	import Uediter from '@/components/ue.vue'
	const channelOptions = ['频道1', '频道2', '频道3', '频道4'];
	const labelOptions = ['标签1', '标签2', '标签3', '标签4'];
	export default{
		components: {Uediter},
		data() {
			return {
				imageUrl:"",
				value1:"",
				value8:"",
				checke:true,
				checkboxGroup1: ['频道1'],
		        channels: channelOptions,
		        checkboxGroup1: ['频道1'],
		        labels: labelOptions,
		        options: [{
		          value: '选项1',
		          label: '全部'
		        }, {
		          value: '选项2',
		          label: '原创'
		        }, {
		          value: '选项3',
		          label: '转载'
		        }],
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
				//编辑器
				dat: {
		          content: ''
		        },
		        ueditor: {
		          value: 'hello,',
		          config: {}
		        },
			}
		},
		methods:{
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
			//编辑器
			returnContent(){
		        this.dat.content = this.$refs.ue.getUEContent()
		    },
		    handleAvatarSuccess:function(){
		    	
		    },
		    beforeAvatarUpload:function(){
		    	
		    }
		}
	}
	



</script>

