import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArchive, HiPencilAlt } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { db } from '../RegistrationForm/firebase';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const Tabulator = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [jumpToPage, setJumpToPage] = useState('');
  
  const location = useLocation();
  const { searchResults } = location.state || {};
  // console.log(location.state);
  const displayData = searchResults || data;

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setJumpToPage('');
    }
  };

  const [currentUserRole, setCurrentUserRole] = useState();
  const user = useSelector((state) => state.user.currentUser);

  const userCollectionRef = collection(db, 'UserCredential');

  useEffect(() => {
    const getUserRoleList = async () => {
      try {
        const data = await getDocs(userCollectionRef);
        const filteredUserRole = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        filteredUserRole.forEach((e) => {
          if (e.email === user[0].email) {
            setCurrentUserRole(e.role);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    getUserRoleList();
  }, [user, userCollectionRef]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'Database'));
      const userData = [];

      querySnapshot.forEach((doc) => {
        const itemData = doc.data();
        userData.push({
          id: doc.id,
          name: itemData.name,
          email: itemData.email,
          course: itemData.certificationProgram,
          status: itemData.status,
        });
      });

      setData(userData);
    };

    fetchData();
  }, []);

  const handleDeleteClick = async (id) => {
    const deleteValue = doc(db, 'Database', id);
    await deleteDoc(deleteValue);
    alert("Do you really want to delete this data ?");
    window.location.reload();
  };

  // Calculate total pages
  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  // console.log(totalPages);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data to display on the current page
  const currentPageData = displayData.slice(startIndex, endIndex);
  // console.log(currentPageData);

  return (
    <div className="min-h-screen mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Table</h1>
      <h1 className="text-2xl font-bold mb-4">{currentUserRole}</h1>

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
        <span className={`${result.status === 'Yes' ? 'text-green-500' : 'text-red-500'} py-1 px-3 font-bold`}>
          {result.status}
        </span>
      </td>
      <td className="px-4 py-2 text-center">
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
      </td>
    </tr>
  ))
) : currentPageData.length > 0 ? (
  currentPageData.map((item, index) => (
    <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F1F5F9] border-b border-t' : ''}>
      <td className="px-4 py-2 text-left capitalize">{item.name}</td>
      <td className="px-4 py-2 text-left">
        {item.email}
      </td>
      <td className="px-4 py-2 text-left">{item.course}</td>
      <td className="px-4 py-2 text-center">
        <span className={`${item.status === 'Yes' ? 'text-green-500' : 'text-red-500'} py-1 px-3 font-bold`}>
          {item.status}
        </span>
      </td>
      <td className="px-4 py-2 text-center">
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
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
      No results found.
    </td>
  </tr>
)}

        </tbody>
      </table>

      {/* Pagination controls & Information*/}
      <div className="flex justify-between items-center mt-4">

      <div>
          <span className="mr-2">
            Page {currentPage} of {totalPages}
          </span>
          <span className="text-gray-500">
            ({displayData.length} items in total)
          </span>
        </div>
        <div className="flex">
          <button
            onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={currentPage === 1}
            className="py-2 px-4 bg-gray-300 text-gray-700 rounded cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-2 py-2 px-4 bg-gray-300 text-gray-700 rounded cursor-pointer"
          >
            Next
          </button>
        </div>
        <div className="flex items-center">
          <span className="mr-2">
            Jump to Page:
          </span>
          <input
            type="text"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            className="px-2 py-1 border rounded"
          />
          <button
            onClick={handleJumpToPage}
            className="ml-2 py-2 px-4 bg-gray-300 text-gray-700 rounded cursor-pointer"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tabulator;
