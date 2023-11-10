import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { storage  } from "./firebase";
import { ref, uploadBytes ,getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import loginImg from "../login.jpg"

function EditUser() {
  const { id } = useParams();

  const [currentDataFromFirebase, setCurrentDataFromFirebase] = useState({});
  // const [imageUrl, setImageUrl] = useState("");
  // const [editData, setEditData] = useState({
  //   name: "",
  //   dob: "",
  //   email: "",
  // });
  
  // useEffect(() => {
  //   const getImageUrl = async () => {
  //     try {
  //       const storageRef = ref(storage, `image/${imageUrl.name}`); // Replace with your image path
  //       const url = await getDownloadURL(storageRef);
  //       setImageUrl(url);
  //       {console.log(setImageUrl);}
  //     } catch (error) {
  //       console.error('Error fetching image:', error);
  //     }
  //   };

  //   getImageUrl();
  // }, [storage]);


  useEffect(() => {
    const getDatasFromFirebase = async () => {
      try {
        const docRef = doc(db, "Database", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentDataFromFirebase(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getDatasFromFirebase();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that the data you want to update is in the correct format.
    const updatedData = currentDataFromFirebase;

    try {
      // Update the document in the Firestore database.
      await setDoc(doc(db, "Database", id), updatedData);

      // Handle image uploads if needed (uncomment the code if necessary).
      // uploadImages();

      // You can add a success message or redirect the user here.
      // alert("Data updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // const uploadImages = () => {
  //   if (imageUpload == null && idproof == null) return;

  //   const imgRef = ref(storage, `image/${imageUpload.name}`);
  //   uploadBytes(imgRef, imageUpload);

  //   const idRef = ref(storage, `idCopy/${idproof.name}`);
  //   uploadBytes(idRef, idproof);
  // };

  // Add your state and event handling logic for the editData, imageUpload, and idproof here.

  // return (
    // <div className="container min-h-screen mx-auto p-4">
    //  
    //   <form onSubmit={handleSubmit}>
    //     <div>
    //       <label>Name:</label>
    //       <input
    //         type="text"
    //         name="name"
    //         value={currentDataFromFirebase.name}
    //         onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value }) }
    //       />
    //     </div>


 // App.js

  return (
    <div className="h-screen w-screen flex items-center rounded-md shadow-md">
       {/* <h1 className="text-2xl font-bold mb-4">Edit User Data</h1> */}
      <div className="w-1/3 h-full  bg-[#2960A1] rounded-s-md shadow-lg">
        <div className="flex items-center justify-center m-8">
        <img src={currentDataFromFirebase.image} alt="User" className="w-48 h-48 rounded-full border-solid border-[#8DC162] border-4 object-cover" />
        </div>
        <div className="">
        <div className="flex flex-wrap gap-4 p-10">
                    <div className="w-full">
                      <label className="mb-2 text-white font-semibold ">Email</label>
                      <input type="text" name="email" className="w-full mb-2 border-b-2 text-white border-white bg-transparent outline-none" value={currentDataFromFirebase.email} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, email: e.target.value })}/>
                      </div>
                      <div className="w-full">
                      <label className="mb-2 text-white font-semibold">Phone No.</label>
                      <input type="text" name="phone" className="w-full mb-2 border-b-2 text-white border-white bg-transparent outline-none" value={currentDataFromFirebase.phone} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, phone: e.target.value })}/>
                      </div>
                      <div className="w-full">
                      <label className="mb-2 text-white font-semibold">Alternative Phone No.</label>
                    <input type="text" name="alternativePhone" className="w-full mb-2 border-b-2 text-white border-white bg-transparent outline-none" value={currentDataFromFirebase.alternativePhone} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, alternativePhone: e.target.value })}/>
                    </div>
                  </div>
        </div>
      </div>
      <div className="w-full h-full overflow-y-scroll bg-gray-100 rounded-e-md shadow-md">
      <div className="flex flex-wrap gap-4 m-10 mb-0">
              <div className="w-full">
              {/* <label className="mb-2">Name</label> */}
              <input type="text" name="name" className="w-full mb-2 border-b-2 text-5xl font-semibold bg-transparent outline-none" placeholder="Name" value={currentDataFromFirebase.name} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })}/>
              </div>
              {/* <label className="mb-2">Date of Birth</label> */}
              <div className="w-1/3">
              <input type="text" name="dob" className="w-full mb-2 border-b-2 outline-none bg-transparent" placeholder="Date of Birth" value={currentDataFromFirebase.dob} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, dob: e.target.value })}/>
              </div>
              {/* <label className="mb-2">Age</label> */}
              <div className="w-1/3">
              <input type="text" name="gender" className="w-full mb-2 border-b-2 outline-none bg-transparent" placeholder="Gender" value={currentDataFromFirebase.gender} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, gender: e.target.value })}/>
            </div>
          </div>
          <div>
            <div className="p-4 rounded-lg shadow-lg ">
              <div>
              <h2 className="text-2xl font-semibold m-8">Personal Details</h2>
                <div className="flex flex-wrap gap-4 m-8">
              <div className="w-1/3">
              <label className="mb-2 font-medium">Address</label>
              <input type="text" name="streetAddress" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.streetAddress} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, sreetAddress: e.target.value })} />
              <label className="mb-2 font-medium">Address 2</label>
              <input type="text" name="addressLine2" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.addressLine2} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, addressLine2: e.target.value })} />
              <label className="mb-2 font-medium">City</label>
              <input type="text" name="city" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent"  value={currentDataFromFirebase.city} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, city: e.target.value })} />
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">State</label>
              <input type="text" name="state" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.state} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, state: e.target.value })}/>
              <label className="mb-2 font-medium">Zipcode</label>
              <input type="text" name="zipcode" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.zipcode} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, Zipcode: e.target.value })} />
              <label className="mb-2 font-medium">Country</label>
              <input type="text" name="country" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent"value={currentDataFromFirebase.country} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, country: e.target.value })} />
            </div>
          </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mt-4 m-8">Program Details</h2>
                  <div className="flex flex-wrap gap-4 m-8">
                    <div className="w-1/3">
                      <label className="mb-2 font-medium">Program Enroll For</label>
                      <input type="text" name="certificationProgram" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent"  value={currentDataFromFirebase.certificationProgram} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })} />
                      </div>
                      <div className="w-1/3">
                      <label className="mb-2 font-medium">Date of Registration</label>
                      <input type="text" name="registrationDate" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.registrationDate} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })}  />
                      </div>
                  </div>
              </div>
                
              <div>
              <h2 className="text-2xl font-semibold m-8">Education Qualification & Experience</h2>
            <div className="flex flex-wrap gap-4 m-8">
            <div className="w-1/3">
              <label className="mb-2 font-medium">Education</label>
              <input type="text" name="education" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.education} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })} />
              <label className="mb-2 font-medium">Total Year of Experience</label>
              <input type="text" name="totalExperience" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.totalExperience} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })}/>
              <label className="mb-2 font-medium">Relevent Experience in HR</label>
              <input type="text" name="hrExperience" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.hrExperience} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })}/>
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">Previous organization</label>
              <input type="text" name="prevOrg" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.prevOrg} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })} />
              <label className="mb-2 font-medium">Current organization</label>
              <input type="text" name="currentOrg" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.currentOrg} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })} />
              <label className="mb-2 font-medium">Designation</label>
              <input type="text" name="designation" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.designation} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })} />
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">Linkedin Profile URL</label>
              <input type="text" name="linkedin" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.linkedin} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })} />
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">How Did you find us?</label>
              <input type="text" name="howFound" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.howFound} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value })} />
            </div>
        </div>
            <button type="submit" className="bg-[#2960a1] m-6 hover:bg-[#8DC162] text-white py-2 px-4 rounded-md focus:outline-none transition duration-300 ease-in-out font-medium" onClick={handleSubmit}>Update</button>
          </div>
        </div>
       </div>       
    </div>
  </div>
  );





// export default App;


        {/* <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={editData.dob}
            onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="email"
            name="phone"
            value={editData.phone}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
          />
        </div> */}
        
        {/* Add input fields for other data fields here */}

      //  
      {/* // </form> */}

      {/* Display user data */}
  //     <div>
  //       <h2>User Data:</h2>
  //       <p>Name: {currentDataFromFirebase.name}</p>
  //       <p>Date of Birth: {currentDataFromFirebase.dob}</p>
  //       <p>Email: {currentDataFromFirebase.email}</p>
  //       <p>Phone: {currentDataFromFirebase.phone}</p>
  //       {/* Add paragraphs for other data fields here */}
  //     </div>
  //   </div>
  // );
}

export default EditUser;
