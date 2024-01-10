import React, { useEffect, useState } from 'react';
import './SignUp.css'
import { useForm } from 'react-hook-form';
import { Calendar3, Envelope, Lock, Pen, PencilFill, Person } from 'react-bootstrap-icons';

export default function SignUp() {
   const [profile, setProfile] = useState();
   const { register, handleSubmit, formState: { errors }, trigger } = useForm();
   const onSubmit = data => {
      console.log(data)
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className='form' id='signup'>

         <label htmlFor="profile" className='profile'>
            {profile ? (<img src={profile} className='profileimg' />) : (<Person className='profileicon' />)}
            <PencilFill className='edit'></PencilFill>
            <input type='file' id="profile" accept='image/*' {...register('profile', { onChange: (e) => (e.target.files[0]) ? setProfile(URL.createObjectURL(e.target.files[0])) : null })} />
         </label>
         <div className='firstlastname'>
            <input type="text" placeholder='Firstname'   {...register("firstname")} />
            <input type="text" placeholder='Surname'  {...register("lastname")} />
         </div>
         <div>Username : </div>
         <div className='withicon'>
            <input type="text"   {...register("username", { required: "Username cannot be Empty", minLength: { message: "Username have at least 5 Characters", value: 5 }, onBlur: () => trigger('username') })} />
            <Person></Person>
         </div>
         <div>Email : </div>
         <div className='withicon'>
            <input
               type="email"
               id="email"

               {...register("email", {
                  onBlur: () => trigger('email'), // Trigger validation on blur
                  required: 'Please Enter Email',
                  pattern: {
                     value: /^\S+@\S+\.\S+$/,
                     message: 'Please Enter Valid Email',
                  },
               })}
            />
            <Envelope></Envelope>
         </div>
         <div>Password : </div>
         <div className='withicon'>
            <input type="password"   {...register("password", { onBlur: () => trigger('password'), required: 'Please enter Password', minLength: { message: "Password have atl least 8 Characters", value: 8 } })} />
            <Lock></Lock>
         </div>
         <div>Date : </div>
         <div className='withicon'>
            <input
               type="date"
               id="dob"
               {...register("dob", {
                  required: 'Date of Birth is required',
                  validate: (value) => {
                     const selectedDate = new Date(value);
                     const currentDate = new Date();
                     if (selectedDate >= currentDate) {
                        return 'Date of Birth must be in the past';
                     }
                     return true;
                  },
               })}
               onBlur={() => trigger("dob")}
            />
            <Calendar3></Calendar3>
         </div>
         <input type="submit" className='submit' value='Submit' />
      </form>
   );
}