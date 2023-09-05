import React, { useContext, useEffect, useState } from 'react';
import avatars from '../../common/avatars';
import MEDAL1 from '../../../img/medal_1.png';
import MEDAL2 from '../../../img/medal_2.png';
import MEDAL3 from '../../../img/medal_3.png';

import './style.css';
import { DataContext } from '../../../Context';
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';

const UserList = () => {
    const context = useContext(DataContext)

    const orderedUsers = () => {
        let userList = [...context?.gameState?.user_list]
        return userList.sort((user1, user2) =>
            context?.gameState?.total_points_user_id_map[user2?.user_id] - context?.gameState?.total_points_user_id_map[user1?.user_id])
    }

    //console.log(context?.gameState, context?.gameSettings)

    return (
        <div id='user-list'>
            {
                orderedUsers().map((user, user_index) =>
                    <div className={'user-row'
                        + (user?.user_id === context?.user?.user_id ? ' current-user' : '')
                        + (context?.gameState?.correct_guess_user_id_list?.includes(user?.user_id) ? ' correct-guess' : '')} key={user?.user_id}>
                        <div className='user-avatar-wrapper'>
                            <img className='user-avatar' src={avatars?.[user?.avatar].img} />
                        </div>
                        <div className='user-username-points'>
                            <p className='user-username'>{user?.username}{user?.user_id === context?.user?.user_id ? ' (Ti)' : ''}</p>
                            <p className='user-points'>{context?.gameState?.total_points_user_id_map?.[user?.user_id]}</p>
                        </div>
                        {
                            context?.gameState?.total_points_user_id_map?.[user?.user_id] > 0
                                && user_index < 3
                                ? <img className='user-medal' src={user_index === 0 ? MEDAL1 : user_index === 1 ? MEDAL2 : MEDAL3} />
                                : null
                        }
                    </div>
                )
            }
        </div>
    )
}

export default UserList;