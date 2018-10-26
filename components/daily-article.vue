<template>
	<div class="daily-article">
		<div class="daily-article-title">{{data.title}}</div>
		<div class="daily-article-content" v-html="data.body"></div>
	</div>
</template>
<script>
	import $ from '../lib/util';
	export default {
		props: {
			id: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				data: {}
			}
		}, 
		methods: {
			getArticle() {
				$.ajax.get('news/' + this.id).then(res => {
					// 将文章中的图片地址替换为代理地址
					res.body = res.body.replace(/src="http/g, 'src="' + $.imgPath + 'http');
					res.body = res.body.replace(/src="https/g, 'src="' + $.imgPath + 'https');
					this.data = res;
					// 返回文章顶部
					// .daily-article并没有用overflow:auto滚动，而是自然高度，所以显示出滚动条是浏览器窗口的滚动条，返回顶部不能设置.daily-article的scrollTop为0
					window.scrollTo(0, 0);
				});
			}
		},
		watch: {
			id(val) {
				if (val)
					this.getArticle();
			}
		}
	}
</script>