import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

type SeriesType = {
	name: string;
	data: number[];
}[];

type ChartComponentProps = {
	// options: ApexOptions;
	categories: string[];
	series: SeriesType;
	width: string | number;
	height: string | number;
	theme?: 'light' | 'dark';
};

export default function ChartComponent({
	categories,
	series,
	width,
	height,
	theme,
}: ChartComponentProps) {
	const ops: ApexOptions = {
		chart: {
			id: 'chart' + Math.random(),
			toolbar: {
				show: false,
			},
		},
		dataLabels: {
			enabled: false,
		},
		xaxis: {
			// categories: options.xaxis.categories,
			axisBorder: {
				show: true,
				color: '#78909C',
				strokeWidth: 1,
			},
			axisTicks: {
				show: false,
			},
			categories,
		},
		yaxis: {
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		grid: {
			show: true,
			borderColor: theme === 'dark' ? '#27282D' : '#F1F3F5',
			strokeDashArray: 0,
			position: 'back',
			xaxis: {
				lines: {
					show: false,
				},
			},
			yaxis: {
				lines: {
					show: true,
				},
			},
			row: {
				colors: undefined,
				opacity: 0.5,
			},
			column: {
				colors: undefined,
				opacity: 0.5,
			},
		},

		stroke: {
			curve: 'smooth',
			width: 1,
			colors: ['#8973FF'],
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 0,
				inverseColors: false,
				opacityFrom: 0.41,
				opacityTo: 0,
				stops: [0, 100],
				colorStops: [
					{
						offset: 0,
						color: 'rgba(174, 156, 254, 0.41)',
						opacity: 0.41,
					},
					{
						offset: 100,
						color: 'rgba(174, 156, 254, 0)',
						opacity: 0,
					},
				],
			},
		},
		tooltip: {
			theme: 'dark',
		},
	};

	return (
		<div id="chart" className="bg-light-900 dark:bg-dark-900 rounded-lg ">
			<ReactApexChart
				options={ops}
				series={series}
				type="area"
				width={width}
				height={height}
			/>
		</div>
	);
}
