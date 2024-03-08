import { db } from "./firebase";
import { Timestamp } from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HiPlus, HiX } from "react-icons/hi";
import CollectionData from '.././Collection.json'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserDataBasedOnId } from "../Redux/DataBasedOnIdSlice";


function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentDataFromFirebase, setCurrentDataFromFirebase] = useState({});
  const [userId, setUserId] = useState()
  const [originalData, setOriginalData] = useState({});
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewIDImage, setPreviewIDImage] = useState(null);
  const [newIdProofFile, setNewIdProofFile] = useState(null);
  const statusOptions = ['Initial fill up', 'In Progress', 'Completed'];
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastlogin , setLastlogin] = useState(null)
 const [ humanReadableTime , setHumanReadableTime ] = useState(null)

  const userDispatch = useDispatch()

  const handleIdProofClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  function generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 20; // You can adjust the length of the ID as needed
    let randomId = '';
  
    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
  
    return randomId;
  }

  async function convertDateToFirestoreTimestamp(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Use Firestore Timestamp.fromDate() method to convert it
    return Timestamp.fromDate(date);
}
// for creating timestamp in firebase , check wheather timestamp is there or not while importing


  

    const handleMigrateCollection = () =>{
    const yourCollection = collection(db,'Database');

    // Sample data for all documents

    const allDocumentsData = CollectionData

    // Add all documents to the collection
    allDocumentsData.forEach(async (docData, index) => {
      const randomId = generateRandomId();
      const documentRef = doc(yourCollection, randomId);

      const dateString = docData.timestamp;
      const firestoreTimestamp = await convertDateToFirestoreTimestamp(dateString);
      console.log(firestoreTimestamp);

      docData.timestamp =  firestoreTimestamp;
  
      setDoc(documentRef, docData)
        .then(() => {
          console.log(`Document ${index + 1} added successfully with ID: ${randomId}`);
        })
        .catch((error) => {
          console.error(`Error adding document ${index + 1}: `, error);
        });
    });
    console.log('migrate hela');
    navigate('/dashboard')
    // handleMigrateCollection();
  };
  

  
  const handleStatusChange = (e) => {
    e.preventDefault();
    const updatedData = {
      ...currentDataFromFirebase,
      status: e.target.value,
    };
    setCurrentDataFromFirebase(updatedData);
  };

  const handleIdProofFileChange = (e) => {
    e.preventDefault();
    setNewIdProofFile(e.target.files[0]);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewIDImage(reader.result);
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    // setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };


  const updateIdProof = async () => {
    try {
      //if (newIdProofFile) {
        setLoading(true)
        const newIdProofStorageRef = ref(storage, `idCopy/${newIdProofFile.name}`);
        await uploadBytes(newIdProofStorageRef, newIdProofFile);
        const newIdProofUrl = await getDownloadURL(newIdProofStorageRef);
        console.log(newIdProofUrl);
        // Update the Firestore document with the new ID proof URL
        const updatedData = {
          ...currentDataFromFirebase,
          idProof: newIdProofUrl,
        };
        console.log(updatedData);
        await setDoc(doc(db, "Database", id), updatedData);
        setCurrentDataFromFirebase(updatedData);
        console.log(newIdProofUrl);
        setLoading(false)
        // alert("Successfully Updated");
        // navigate("/dashboard");  
      //} else {
        //alert("You dont choose anything Update")  
      //}
    } catch (error) {
      setLoading(false)
      console.error("Error updating ID proof:", error);
      alert("Error updating ID proof");
    }
  };
  

  const userToken =JSON.parse(localStorage.getItem('userDatas'))
  useEffect(() => {
    const getDatasFromFirebase = async () => {
      try {
        const docRef = doc(db, "Database", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentDataFromFirebase(docSnap.data());
          const userEmailID = docSnap.data().email
          setOriginalData(docSnap.data())
          console.log(userToken);
          // userDispatch(addUserDataBasedOnId(docSnap.data()))
          await fetch (`https://academy.chrmp.com/wp-json/custom-app/v1/get-user-id?email_id=${userEmailID}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
            },
          })
            .then(async (res) => {
              if (res.status === 200) {
                const data = await res.json();
                console.log(data);
                setUserId(data?.user_id)
                //console.log(userId);
                console.log("hela");
                await fetch (`https://academy.chrmp.com/wp-json/custom-app/v1/get-user-login-status?user_id=${data?.user_id}`,{
               method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userToken}`,
                },
              })
                .then(async (res) => {
                  if (res.status === 200) {
                    const data = await res.json();
                    console.log(data);
                    
                    console.log("hela");
                      var timestamp = data.last_login;

                      // Convert to milliseconds by multiplying by 1000
                      var milliseconds = timestamp * 1000;

                      // Create a new Date object with the milliseconds
                      var dateObject = new Date(milliseconds);

                      // Define options for formatting the date and time
                      var options = {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        timeZone: 'Asia/Kolkata', // Indian timezone
                      };
                      // Format the date using the specified options
                      const humanReadableTime = dateObject.toLocaleString('en-IN', options);
                      setHumanReadableTime(humanReadableTime)
                      setLastlogin(data.login_status)
                      console.log(humanReadableTime);
                  }
                })
                .catch((error) => {
                  console.error(error)
                });
              }
            })
            .catch((error) => {
              console.error(error)
            });
        }
      } catch (error) {
        console.log(error);
      }
    }

    if(userToken ) {
    getDatasFromFirebase();
    }
  }, [id,userToken]);

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
  newIdProofFile && console.log(newIdProofFile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = currentDataFromFirebase;
    console.log(updatedData);

    const isDataChanged = JSON.stringify(currentDataFromFirebase) !== JSON.stringify(originalData);
    const isIdProofChanged = newIdProofFile !== null;
    const isProfilePhotoChanged = newProfilePhoto !== null;
    
    if (!isDataChanged && !isProfilePhotoChanged && !isIdProofChanged) {
      alert('Nothing has changed to update.');
      return;
    }
    
    try {
      // Update the document in the Firestore database.
      const updateDocResponse = await updateDoc(doc(db, "Database", id), updatedData);
      console.log(updateDocResponse);
      // console.log(newIdProofFile);
      if (newProfilePhoto ) {
        await updateProfilePhoto();
      }
      console.log(newIdProofFile);
      if (newIdProofFile ) {
        await updateIdProof();
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
      setLoading(true)
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
      setLoading(false)
    
    } catch (error) {
      console.error("Error updating profile photo:", error);
      setLoading(false)
    }
  };
  // console.log(id);

  return (
    <div className="h-screen w-screen flex items-center rounded-md shadow-md overflow-hidden">
       {/* <h1 className="text-2xl font-bold mb-4">Edit User Data</h1> */}
      <div className="w-1/3 h-full  bg-[#2960A1] rounded-s-md shadow-lg">
        <div className="flex items-center justify-center m-5 ">
          {previewImage ? (<img src={previewImage} alt="User" className="w-48 h-48 rounded-full border-solid border-[#8DC162] border-4 object-cover" />) : (<img src={currentDataFromFirebase.image } alt="User" className="w-48 h-48 rounded-full border-solid border-[#8DC162] border-4 object-cover" />)}
        {/* {console.log(currentDataFromFirebase.image)} */}
        
       </div>
       <div className="flex items-center justify-center m-8 mt-0 mb-2 bg-white p-2 gap-1 " >
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
        <HiPlus className="text-lg"/>
       </div>
        <div className="">
        <div className="flex flex-wrap gap-4 p-10 pt-0 pb-2">
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
                   <div className="flex justify-center items-center flex-col ">
                        <div className="w-72 h-32 border-2 border-solid border-white rounded-md overflow-hidden ">
                {previewIDImage ? (
                <img src={previewIDImage} alt="New ID Proof Preview" className="w-full h-full object-cover overflow-hidden cursor-pointer"  onClick={handleIdProofClick} />
                ):(<img src={currentDataFromFirebase.idProof} alt="ID Proof" className="w-full h-full  object-cover overflow-hidden cursor-pointer"  onClick={handleIdProofClick}/>)}
                {showModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-md">
                <img
                src={previewIDImage || currentDataFromFirebase.idProof}
                alt="ID Proof"
                className="w-full h-full object-cover "
                />
              <button className="absolute top-4 right-4 text-white font-semibold flex justify-center items-center gap-2 text-lg bg-red-500 p-2 rounded-md" onClick={closeModal}>
              Close <HiX/>
            </button>
          </div>
        </div>
      )}               
                        </div>
                    <div className="flex items-center justify-center m-8 mt-6 bg-white p-2 gap-1 " >
                    <label htmlFor="idProofInput" className="cursor-pointer">
                      Edit IdPoof
                    <input
                    id="idProofInput"
                    name="idProof"
                  type="file"
                  accept=".jpg,.png,image/*"
                  onChange={handleIdProofFileChange}
                  className="hidden"
                  />
                  </label>
                  <HiPlus className="text-lg"/>
                  </div>
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
   <div className="flex justify-items-end items-baseline">
  {lastlogin
 ? (
  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
  ) : (
    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
  )}

  {humanReadableTime && (
    <p className="text-sm text-gray-500">
      Last Login: {humanReadableTime}
    </p>
  )}
</div>
    <select
    value={currentDataFromFirebase.status}
    onChange={(e) => handleStatusChange(e, id)}
    className={`px-2 py-1 outline-none w-auto h-10 rounded ${currentDataFromFirebase?.status === 'Initial fill up' ? 'bg-[#FF8589] border-2 border-red-800 font-medium text-red-800' : currentDataFromFirebase?.status === 'In Progress' ? 'bg-[#90EE90] font-medium border-2 border-green-800 text-green-800' : currentDataFromFirebase?.status === 'Completed' ? 'bg-[#ADD8E6] font-medium border-2 border-blue-800 text-blue-800' : null }`}
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
            <button type="submit" className="bg-[#2960a1] m-6 hover:bg-[#8DC162] text-white py-2 px-4 rounded-md focus:outline-none transition duration-300 ease-in-out font-medium" onClick={handleSubmit} disabled={loading}>{loading ? "Updating..." : "Update"}</button>
            {/* <button type="submit" className="bg-[#2960a1] m-6 hover:bg-[#8DC162] text-white py-2 px-4 rounded-md focus:outline-none transition duration-300 ease-in-out font-medium" onClick={handleMigrateCollection}>Upload</button> */}
          </div>
        </div>
       </div>       
    </div>
  </div>
  );
}

export default EditUser;
