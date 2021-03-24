// 默认位置四川省政府
const latitude = 30.65089
const longitude = 104.07572
const defaultConfig = {
	rotate: 0,
	alpha: 0.6,
	latitude,
	longitude,
}
export const myLocation = {
	callout: {
		content: '我的位置',
		padding: 10,
		borderRadius: 2,
		display: 'ALWAYS'
	},
	iconPath: '/static/Marker1_Normal@3x.png',
	width: '34px',
	height: '34px',
	id: 1,
	title: '我的位置',
	...defaultConfig
}

export const location = {
	callout: {
		content: '签到位置',
		padding: 10,
		borderRadius: 2,
		display: 'ALWAYS'
	},
	id: 2,
	title: '签到位置',
	...defaultConfig
}
