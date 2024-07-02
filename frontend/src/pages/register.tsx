import { useState } from 'react';
import { Oval } from 'react-loader-spinner'
import { useRouter } from 'next/router';

//Own files.
import Layout from '@/hocs/Layout';
import { registerUser, showSnackbar } from '@/redux/slices/auth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { AlertSeverity } from '@/constants/enums';

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { registered, loading, isAuthenticated } = useAppSelector(state => state.persistedReducers.auth);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: '',
    });

    const {
        first_name,
        last_name,
        email,
        password,
        re_password,
    } = formData;

    const onChange = (e: { target: { name: string; value: string; }; }) => setFormData({ ...formData, [e.target.name]: e.target.value });

    /*
        Function that is called when an user clicks on the register. Will send an API call and register an user and show a snackbar on the screen
        with information.
    */
    const registerAnUser = (e: React.FormEvent) => {
        e.preventDefault()

        if(re_password !== password) {
            if (dispatch && dispatch !== null && dispatch !== undefined) {
                dispatch(showSnackbar({
                    severity: AlertSeverity.Error,
                    open: true,
                    message: 'Passwords do not match, try again',
                }));
    
                // We reset inputted passwords
                setFormData({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: '',
                    re_password: '',
                });
            }
        }
        else {
            if (dispatch && dispatch !== null && dispatch !== undefined) {
                dispatch(
                    registerUser({
                        first_name,
                        last_name,
                        email,
                        password
                    }
                    )
                );
            }
        }
    };

    // If authenticated, be redirected to dashboard page instead.
    if (typeof window !== 'undefined' && isAuthenticated) {
        router.push('/dashboard');
    }

    // If registered, be redirected to login page instead. 
    if (registered) {
        router.push('/login');
    }

    return (
        <Layout
            title={'Register'}
            content={'Register page'}
        >
            <h1 className='display-4 mt-5'>Register</h1>
            <form className='bg-light p-5 mt-5 mb-5' onSubmit={registerAnUser}>
                <h3>Create an account</h3>

                <div className='form-group'>
                    <label className='form-label mt-5' htmlFor='first_name'>
                        <strong>First Name</strong>
                    </label>

                    <input
                        className='form-control'
                        type='text'
                        name='first_name'
                        placeholder='First Name'
                        onChange={onChange}
                        value={first_name}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label className='form-label mt-3' htmlFor='last_name'>
                        <strong>Last Name</strong>
                    </label>

                    <input
                        className='form-control'
                        type='text'
                        name='last_name'
                        placeholder='Last Name'
                        onChange={onChange}
                        value={last_name}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label className='form-label mt-3' htmlFor='email'>
                        <strong>Email</strong>
                    </label>

                    <input
                        className='form-control'
                        type='email'
                        name='email'
                        placeholder='Email'
                        onChange={onChange}
                        value={email}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label className='form-label mt-3' htmlFor='password'>
                        <strong>Password</strong>
                    </label>

                    <input
                        className='form-control'
                        type='password'
                        name='password'
                        placeholder='Password'
                        onChange={onChange}
                        value={password}
                        minLength={8}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label className='form-label mt-3' htmlFor='re_password'>
                        <strong>Confirm password</strong>
                    </label>

                    <input
                        className='form-control'
                        type='password'
                        name='re_password'
                        placeholder='Confirm password'
                        onChange={onChange}
                        value={re_password}
                        minLength={8}
                        required
                    />
                </div>
                {
                    loading ? (
                        <div className='d-flex justify-content-center align-items-center mt-5'>
                            <Oval
                                color='#00bfff'
                                width={50}
                                height={50}
                            />
                        </div>
                    ) : (
                        <button className='btn btn-primary mt-5' type='submit'>
                            Register account
                        </button>
                    )
                }
            </form>
        </Layout>
    );
}

export default RegisterPage;