import React from 'react'
import { useState,useEffect } from 'react'
import jsonData from '../Demo.json'
import { HiOutlineArchive, HiPencilAlt } from 'react-icons/hi';
const Tabulator = () => {
    const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate fetching data from the JSON file (you can use an HTTP request in a real application)
    setData(jsonData);
  }, []);
  return (
    <div className="cointainer min-h-screen mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Table</h1>
      <table className="min-w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border-b hover:bg-gray-400">User Name</th>
            <th className="px-4 py-2 text-left border-b hover:bg-gray-400">Images</th>
            <th className="px-4 py-2 text-left border-b hover:bg-gray-400">Course</th>
            <th className="px-4 py-2 text-center border-b hover:bg-gray-400">Status</th>
            <th className="px-4 py-2 text-center border-b hover:bg-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jsonData.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F1F5F9] border-b border-t' : ''}>
              <td className="px-4 py-2 text-left">{item.name}</td>
              <td className="px-4 py-2 text-left"><img src={item.image} alt={item.name} className="w-10 h-10 rounded-full" /></td>
              <td className="px-4 py-2 text-left">{item.course}</td>
              <td className="px-4 py-2 text-center"><span
                  className={`${
                    item.status === 'Yes' ? 'text-green-500' : 'text-red-500'
                  } py-1 px-3 font-bold`}
                >
                  {item.status}
                </span></td>
              <td className="px-4 py-2 text-center">
                <button className="text-black py-2 px-3 rounded mr-2"><div className='flex justify-evenly items-center'><HiPencilAlt className='text-lg text-blue-700'/><span>Edit</span></div></button>
                <button className="text-black py-2 px-3 rounded"><div className='flex justify-evenly items-center'><HiOutlineArchive className='text-lg text-red-500 hover:text-white hover:bg-red-500 hover:shadow-red-500 hover:shadow-lg hover:p-1 hover:rounded-full'/></div></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
}

export default Tabulator;