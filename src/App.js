import './App.css';
import loginPic from './Group.svg'
import vector from './Vector 636.svg'
import ellipse from './Ellipse 1184.svg'
import diamond from './Group 1000003346.svg'
import circle from './Ellipse 1185.svg'
import diamond2 from './Group 1000003347.svg'
function App() {
  return (
    <div className="min-h-screen p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-center w-full bg-[#E7EBF2]">
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
      <div className="md:w-1/4 rounded-lg shadow-lg p-8 bg-white">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#2960a1]"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
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
            />
          </div>
          <button
            className="bg-[#2960a1] text-white py-2 px-4 w-full font-semibold rounded-lg hover:bg-[#8dc162] focus:outline-none focus:bg-[#8dc162]"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    {/* </div> */}
  </div>
  );
}

export default App;
