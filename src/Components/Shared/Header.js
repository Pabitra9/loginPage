import React, { useEffect, useState } from 'react';
import { HiOutlineMenu, HiOutlineSearch } from 'react-icons/hi';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  startAt,
  endAt,
  limit,
  startAfter,
} from 'firebase/firestore';
import chrmpLogo from '../../CHRMP Logo - Tagline.svg';
import { db } from '../../RegistrationForm/firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSearchResult } from '../../Redux/SearchSlice';




const Header = ({ isSidebarOpen, setSidebarOpen }) => {
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [searchValue, setSearchValue] = useState('');
  //const [searchResults, setSearchResults] = useState([]);
  //const [typingTimeout, setTypingTimeout] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (location.state && location.state.searchResults) {
  //     // Handle the search results here
  //     setSearchResults(location.state.searchResults);
  //     console.log(location.state.searchResults);
  //   }
  // }, [location.state]);
   const searchDispatch = useDispatch()

  const handleSearch = async () => {
    const trimmedSearchValue = searchValue.trim().toLowerCase();

    if (trimmedSearchValue !== '') {
      const collectionRef = collection(db, 'Database');
      const q = query(
        collectionRef,
        //where('name', '>=', trimmedSearchValue),
        //where('name', '<=', trimmedSearchValue + '\uf8ff'),
        where('email', '==', trimmedSearchValue),
        limit(10)
      );
      const docRefs = await getDocs(q);
      const results = docRefs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //setSearchResults(results);
     // navigate('/dashboard', { state: { searchResults: results  } });
     searchDispatch(addSearchResult(results));
     }
    else{
      navigate('/dashboard')
      //setSearchResults([])
      searchDispatch(addSearchResult([]));
      
    }
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setSearchValue(event.target.value);
    if (event.target.value.trim() === '') {
      navigate('/dashboard')
      searchDispatch(addSearchResult([]));
    }
  }
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        // Trigger search when Enter key is pressed
        handleSearch();
      }
    };
  

  // const handleSearch = (newSearchQuery, e) => {
  //   setSearchQuery(newSearchQuery);
  //   setLastVisibleDoc(null); // Reset lastVisibleDoc when the search query changes
    
  //   if (newSearchQuery.trim() === '') {
  //     console.log('please enter a value');
  //     navigate('/dashboard');
  //   }
  // };

  return (
    <div className="bg-[#F1F5F9] p-6 shadow-md rounded-t-xl border-b ml-">
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
            className="bg-[#DEE5ED] outline-none rounded-3xl pl-4 p-2 font-normal text-sm "
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          <HiOutlineSearch className="text-[#475569] text-sm cursor-pointer"  onClick={handleSearch}/>
        </div>
      </div>
    </div>
  );
};

export default Header;