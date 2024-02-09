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
  startAfter
} from 'firebase/firestore';
import chrmpLogo from '../../CHRMP Logo - Tagline.svg';
import { db } from '../../RegistrationForm/firebase';
import { useNavigate } from 'react-router-dom';

const Header = ({ isSidebarOpen, setSidebarOpen }) => {
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [displayedData, setDisplayedData] = useState([]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery !== '') {
        try {
          const q = query(
            collection(db, 'Database'),
            orderBy('email'),
            startAt(searchQuery),
            endAt(searchQuery + '\uf8ff'),
            limit(10)
          );

          onSnapshot(q, (snapshot) => {
            const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setDisplayedData(newData);

            const lastDoc = snapshot.docs[snapshot.docs.length - 1];
            setLastVisibleDoc(lastDoc);
          });
        } catch (error) {
          console.error('Error searching for similar keywords:', error);
          setDisplayedData([]);
        }
      } else {
        setDisplayedData([]); // Clear displayedData when searchQuery is empty
      }
    };

    fetchData();
  }, [searchQuery]);

  const loadMoreData = async () => {
    if (lastVisibleDoc) {
      try {
        const q = query(
          collection(db, 'Database'),
          orderBy('email'),
          startAt(searchQuery),
          endAt(searchQuery + '\uf8ff'),
          startAfter(lastVisibleDoc),
          limit(10)
        );

        const snapshot = await getDocs(q);
        const newData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setDisplayedData((prevData) => [...prevData, ...newData]);
        navigate('/dashboard', { state: { searchResults: displayedData } });
        const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
        setLastVisibleDoc(newLastDoc);
      } catch (error) {
        console.error('Error fetching more data:', error);
      }
    }
  };

  const handleSearch = (newSearchQuery) => {
    setSearchQuery(newSearchQuery.trim());
    setLastVisibleDoc(null); // Reset lastVisibleDoc when the search query changes
    if (newSearchQuery.trim() === '') {
      console.log('please enter a value');
      navigate('/dashboard');
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
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <HiOutlineSearch className="text-[#475569] text-sm" onClick={loadMoreData} />
        </div>
      </div>

      {/* Display relevant data based on the search query
      <ul>
        {displayedData.map((item) => (
          <li key={item.id}>{item.email}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default Header;
