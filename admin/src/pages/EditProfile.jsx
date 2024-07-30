import React from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { API } from "../utility";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const fetchUser = async (id) => {
  const { data } = await axios.get(`${API}/college/get/${id}`);
  return data;
};

const EditProfile = () => {
  const auth = useSelector((state) => state.auth.user);
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(auth.id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const updateUserPassword = async (newPassword) => {
    console.log("hello");
    const { data } = await axios.put(`${API}/college/update/${auth.id}`, {
      password: newPassword,
    });
    return data;
  };

  const mutation = useMutation({
    mutationFn: (newPassword) => updateUserPassword(newPassword),
    onSuccess: () => {
reset()
toast.success(
  <p className="text-green-500 text-xs italic mt-4">
    Password updated successfully!
  </p>
);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data.password);
  };

  if (isLoading) {
    return <div className="flex w-full justify-center"><Loading /></div>;
  }

  if (isError) {
    return <div>Error loading user data</div>;
  }

 return (
   <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
     <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
       <h1 className="text-2xl mb-4 text-center text-gray-900 dark:text-gray-100">
         Edit Profile
       </h1>
       <form onSubmit={handleSubmit(onSubmit)}>
         <div className="mb-4">
           <label
             className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
             htmlFor="email"
           >
             Email
           </label>
           <input
             type="email"
             id="email"
             value={user.email}
             disabled
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           />
         </div>
         <div className="mb-4">
           <label
             className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
             htmlFor="password"
           >
             New Password
           </label>
           <input
             type="password"
             id="password"
             {...register("password", { required: true, minLength: 6 })}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           />
           {errors.password && (
             <p className="text-red-500 text-xs italic">
               Password is required and must be at least 6 characters long.
             </p>
           )}
         </div>
         <div className="flex items-center justify-between">
           <button
             type="submit"
             className="flex items-center justify-between gap-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
             disabled={mutation.isPending}
           >
             <p>{mutation.isPending ? "Updating..." : "Update Password"}</p>
             {mutation.isPending && <Loading />}
           </button>
         </div>
       </form>
       {mutation.isError && (
         <p className="text-red-500 text-xs italic mt-4">
           Error updating password. Please try again.
         </p>
       )}
     </div>
   </div>
 );
};

export default EditProfile;
