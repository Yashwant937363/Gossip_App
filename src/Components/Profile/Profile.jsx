import React, { useEffect, useState } from 'react';
import './Profile.css'
import { useForm } from 'react-hook-form';
import { Calendar3, Envelope, Lock, Pencil, PencilFill, Person } from 'react-bootstrap-icons';
import { setErrorMsgUser, setProfile, setSignUpDetails, signUpUser } from '../../store/slices/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToggle } from '../Hooks/useToggle';

export default function SignUp() {
    const dispatch = useDispatch()
    const isLogin = useSelector((state) => state.user.isLogin);
    const profile = useSelector((state) => state.user.profile)
    const fullname = useSelector((state) => state.user.fullname)
    const username = useSelector((state) => state.user.username)
    const email = useSelector((state) => state.user.email)
    const dob = new Date(useSelector((state) => state.user.dob))
    const [profiletoggle, profileToggle] = useToggle()
    const [fullnametoggle, fullnameToggle] = useToggle()
    const [usernametoggle, usernameToggle] = useToggle()
    const [emailtoggle, emailToggle] = useToggle()
    const [dobtoggle, dobToggle] = useToggle()
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            dispatch(setErrorMsgUser("Please Login First"))
            navigate('/login');
        }
    }, [isLogin, navigate]);

    const [dateError, setDateError] = useState(false)
    const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm();
    const [daysInMonth, setDaysInMonth] = useState(31);
    const onSubmit = data => {
        const signUpData = new FormData()
        const { day, month, year } = data.date;
        if (day === 29 && year % 4 !== 0) {
            setDateError(true);
            return;
        }
        const birthDate = new Date(
            `${parseInt(year, 10)}-${parseInt(month, 10)}-${parseInt(day, 10)}`
        );
        signUpData.append('profile', data.profile?.[0])
        signUpData.append('fullname', JSON.stringify(data.fullname))
        signUpData.append('username', data.username)
        signUpData.append('email', data.email)
        signUpData.append('password', data.password)
        signUpData.append('dob', birthDate)
        dispatch(setSignUpDetails({
            profile: profile,
            fullname: data.fullname,
            username: data.username,
            email: data.email,
            date: `${birthDate}`
        }))
        dispatch(signUpUser({ signUpData }))
    };
    const onMonthChange = async (e) => {
        setDateError(false)
        let month = getValues("date.month")
        const year = getValues("date.year")
        let lastDay = new Date(year ? year : new Date().getFullYear(), month, 0).getDate();
        if (lastDay === 29) {
            const year = getValues("date.year")
        }
        setDaysInMonth(lastDay)

    }

    return (
        <div className='profilepage'>
            <form className='form' id='signup'>
                <label htmlFor="profile" className='profile'>
                    {profile ? (<img src={profile} className='profileimg' />) : (<Person className='profileicon' />)}
                    <PencilFill className='edit'></PencilFill>
                    <input type='file' id="profile" accept='image/*' {...register('profile', { onChange: (e) => (e.target.files[0]) ? dispatch(setProfile(URL.createObjectURL(e.target.files[0]))) : null })} />
                </label>
                <div className='firstlastname'>
                    {fullnametoggle ? (
                        <>
                            <input type="text" placeholder='Firstname'   {...register("fullname.firstname")} />
                            <input type="text" placeholder='Surname'  {...register("fullname.lastname")} />
                        </>
                    ) : (
                        <span>Name : {fullname?.firstname} {fullname?.lastname}</span>
                    )}
                    <button onClick={fullnameToggle} type='button'><Pencil></Pencil></button>
                </div>
                <div className={errors.username ? 'error' : ''}>Username : </div>
                <div className={errors.username ? 'withicon error' : 'withicon'}>
                    {usernametoggle ? (
                        <>
                            <input type="text" {...register("username", { required: "Username cannot be Empty", minLength: { message: "Username have at least 5 Characters", value: 5 }, onBlur: () => trigger('username') })} />
                            <Person></Person>
                            {errors.username && (<div className='errortext'>{errors.username.message}</div>)}
                        </>
                    ) : (
                        <span>{username}</span>
                    )}
                    <button onClick={usernameToggle} type='button'><Pencil></Pencil></button>
                </div>
                <div className={errors.email ? 'error' : ''}>Email : </div>
                <div className={errors.email ? 'withicon error' : 'withicon'}>
                    {emailtoggle ? (
                        <>
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
                        </>
                    ) : (
                        <span>{email}</span>
                    )}
                    <button onClick={emailToggle} type='button'><Pencil></Pencil></button>
                </div>
                <div>DOB : </div>
                <div className='withicon dob'>
                    {dobtoggle ? (
                        <>
                            <select
                                {...register("date.day", {
                                    required: 'Day is required',
                                    onChange: () => setDateError(false)
                                })}
                            >
                                <option value="">Day</option>
                                {/* Generate options for days 1 to 31 */}
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>

                            {/* Month dropdown */}
                            <select
                                {...register("date.month", {
                                    required: 'Month is required',
                                    onChange: onMonthChange,
                                })}
                            >
                                <option value="">Month</option>
                                {[
                                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                                ].map((monthAbbr, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {monthAbbr}
                                    </option>
                                ))}
                            </select>

                            <select
                                {...register("date.year", {
                                    required: 'Year is required',
                                    onChange: () => setDateError(false)
                                })}
                            >
                                <option value="">Year</option>
                                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <Calendar3></Calendar3>
                            {dateError && (<div>Invalid Date</div>)}
                        </>
                    ) : (
                        <span>{dob.toLocaleDateString('en-US', { month: 'short' })} {dob.getDate()},{dob.getFullYear()}</span>
                    )}
                    <button onClick={dobToggle} type='button'><Pencil></Pencil></button>
                </div>
                <input type="submit" className='submit' value='Submit' />
            </form>
        </div>
    );
}