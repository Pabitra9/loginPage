import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import loginPic from '../Group.svg'
import vector from '../Vector 636.svg'
import ellipse from '../Ellipse 1184.svg'
import diamond from '../Group 1000003346.svg'
import circle from '../Ellipse 1185.svg'
import diamond2 from '../Group 1000003347.svg'
import { firebaseAuth } from '../RegistrationForm/firebase';
import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { addUser } from '../Redux/UserSlice';
function LoginPage() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [inputEmail,setInputEmail] = useState(); 
  const [inputPassword,setInputPassword] = useState();
  const [errorMessage, setErrorMessage] = useState(""); 


    const userDispatch = useDispatch()
    const handleInputChange = () => {
      setErrorMessage("");
    };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Perform login logic here, and if successful, set isLoggedIn to true
    // const credentialsSubmitted = async () => {
      try {
          await signInWithEmailAndPassword(firebaseAuth, inputEmail, inputPassword)
          .then((userCredential) => {
              // Signed in 
              const user = userCredential.user;
              // console.log(user);
              const filteredUser = {
                  email : user.email,
                  token : user.accessToken,
                  displayName : user.displayName,
                  userId : user.uid,
              }
              if (filteredUser.token) {
                  console.log(filteredUser);
                  userDispatch(addUser(filteredUser))
                  setLoggedIn(true);
              }
            })
      } catch (error) {
          console.error(error)
          setErrorMessage("Invalid login credentials");
      // }
  }
  };
  return (
    <div className="min-h-screen p-8 rounded-lg gap-36 shadow-lg flex md:flex-row items-center justify-center w-full bg-[#E7EBF2]">
    <img src={vector} className='absolute top-[100px] left-0 w-56'/>
    <img src={ellipse} className='absolute top-[180px] left-80 w-8'/>
    <img src={diamond} className='absolute top-[520px] left-24 w-48'/>
    <img src={circle} className='absolute top-[90px] left-[45%] w-16'/>
    <img src={diamond2} className='absolute top-[80px] left-[55%] w-16'/>

    
      {/* Left Partition for Image */}
      <div className="md:w-2/4 mb-4 md:mb-0 pr-12">
        <img src={loginPic} className="max-h-72 max-w-full mx-auto"/>
      </div>

      {/* Right Partition for Login Form */}
      <div className="md:w-1/4 rounded-lg shadow-lg p-8 bg-white ml-14">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {isLoggedIn ? (<Navigate to="/dashboard"/>) : (<p className='text-red-600'>{errorMessage}</p>) }
        <form >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email" >
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#2960a1]"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={(e) => {setInputEmail(e.target.value);handleInputChange()}}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#2960a1]"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={(e) => {setInputPassword(e.target.value);handleInputChange()}}
            />
          </div>
          <button
            className="bg-[#2960a1] text-white py-2 px-4 w-full font-semibold rounded-lg hover:bg-[#8dc162] focus:outline-none focus:bg-[#8dc162]"
            type="submit" onClick={(e) => handleLogin(e)}
          >
            Login
          </button>
        </form>
      </div>
    {/* </div> */}
  </div>
  
  );
}

export default LoginPage;
