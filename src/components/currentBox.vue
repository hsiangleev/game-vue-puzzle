<template>
	<div id="currentBox" :style="currentBoxStyle">
		
	</div>
</template>

<script>
export default {
    name: 'currentBox',
    props: ["initData"],
	data () {
		return {
			currentBoxStyle: {}
		}
	},
	mounted() {
		this.init();
	},
	computed: {
		
	},
	methods: {
		init() {
			this.$nextTick(()=>{
				this.currentBoxStyle={
					width: document.querySelector("#app").offsetWidth / this.initData.x + "px",
					height: document.querySelector("#app").offsetHeight / this.initData.y + "px",
					background: `url(${this.initData.imgUrl}) left ${this.$store.state.randomArr[0][0] * 200 * (-1)}px top ${this.$store.state.randomArr[0][1] * 200 * (-1)}px / 800px 600px no-repeat;`
				}
			})
		}
	}
}
</script>

<style lang="scss">
	#currentBox{
		position: absolute;
	}

</style>
