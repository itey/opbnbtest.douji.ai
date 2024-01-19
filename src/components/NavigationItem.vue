<template>
	<div class="navigation-item">
		<img style="width: 40px;height:40px;" />
		<div class="content">
			<div class="label text-color">Goodbite</div>
			<div class="sub text-sub-color">
				Cisco to Acquire Splunkfor $28 Billion in Major AlCloud Security Deal Acquire
			</div>
		</div>
	</div>
</template>


<script>
	export default {
		name: 'NavigationItem',
		props: {
			item: {
				type: Object,
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navigation-item {
		height: 101px;
		background: #1A2027;
		border-radius: 8px;
		padding: 22px 18px;
		display: flex;
		flex-direction: row;
		cursor: pointer;

		&:hover .content .label {
			color: #00F9E5;
		}

		.content {
			flex: 1;
			margin-left: 16px;

			.label {
				font-size: 18px;
				font-family: Source Han Sans CN;
				font-weight: bold;
				line-height: 26px;
				text-align: left;
			}

			.sub {
				font-size: 14px;
				font-family: Arial;
				font-weight: 400;
				color: #B2B9B9;
				line-height: 22px;
				margin-top: 19px;
				text-align: left;
				word-wrap: break-word;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-line-clamp: 3;
			}
		}
	}
</style>