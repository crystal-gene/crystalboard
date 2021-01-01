import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import 'fontsource-roboto/400.css';

import LeftPanel from './left_panel';
import Stage from './stage';
import RightPanel from './right_panel'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    }
}));

function App() {
    const classes = useStyles();

    const names = [...Array(500).keys()];
    const tmp = [...Array(500).keys()];
    const names2 = tmp.map((t) => `${t}`)
    const [ currentIndex, setIndex ] = useState(0);
    const [ currentStepIndex, setStepIndex ] = useState(names2.length)
    const handleUpdate = (action, value) => {
        switch (action) {
            case 'trajectory':
                setIndex(value);
                break;
            case 'step':
                setStepIndex(value);
                break;
            default:
                throw new Error();
        }
    }
    return (
        <div className={classes.root}>
            <LeftPanel 
                data={names} 
                checkedIndex={currentIndex}
                handleUpdate={handleUpdate}
            />
            <Stage />
            <RightPanel 
                currentStepIndex={currentStepIndex} 
                steps={names2}
                handleUpdate={handleUpdate}
            />
        </div>
    )
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>, 
    document.getElementById('root')
);
