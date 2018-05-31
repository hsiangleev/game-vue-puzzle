<template>
	<div id="app">
		<puzzle :initData="initData"></puzzle>
	</div>
</template>

<script>
import puzzle from "./components/puzzle.vue"
export default {
	name: 'app',
	data () {
		return {
			initData: {
				x: 4,
				y: 3,
				imgUrl: ["./src/assets/1.jpg","./src/assets/2.jpg","./src/assets/3.jpg"]
			},
		}
	},
	components: {
		puzzle
	},
}
</script>

<style lang="scss">
	*{
		margin: 0;
		padding: 0;
	}
	html,body{
		width: 100%;
		height: 100%;
	}
	#app{
		width: 800px;
		height: 600px;
		position: relative;
		margin: 0px auto;
	}
	@media only screen and (max-width: 991px) {
		#app{
			width: 100%;
			height: 100%;
		}
	}

</style>
