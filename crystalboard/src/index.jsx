import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import '@fontsource/roboto/400.css';

import LeftPanel from './left_panel';
import Stage from './stage';
import RightPanel from './right_panel';
import { getTracList, getStepFile } from './utils';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    }
}));

const BASE_URL = '/data/plugin/crystal';

const urls = {
    tracList: BASE_URL + '/tags',
    stepFile: BASE_URL + '/step',
    stepMetadata: BASE_URL + '/metadata'
};

function App() {
    const classes = useStyles();

    let isLoad = useRef(false);
    const [ tracList, setTracList ] = useState([]);
    const [ stepFile, setStepFile ] = useState({
        structures: [],
        stepMetadata: []
    });
    const [ crystal1, setCrystal1 ] = useState({});
    const [ crystal2, setCrystal2 ] = useState({});
    const [ metadata, setMetadata ] = useState({});

    const [ currentIndex, setIndex ] = useState(0);
    const [ currentStepIndex, setStepIndex ] = useState(null);

    const handleUpdate = useCallback((action, value) => {
        switch (action) {
            case 'trajectory':
                setIndex(value);
                break;
            case 'step':
                setStepIndex(value);
                if (value === stepFile.structures.length - 1) {
                    setCrystal1(stepFile.structures[0]);
                    setCrystal2(stepFile.structures[stepFile.structures.length - 1]);
                    setMetadata({
                        summary: true,
                        fromInit: true,
                        toFinal: true,
                        stepIndex: value,
                        ...stepFile.stepMetadata[value]
                    })
                } else {
                    setCrystal1(stepFile.structures[value]);
                    setCrystal2(stepFile.structures[value+1]);
                    setMetadata({
                        summary: false,
                        fromInit: value === 0,
                        toFinal: value === stepFile.structures.length - 2,
                        stepIndex: value,
                        ...stepFile.stepMetadata[value]
                    })
                }
                break;
            default:
                throw new Error(`Unexpected action type: ${action}`);
        }
    }, [ stepFile ])

    useEffect(() => {
        const fetchTrac = async () => {
            if (!isLoad.current) {
                setTracList(
                    await getTracList(urls.tracList)
                );
            }
            isLoad.current = true;
        };
        fetchTrac()
    }, [ isLoad ])

    useEffect(() => {
        const fetchStep = async () => {
            if (tracList && tracList.length > currentIndex) {
                setStepFile(
                    await getStepFile(urls.stepFile, urls.stepMetadata, tracList[currentIndex].run, tracList[currentIndex].tag)
                );
            }
        }
        fetchStep();
    }, [ currentIndex, tracList ])

    useEffect(() => {
        handleUpdate('step', stepFile.structures.length-1);
    }, [ stepFile, handleUpdate ])

    return (
        <div className={classes.root}>
            <LeftPanel 
                data={tracList} 
                checkedIndex={currentIndex}
                handleUpdate={handleUpdate}
            />
            <Stage 
                crystal1={crystal1} 
                crystal2={crystal2} 
                metadata={metadata}
            />
            <RightPanel 
                currentStepIndex={currentStepIndex} 
                steps={stepFile}
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
