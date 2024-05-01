import { Line, Area, Column, Pie, Scatter, Radar } from '@ant-design/charts';
import _ from 'lodash';

const width = 800;

export default function Chart({ type, data, xAxis, yAxis, colorAxis, sizeAxis, order, option }) {

    const aggregateCount = (data, x_col, y_col) => {
        const aggregate_data = _.countBy(data, x_col);

        const chart_data = Object.keys(aggregate_data).map((item) => ({
            [x_col]: item,
            [`COUNT(${y_col})`]: aggregate_data[item]
        }));

        return chart_data;
    };

    let chart_data = data;
    let x_col_name = xAxis.col_name;
    let y_col_name = yAxis.col_name;

    switch (type) {
        case 'line':

            if (yAxis.aggregate_func === 'count') {
                if (!colorAxis) {
                    chart_data = aggregateCount(data, x_col_name, y_col_name);
                    y_col_name = `COUNT(${yAxis.col_name})`;
                }
                else {
                    const aggregate_data = _.countBy(data, item => (`${item[x_col_name]}$${item[colorAxis.col_name]}`));

                    const temp_data = Object.keys(aggregate_data).map((item) => ({
                        [x_col_name]: item.split('$')[0],
                        [colorAxis.col_name]: item.split('$')[1],
                        [`COUNT(${y_col_name})`]: aggregate_data[item]
                    }));

                    chart_data = temp_data;
                    y_col_name = `COUNT(${yAxis.col_name})`;
                }
            }

            chart_data = order === 'asc' && xAxis.data_type === 'number' ? chart_data.toSorted((a, b) => (a[x_col_name] - b[x_col_name])) :
                               order === 'desc' && xAxis.data_type === 'number' ? chart_data.toSorted((a, b) => (b[x_col_name] - a[x_col_name])) :
                               order === 'asc' && xAxis.data_type === 'string' ? chart_data.toSorted((a, b) => (a[x_col_name].localeCompare(b[x_col_name]))) :
                               order === 'desc' && xAxis.data_type === 'string' ? chart_data.toSorted((a, b) => (b[x_col_name].localeCompare(a[x_col_name]))) :
                               order === 'asc' && xAxis.data_type === 'datetime' ? chart_data.toSorted((a, b) => (new Date(a[x_col_name]) - new Date(b[x_col_name]))) :
                               order === 'desc' && xAxis.data_type === 'datetime' ? chart_data.toSorted((a, b) => (new Date(b[x_col_name]) - new Date(a[x_col_name]))) :
                               chart_data;

            console.log(chart_data)

            return (
                <Line
                    width={width}
                    data={chart_data}
                    xField={x_col_name}
                    yField={y_col_name} 
                    colorField={colorAxis ? colorAxis.col_name : undefined}
                    sizeField={sizeAxis ? sizeAxis.col_name : undefined}
                    shapeField={sizeAxis ? 'trail' : undefined}
                    slider={{
                        x: {}
                    }}
                />
            );
        case 'area':
            return <Area width={width} data={data} xField={x_col_name} yField={y1_col_name} seriesField={y2_col_name ? y2_col_name : undefined} colorField={y2_col_name ? y2_col_name : undefined} />;
        case 'bar':
            if (yAxis.aggregate_func === 'count') {
                if (!colorAxis) {
                    chart_data = aggregateCount(data, x_col_name, y_col_name);
                    y_col_name = `COUNT(${yAxis.col_name})`;
                }
                else {
                    const aggregate_data = _.countBy(data, item => (`${item[x_col_name]}$${item[colorAxis.col_name]}`));

                    const temp_data = Object.keys(aggregate_data).map((item) => ({
                        [x_col_name]: item.split('$')[0],
                        [colorAxis.col_name]: item.split('$')[1],
                        [`COUNT(${y_col_name})`]: aggregate_data[item]
                    }));

                    chart_data = temp_data;
                    y_col_name = `COUNT(${yAxis.col_name})`;
                }
            }

            // chart_data = order === 'asc' && xAxis.data_type === 'number' ? chart_data.toSorted((a, b) => (a[y_col_name] - b[y_col_name])) :
            //                    order === 'desc' && xAxis.data_type === 'number' ? chart_data.toSorted((a, b) => (b[y_col_name] - a[y_col_name])) :
            //                    order === 'asc' && xAxis.data_type === 'string' ? chart_data.toSorted((a, b) => (a[y_col_name].localeCompare(b[y_col_name]))) :
            //                    order === 'desc' && xAxis.data_type === 'string' ? chart_data.toSorted((a, b) => (b[y_col_name].localeCompare(a[y_col_name]))) :
            //                    order === 'asc' && xAxis.data_type === 'datetime' ? chart_data.toSorted((a, b) => (new Date(a[y_col_name]) - new Date(b[y_col_name]))) :
            //                    order === 'desc' && xAxis.data_type === 'datetime' ? chart_data.toSorted((a, b) => (new Date(b[y_col_name]) - new Date(a[y_col_name]))) :
            //                    chart_data;

            console.log(chart_data)

            return (
                <Column 
                    width={width} 
                    data={chart_data} 
                    xField={x_col_name} 
                    yField={y_col_name}
                    seriesField={colorAxis && option === 'group' ? colorAxis.col_name : undefined}
                    colorField={colorAxis ? colorAxis.col_name : undefined}
                    stack={colorAxis && option === 'stack'}
                    sort={{
                        reverse: order === 'asc' ? false : order === 'desc' ? true : undefined,
                        by: order === 'def' ? undefined : 'y'
                    }}
                    slider={{
                        x: {}
                    }}
                />
            );
        case 'pie':

            if (yAxis.aggregate_func === 'count') {
                if (!colorAxis) {
                    chart_data = aggregateCount(data, x_col_name, y_col_name);
                    y_col_name = `COUNT(${yAxis.col_name})`;
                }
                else {
                    const aggregate_data = _.countBy(data, item => (`${item[x_col_name]}-${item[colorAxis.col_name]}`));

                    const temp_data = Object.keys(aggregate_data).map((item) => ({
                        [x_col_name]: item.split('-')[0],
                        [colorAxis.col_name]: item.split('-')[1],
                        [`COUNT(${y_col_name})`]: aggregate_data[item]
                    }));

                    chart_data = temp_data;
                    y_col_name = `COUNT(${yAxis.col_name})`;
                }
            }

            // chart_data = order === 'asc' && xAxis.data_type === 'number' ? chart_data.toSorted((a, b) => (a[y_col_name] - b[y_col_name])) :
            //                    order === 'desc' && xAxis.data_type === 'number' ? chart_data.toSorted((a, b) => (b[y_col_name] - a[y_col_name])) :
            //                    order === 'asc' && xAxis.data_type === 'string' ? chart_data.toSorted((a, b) => (a[y_col_name].localeCompare(b[y_col_name]))) :
            //                    order === 'desc' && xAxis.data_type === 'string' ? chart_data.toSorted((a, b) => (b[y_col_name].localeCompare(a[y_col_name]))) :
            //                    order === 'asc' && xAxis.data_type === 'datetime' ? chart_data.toSorted((a, b) => (new Date(a[y_col_name]) - new Date(b[y_col_name]))) :
            //                    order === 'desc' && xAxis.data_type === 'datetime' ? chart_data.toSorted((a, b) => (new Date(b[y_col_name]) - new Date(a[y_col_name]))) :
            //                    chart_data;
            return (
                <Pie 
                    width={width}
                    data={chart_data} 
                    colorField={x_col_name} 
                    angleField={y_col_name} 
                    label={{
                        text: y_col_name,
                        position: 'outside'
                    }}
                    tooltip={{
                        title: x_col_name
                    }}
                    state={{
                        active: { opacity: 1 },
                        inactive: { opacity: 0.5 }
                    }}
                    interaction={{
                        elementHighlight: true
                    }}
                />
            );
        case 'scatter':
            return <Scatter width={width} data={chart_data} xField={x_col_name} yField={y_col_name} colorField={colorAxis ? colorAxis.col_name : undefined}
            sizeField={sizeAxis ? sizeAxis.col_name : undefined} />;
        case 'radar':
            return <Radar width={width} data={data} xField={x_col_name} yField={y_col_name} />;
    }
}