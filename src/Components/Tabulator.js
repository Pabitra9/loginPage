import React from 'react'
import { useState,useEffect } from 'react'
import jsonData from '../Demo.json'
import { HiOutlineArchive, HiPencilAlt } from 'react-icons/hi';
import { db } from '../RegistrationForm/firebase';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
const Tabulator = () => {
    const [data, setData] = useState([]);
   

    useEffect(() => {
      // Fetch data from the "Database" collection in Firestore
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, 'Database'));
        const userData = [];
  
        querySnapshot.forEach((doc) => {
          // Extract data from each document
          const itemData = doc.data();
          {console.log(itemData)}
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

    const handleDeleteClick = async(id) => {
      const deleteValue = doc(db,"Database",id)
      await deleteDoc(deleteValue)
    }

  return (
    <div className="cointainer min-h-screen mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Table</h1>
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
          {data.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F1F5F9] border-b border-t' : ''}>
              <td className="px-4 py-2 text-left">{item.name}</td>
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
                <Link to = {`/edit/${item.id}`}>
                <button className="text-black py-2 px-3 rounded mr-2">
                  <div className='flex justify-evenly items-center'>
                    <HiPencilAlt className='text-lg text-blue-700' />
                    <span>Edit</span>
                  </div>
                </button>
                </Link>
                <button className="text-black py-2 px-3 rounded">
                  <div className='flex justify-evenly items-center'>
                    <HiOutlineArchive className='text-lg text-red-500 hover:text-white hover:bg-red-500 hover:shadow-red-500 hover:shadow-lg hover:p-1 hover:rounded-full' onClick={()=>handleDeleteClick(item.id)}/>
                  </div>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
}

export default Tabulator;