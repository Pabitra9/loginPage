import React from 'react'
import Tabulator from './Components/Tabulator'
import Sidebar from './Components/Shared/Sidebar'
const Dashboard = () => {
  return (
     <div className='bg-[#F1F5F9] rounded-b-xl'>
    <>
      {/* <Sidebar/> */}
       <Tabulator/>
       </>
   </div>
  )
}

export default Dashboard