import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs , addDoc } from 'firebase/firestore';
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HiPlus } from "react-icons/hi";
import { CiImport } from "react-icons/ci";
import { readExcelFile } from '../Components/ReadExcelFileToImport';
import { useEffect, useState } from "react";

// import {collectionData} from "../Collection.json"

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentDataFromFirebase, setCurrentDataFromFirebase] = useState({});
  const [data, setData] = useState([])
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [excelFile , setExcelFile] = useState ("")
  const statusOptions = ['Open', 'In Progress', 'Completed'];


    const handleMigrateCollection = () =>{
    const yourCollection = collection(db,'Database');

    // Sample data for all documents
    const allDocumentsData =  [
      {
        "balance": "$3,946.45",
        "image": "http://placehold.it/32x32",
        "age": 23,
        "name": "Bird Ramsey",
        "gender": "male",
        "company": "NIMON",
        "email": "birdramsey@nimon.com"
      },
      {
        "balance": "$2,499.49",
        "picture": "http://placehold.it/32x32",
        "age": 31,
        "name": "Lillian Burgess",
        "gender": "female",
        "company": "LUXURIA",
        "email": "lillianburgess@luxuria.com"
      },
      {
        "balance": "$2,820.18",
        "picture": "http://placehold.it/32x32",
        "age": 34,
        "name": "Kristie Cole",
        "gender": "female",
        "company": "QUADEEBO",
        "email": "kristiecole@quadeebo.com"
      },
      {
        "balance": "$3,277.32",
        "picture": "http://placehold.it/32x32",
        "age": 30,
        "name": "Leonor Cross",
        "gender": "female",
        "company": "GRONK",
        "email": "leonorcross@gronk.com"
      },
      {
        "balance": "$1,972.47",
        "image": "http://placehold.it/32x32",
        "age": 28,
        "name": "Marsh Mccall",
        "gender": "male",
        "company": "ULTRIMAX",
        "email": "marshmccall@ultrimax.com"
      }
    ]

    // Add all documents to the collection
    allDocumentsData.forEach((docData, index) => {
      setDoc(doc(yourCollection, `document_${index + 1}`), docData)
        .then(() => {
          // console.log(`Document ${index + 1} added successfully`);
        })
        .catch((error) => {
          console.error(`Error adding document ${index + 1}: `, error);
        });
    })};
    
  useEffect(() => {
    handleMigrateCollection();
  }, []);
  
  const handleStatusChange = (e) => {
    e.preventDefault();
    const updatedData = {
      ...currentDataFromFirebase,
      status: e.target.value,
    };
    setCurrentDataFromFirebase(updatedData);
  };


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

  const handleFileChange = (e) => {
    e.preventDefault();
    setNewProfilePhoto(e.target.files[0]);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

  };

  newProfilePhoto && console.log(newProfilePhoto);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = currentDataFromFirebase;
    console.log(updatedData);

    try {
      // Update the document in the Firestore database.
      const updateDocResponse = await updateDoc(doc(db, "Database", id), updatedData);
      console.log(updateDocResponse);

      if (newProfilePhoto) {
        await updateProfilePhoto();
      }

      if (currentDataFromFirebase.status !== currentDataFromFirebase.statusInFirestore) {
        const itemDocRef = doc(db, 'Database', id);
        await updateDoc(itemDocRef, { status: currentDataFromFirebase.status });
      }

      alert('Successfully Updated')
      navigate('/dashboard')
    } catch (error) {
      // console.log(error); 
     console.log({...error}); 
      if (error.code == 'permission-denied') {
        alert("You don't have sufficient permission")
      }
    }
  };
  const updateProfilePhoto = async () => {
    try {
      const storageRef = ref(storage, `image/${newProfilePhoto?.name}`); // Adjust the path as needed
      // console.log(storageRef);
    
      await uploadBytes(storageRef, newProfilePhoto); // Upload the new profile photo
      const downloadNewProfileUrl = await getDownloadURL(storageRef);
      const updatedData = {
        ...currentDataFromFirebase,
        image: downloadNewProfileUrl,
      };
      console.log(updatedData);
      await setDoc(doc(db, "Database", id), updatedData);

      // Update the state or wherever you store currentDataFromFirebase
      setCurrentDataFromFirebase(updatedData);
      // setDownloadPic(downloadNewProfileUrl)
      console.log(downloadNewProfileUrl);
      
      // console.log(newProfilePhoto);
    
    } catch (error) {
      console.error("Error updating profile photo:", error);
    }
  };
  console.log(id);
      const handleInputFileChange = (e) => {
        e.preventDefault()
        setExcelFile (e.target.files[0])
      };

      const handleImportData = async () => {
        try {
          if (!excelFile) {
            console.error('No Excel file selected');
            return;
          }
      
          // Read the Excel file
          const excelData = await readExcelFile(excelFile);
      
          // Assuming the first row in excelData contains field names
          const fieldNames = excelData[0];
      
          // Assuming each array in excelData represents a row of data
          const yourCollection = collection(db, 'Database');
      
          for (let index = 1; index < excelData.length; index++) {
            try {
              const data = excelData[index];
      
              // Convert the array to an object using field names from the first row
              const objectData = {};
              fieldNames.forEach((fieldName, i) => {
                // Add the field to the object regardless of whether it's defined
                objectData[fieldName] = data[i];
              });
      
              // Add each document to the collection
              await addDoc(yourCollection, objectData);
            } catch (error) {
              console.error(`Error adding document ${index}: `, error);
            }
          }
      
          alert('Data imported successfully');
        } catch (error) {
          console.error('Error reading Excel file:', error);
          alert('Error importing data');
        }
      };
      


  return (
    <div className="h-screen w-screen flex items-center rounded-md shadow-md">
       {/* <h1 className="text-2xl font-bold mb-4">Edit User Data</h1> */}
      <div className="w-1/3 h-full  bg-[#2960A1] rounded-s-md shadow-lg">
        <div className="flex items-center justify-center m-8 ">
          {previewImage ? (<img src={previewImage} alt="User" className="w-48 h-48 rounded-full border-solid border-[#8DC162] border-4 object-cover" />) : (<img src={currentDataFromFirebase.image } alt="User" className="w-48 h-48 rounded-full border-solid border-[#8DC162] border-4 object-cover" />)}
        {/* {console.log(currentDataFromFirebase.image)} */}
        
       </div>
       <div className="flex items-center justify-center m-8 bg-white p-2 gap-1" >
       <label htmlFor="profilePhotoInput" className="cursor-pointer">
            Edit Photo
            <input
              id="profilePhotoInput"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        <HiPlus className="text-lg" onClick={updateProfilePhoto}/>
       </div>
        <div className="">
        <div className="flex flex-wrap gap-4 p-10">
                    <div className="w-full">
                      <label className="mb-2 text-white font-semibold ">Email</label>
                      <input type="text" name="email" className="w-full mb-2 border-b-2 text-white border-white bg-transparent outline-none" value={currentDataFromFirebase.email} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, email: e.target.value })}/>
                      </div>
                      <div className="w-full">
                      <label className="mb-2 text-white font-semibold">Phone No.</label>
                      <input type="text" name="phone" className="w-full mb-2 border-b-2 text-white border-white bg-transparent outline-none" value={currentDataFromFirebase.phone} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, phone: e.target.value })}/>
                      </div>
                      <div className="w-full">
                      <label className="mb-2 text-white font-semibold">Alternative Phone No.</label>
                    <input type="text" name="alternativePhone" className="w-full mb-2 border-b-2 text-white border-white bg-transparent outline-none" value={currentDataFromFirebase.alternativePhone} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, alternativePhone: e.target.value })}/>
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
      <div className="w-full flex h-auto items-center justify-between">
      <input
      type="text"
      name="name"
      className="w-auto mb-2 border-b-2 text-5xl font-semibold bg-transparent outline-none capitalize"
      placeholder="Name"
      value={currentDataFromFirebase.name}
      onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, name: e.target.value.toLocaleLowerCase() })}
      />

    <select
    value={currentDataFromFirebase.status}
    onChange={(e) => handleStatusChange(e, id)}
    className={`px-2 py-1 border-solid border-gray-400 border-2 w-auto h-10 rounded ${currentDataFromFirebase?.status === 'Open' ? 'bg-[#FF474C] border-2 border-red-800 font-medium' : currentDataFromFirebase?.status === 'In Progress' ? 'bg-[#90EE90] font-medium border-2 border-green-800' : currentDataFromFirebase?.status === 'Completed' ? 'bg-[#ADD8E6] font-medium border-2 border-blue-800' : null }`}
     >
    {statusOptions.map((option) => (
      <option key={option} value={option} className="bg-white">
        {option}
      </option>
    ))}
    </select>
    </div>
              {/* <label className="mb-2">Date of Birth</label> */}
              <div className="w-1/3">
              <input type="text" name="dob" className="w-full mb-2 border-b-2 outline-none bg-transparent" placeholder="Date of Birth" value={currentDataFromFirebase.dob} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, dob: e.target.value })}/>
              </div>
              {/* <label className="mb-2">Age</label> */}
              <div className="w-1/3">
              <input type="text" name="gender" className="w-full mb-2 border-b-2 outline-none bg-transparent" placeholder="Gender" value={currentDataFromFirebase.gender} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, gender: e.target.value })}/>
            </div>
            <div className="w-1/3">
              {/* <input type="text" name="gender" className="w-full mb-2 border-b-2 outline-none bg-transparent" placeholder="Gender" value={currentDataFromFirebase.gender} onChange={(e) => setCurrentDataFromFirebase({ ...currentDataFromFirebase, gender: e.target.value })}/> */}
            </div>
            {/* <div className="w-1/4">
              <div className="w-32 first-letter flex items-center border-solid border-red-400 border-2 p-1 rounded-md gap-1">
              <CiImport className="text-red-700 text-lg " onClick={handleImportData} />
              <input type="file" accept=".xlsx, .xls" onChange={handleInputFileChange} className=""/>
              </div>
            </div> */}
            {/* <div className="w-1/5">
              <div className="w-32 first-letter flex items-center border-solid border-green-400 border-2 p-1 rounded-md gap-1">
              <CiExport className="text-green-700 text-lg"/>
              {data.length > 0 && (
              <button onClick={handleExportData} className="font-semibold">Export Data</button>
              )}
              </div>
            </div> */}
          </div>
          <div>
            <div className="p-4 rounded-lg shadow-lg ">
              <div>
              <h2 className="text-2xl font-semibold m-8">Personal Details</h2>
                <div className="flex flex-wrap gap-4 m-8">
              <div className="w-1/3">
              <label className="mb-2 font-medium">Address</label>
              <input type="text" name="streetAddress" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.streetAddress} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, streetAddress: e.target.value })} />
              <label className="mb-2 font-medium">Address 2</label>
              <input type="text" name="addressLine2" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.addressLine2} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, addressLine2: e.target.value })} />
              <label className="mb-2 font-medium">City</label>
              <input type="text" name="city" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent"  value={currentDataFromFirebase.city} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, city: e.target.value })} />
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">State</label>
              <input type="text" name="state" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.state} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, state: e.target.value })}/>
              <label className="mb-2 font-medium">Zipcode</label>
              <input type="text" name="zipcode" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.zipcode} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, zipcode: e.target.value })} />
              <label className="mb-2 font-medium">Country</label>
              <input type="text" name="country" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent"value={currentDataFromFirebase.country} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, country: e.target.value })} />
            </div>
          </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mt-4 m-8">Program Details</h2>
                  <div className="flex flex-wrap gap-4 m-8">
                    <div className="w-1/3">
                      <label className="mb-2 font-medium">Program Enroll For</label>
                      <input type="text" name="certificationProgram" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent"  value={currentDataFromFirebase.certificationProgram} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, certificationProgram: e.target.value })} />
                      </div>
                      <div className="w-1/3">
                      <label className="mb-2 font-medium">Date of Registration</label>
                      <input type="text" name="registrationDate" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.registrationDate} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, registrationDate: e.target.value })}  />
                      </div>
                  </div>
              </div>
                
              <div>
              <h2 className="text-2xl font-semibold m-8">Education Qualification & Experience</h2>
            <div className="flex flex-wrap gap-4 m-8">
            <div className="w-1/3">
              <label className="mb-2 font-medium">Education</label>
              <input type="text" name="education" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.education} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, education: e.target.value })} />
              <label className="mb-2 font-medium">Total Year of Experience</label>
              <input type="text" name="totalExperience" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.totalExperience} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, totalExperience: e.target.value })}/>
              <label className="mb-2 font-medium">Relevent Experience in HR</label>
              <input type="text" name="hrExperience" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.hrExperience} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, hrExperience: e.target.value })}/>
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">Previous organization</label>
              <input type="text" name="prevOrg" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.prevOrg} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, prevOrg: e.target.value })} />
              <label className="mb-2 font-medium">Current organization</label>
              <input type="text" name="currentOrg" className="w-full mb-4 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.currentOrg} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, currentOrg: e.target.value })} />
              <label className="mb-2 font-medium">Designation</label>
              <input type="text" name="designation" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.designation} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, designation: e.target.value })} />
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">Linkedin Profile URL</label>
              <input type="text" name="linkedin" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.linkedin} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, linkedin: e.target.value })} />
            </div>
            <div className="w-1/3">
              <label className="mb-2 font-medium">How Did you find us?</label>
              <input type="text" name="howFound" className="w-full mb-2 mt-2 border-b-2 outline-none bg-transparent" value={currentDataFromFirebase.howFound} onChange={(e) => setCurrentDataFromFirebase({...currentDataFromFirebase, howFound: e.target.value })} />
            </div>
        </div>
            <button type="submit" className="bg-[#2960a1] m-6 hover:bg-[#8DC162] text-white py-2 px-4 rounded-md focus:outline-none transition duration-300 ease-in-out font-medium" onClick={handleSubmit}>Update</button>
            <button type="submit" className="bg-[#2960a1] m-6 hover:bg-[#8DC162] text-white py-2 px-4 rounded-md focus:outline-none transition duration-300 ease-in-out font-medium" onClick={handleMigrateCollection}>Upload</button>
          </div>
        </div>
       </div>       
    </div>
  </div>
  );
}

export default EditUser;
