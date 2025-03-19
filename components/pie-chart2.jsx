"use client";
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { eventsAll } from '@/models/data';

ChartJS.register(ArcElement, Tooltip, Legend);


export default function PieChart2(){
    const events = eventsAll.events

    let data=[]
    let bgs=[]
    let labels=[]

    events.map((event,index)=>{
        data.push(event.uniqueVisitors)
        bgs.push(event.color)
        labels.push(event.name)
    })

    const dataFinal = {
        labels: labels,
        datasets: [
          {
            label: '# of Unique Visitors',
            data: data,
            backgroundColor: bgs,
        borderWidth:0,
        hoverOffset:50,
          },
        ],
      };

  return (
    <>
    <Pie data={dataFinal} width={"100%"} className='w-full font-quickSand' options={{
        layout:{
            padding:20
        },
        responsive:true,
        maintainAspectRatio:false,
        plugins:{legend:{
            align:"start",
            position:"bottom",
            fullSize:true,
            labels:{
                textAlign:"left",
                padding:10,
                pointStyle:"circle",boxHeight:8,boxWidth:8,
                usePointStyle:true,color:"#23272D",
                font:{size:10,weight:"700",style:"inherit",family:"'Quicksand', sans-serif"}
            }
        },}
    }} />
    </>
  )
}
