import React from 'react';

import './style.css';

const Loader = (params) => {
    return (
        <span className={`loader${params?.absolute ? ' absolute' : ''}`} style={params?.style}></span>
    )
}

export default Loader;