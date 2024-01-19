import React, { useEffect, useState } from 'react';
import './SignIn.css'
import { useForm } from 'react-hook-form';
import { Envelope, Lock } from 'react-bootstrap-icons';

export default function SignIn() {
   const { register, handleSubmit, formState: { errors }, trigger } = useForm();
   const onSubmit = data => {
      console.log(data)
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className='form' id='signin'>
         <div className={errors.email ? 'error' : ''}>Email : </div>
         <div className={errors.email ? 'withicon error' : 'withicon'}>
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
            {errors.email && (<div className='errortext'>{errors.email.message}</div>)}
         </div>
         <div className={errors.password ? 'error' : ''}>Password : </div>
         <div className={errors.password ? 'withicon error' : 'withicon'}>
            <input type="password"   {...register("password", { onBlur: () => trigger('password'), required: 'Please enter Password', minLength: { message: "Password have atl least 8 Characters", value: 8 } })} />
            <Lock></Lock>
            {errors.password && (<div className='errortext'>{errors.password.message}</div>)}
         </div>
         <input type="submit" className='submit' value='Submit' />
      </form>
   );
}