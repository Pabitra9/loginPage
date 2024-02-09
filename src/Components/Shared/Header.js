import React, { useEffect, useState } from 'react';
import { HiOutlineMenu, HiOutlineSearch } from 'react-icons/hi';
import { collection, query, where, getDocs , limit,startAfter } from 'firebase/firestore';
import chrmpLogo from '../../CHRMP Logo - Tagline.svg';
import { db } from '../../RegistrationForm/firebase';
import { useNavigate } from 'react-router-dom';

const Header = ({ isSidebarOpen, setSidebarOpen }) => {
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [displayedData, setDisplayedData] = useState([]);
  // const [typingTimeout, setTypingTimeout] = useState(null);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const navigate = useNavigate();

  // const handleSearch = async () => {
  //   const trimmedSearchValue = searchValue.trim().toLowerCase();
  //   console.log(trimmedSearchValue);
  //   if (trimmedSearchValue !== '') {
  //     const collectionRef = collection(db, 'Database');
  //     const q = query(
  //       collectionRef,
  //       where('name', '>=', trimmedSearchValue),
  //       where('name', '<=', trimmedSearchValue + '\uf8ff')
  //     );
  //     // const docRefs = await getDocs(q);
  //     // const results = docRefs.docs.map((doc) => ({
  //     //   id: doc.id,
  //     //   ...doc.data(),
  //     // }));
  //     // setSearchResults(results);
  //     navigate('/dashboard', { state: { searchResults: results  } });
  //    }
  //   else{
  //     setSearchResults([])
  //   }
  // };

  // const handleInputChange = (event) => {
  //   event.preventDefault();
  //   setSearchValue(event.target.value);

  //   // Clear existing timeout
  //   if (typingTimeout) {
  //     clearTimeout(typingTimeout);
  //   }

  //   // Set a new timeout
  //   setTypingTimeout(
  //     setTimeout(() => {
  //       handleSearch();
  //     }, 1000),
  //   );
  // };

  useEffect(()=>{
    fetchData();
    console.log('search hauchi');
  },[searchQuery])
  
  console.log(searchQuery);
  const fetchData = async () => {
    let Squery =query( collection(db,'Database'));

    if (searchQuery != '') {
      Squery = query(Squery, where('email', '==', searchQuery));
    }
    Squery = query(Squery, limit(10));
    try {
      const snapshot = await getDocs(Squery);

      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDisplayedData(data);

      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      setLastVisibleDoc(lastDoc);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDisplayedData([]); // Reset displayed data in case of an error
    }
  };

  const loadMoreData = async () => {
    if (lastVisibleDoc) {
      const Squery = query(collection(db,'Database')
                    ,where('email', '==', searchQuery)
                    ,startAfter(lastVisibleDoc)
                    ,limit(10));

                    try {
                      const snapshot = await getDocs(Squery);
              
                      const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                      setDisplayedData((prevData) => [...prevData, ...newData]);
              
                      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
                      setLastVisibleDoc(lastDoc);
                      navigate('/dashboard', { state: { searchResults: displayedData } });
                      console.log('hauchi');
                    } catch (error) {
                      console.error('Error fetching more data:', error);
                    }
    }
  };
  
  const handleSearch = async (newSearchQuery) => {
    setSearchQuery(newSearchQuery.trim());
    setLastVisibleDoc(null); // Reset lastVisibleDoc when the search query changes
    if (newSearchQuery.trim() === '') {
      console.log('please enter a value');
      navigate('/dashboard');
    } else {
      try {
        const resultQuery = query(collection(db, 'Database'), where('email', '==', newSearchQuery));
        const resultSnapshot = await getDocs(resultQuery);

        if (resultSnapshot.empty) {
          // No results found
          setDisplayedData([]);
        }
      } catch (error) {
        console.error('Error checking for search results:', error);
      }
    }
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
            // value={searchValue}
            // onChange={handleInputChange}
            value={searchQuery}
           onChange= {(e) => handleSearch(e.target.value)}
          />
          <HiOutlineSearch className="text-[#475569] text-sm"  onClick={loadMoreData}/>
        </div>
      </div>
    </div>
  );
};

export default Header;
