import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import 'fontsource-roboto/400.css';

import LeftPanel from './left_panel';
import Stage from './stage';
import RightPanel from './right_panel';
import { getTracList, getStepFile } from './utils';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    }
}));


const urls = {
    tracList: '/list',
    stepFile: '/step'
}

function App() {
    const classes = useStyles();

    let tracList = useRef(getTracList(urls.tracList));
    if (tracList.length > 0) {
        let stepFile = useRef(getStepFile(urls.stepFile, tracList[0]))
    }
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
                throw new Error(`Unexpected action type: ${action}`);
        }
    }
    return (
        <div className={classes.root}>
            <LeftPanel 
                data={tracList} 
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
