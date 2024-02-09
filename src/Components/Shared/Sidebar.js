import React from 'react';
import { HiOutlineLogout, HiViewGrid, HiX } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { firebaseAuth } from '../../RegistrationForm/firebase';
import { signOut } from 'firebase/auth';
import profilePic from '../../Profile.png'
import { useState , useEffect } from 'react';

const Sidebar = ({isSidebarOpen, setSidebarOpen}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userDisplayName, setUserDisplayName] = useState('');

  const extractUserName = (email) => {
    // Assuming email is in the format 'username@example.com'
    const usernameWithoutDots = email.split('@')[0].replace(/\./g, ' ');
    // Capitalize the first letter of each word
    return usernameWithoutDots.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

   useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userEmail = localStorage.getItem('currentUserEmail');
        if (userEmail) {
          const displayName = await extractUserName(userEmail);
          setUserDisplayName(displayName);
        } else {
          console.error('User email not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []); // Empty dependency array ensures the effect runs only once on mount
  
  const handleLogOut = async () => {
    try {
      await signOut(firebaseAuth); 
      localStorage.clear();
      // Sign the user out using Firebase auth
      // Additional cleanup or state changes can be done here if needed
      
      localStorage.removeItem('userToken');
      localStorage.removeItem('currentUserRole')
      localStorage.removeItem('currentUserEmail')
      
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }

  };

  return (
    <div className="flex flex-col w-64 p-3 text-white relative">
      <HiX className='text-2xl absolute left-56 top-14 hidden mobile:flex overflow-hidden' onClick={() => setSidebarOpen(!isSidebarOpen)}/>
        <div className='flex items-center justify-start my-8 pb-2 gap-4 border-b'>
            <img src={profilePic} className='w-10 cursor-pointer'/>
            <span className='text-xl font-semibold text-white'>{userDisplayName}</span>
            {/* {console.log(userCredentialFromFirebase)} */}
            </div>
      {/* <h1 className=" text-2xl font-semibold m-5 pb-4 ">Sidebar</h1> */}
      <div className="flex-1 ">
          <Link to={'/dashboard'}>
        <div className={`flex pl-10 items-center gap-1 p-3 m-1 ${location.pathname === '/dashboard' ? 'bg-slate-400 rounded-md' : 'hover:bg-slate-400 hover:rounded-md'}`}>
            <HiViewGrid className="text-lg" />
          <span>
            Dashboard
          </span>
        </div>
          </Link>

          {/* <Link to={'/menu1'}>
        <div className={`flex pl-10 items-center gap-1 p-3 m-1 ${location.pathname === '/menu1' ? 'bg-slate-400 rounded-md' : 'hover:bg-slate-400 hover:rounded-md'}`}>
            <HiMenu className="text-lg" />
          <span>
            Menu1
          </span>
        </div>
          </Link>

          <Link to={'/menu2'}>
        <div className={`flex pl-10 items-center gap-1 p-3 m-1 ${location.pathname === '/menu2' ? 'bg-slate-400 rounded-md' : 'hover:bg-slate-400 hover:rounded-md'}`}>
            <HiMenu className="text-lg" />
          <span>
            Menu2
          </span>
        </div>
          </Link> */}
      </div>
      {/* <div className="flex pl-10 items-center gap-1 p-3"> */}
          {/* <Link to={'/login'}> */}
        <div className="flex items-center justify-center gap-2 p-3 m-1 bg-[#8dc14e] rounded-md cursor-pointer" onClick={handleLogOut}>
            <HiOutlineLogout className="text-lg font-extrabold" />
            <span className='font-bold text-sm'>Log Out</span>
        </div>
          {/* </Link> */}
      {/* </div> */}
    </div>
  );
};

export default Sidebar;