import { useState, useEffect } from 'react';
import { Oval } from 'react-loader-spinner'
import { useRouter } from 'next/router';

//Own files.
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Layout from '@/hocs/Layout'
import { resetRegistered, loginUser } from '@/redux/slices/auth';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { loading, isAuthenticated, registered } = useAppSelector(state => state.persistedReducers.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const {
        email,
        password,
    } = formData;

    useEffect(() => {
        if (dispatch && dispatch !== null && dispatch !== undefined && registered) {
            dispatch(resetRegistered());
        }
    }, [dispatch, registered]);

    const onChange = (e: { target: { name: string; value: string; }; }) => setFormData({ ...formData, [e.target.name]: e.target.value });

    /*
        Function that is called when an user clicks on the login button. Will call the redux reducer loginUser to login an user
        and then call the showSnackbar reducer to show a message to the user on the screen.
    */
    const loginTheUser = (e: React.FormEvent) => {
        e.preventDefault()

        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(loginUser({ email, password }));
        }
    };

    if (typeof window !== 'undefined' && isAuthenticated) {
        router.push('calendar');
    }

    return (
        <Layout
            title={'Login'}
            content={'Login page'}
        >
            <h1 className='display-4 mt-5'>Login</h1>
            <form className='bg-light p-5 mt-5 mb-5' onSubmit={loginTheUser}>
                <h3>Log into your account</h3>

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
                            Login
                        </button>
                    )
                }
            </form>
        </Layout>
    );
}

export default LoginPage;