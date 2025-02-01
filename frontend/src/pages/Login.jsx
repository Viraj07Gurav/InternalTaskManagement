// import { useEffect, useState } from "react";
// import LoginForm from "../components/Auth/Login/LoginForm";
// import Axios from "axios";

// const Login = () => {

//   // // for testing
//   // const [data,setData] = useState("");

//   // const getData = async() => {
//   //   const response = await Axios.get("http://localhost:5000/getData");
//   //   setData(response.data);
//   // }

//   // useEffect(()=> {
//   //   getData();
//   // },[]);


//   return (
//     <div className="flex flex-col gap-[1rem] items-center justify-center min-h-screen px-4 sm:px-0 py-[2rem] bg-gradient-to-br from-blue-50 to-indigo-50 ">
//       <div className="w-full max-w-sm p-6 sm:p-8 bg-white border-2 border-blue-100 shadow-lg rounded-2xl ">
//         <div className="mb-8 flex flex-col text-center gap-4">
//           <div className="flex flex-row items-center justify-start gap-2">
//             <svg
//               className="w-8 h-8 text-blue-600 "
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
//               />
//             </svg>
//             <h1 className="text-blue-600 text-2xl font-bold ">
//               TaskFlow
//             </h1>
//           </div>
//           <div className="flex flex-row justify-between items-center relative">
//             <h1 className="text-3xl font-semibold text-gray-800 ">
//               Welcome Back 
//             </h1>
//           </div>
//         </div>
//         <LoginForm />
//       </div>
//     </div>
//   );
// };
// export default Login;




import { useEffect, useState } from "react";
import LoginForm from "../components/Auth/Login/LoginForm";
import Axios from "axios";

const Login = () => {
  return (
    <div className="flex flex-col gap-[1rem] items-center justify-center min-h-screen px-4 sm:px-0 py-[2rem] bg-gradient-to-br from-blue-50 to-indigo-50 ">
      <div className="w-full max-w-sm p-6 sm:p-8 bg-white border-2 border-blue-100 shadow-lg rounded-2xl ">
        <div className="mb-8 flex flex-col text-center gap-4">
          <div className="flex flex-row items-center justify-start gap-2">
            <svg
              className="w-8 h-8 text-blue-600 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h1 className="text-blue-600 text-2xl font-bold ">
              TaskFlow
            </h1>
          </div>
          <div className="flex flex-row justify-between items-center relative">
            <h1 className="text-3xl font-semibold text-gray-800 ">
              Welcome Back 
            </h1>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
export default Login;
