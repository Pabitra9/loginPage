import React from 'react';
import { HiMenu, HiOutlineLogout, HiViewGrid, HiX } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import profilePic from '../../Profile.png'
const Sidebar = ({isSidebarOpen, setSidebarOpen}) => {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 p-3 text-white relative">
      <HiX className='text-2xl absolute left-56 top-14 hidden mobile:flex overflow-hidden' onClick={() => setSidebarOpen(!isSidebarOpen)}/>
        <div className='flex items-center justify-start my-8 pb-2 gap-4 border-b'>
            <img src={profilePic} className='w-10 cursor-pointer'/>
            <span className='text-xl font-semibold '>Pabitra Kumar</span>
            
            </div>
      {/* <h1 className=" text-2xl font-semibold m-5 pb-4 ">Sidebar</h1> */}
      <div className="flex-1 ">
          <Link to={'/'}>
        <div className={`flex pl-10 items-center gap-1 p-3 m-1 ${location.pathname === '/' ? 'bg-slate-400 rounded-md' : 'hover:bg-slate-400 hover:rounded-md'}`}>
            <HiViewGrid className="text-lg" />
          <span>
            <Link to={'/'}>Dashboard</Link>
          </span>
        </div>
          </Link>

          <Link to={'/menu1'}>
        <div className={`flex pl-10 items-center gap-1 p-3 m-1 ${location.pathname === '/menu1' ? 'bg-slate-400 rounded-md' : 'hover:bg-slate-400 hover:rounded-md'}`}>
            <HiMenu className="text-lg" />
          <span>
            <Link to={'/menu1'}>Menu1</Link>
          </span>
        </div>
          </Link>

          <Link to={'/menu2'}>
        <div className={`flex pl-10 items-center gap-1 p-3 m-1 ${location.pathname === '/menu2' ? 'bg-slate-400 rounded-md' : 'hover:bg-slate-400 hover:rounded-md'}`}>
            <HiMenu className="text-lg" />
          <span>
            <Link to={'/menu2'}>Menu2</Link>
          </span>
        </div>
          </Link>
      </div>
      {/* <div className="flex pl-10 items-center gap-1 p-3"> */}
          <Link to={'/logout'}>
        <div className="flex items-center justify-center gap-2 p-3 m-1 bg-[#8dc14e] rounded-md">
            <HiOutlineLogout className="text-lg font-extrabold" />
          <Link to={'/logout'}>
            <span className='font-bold text-sm'>Log Out</span>
          </Link>
        </div>
          </Link>
      {/* </div> */}
    </div>
  );
};

export default Sidebar;