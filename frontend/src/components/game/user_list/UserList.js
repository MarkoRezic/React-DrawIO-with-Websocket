import React, { useContext, useEffect, useState } from 'react';

import './style.css';
import { DataContext } from '../../../Context';
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';

const UserList = () => {
    const context = useContext(DataContext)

    console.log(context?.gameState)

    return (
        <div id='user-list'>
            <p id='user-list-header'>Igrači</p>
            {
                context?.gameState?.user_list?.map((user) =>
                    <div className={'user-row' + (user?.user_id === context?.user?.user_id ? ' current-user' : '')} key={user?.user_id}>
                        <p>{user?.username}</p>
                    </div>
                )
            }
        </div>
    )
}

export default UserList;