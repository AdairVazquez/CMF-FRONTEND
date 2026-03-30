import React from 'react';
import { useHistory } from 'react-router-dom';

const SiteHeader = () => {
    const history = useHistory();

    return (
        <header className="site-header">
            <h1 className="site-title">Your Site Title</h1>
        </header>
    );
};

export default SiteHeader;