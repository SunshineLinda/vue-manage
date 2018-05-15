<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="brandName" filterable placeholder="品牌名">
					    <el-option v-for="item in brandoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.coordinate" placeholder="坐标" id="lnglat"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.addr" placeholder="地址" id="tipinput"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<div id="container" class="mymap"></div>
	</section>
</template>

<script>
//	import AMap from 'AMap';   //在页面中引入高德地图
	export default{
		data(){
			return{
				filters:{
					name:"",
				},
				brandName:"",
				brandoptions:[{
				value: '选项1',
		          label: '全部'
		        }, {
		          value: '选项2',
		          label: '宝马'
		        }, {
		          value: '选项3',
		          label: '奥迪'
		        },{
		        	   value:"选项4",
		        	   label:"大众"
		        }],
			}
		},
		methods:{
			loadmap(){
		        const map = new AMap.Map('container', {
		          resizeEnable: true
		        });
		    }
		},
		mounted(){
//	       this.loadmap();     //加载地图和相关组件
	    },
	}
</script>

<style>
	.mymap{
      width:1200px;
      height:1000px;
    }
</style>