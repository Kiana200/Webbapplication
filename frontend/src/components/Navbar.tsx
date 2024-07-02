import Link from 'next/link';
import { useRouter } from 'next/router';

// Own files.
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser, reset } from '@/redux/slices/auth';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { isAuthenticated } = useAppSelector(state => state.persistedReducers.auth);

    /*
        Function that is called when the user clicks on the logout button in the navbar. Will log out the user and also resets the redux store
        that contains information about the user.
    */
    const logOutUser = () => {
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(logoutUser());
            dispatch(reset()); // Resets redux store to it's inital state.
        }
    };

    const authLinks = (
        <>
            <li className='nav-item'>
                <Link className={
                    router.pathname === '/calendar' ?
                        'nav-link active' : 'nav-link'
                }
                    href='/calendar'
                >
                    Calendar
                </Link>
            </li>

            <li className='nav-item'>
                <Link className={
                    router.pathname === '/profile' ?
                        'nav-link active' : 'nav-link'
                }
                    href='/profile'
                >
                    Profile
                </Link>
            </li>

            <li className='nav-item'>
                <a
                    className='nav-link'
                    href='/'
                    onClick={() => logOutUser()}
                >
                    Logout
                </a>
            </li>
        </>
    );

    const nonAuthLinks = (
        <>
            <li className='nav-item'>
                <Link className={
                    router.pathname === '/' ?
                        'nav-link active' : 'nav-link'
                }
                    href='/'
                >
                    Home
                </Link>
            </li>

            <li className='nav-item'>
                <Link className={
                    router.pathname === '/register' ?
                        'nav-link active' : 'nav-link'
                }
                    href='/register'
                >
                    Register
                </Link>
            </li>

            <li className='nav-item'>
                <Link className={
                    router.pathname === '/login' ?
                        'nav-link active' : 'nav-link'
                }
                    href='/login'
                >
                    Login
                </Link>
            </li>
        </>
    );


    return (
        <nav className='navbar navbar-expand-lg bg-body-tertiary'>
            <div className='container-fluid'>

                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarNav'
                    aria-controls='navbarNav'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>

                <div className='collapse navbar-collapse' id='navbarNav'>
                    <ul className='navbar-nav'>
                        {isAuthenticated ? authLinks : nonAuthLinks}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;