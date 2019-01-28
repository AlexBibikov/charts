import React, {useState} from 'react';

import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemePaired } from 'd3-scale-chromatic'
import { format } from 'd3-format'
import Color from 'color'

import { isReactComponent, isDOMTypeElement } from './utils'

export const FunnelChart = ({ 
                                width, 
                                height, 
                                data=[], 
                                extractValue=(d=>d.value), 
                                extractLabel=(d=>d.name), 
                                label=true,
                                valueFormat='.2s',
                                colorScale=scaleOrdinal(schemePaired),
                                minItemWidth=10, 
                                margins={top:10,bottom:10,left:10,right:10},
                                gap=4,
                                ry=0.02,
                                hoverShift=5,
                                luminosityThreshold=0.4
                            }) => {

    const [hover, setHover] = useState(null);

    const colors = data.reduce((a, c) => {
        a[c.name] = colorScale(c.name);
        return a;
    }, {});
    const w = width - margins.left - margins.right;
    const h = height - margins.top - margins.bottom - ry*w*1.4;
    const prepareData = data => {
        const ih = Math.floor(h/data.length);
        const maxValue = Math.max(...data.map(extractValue));
        const sumValue = data.map(extractValue).reduce((a, c) => (a + c));
        const scale = scaleLinear().domain([0, maxValue]).range([minItemWidth, w]);
        return data.map((item, i, a) => {
            const value = extractValue(item);
            const iw = Math.floor(scale(value));
            const x = Math.floor((w - iw)/2);
            const y = Math.floor(ih * (a.length - i - 1) + ry * w);
            const cc = colors[item.name];
            return {value, x, y, 
                percent: value/sumValue,
                height: ih, 
                width: iw, 
                color: cc,
                textColor: new Color(cc).luminosity() > luminosityThreshold ? '#000000' : '#FFFFFF',
                item};
        });
    }
    const d = prepareData(data.sort((a, b) => (a.value - b.value)));

    const renderLabel = (item, i) => {
        if(typeof label === 'boolean' && label) {
            const sc = new Color(item.textColor).negate();
            const scale = scaleLinear().domain([20, 500]).range([20, 24]);
            return (<text x={item.x+item.width/2} y={item.y+item.height/2+item.width*ry} 
                fill={item.textColor} 
                stroke={'none'} strokeWidth={0}
                fontWeight={900}
                fontSize={scale(item.height)}
                style={{textShadow:`1px 1px 0 ${sc},-1px 1px 0 ${sc},1px -1px 0 ${sc},-1px -1px 0 ${sc}`}}
                dominantBaseline="middle"
                textAnchor="middle">
                {extractLabel(item.item)}: {format(valueFormat)(extractValue(item.item))}
                ({format('2.0%')(item.percent)})
                </text>);
        }
        else if (isReactComponent(label)) {
            return label(item, i);
        }
        else if (isDOMTypeElement(label)) {
            return label;
        }
        if(typeof label === 'string') {
            return (<text x={item.x+item.width/2} y={item.y+item.height/2} 
                fill={item.textColor} dominantBaseline="middle"
                textAnchor="middle">{label}</text>);
        }
        else {
            return null;
        }
    }
    //
    // render segments from bottom to top
    //
    let bottomW = d[0].width*0.67;

    const renderItem = (item, i, a) => {
        const d = [
            item.x, item.y,
            item.x+item.width, item.y,
            Math.floor((w+bottomW)/2), item.height-gap+item.y,
            Math.floor((w-bottomW)/2), item.height-gap+item.y
        ];
        const points = `M${d[0]},${d[1]} L${d[2]},${d[3]} `+ 
        `Q${Math.floor((d[2]+2*d[4])/3)},${Math.floor((d[5]+d[3])/2)},${d[4]},${d[5]} `+
        `A${Math.floor(bottomW/2)},${Math.floor(bottomW*ry)},0,1,1,${d[6]},${d[7]} `+
        `Q${Math.floor((d[0]+2*d[6])/3)},${Math.floor((d[7]+d[1])/2)},${d[0]},${d[1]}`;
        
        //console.log(points);
        bottomW = item.width;

        return <g className="chart-funnel-item" key={`p-${i}`} 
            stroke='black' 
            strokeWidth={0.14} 
            onMouseEnter={() => {setHover(item.item.name)}}  
            onMouseLeave={() => {setHover(null)}}>
            <path d={points} fill={`url(#color-${i})`} />

            <ellipse 
                cx={Math.floor(w/2)} 
                cy={item.y} 
                rx={(d[2]-d[0])/2} 
                ry={item.width*ry} 
                fill={colors[item.item.name]} />

            {renderLabel(item, i)}
            
        </g>
    }

    const gradientItem = (item, i) => {
        const color0 = new Color(item.color).lighten(0.3);
        const color1 = new Color(item.color).darken(0.6);
        return <linearGradient key={`color-${i}`} id={`color-${i}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={item.color} />
            <stop offset="33%" stopColor={color0}/>
            <stop offset="66%" stopColor={item.color}/>
            <stop offset="100%" stopColor={color1}/>
        </linearGradient>
    }
    
    return <svg 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg"  
        x="0px" 
        y="0px" 
        viewBox={`0 0 ${width} ${height}`}>
        <defs>
            {d.map(gradientItem)}
        </defs>
        <g className="chart-funnel" transform={`translate(${margins.left},${margins.top})`}>
            {d.map(renderItem)}
        </g>
    </svg>
}