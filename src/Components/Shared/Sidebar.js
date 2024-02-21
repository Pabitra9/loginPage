import React from 'react';
import { HiOutlineLogout, HiViewGrid, HiX } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { firebaseAuth } from '../../RegistrationForm/firebase';
import { signOut } from 'firebase/auth';
import profilePic from '../../Profile.png'
import { useState , useEffect } from 'react';
import { CiExport } from "react-icons/ci";
import { db } from '../../RegistrationForm/firebase';
import { getDocs, collection, deleteDoc, doc ,query,limit,orderBy,startAfter, getCountFromServer} from 'firebase/firestore';
import Papa from 'papaparse';

const Sidebar = ({isSidebarOpen, setSidebarOpen}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [exportedData, setExportedData] = useState([])
  const [highlight, setHighlight] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');

  const extractUserName = async (email) => {
    if (!email) {
      return null; // or handle this case in a way that makes sense for your application
    }
  
    // Assuming email is in the format 'username@example.com'
    const usernameWithoutDots = await email.split('@')[0].replace(/\./g, ' ');
    // Capitalize the first letter of each word
    return usernameWithoutDots.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };
  const userEmail = localStorage.getItem('currentUserEmail');
  
  const fetchUserEmail = async () => {
    try {
      console.log(userEmail);
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
  useEffect(() => {
  
    fetchUserEmail();
  }, [userEmail]); // Empty dependency array ensures the effect runs only once on mount
  
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

  useEffect(() => {
    if (exportedData.length > 0) {
      console.log('Data ready for export:', exportedData);
      exportToCSV();
    }
  }, [exportedData]);
    const fetchDataToExport = async () => {
      try {
        const exportData = query(collection(db,'Database'),limit(100))
        const querySnapshot = await getDocs(exportData);
  
        const allData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        setExportedData(allData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
      
      const exportToCSV = () => {
        const csv = Papa.unparse(exportedData,{ header: true
       // columns: ['id', 'status', /* other fields */] // Explicitly specify columns
       });
        // console.log(csv);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'firebase_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

  return (
    <div className="flex flex-col w-64 p-3 text-white h-screen relative">
      <HiX className='text-2xl absolute left-56 top-14 hidden mobile:flex overflow-hidden' onClick={() => setSidebarOpen(!isSidebarOpen)}/>
        <div className='flex items-center justify-start my-8 pb-2 gap-4 border-b'>
            {/* <img src={profilePic} className='w-10 cursor-pointer'/> */}
            {userDisplayName && (
          <div className='w-14 h-12 rounded-[100%] bg-[#8dc14e] flex items-center justify-center'>
            <span className='text-white text-lg font-semibold'>{userDisplayName.charAt(0)}</span>
          </div>
        )}
            <span className='text-xl font-semibold text-white'>{userDisplayName}</span>
            {/* {console.log(userCredentialFromFirebase)} */}
            </div>
      {/* <h1 className=" text-2xl font-semibold m-5 pb-4 ">Sidebar</h1> */}
      <div className="flex flex-col">
          <Link to={'/dashboard'}>
        <div className={`flex pl-10 items-center gap-2 p-3 m-1 ${location.pathname === '/dashboard' ? 'bg-slate-400 rounded-md' : 'hover:bg-slate-400 hover:rounded-md'}`}>
            <HiViewGrid className="text-lg" />
          <span>
            Dashboard
          </span>
        </div>
          </Link>

          {/* <Link to={'/menu1'}> */}
          <button
          className={`flex pl-10 items-center gap-2 p-3 m-1 ${
            highlight
              ? 'bg-slate-400 rounded-md'
              : 'hover:bg-slate-400 hover:rounded-md'
          }`}
          onClick={() => {
            fetchDataToExport();
          }}
        >
          <CiExport className="text-lg" />
          <span>Export Data</span>
        </button>
          {/* </Link> */}

          {/* <Link to={'/menu2'}>
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
          <div 
  className="flex items-center justify-center gap-2 p-3 m-1 bg-[#ffffff] hover:bg-[#E41B17] hover:text-white transition-all ease-out rounded-md mt-auto cursor-pointer text-blue-900" 
  onClick={handleLogOut}
  >
  <HiOutlineLogout className="text-lg font-extrabold" />
  <span className='font-bold text-sm'>Log Out</span>
  </div>
          {/* </Link> */}
      {/* </div> */}
    </div>
  );
};

export default Sidebar;