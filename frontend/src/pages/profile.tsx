
//Own files.
import { AlertSeverity, ErrorMessages } from '@/constants/enums';
import { User } from '@/constants/interfaces';
import Layout from '@/hocs/Layout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { acceptFriendRequest, changePassword, deleteFriend, deleteFriendRequest, getReceivedFriendRequests, getSentFriendRequests, getUser, getUsers, sendFriendRequest, showSnackbar } from '@/redux/slices/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { user, loading, isAuthenticated, users, sentFriendRequests, getFriendRequests } = useAppSelector(state => state.persistedReducers.auth);

    const [formData, setFormData] = useState({
        old_password: '',
        password: '',
        repeated_password: '',
    });

    const {
        old_password,
        password,
        repeated_password,
    } = formData;

    useEffect(() => {
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(getUser());

            dispatch(getUsers());

            dispatch(getSentFriendRequests());

            dispatch(getReceivedFriendRequests());
        }

        const updatePage = setInterval(() => updateProfilePage(), 2000);
        return () => clearInterval(updatePage);
    }, []);

    if (typeof window !== 'undefined' && !isAuthenticated) {
        router.push('/');
    }

    const updateProfilePage = () => {
        /*
        Function that is called every two seconds to refresh profile page with new information. For example if there have arrived new friend requests.
        */
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(getUser());
            
            dispatch(getUsers());

            dispatch(getSentFriendRequests());

            dispatch(getReceivedFriendRequests());
        }
    };

    const onChange = (e: { target: { name: string; value: string; }; }) => setFormData({ ...formData, [e.target.name]: e.target.value });

    /*
        Function that is called when an user clicks on the change password button. Will update the user's password and show a snackbar on the screen
        with information.
    */
    const changeUserPassword = (e: React.FormEvent) => {
        e.preventDefault()

        if(password !== repeated_password) { // Inputted passwords do not match, this not ok.
            dispatch(showSnackbar({
                severity: AlertSeverity.Warning,
                open: true,
                message: ErrorMessages.PasswordsDoNotMatch,
            }));

            formData.password = '';
            formData.repeated_password = '';
        }
        else {
            if (dispatch && dispatch !== null && dispatch !== undefined) {
                dispatch(
                    changePassword({
                            old_password,
                            password,
                            repeated_password,   
                        }
                    )
                );

                // Reset form data.
                formData.old_password = '';
                formData.password = '';
                formData.repeated_password = '';
            }
        }
    };

    /*
        Function that is called when an user clicks on the undo button under sent friend requests. Will remove that friend request and show a snackbar on the screen
        with information.
    */
    const undoAFriendRequest = async (e: React.FormEvent, to_user: string) => {
        e.preventDefault()
        
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            const from_user = user!.email;

            dispatch(
                deleteFriendRequest(
                    {
                    to_user,
                    from_user
                    }
                )
            );
        }
    };

    /*
        Function that is called when an user clicks on the deny button under received friend requests. Will remove that friend request and show a snackbar on the screen
        with information.
    */
    const denyAFriendRequest = async (e: React.FormEvent, from_user: string) => {
        e.preventDefault()
        
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            const to_user = user!.email;

            dispatch(
                deleteFriendRequest(
                    {
                    to_user,
                    from_user
                    }
                )
            );
        }
    };

    /*
        Function that is called when an user clicks on the accept button under received friend request. Will add that user as a friend and show a snackbar on the screen
        with information.
    */
    const acceptAFriendRequest = async (e: React.FormEvent, from_user: string) => {
        e.preventDefault()
        
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            const to_user = user!.email;

            dispatch(
                acceptFriendRequest(
                    {
                    to_user,
                    from_user
                    }
                )
            );
        }
    };

    /*
        Function that is called when an user clicks on the delete button under the friends tab. Will remove that user as a friend and show a snackbar on the screen
        with information.
    */
    const deleteAFriend = async (e: React.FormEvent, email: string) => {
        e.preventDefault()
        
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(
                deleteFriend(
                    {
                        email
                    }
                )
            );
        }
    };

    /*
        Function that is called when an user clicks on the send button under the add new friends tab. Will send a friend request to that user and show a snackbar on the screen
        with information.
    */
    const sendAFriendRequest = async (e: React.FormEvent, to_user: string) => {
        e.preventDefault()
        
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            const from_user = user!.email;

            dispatch(
                sendFriendRequest(
                    {
                    to_user,
                    from_user
                    }
                )
            );
        }
    };

    let availUsersToAddAsFriends: User[] = []; // List that does not contain people that current user is already friends with, sent or recieved friend requests to/from.

    let unionFriendsList: string[] = []; // Contains both friends and friend requests.

    if(user) unionFriendsList = unionFriendsList.concat(user!.friends); // Update unionFriendsList with the current user's friends.
    if(sentFriendRequests) unionFriendsList = unionFriendsList.concat(sentFriendRequests); // Update unionFriendsList with the current user's sent friend requests.
    if(getFriendRequests) unionFriendsList = unionFriendsList.concat(getFriendRequests); // Update unionFriendsList with the current user's received friend requests.

    availUsersToAddAsFriends = users.filter(friend => !unionFriendsList.includes(friend.email)); // Remove people that the user is already friends with or sent or recieved friend requests to/from.

    return (
        <Layout
            title={'Profile'}
            content={'Profile page'}
        >
            <h1 className='display-4 mt-5'>Profile</h1>¨

            <div className='container bg-light p-5 mt-3 mb-3'>
                <div className='row'>
                    <div className='col-sm'>
                        <div className='column'>
                            <h4>Your information</h4>
                            <div className='col-sm'>
                                <strong>First name: </strong> { user ? user.first_name : ''}
                            </div>
                            <div className='col-sm'>
                                <strong>Last name: </strong> { user ? user.last_name : ''}
                            </div>
                            <div className='col-sm'>
                                <strong>Email: </strong> {user ? user.email : ''}
                            </div>
                        </div>
                    </div>
                    <div className='col-sm'>
                        <h4>Your friends</h4>
                        <ul className='list-group overflow-y-scroll' style={{maxHeight: '12rem', overflowX: 'hidden'}}>
                            {   user ?
                                user!.friends.map(function(friendEmail){
                                    return (
                                        <div key={friendEmail} className='mt-2 mb-2'>
                                            <li className='list-group-item'>{friendEmail}</li>
                                            <button type='button' className='btn btn-danger btn-sm' onClick={(e) => deleteAFriend(e, friendEmail)}>Remove</button>
                                        </div>
                                    )
                                })
                                : null
                            } 
                        </ul>
                    </div>
                    <div className='col-sm'>
                        <h4>Sent friend requests</h4>
                        <ul className='list-group overflow-y-scroll' style={{maxHeight: '12rem', overflowX: 'hidden'}}>
                            {   sentFriendRequests ?
                                sentFriendRequests.map(function(friendRequestEmail){
                                    return (
                                        <div key={friendRequestEmail} className='mt-2 mb-2'>
                                            <li className='list-group-item'>{friendRequestEmail}</li>
                                            <button type='button' className='btn btn-danger btn-sm' onClick={(e) => undoAFriendRequest(e, friendRequestEmail)}>Undo</button>
                                        </div>
                                    )
                                }) : null
                            }
                        </ul>
                    </div>
                    <div className='col-sm'>
                        <h4>Received friend request</h4>
                        <ul className='list-group overflow-y-scroll' style={{maxHeight: '12rem', overflowX: 'hidden'}}>
                            {   getFriendRequests ?
                                getFriendRequests.map(function(friendRequestEmail){
                                    return (
                                        <div key={friendRequestEmail} className='mt-2 mb-2'>
                                            <li className='list-group-item'>{friendRequestEmail}</li>
                                            <button type='button' className='btn btn-primary btn-sm' onClick={(e) => acceptAFriendRequest(e, friendRequestEmail)}>Accept</button>
                                            <button type='button' className='btn btn-danger btn-sm' onClick={(e) => denyAFriendRequest(e, friendRequestEmail)}>Deny</button>
                                        </div>
                                    )
                                }) : null
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <div className='container bg-light p-5 mt-3 mb-3'>
                <h4>Add new friend</h4>
                <ul className='list-group overflow-y-scroll' style={{maxHeight: '12rem', overflowX: 'hidden'}}>
                    {  
                        availUsersToAddAsFriends.map(function(user){
                            return (
                                <div key={user.email} className='row mt-2 mb-2'>
                                    <div className='col-sm'> 
                                        <li className='list-group-item'>{user.email}</li>
                                    </div>
                                    <div className='col-sm'>
                                        <button type='button' className='btn btn-primary btn-sm' onClick={(e) => sendAFriendRequest(e, user.email)}>Send friend request</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </ul>
            </div>

            <form className='bg-light p-5 mt-3 mb-5' onSubmit={changeUserPassword}>
                <h4>Change your password</h4>
                
                <div className='form-group'>
                    <label className='form-label mt-3' htmlFor='old_password'>
                        <strong>Current password</strong>
                    </label>

                    <input
                        className='form-control'
                        type='password'
                        name='old_password'
                        placeholder='Password'
                        onChange={onChange}
                        value={old_password}
                        minLength={8}
                        required
                    />
                </div>

                <div className='form-group'>
                    <label className='form-label mt-3' htmlFor='password'>
                        <strong>New password</strong>
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
                    <label className='form-label mt-3' htmlFor='repeated_password'>
                        <strong>Repeat new password</strong>
                    </label>
                    <input
                        className='form-control'
                        type='password'
                        name='repeated_password'
                        placeholder='Password'
                        onChange={onChange}
                        value={repeated_password}
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
                        <button className='btn btn-primary mt-4' type='submit'>
                            Change password
                        </button>
                        
                    )
                }
            </form>
        </Layout>
    )
}

export default ProfilePage;
