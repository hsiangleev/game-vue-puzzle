<template>
	<div id="drawBackground" @mousedown="move" ref="draw">
		<canvas width="800" height="600" ref="ctx"></canvas>
	</div>
</template>

<script>
export default {
	name: 'drawBackground',
	props: ["initData"],
	data () {
		return {
			ctx: "",
			orginArr: [],
			oWidth: 0,
			oHeight: 0,
		}
	},
	computed: {
		partWidth() {
			return this.oWidth/this.initData.x;
		},
		partHeight() {
			return this.oHeight/this.initData.y;
		},
	},
	mounted() {
		this.init();
		this.draw();
	},
	methods: {
		init() {
			this.ctx=this.$refs["ctx"].getContext("2d");
			// 获取画布宽高
			this.oWidth=this.$refs["ctx"].width;
			this.oHeight=this.$refs["ctx"].height;
			// 初始化坐标
			for(var i=0;i<this.initData.x;i++){
				for(var j=0;j<this.initData.y;j++){
					this.orginArr.push([i,j]);
					this.$store.state.randomArr.push([i,j]);
				}
			}	
			this.random(this.$store.state.randomArr);
		},
		random(arr) {
			arr.sort(()=>{
				return Math.random()-0.5;
			})
		},
		draw() {
			this.ctx.clearRect(0,0,this.oWidth,this.oHeight);
			var img=new Image();
			img.src=this.initData.imgUrl;
			// 初始化画布
			img.onload=()=>{
				this.$store.state.randomArr.forEach((value,i)=>{
					this.ctx.drawImage(img,
						value[0]*this.partWidth,value[1]*this.partHeight,
						this.partWidth,this.partHeight,
						this.orginArr[i][0]*this.partWidth,this.orginArr[i][1]*this.partHeight,
						this.partWidth,this.partHeight
					)
				})
			}
		},
		move() {
			var e=window.event || event;
			this.$store.state.x=Math.floor((e.clientX-document.querySelector("#app").offsetLeft)/this.partWidth);
			this.$store.state.y=Math.floor((e.clientY-document.querySelector("#app").offsetTop)/this.partHeight);
			
		}
	}
}
</script>

<style lang="scss">
	#drawBackground{
		width: 100%;
		height: 100%;
		position: absolute;
		canvas{
			width: 100%;
			height: 100%;
		}
	}
</style>
