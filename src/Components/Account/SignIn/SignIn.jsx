import React, { useEffect, useState } from 'react';
import './SignIn.css'
import { useForm } from 'react-hook-form';

export default function SignIn() {
   const { register, handleSubmit, formState: { errors }, trigger } = useForm();
   const onSubmit = data => {
      console.log(data)
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className='form' id='signin'>
         <div>
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
         </div>
         <div>
            <input type="password"   {...register("password", { onBlur: () => trigger('password'), required: 'Please enter Password', minLength: { message: "Password have atl least 8 Characters", value: 8 } })} />
         </div>
         <input type="submit" className='submit' value='Submit' />
      </form>
   );
}