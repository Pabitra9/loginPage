import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

// console.log(isSidebarOpen);
  return (
    <>
    <div className={`min-h-screen bg-[#2960a1] flex`} >
    {/* <div className={`sm ${isSidebarOpen ? 'ml-0' : 'hidden'} md: flex `}> */}
    <div className={`desktop:flex mobile: ${isSidebarOpen ? 'ml-0' : 'hidden'}`}>
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
    </div>


        
      {/* Sidebar */}
      
      <main className="flex-1 p-4 bg-[#2960a1]">
        {/* Header */}
        <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}/>
        
        {children}
      </main>
    </div>
    </>
  );

}

export default Layout;