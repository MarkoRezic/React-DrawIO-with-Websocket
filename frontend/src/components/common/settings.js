import SETTING_MAX_USERS from '../../img/settings/setting_max_users.svg'
import SETTING_ROUND_TIME from '../../img/settings/setting_round_time.svg'
import SETTING_ROUND_COUNT from '../../img/settings/setting_round_count.svg'
import SETTING_HINT_COUNT from '../../img/settings/setting_hint_count.svg'

const settings = [
    {
        img: SETTING_MAX_USERS,
        key: 'max_users',
        title: 'Igrača',
        min: 2,
        max: 8,
    },
    {
        img: SETTING_ROUND_TIME,
        key: 'round_time',
        title: 'Vrijeme',
        min: 20,
        max: 120,
    },
    {
        img: SETTING_ROUND_COUNT,
        key: 'round_count',
        title: 'Runda',
        min: 2,
        max: 10,
    },
    {
        img: SETTING_HINT_COUNT,
        key: 'hint_count',
        title: 'Pomoć',
        min: 0,
        max: 10,
    },
]

export default settings