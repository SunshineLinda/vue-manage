<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form label-width="100px" style="width:300px;" v-model="labelPosition">
			  <el-form-item label="个人信息">
			  </el-form-item>
			  <el-form-item label="用户名" prop="username">
			     <el-input v-model="labelPosition.username" auto-complete="off" :disabled="true"></el-input>
			  </el-form-item>
			  <el-form-item label="所属角色" prop="role">
			     <el-input v-model="labelPosition.role" auto-complete="off" :disabled="true"></el-input>
			  </el-form-item>
			  <el-form-item label="所属组织" prop="organization">
			     <el-input v-model="labelPosition.organization" auto-complete="off" :disabled="true"></el-input>
			  </el-form-item>
			  <el-form-item label="绑定作者" prop="author">
			     <el-input v-model="labelPosition.author" auto-complete="off" :disabled="true"></el-input>
			  </el-form-item>
			</el-form>
		</el-col>
		<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" style="width: 300px;">
		  <el-form-item label="密码设置">
		  </el-form-item>
		  <el-form-item label="密码" prop="pass">
		     <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
		  </el-form-item>
		  <el-form-item label="确认密码" prop="checkPass">
		     <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
		  </el-form-item>
		  <el-form-item>
		     <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
		     <el-button @click="resetForm('ruleForm2')">重置</el-button>
		  </el-form-item>
		</el-form>
	</section>
	
</template>
<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
      	labelPosition:"",
        ruleForm2: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        labelPosition:{
       	 	username:"小明",
       	 	role:"打酱油",
       	 	organization:"后勤部",
       	 	author:"小小明",
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style>
</style>