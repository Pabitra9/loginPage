import React,{useEffect, useState} from 'react'
import { HiOutlineMenu, HiOutlineSearch } from 'react-icons/hi'
import { collection, query, where, getDocs } from "firebase/firestore";
import chrmpLogo from '../../CHRMP Logo - Tagline.svg'
import {db} from '../../RegistrationForm/firebase'
import { useNavigate } from 'react-router-dom';


const Header = ({isSidebarOpen, setSidebarOpen}) => {

//     const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const [serchValue , setSearchValue] = useState("")
  const [searchResults , setSearchResults] = useState ([])
  const navigate = useNavigate();
//   const isSidebarOpen = props


// console.log(isSidebarOpen);
// setSidebarOpen(true);
// console.log(isSidebarOpen);

const trimmedSearchValue = serchValue.trim().toLowerCase(); 
// console.log(trimmedSearchValue);
  const handleSearch = async () => {
   
    const collection_ref = collection(db,"Database")
    const q = query(collection_ref,where("name", ">=" , trimmedSearchValue),where ("name","<=", trimmedSearchValue + "\uf8fe"))
    const doc_refs = await getDocs(q)
    console.log(doc_refs);
    const results = [];
    console.log(results);
    doc_refs.forEach((doc) => {
      // const storedName = doc.data().name.toLowerCase()
      // console.log(storedName);
      // if (storedName === trimmedSearchValue) {
        results.push({
          id: doc.id,
          ...doc.data(),
          
        });
        
      // }
    });
    setSearchResults(results);
    navigate('/', { state: { searchResults: results } });
    console.log(results);

  };

  return (
     (<div className='bg-[#F1F5F9] p-6 shadow-md rounded-t-xl border-b'>
       
        <div className="text-2xl font-bold flex justify-between items-center gap-10">
        <div className='sm:hidden md:flex'>
            <img src={chrmpLogo} className='w-24'/>
        </div>
        <div className={`hidden mobile:${!isSidebarOpen ? 'flex' : 'hidden'}`} >
              <HiOutlineMenu className=''onClick={toggleSidebar}/>
        </div>
            <div className='flex bg-[#DEE5ED] items-center w-auto gap-2 rounded-3xl justify-center pr-4'>
            <input
            type="text"
            className="bg-[#DEE5ED] outline-none rounded-3xl pl-4 p-1 font-normal"
            value={serchValue} onChange={(e)=>setSearchValue(e.target.value)}/>
            {console.log(serchValue)}
            <HiOutlineSearch className='text-[#475569] text-sm' onClick={handleSearch}/>
            </div>
            {console.log(searchResults)}
            
            {/* <ul>
        {searchResults.map((result) => (
          <li className='capitalize' key={result.id}>{result.name}</li>
        ))}
      </ul> */}
      
                
        </div>
    </div>)
  )
}

export default Header;
