import React, { useEffect, useState } from 'react';
import { HiOutlineMenu, HiOutlineSearch } from 'react-icons/hi';
import { collection, query, where, getDocs } from 'firebase/firestore';
import chrmpLogo from '../../CHRMP Logo - Tagline.svg';
import { db } from '../../RegistrationForm/firebase';
import { useNavigate } from 'react-router-dom';

const Header = ({ isSidebarOpen, setSidebarOpen }) => {
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const trimmedSearchValue = searchValue.trim().toLowerCase();

    // if (trimmedSearchValue !== '') {
      const collectionRef = collection(db, 'Database');
      const q = query(
        collectionRef,
        where('name', '>=', trimmedSearchValue),
        where('name', '<=', trimmedSearchValue + '\uf8ff')
      );
      const docRefs = await getDocs(q);
      const results = docRefs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
      navigate('/dashboard', { state: { searchResults: results  } });
    // }
    // else{
    //   setSearchResults([])
      
    // }
  };
  useEffect(()=>{
    if (!localStorage.getItem('currentUserRole')) {
      console.log('hauchi');
      // alert('What are you doing without login')
      navigate('/')
    }
  },[])
  

  const handleInputChange = (event) => {
    event.preventDefault();
    setSearchValue(event.target.value);

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout
    setTypingTimeout(
      setTimeout(() => {
        handleSearch();
      }, 1000),
    );
  };

  return (
    <div className="bg-[#F1F5F9] p-6 shadow-md rounded-t-xl border-b">
      <div className="text-2xl font-bold flex justify-between items-center gap-10">
        <div className="sm:hidden md:flex">
          <img src={chrmpLogo} className="w-24" alt="logo" />
        </div>
        <div className={`hidden mobile:${!isSidebarOpen ? 'flex' : 'hidden'}`}>
          <HiOutlineMenu className="" onClick={toggleSidebar} />
        </div>
        <div className="flex bg-[#DEE5ED] items-center w-auto gap-2 rounded-3xl justify-center pr-4">
          <input
            type="text"
            className="bg-[#DEE5ED] outline-none rounded-3xl pl-4 p-1 font-normal"
            value={searchValue}
            onChange={handleInputChange}
          />
          <HiOutlineSearch className="text-[#475569] text-sm" />
        </div>
      </div>
    </div>
  );
};

export default Header;
