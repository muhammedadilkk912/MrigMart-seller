import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../configure/axios';


const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const dummyData = [
  { name: 'Jan', sales: 1 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 0 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];
const currentMonth = new Date().getMonth();


const Chart = () => {
    const [filter, setFilter] = useState('6months');

    const [chartData,setChartData]=useState([])
    console.log("chart data",chartData)

useEffect(()=>{
    getsalesreport()
},[filter])
const getsalesreport=async()=>{
    try {
        const response=await axiosInstance.get(`/seller/dashboard/salesreport/${filter}`)
        console.log(response)
        const salesMap = {};

       
        let data=response.data
        if(filter === '6months'){
            data.sales.forEach(item => {
        salesMap[item._id.month] = item.totalsales;
      });
      console.log("cuurent month",currentMonth+1)
       const months = MONTHS.slice(currentMonth - 5, currentMonth + 1);
       console.log(months)
       const formattedSales = months.map((month, index) => ({
            month,
             sales: salesMap[index + 2] || 0
               }))

               console.log("formatted sales",formattedSales)
        setChartData(formattedSales)

        }
        
    else if(filter=== '7days'){
     const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        // console.log(date) // to get in chronological order
        const formatted = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
        return formatted;
      });

    //   console.log(last7Days)
        const salesMap = {};
      data.sales.forEach(item => {
        salesMap[item._id] = item.totalsales;
      });
      console.log(salesMap)
      
      const formattedSales = last7Days.map(date => ({
        date,
        sales: salesMap[date] || 0,
      }));

      setChartData(formattedSales);

    //     const formattedSales = data.sales.map(item => ({
    //     date: item._id,
    //     sales: item.totalsales
    //   }));
    //     setChartData(formattedSales)

        }
          
        // const formattedSales = MONTHS.map((month, index) => ({
        //     month,
        //      sales: salesMap[index + 1] || 0
        //        })).slice(0,(currentMonth+1));
        //        console.log(formattedSales)
         
    } catch (error) {
        console.log(error)
    }
}
  return (
    <div className='flex flex-col space-y-2 w-full'>
        <div className="flex justify-end ">
  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="border border-gray-300  rounded px-2 py-1"
  >
    {/* <option value=""></option> */}
    <option value="6months">Last 6 Months</option>
    <option value="7days">Last 7 Days</option>
  </select>
</div>


   
    <div className="  w-full h-80 ">
       

      {/* <h2 className="text-lg font-semibold ">Monthly Sales</h2> */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={filter === '7days' ? 'date':'month'} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#4f46e5"
            strokeWidth={3}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
     </div>
  )
}

export default Chart
