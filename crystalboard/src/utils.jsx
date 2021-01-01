import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

export function useWindowDimensions() {
    
    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}


const useStyles = makeStyles((theme) => ({
    redText: {
        fontColor: "#f44336"
    },
    greenText: {
        fontColor: "#4caf50"
    }
}));

const ColoredNumber = ({ number }) => {
    const classes = useStyles();
    return (
        <span
            className={number > 0 ? classes.greenText : classes.redText}
        >
            {`${number}`}
        </span>
    );
};

export { ColoredNumber };
