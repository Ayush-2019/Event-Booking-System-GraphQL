import React from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const BUCKETS = {
    'Affordable' : {
        min:0,
        max:150
    },
    'Usual' : {
        min:150,
        max:300
    },
    'Expensive':{
        min:300,
        max:Number.MAX_SAFE_INTEGER
    }
}

const BookingChart = props => {
    const chart_data = {
        labels:[],
        datasets : []
    };

    const bar_colors = [
        'rgb(92, 215, 92)',
        'rgb(202, 202, 37)',
        'rgb(214, 51, 51)'
    ]
    let col_ind = 0;

    let values = [];

    for(const bucket in BUCKETS){
        const filtered = props.bookings.reduce((prev, curr) => {

            if(curr.event.price > BUCKETS[bucket].min && curr.event.price < BUCKETS[bucket].max){
            return prev + 1;
            }
            else{
                return prev;
            }
        }, 0);
        values.push(filtered)
        console.log(filtered)
        chart_data.labels.push(bucket + ' events booked')
        chart_data.datasets.push({
            label: bucket,
            data:values,
            backgroundColor: bar_colors[col_ind]
        });

        col_ind+=1;
        values = [...values]
        values[values.length-1] = 0
        //console.log(values)
    }

    
    return(

        
        <div style={{
            textAlign:'center',
            width:'700px',
            border:'3px solid orange',
            marginLeft:'20%'
        }}>
            <Bar
            data={chart_data}
        />
        </div>
    )
};

export default BookingChart;