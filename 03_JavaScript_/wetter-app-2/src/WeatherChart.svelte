<script>
    import { onMount, onDestroy } from 'svelte';
    import * as d3 from 'd3';
    import { weatherDataStore } from '../stores/store.js';

    let chartContainer;

    const createChart = () => {
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(chartContainer)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleTime().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 0]);

        const xAxis = svg.append('g')
            .attr('transform', `translate(0,${height})`);

        const yAxis = svg.append('g');

        svg.append('path')
            .attr('class', 'line');

        chartContainer._chart = { svg, xScale, yScale, xAxis, yAxis };
    };

    const updateChart = (data) => {
        const { svg, xScale, yScale, xAxis, yAxis } = chartContainer._chart;

        xScale.domain(d3.extent(data, d => d.date));
        yScale.domain([0, d3.max(data, d => d.temp)]);

        xAxis.transition().call(d3.axisBottom(xScale));
        yAxis.transition().call(d3.axisLeft(yScale));

        const line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.temp));

        svg.select('.line')
            .datum(data)
            .transition()
            .attr('d', line);
    };

    const unsubscribe = weatherDataStore.subscribe(value => {
        if (value.length > 9) {
            const data = value.slice(-10).map(d => ({
                temp: d.main.temp,
                date: new Date(d.date)
            }));
            updateChart(data);
        }
    });

    onMount(() => {
        createChart();
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div bind:this={chartContainer} class="chart-container line"></div>

<style>
    .chart-container {
        width: 100%;
        margin-top: 2em;
    }

    .line {
        fill: none;
        stroke: steelblue;
        stroke-width: 2;
    }
</style>