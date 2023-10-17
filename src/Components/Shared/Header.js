import React,{useState} from 'react'
import { HiOutlineMenu, HiOutlineSearch } from 'react-icons/hi'

import chrmpLogo from '../../CHRMP Logo - Tagline.svg'
const Header = ({isSidebarOpen, setSidebarOpen}) => {

//     const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

//   const isSidebarOpen = props


// console.log(isSidebarOpen);
// setSidebarOpen(true);
// console.log(isSidebarOpen);

  return (
    //  isSidebarOpen? null : 
     (<div className='bg-[#F1F5F9] p-6 shadow-md rounded-t-xl border-b'>
       
        <div className="text-2xl font-bold flex justify-between items-center gap-10">
        <div className='sm:hidden md:flex'>
            <img src={chrmpLogo} className='w-24'/>
        </div>
        <div className={`hidden mobile:${!isSidebarOpen ? 'flex' : 'hidden'}`} >
              <HiOutlineMenu className=''onClick={toggleSidebar}/>
        </div>
            <div className='flex bg-[#DEE5ED] items-center w-auto gap-2 rounded-3xl justify-center pr-4'>
            <input
            type="text"
            className="bg-[#DEE5ED] outline-none rounded-3xl pl-4 p-1 font-normal"
            />
            <HiOutlineSearch className='text-[#475569] text-sm'/>
            </div>
                
        </div>
    </div>)
  )
}

export default Header