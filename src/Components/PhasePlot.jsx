// Display the phase response of the system

import React, { useEffect } from 'react';

export default function PhasePlot({ poles }) {
    useEffect(() => {
        console.log('Redrawing plot for', poles);
    }, [poles]);

    return <div>Phase Plot (mock)</div>;
}
