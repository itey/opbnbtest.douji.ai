<template>
	<div class="news-type-container">
		<div class="news-type-content">
			<div class="type-left">
				<div class="type-left-title">
					ALL News
				</div>
				<div class="news-list-container">
					<div :class="{
						light:currentIndex==index
					}" @mouseover="currentIndex = index" class="news-item" v-for="(item,index) in newsTypes">
						<div class="news-item-label text-color">
							{{item.title}}
						</div>
						<div class="news-item-arrow">
							<i class="el-icon-arrow-right text-color" />
						</div>
					</div>
				</div>
			</div>
			<div class="type-right">
				<div class="type-right-title">
					ALL Categories
				</div>
				<div class="categorie-container">
					<div v-for="(item,index) in newsTypes[currentIndex].categories">
						<div class="categorie-item text-color">
							{{item.title}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'news-types',
		data() {
			return {
				currentIndex: 0,
				newsTypes: [{
					title: 'Categories',
					categories: [{
						title: 'AI'
					}, {
						title: 'AIGC'
					}, {
						title: 'ChatGPT'
					}, {
						title: 'Metaverse'
					}, {
						title: 'NFT'
					}, {
						title: 'Web3'
					}, {
						title: 'Fashion'
					}, {
						title: 'Digital Art'
					}, {
						title: 'Bitcoin'
					}, {
						title: 'Ethereum'
					}, {
						title: 'BlockChan'
					}]
				}, {
					title: 'Featured',
					categories: [{
						title: 'AI'
					}, {
						title: 'AIGC'
					}, {
						title: 'ChatGPT'
					}, {
						title: 'Metaverse'
					}, {
						title: 'NFT'
					}, {
						title: 'Web3'
					}, {
						title: 'Fashion'
					}, {
						title: 'Digital Art'
					}, {
						title: 'Bitcoin'
					}, {
						title: 'Ethereum'
					}, {
						title: 'BlockChan'
					}]
				}, {
					title: 'AI Tools'
				}, {
					title: 'Prompt Engineering'
				}, {
					title: 'Learining'
				}]
			}
		},
		methods: {

		},
	}
</script>

<style lang="scss">
	.news-type-container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1A2027;
		border-top: 1px solid #29383F;
		border-bottom: 1px solid #29383F;
		box-shadow: 0px 6px 16px 0px #0C0E0F;

		.news-type-content {
			width: 1440px;
			height: 510px;
			display: flex;
			flex-direction: row;

			.type-left {
				width: 358px;
				border-right: 1px solid #2F3A41;

				.type-left-title {
					font-size: 16px;
					font-family: Microsoft YaHei;
					font-weight: bold;
					color: #FFFFFF;
					padding: 46px 0 29px 11px;
				}

				.news-list-container {
					.news-item {
						margin-bottom: 11px;
						padding: 22px 49px 22px 25px;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
						cursor: pointer;

						&.light {
							background: #384E59;

							.news-item-label {
								color: #00F9E5;
							}

							.news-item-arrow {
								color: #00F9E5;
							}
						}

						.news-item-label {
							font-size: 14px;
							font-family: Microsoft YaHei;
							font-weight: bold;
						}

						.news-item-arrow {
							font-size: 15px;
						}
					}
				}
			}

			.type-right {
				.type-right-title {
					font-size: 16px;
					font-family: Microsoft YaHei;
					font-weight: bold;
					color: #FFFFFF;
					padding: 46px 0 12px 27px;
				}

				.categorie-container {
					height: 324px;
					display: flex;
					flex-direction: column;
					flex-wrap: wrap;

					.categorie-item {
						min-width: 230px;
						padding-left: 27px;
						height: 36px;
						line-height: 36px;
						font-size: 14px;
						font-family: Arial;
						font-weight: 400;

						&:hover {
							font-size: 14px;
							font-family: Microsoft YaHei;
							font-weight: bold;
							color: #00F9E5;
							text-decoration: underline;
						}
					}
				}
			}
		}
	}
</style>