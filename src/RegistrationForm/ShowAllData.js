import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from "react-router-dom";

function ShowAllData() {
  const { id } = useParams();

  const [currentDataFromFirebase, setCurrentDataFromFirebase] = useState({});

  useEffect(() => {
    const getDatasFromFirebase = async () => {
      try {
        const docRef = doc(db, "Database", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentDataFromFirebase(docSnap.data());
        }
      } catch (error) {
        console.log(error);
      }
    }

    getDatasFromFirebase();
  }, [id]);

  return (
    <div className="h-screen w-screen flex items-center rounded-md shadow-md">
       {/* <h1 className="text-2xl font-bold mb-4">Edit User Data</h1> */}
      <div className="w-1/3 h-full  bg-[#2960A1] rounded-s-md shadow-lg">
        <div className="flex items-center justify-center m-8 ">
          <img src={currentDataFromFirebase.image } alt="User" className="w-48 h-48 rounded-full border-solid border-[#8DC162] border-4 object-cover" />
        {/* {console.log(currentDataFromFirebase.image)} */}
        
       </div>
        <div className="">
        <div className="flex flex-wrap gap-4 p-10">
                    <div className="w-full">
                      <label className="mb-2 text-white font-semibold ">Email: </label>
                      <label className="mb-2 text-white ">{currentDataFromFirebase.email}</label>
                      </div>
                      <div className="w-full">
                      <label className="mb-2 text-white font-semibold">Phone: </label>
                      <label className="mb-2 text-white ">{currentDataFromFirebase.phone}</label>
                      </div>
                      <div className="w-full">
                      <label className="mb-2 text-white font-semibold">Alternative Phone No: </label>
                      <label className="mb-2 text-white ">{currentDataFromFirebase.alternativePhone}</label>
                    </div>
                  </div>  
              </div>
                   <div className="flex justify-center items-center">
                        <div className="w-72 h-20 border-2 border-solid border-white rounded-md">
                            {/* <HiDocument className="w-32 h-20"/> */}
                        </div>
                   {/* <object data={currentDataFromFirebase.idProof} type="application/pdf" width="100" height="200"></object> */}

                   </div>
            </div>
      <div className="w-full h-full overflow-y-scroll bg-gray-100 rounded-e-md shadow-md">
      <div className="flex flex-wrap gap-4 m-10 mb-0">
              <div className="w-full">
              {/* <label className="mb-2">Name</label> */}
              <label className="w-full mb-2 text-5xl font-semibold bg-transparent outline-none capitalize">{currentDataFromFirebase.name}</label>
              </div>
              <div className="w-1/3">
              <label className="mb-2 font-semibold">Date of Birth: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.dob}</label>
              </div>
              
              <div className="w-1/3">
              <label className="mb-2 font-semibold">Gender: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.gender}</label>
            </div>
            <div className="w-1/3">
              <label className="mr-2 font-medium">Status: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.status}</label>
            </div>
          </div>
          <div>
            <div className="p-4 rounded-lg shadow-lg ">
              <div>
              <h2 className="text-2xl font-semibold m-8">Personal Details</h2>
                <div className="flex flex-wrap gap-4 m-8">
            <div className="w-1/3">
              <label className="mb-2 font-medium">Address: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.streetAddress}</label>
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium ">Address 2: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.addressLine2}</label>
            </div>  
            <div className="w-1/3">
              <label className="mb-2 font-medium">City: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.city}</label>
            </div>  
            <div className="w-1/3">
              <label className="mb-2 font-medium">State: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.state}</label>
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">Zipcode: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.zipcode}</label>
            </div>  
            <div className="w-1/3">
              <label className="mb-2 font-medium">Country: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.country}</label>
            </div>  
          </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mt-4 m-8">Program Details</h2>
                  <div className="flex flex-wrap gap-4 m-8">
                    <div className="w-1/3">
                      <label className="mb-2 font-medium">Program Enroll For: </label>
                      <label className="mb-2 text-black ">{currentDataFromFirebase.certificationProgram}</label>
                      </div>
                      <div className="w-1/3">
                      <label className="mb-2 font-medium">Date of Registration: </label>
                      <label className="mb-2 text-black ">{currentDataFromFirebase.registrationDate}</label>
                      </div>
                  </div>
              </div>
                
              <div>
              <h2 className="text-2xl font-semibold m-8">Education Qualification & Experience</h2>
            <div className="flex flex-wrap gap-4 m-8">
            <div className="w-1/3">
              <label className="mb-2 font-medium">Education: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.education}</label>
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">Total Year of Experience: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.totalExperience}</label>
             </div> 
            <div className="w-1/3">  
              <label className="mb-2 font-medium">Relevent Experience in HR: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.hrExperience}</label>
            </div>  
            <div className="w-1/3">
              <label className="mb-2 font-medium">Previous organization: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.prevOrg}</label>
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">Current organization: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.currentOrg}</label>
            </div>  
            <div className="w-1/3">  
              <label className="mb-2 font-medium">Designation: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.designation}</label>
            </div>  
            <div className="w-1/3">
              <label className="mb-2 font-medium">Linkedin Profile URL: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.linkedin}</label>
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">How Did you find us?: </label>
              <label className="mb-2 text-black ">{currentDataFromFirebase.howFound}</label>
            </div>
        </div>
          </div>
        </div>
       </div>       
    </div>
  </div>
  );
}

export default ShowAllData;
