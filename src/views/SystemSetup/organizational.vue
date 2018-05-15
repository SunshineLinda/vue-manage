<template>
	<section>
		<!--头部工具条-->
		<el-col :span="6" class="toolbar" style="padding-bottom: 0px; border: 1px solid gainsboro;">
			<el-tree :data="data2" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false"
		      @node-drag-start="handleDragStart"
			  @node-drag-enter="handleDragEnter"
			  @node-drag-leave="handleDragLeave"
			  @node-drag-over="handleDragOver"
			  @node-drag-end="handleDragEnd"
			  @node-drop="handleDrop"
			  draggable
			  :allow-drop="allowDrop"
			  :allow-drag="allowDrag">
		      <span class="custom-tree-node" slot-scope="{ node, data }"style="width: 100%;">
		      	<span>{{ node.label }}</span>
		        <span style="float: right;">
		        		<el-button type="text" size="mini" @click="() => append(data)" sytle="">添加</el-button>
		            <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
		        </span>
		      </span>
		   </el-tree>
		</el-col>
		<!--列表-->
		<el-col :span="18">
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
					<el-form-item>
						<el-select v-model="value8" filterable placeholder="状态">
						    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="getUsers">搜索</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-table :data="users" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="index" label="ID" width="60">
				</el-table-column>
				<el-table-column prop="name" label="用户名" width="120">
				</el-table-column>
				<el-table-column prop="sex" label="员工编号" sortable width="120">
				</el-table-column>
				<el-table-column prop="age" label="员工姓名"  width="100">
				</el-table-column>
				<el-table-column prop="sex" label="所属部门" width="120">
				</el-table-column>
				<el-table-column prop="age" label="所属角色"  width="100" >
				</el-table-column>
				<el-table-column prop="sex" label="状态" width="120">
				</el-table-column>
				<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-button :disabled="this.sels.length===0">恢复</el-button>
				<el-button type="danger" :disabled="this.sels.length===0">禁用</el-button>
				<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			</el-col>
			<el-pagination
		      @current-change="handleCurrentChange"
		      :page-size="pagesize"
		      layout="prev, pager, next, jumper"
		      :total="total"
		      style="float: right;margin-top: 10px;">
		    </el-pagination>
		</el-col>
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="员工编号" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="员工姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属部门" prop="name">
					<el-select v-model="value8" filterable placeholder="所属部门">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="所属角色" prop="name">
					<el-select v-model="value8" filterable placeholder="所属角色">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					  </el-select>
				</el-form-item>
				<el-form-item  v-model="value8" filterable label="状态">
					<el-radio v-model="radio" label="1">正常</el-radio>
  					<el-radio v-model="radio" label="2">禁用</el-radio>
				</el-form-item>
				<el-form-item  v-model="value8" filterable label="是否作者">
					<el-radio v-model="radio" label="1">是</el-radio>
  					<el-radio v-model="radio" label="2">否</el-radio>
				</el-form-item>
				<el-form-item label="选择作者" prop="name">
					<el-select v-model="value8" filterable placeholder="选择作者">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					  </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑用户信息" v-model="editFormVisible" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="员工编号" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="员工姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属部门" prop="name">
					<el-select v-model="value8" filterable placeholder="所属部门">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="所属角色" prop="name">
					<el-select v-model="value8" filterable placeholder="所属角色">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					  </el-select>
				</el-form-item>
				<el-form-item  v-model="value8" filterable label="状态">
					<el-radio v-model="radio" label="1">正常</el-radio>
  					<el-radio v-model="radio" label="2">禁用</el-radio>
				</el-form-item>
				<el-form-item  v-model="value8" filterable label="是否作者">
					<el-radio v-model="radio" label="1">是</el-radio>
  					<el-radio v-model="radio" label="2">否</el-radio>
				</el-form-item>
				<el-form-item label="选择作者" prop="name">
					<el-select v-model="value8" filterable placeholder="选择作者">
					    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					  </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>

	
	
</template>

<script>
	import util from '../../common/js/util';
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	let id = 1000;
	export default {
		    data() {
      return {
      	filters: {
			name: ''
		},
      	users: [],
		sels: [],//列表选中列
		listLoading: false,
		total: 0,
		page: 1,
		pagesize:20,
		radio:1,
		addFormVisible: false,//新增界面是否显示
		addLoading: false,
		addFormRules: {
			name: [
				{ required: true, message: '请输入作者名称', trigger: 'blur' }
			]
		},
		//新增界面数据
		addForm: {
			name: '',
			birth: '',
			addr: ''
		},
		options: [{
		          value: '选项1',
		          label: '全部'
		        }, {
		          value: '选项2',
		          label: '禁用'
		        }, {
		          value: '选项3',
		          label: '正常'
		        }],
		        value8: '',
        data2: [{
          id: 1,
          label: '产品技术部',
          children: [{
            id: 4,
            label: '谭毅(总监)',
            children: [{
              id: 9,
              label: '林玲'
            }, {
              id: 10,
              label: '张金凤'
            }]
          }]
        }, {
          id: 2,
          label: '设计部',
          children: [{
            id: 5,
            label: '王圣元'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }, {
          id: 4,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }, {
          id: 5,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }, {
          id: 6,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }
        
        
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        editFormVisible: false,//编辑界面是否显示
		editLoading: false,
		editFormRules: {
			name: [
				{ required: true, message: '请输入频道名称', trigger: 'blur' }
			]
		},
		//编辑界面数据
		editForm: {
		},
	
      };
    },
    methods: {
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
//    getCheckedNodes() {
//      console.log(this.$refs.tree.getCheckedNodes());
//    },
//    getCheckedKeys() {
//      console.log(this.$refs.tree.getCheckedKeys());
//    },
//    setCheckedNodes() {
//      this.$refs.tree.setCheckedNodes([{
//        id: 5,
//        label: '二级 2-1'
//      }, {
//        id: 9,
//        label: '三级 1-1-1'
//      }]);
//    },
//    setCheckedKeys() {
//      this.$refs.tree.setCheckedKeys([3]);
//    },
//    resetChecked() {
//      this.$refs.tree.setCheckedKeys([]);
//    },
			
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
			handleEdit: function(){
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			selsChange: function (sels) {
				this.sels = sels;
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
			//树型控件
			append(data) {
		        const newChild = { id: id++, label: 'new', children: [] };
		        if (!data.children) {
		          this.$set(data, 'children', []);
		        }
		        data.children.push(newChild);
		      },
		
	      remove(node, data) {
	        const parent = node.parent;
	        const children = parent.data.children || parent.data;
	        const index = children.findIndex(d => d.id === data.id);
	        children.splice(index, 1);
	      },
	      handleDragStart(node, ev) {
	        console.log('drag start', node);
	      },
	      handleDragEnter(draggingNode, dropNode, ev) {
	        console.log('tree drag enter: ', dropNode.label);
	      },
	      handleDragLeave(draggingNode, dropNode, ev) {
	        console.log('tree drag leave: ', dropNode.label);
	      },
	      handleDragOver(draggingNode, dropNode, ev) {
	        console.log('tree drag over: ', dropNode.label);
	      },
	      handleDragEnd(draggingNode, dropNode, dropType, ev) {
	        console.log('tree drag end: ', dropNode && dropNode.label, dropType);
	      },
	      handleDrop(draggingNode, dropNode, dropType, ev) {
	        console.log('tree drop: ', dropNode.label, dropType);
	      },
	      allowDrop(draggingNode, dropNode) {
	        return dropNode.data.label !== '二级 3-1';
	      },
	      allowDrag(draggingNode) {
	        return draggingNode.data.label.indexOf('三级 3-1-1') === -1;
	      }
    },
    mounted() {
		this.getUsers();
	}
  };
</script>

<style>
</style>