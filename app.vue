<template>
	<div class="daily">
		<div class="daily-menu">
			<div class="daily-menu-item" :class="{on: type === 'recommend'}" @click="handleToRecommend">每日推荐</div>
			<div class="daily-menu-item" :class="{on: type === 'daily'}" @click="switchShowThemes">主题日报</div>
			<ul v-show="showThemes">
				<li v-for="item in themes">
					<a :class="{on: item.id === themeId && type === 'daily'}" @click="handleToTheme(item.id)">{{item.name}}</a>
				</li>
			</ul>
		</div>
		<div class="daily-list" ref="list" @scroll="handleScroll">
			<template v-if="type === 'recommend'">
				<div v-for="list in recommendList">
					<div class="daily-date">{{formatDay(list.date)}}</div>
					<Item v-for="item in list.stories" :data="item" :key="item.id" @click.native="handleClick(item.id)"></Item>
				</div>
			</template>
			<template v-if="type === 'daily'">
				<Item v-for="item in list" :data="item" :key="item.id" @click.native="handleClick(item.id)"></Item>
			</template>
		</div>
		<daily-article :id="articleId"></daily-article>
	</div>
</template>	
<script>
	import $ from './lib/util';
	import Item from './components/item.vue';
	import dailyArticle from './components/daily-article.vue';

	export default {
		components: {Item, dailyArticle},
		data () { // ES6中对象方法的简写
			return {
				themes: [], 
				showThemes: false, // 控制主题日报展开还是收起的状态
				type: 'recommend',
				themeId: 0, 
				list: [],
				recommendList: [], 
				dailyTime: $.getTodayTime(), 
				isLoading: false,
				articleId: 0
			}
		},
		methods: {
			getThemes() {
				// axios 发起get请求 
				$.ajax.get('themes').then(res => {
					this.themes = res.others;
				});
			},
			handleToTheme(id) {
				this.themeId = id;
				// 清空中间栏的数据
				this.list = [];
				$.ajax.get('theme/' + id).then(res => {
					// 过滤类型为1的文章，该类型下的文章为空
					this.list = res.stories.filter(item => item.type !== 1);
				});
			},
			switchShowThemes() {
				this.showThemes = !this.showThemes;
				this.type = 'daily';
			},
			handleToRecommend() {
				this.type = 'recommend';
				this.showThemes = false;
				this.recommendList = [];
				this.dailyTime = $.getTodayTime();
				this.getRecommendList();
			},
			getRecommendList() {
				this.isLoading = true; 
				const prevDay = $.prevDay(this.dailyTime + 86400000);
				$.ajax.get('news/before/' + prevDay).then(res => {
					this.recommendList.push(res);
					this.isLoading = false;

					// 获取到DOM
					const $list = this.$refs.list;
					// 如果获取到的内容高度不足以出现滚动条时，再多获取一天的数据，使其出现滚动条，从而可以通过滚动动作触发加载更多的数据
					if ($list.scrollHeight === document.body.clientHeight) {
						this.dailyTime -= 86400000;
						const prevDay = $.prevDay(this.dailyTime + 86400000);
						$.ajax.get('news/before/' + prevDay).then(res => {
							this.recommendList.push(res);
						});
					}
				});
				
			},
			formatDay (date) {
                let month = date.substr(4, 2);
                let day = date.substr(6, 2);
                if (month.substr(0, 1) === '0') month = month.substr(1, 1);
                if (day.substr(0, 1) === '0') day = day.substr(1, 1);
                return `${month} 月 ${day} 日`;
            },
            handleScroll() {
            	// 获取到DOM
				const $list = this.$refs.list;
				if (this.type === 'daily' || this.isLoading) 
					return;
				// 已经滚动的距离加页面的高度等于内容区域高度时，视为接触底部
				if (($list.scrollHeight - ($list.scrollTop + document.body.clientHeight)) <= 1) {
					// 时间相对减少一天
					this.dailyTime -= 86400000;
					this.getRecommendList();
				}
            },
            handleClick(id) {
            	this.articleId = id;
            }
		},
		mounted() {
			// 初始化调用
			this.getThemes();
			this.getRecommendList();
		}
	}
</script>