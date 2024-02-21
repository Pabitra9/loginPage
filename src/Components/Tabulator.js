import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArchive, HiPencilAlt, HiOutlineInformationCircle } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { db } from '../RegistrationForm/firebase';
import { getDocs, collection, deleteDoc, doc ,query,limit,orderBy,startAfter, getCountFromServer, endBefore, endAt} from 'firebase/firestore';
import { useSelector } from 'react-redux';

// const ITEMS_PER_PAGE = 10;
const Tabulator = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // const [jumpToPage, setJumpToPage] = useState('');
  const [totalNoOfPageCount, setTotalNoOfPagecount] = useState(1)
  const [totalNoOfData, setTotalNoOfData] = useState(1)
  const [lastVisible , setLastVisible] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const { searchResults } = location.state || {};
  console.log(location.state);
  console.log(searchResults);
  
  const displayData = searchResults || data;

  // const handleJumpToPage = () => {
  //   const pageNumber = parseInt(jumpToPage, 10);
  //   if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalNoOfPageCount) {
  //     setCurrentPage(pageNumber);
  //     console.log(currentPage);
  //     setJumpToPage('');
  //     setLastVisible(''); 
  //   }
  // };

  const [currentUserRole, setCurrentUserRole] = useState(()=>{
    const storedRole = localStorage.getItem('currentUserRole');
    return storedRole || '';
  });
  const user = useSelector((state) => state.user.currentUser);

  const userCollectionRef = collection(db, 'UserCredential');

  useEffect(() => {
    const getUserRoleList = async () => {
      try {
        if (user && user.length > 0 && user[0].email) {
        const data = await getDocs(userCollectionRef);
        const filteredUserRole = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        filteredUserRole.forEach((e) => {
          if (e.email === user[0].email) {
            // console.log(user[0].email);
            setCurrentUserRole(e.role);
            localStorage.setItem('currentUserRole', e.role);
          }
        });
      }} catch (error) {
        console.error(error);
        
      }
    };

    getUserRoleList();
  }, [user, userCollectionRef]);

    const fetchData = async () => {
      try {
        setIsLoading(true)
        let queryData;
        if (lastVisible) {
          queryData = query(
            collection(db, 'Database'),
            orderBy('timestamp', 'desc'),
            startAfter(lastVisible),
            limit(10)
          );
        } else {
          queryData = query(
            collection(db, 'Database'),
            orderBy('timestamp', 'desc'),
            limit(10)
          );
        }

        let totalCountSnapshot;
           totalCountSnapshot = await getCountFromServer(collection(db, 'Database'));
           const totalCount = totalCountSnapshot.data().count;
          console.log(totalCount);
          setTotalNoOfData(totalCount);
          const totalPages = Math.ceil(totalCount / itemsPerPage);
          setTotalNoOfPagecount(totalPages);
         
        const documentSnapshots = await getDocs(queryData);
        console.log(documentSnapshots);
  
        if (documentSnapshots.empty) {
          // No more data to fetch
          console.log("No data found");
          return;
        }
  
        // Get the last visible document
        const lastVisibleDocument = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  
        // Map the data
        const fetchedData = documentSnapshots.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log(fetchData());
  
        // Combine the current data with the new data
        setData((prevData) =>(lastVisible ? [...prevData, ...fetchedData] : fetchedData));
        console.log(data);
        setLastVisible(lastVisibleDocument);
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
      }finally {
        // Set loading to false regardless of success or failure
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      if (!searchResults || searchResults?.length === 0) {
               fetchData();
             }
             else{
                     let totalCountSnapshot;
                     totalCountSnapshot =  { data: { count: searchResults.length } };
                       //totalCountSnapshot =  searchResults.length
                       console.log(totalCountSnapshot);
                       const totalCount = totalCountSnapshot.data.count;
                      console.log(totalCount);
                      setTotalNoOfData(totalCount);
                      const totalPages = Math.ceil(totalCount / itemsPerPage) 
                      setTotalNoOfPagecount(totalPages);
                      setCurrentPage(1)
                   }
    }, [currentPage , searchResults ]);

  
  //Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  console.log(startIndex);
  const endIndex = startIndex + itemsPerPage;
  console.log(endIndex);

  // Get the data to display on the current page
  //const currentPageData = displayData.slice(startIndex, endIndex);
  const currentPageData =  displayData.slice(startIndex, endIndex);
   console.log(currentPageData);

  const handleDeleteClick = async (id) => {
    const result = window.confirm('Are you sure you want to proceed?');
    if (result) {
      const deleteValue = doc(db, 'Database', id);
      await deleteDoc(deleteValue);
  
      const updatedData = data?.filter(res => res.id != id);
      setData(updatedData);
  
      // If search results exist, update them as well
      if (location.state && location.state.searchResults && location.state.searchResults.length > 0) {
        const updatedSearchResults = location.state.searchResults.filter(item => item.id !== id);
        // Update the location state with the updated search results
        location.state.searchResults = updatedSearchResults;
      }
    } else {
      console.log('User canceled');
    }
  };
  
  return (
    <div className="min-h-screen mx-auto p-4">
    <div className='flex justify-between'>
      {/* <h1 className="text-2xl font-bold mb-4">Data Table</h1> */}
      </div>  
        {/* <h1 className="text-2xl font-bold mb-4">User Role : {currentUserRole}</h1> */}
      <table className="min-w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border-b hover:bg-gray-400">User Name</th>
            <th className="px-4 py-2 text-left border-b hover:bg-gray-400">Email</th>
            <th className="px-4 py-2 text-left border-b hover:bg-gray-400">Course</th>
            <th className="px-4 py-2 text-center border-b hover:bg-gray-400">Status</th>
            <th className="px-4 py-2 text-center border-b hover:bg-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
        {searchResults && searchResults.length > 0  ? (
     searchResults.map((result, index) => (
    <tr key={index} className={index % 2 === 0 ? 'bg-[#F1F5F9] border-b border-t' : ''}>
      <td className="px-4 py-2 text-left capitalize">{result.name}</td>
      <td className="px-4 py-2 text-left">{result.email}</td>
      {console.log(result.email)}
      <td className="px-4 py-2 text-left">{result.certificationProgram}</td>
      {console.log(result.course)}
  <td className="px-4 py-2 text-center">
    {result.status}
  </td>
      <td className="px-4 py-2 text-center">
         {currentUserRole == 'tech'? (
          <>
          <Link to={`/edit/${result.id}`}>
          <button className="text-black py-2 px-3 rounded mr-2">
            <div className='flex justify-evenly items-center'>
              <HiPencilAlt className='text-lg text-blue-700' />
              <span>Edit</span>
            </div>
          </button>
        </Link>
        <button className="text-black py-2 px-3 rounded">
          <div className='flex justify-evenly items-center'>
            <HiOutlineArchive className='text-lg text-red-500 hover:text-white hover:bg-red-500 hover:shadow-red-500 hover:shadow-lg hover:p-1 hover:rounded-full' onClick={() => handleDeleteClick(result.id)} />
          </div>
        </button>
        </>
         ) : (
         <>
         <Link to={`/showAllData/${result.id}`}>
          <button className="text-black py-2 px-3 rounded mr-2">
            <div className='flex justify-evenly items-center'>
              <HiOutlineInformationCircle className='text-lg text-blue-700' />
              <span>Info</span>
            </div>
          </button>
        </Link>
         </> )}
      </td>
    </tr>
  ))
) :  currentPageData.length > 0 ? (
  currentPageData.map((item, index) => (
    <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F1F5F9] border-b border-t' : ''}>
      <td className="px-4 py-2 text-left capitalize">{item.name}</td>
      <td className="px-4 py-2 text-left">
        {item.email}
      </td>
      <td className="px-4 py-2 text-left">{item.certificationProgram}</td>
      <td className="px-4 py-2 text-center">
        {item.status}
    </td>
      <td className="px-4 py-2 text-center">
      {currentUserRole == 'tech'? (
          <>
          <Link to={`/edit/${item.id}`}>
          <button className="text-black py-2 px-3 rounded mr-2">
            <div className='flex justify-evenly items-center'>
              <HiPencilAlt className='text-lg text-blue-700' />
              <span>Edit</span>
            </div>
          </button>
        </Link>
        <button className="text-black py-2 px-3 rounded">
          <div className='flex justify-evenly items-center'>
            <HiOutlineArchive className='text-lg text-red-500 hover:text-white hover:bg-red-500 hover:shadow-red-500 hover:shadow-lg hover:p-1 hover:rounded-full' onClick={() => handleDeleteClick(item.id)} />
          </div>
        </button>
        </>
         ) : (
         <>
         <Link to={`/showAllData/${item.id}`}>
          <button className="text-black py-2 px-3 rounded mr-2">
            <div className='flex justify-evenly items-center'>
              <HiOutlineInformationCircle className='text-lg text-blue-700' />
              <span>Info</span>
            </div>
          </button>
        </Link>
         </> )}
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
   
    {searchResults?.length === 0 ? 'No result found.': ''}
    </td>
  </tr>
)}

        </tbody>
      </table>

      {isLoading && (
        <div className="flex items-center justify-center mt-4">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {/* Pagination controls & Information*/}
      <div className="flex justify-between items-center mt-4">

      <div>
          <span className="mr-2">
            Page {currentPage} of {totalNoOfPageCount}
            {console.log(totalNoOfPageCount)}
          </span>
          <span className="text-gray-500">
            ({totalNoOfData} items in total)
            {console.log(totalNoOfData) }
          </span>
        </div>
        <div className="flex">
          <button
            onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={currentPage === 1 || isLoading }
            className={`ml-2 py-2 px-4 rounded ${ currentPage === 1 || isLoading ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-gray-800 text-white cursor-pointer'}`}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalNoOfPageCount))}
            disabled={currentPage === totalNoOfPageCount || isLoading }

            className={`ml-2 py-2 px-4 rounded ${
              currentPage === totalNoOfPageCount
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : isLoading
                ? 'bg-gray-500 text-white cursor-not-allowed'
                : 'bg-gray-800 text-white cursor-pointer'
            }`}
          >
             {/* {isLoading ? 'Loading...' : 'Next'} */}Next
          </button>
        </div>
        {/* <div className="flex items-center">
          <span className="mr-2">
            Jump to Page:
          </span>
          <input
            type="text"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            className="px-2 py-1 border rounded"
          /> */}
          {/* <button
            onClick={handleJumpToPage}
            className="ml-2 py-2 px-4 bg-gray-300 text-gray-700 rounded cursor-pointer"
          >
            Go
          </button> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Tabulator;