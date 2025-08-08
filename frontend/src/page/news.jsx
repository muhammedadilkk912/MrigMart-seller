import React, { useState } from 'react'
import { EllipsisIcon, EllipsisVertical } from 'lucide-react'

const news = () => {
    const [dropdown,setDropdown]=useState(false)
  return (
    <div className='min-h-screen flex justify-center items-center w-full bg-red-200'>

        <div>
            <table className='bg-green-200 border border-gray-400 table-auto'>
                <tr>
                    <th>no </th>
                    <th>name</th>
                    <th>action</th>
                </tr>
                <tr className='border '>
                    <td className='px-3 py-2'>1</td>
                    <td className='px-3 py-2'>muhammed</td>
                    <td
                    
                    className='px-3 py-2 relative'
                    
                    >
                        <button 
                        onClick={()=>setDropdown(!dropdown)}
                        className=''>
                            <EllipsisVertical/>

                        </button>
                    {
                        dropdown &&(
                            <div className=' absolute right-3 flex flex-col items-center border border-gray-300 justify-center'>
                                <ul className='w-full'>
                                    <li>active</li>
                                    <li>inactive</li>


                                </ul>


                            </div>
                        )
                    }
                    </td>


                </tr>
                <tr className='border '>
                    <td className='px-3 py-2'>1</td>
                    <td className='px-3 py-2'>muhammed</td>
                    <td
                    
                    className='px-3 py-2 relative'
                    
                    >
                        <button 
                        onClick={()=>setDropdown(!dropdown)}
                        className=''>
                            <EllipsisVertical/>

                        </button>
                    {
                        dropdown &&(
                            <div className=' absolute right-3 flex flex-col items-center border border-gray-300 justify-center'>
                                <ul className='w-full'>
                                    <li>active</li>
                                    <li>inactive</li>


                                </ul>


                            </div>
                        )
                    }
                    </td>


                </tr>

            </table>
        </div>
      
    </div>
  )
}

export default news
