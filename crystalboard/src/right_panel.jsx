import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { FixedSizeGrid as GridList } from 'react-window';
import { useWindowDimensions } from './utils'

const drawerWidth = 240;
const gridCol = 3;

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        width: drawerWidth,
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.03)"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
      },
    list: {
        height: "400px",
        overflowY: "auto"
    },
    title: {
        margin: "10px 15px",
        justifyContent: "space-between",
        alignItems: "center",
        display: "flex"
    },
    iconRoot: {
        minWidth: "30px"
    },
    listGutters: {
        paddingLeft: "15px",
        paddingRight: 0
    },
    h6: {
        fontSize: '17px'
    },
    buttonsContainer: {
        display: "flex",
        justifyContent: "center"
    },
    buttonList: {
        margin: "4px 0 0 0"
    },
    button: {
        margin: "3px",
        padding: 0,
        width: 66,
        height: 35
    },
    summaryButton: {
        padding: "16px 6px",
        width: 90,
        height: 35,
        borderRadius: 8,
        fontSize: 12
    }
}));

const RightPanel = ({ currentStepIndex, steps, handleUpdate }) => {
    const classes = useStyles();
    const updateFunction = (stepIndex) => {
        handleUpdate("step", stepIndex)
    }
    const { height } = useWindowDimensions();
    return (
        <Drawer
            variant="permanent"
            className={classes.drawer}
            anchor="right"
            classes={{
                paper: classes.drawerPaper
            }}
        > 
            <div className={classes.title}>
                <Typography 
                    variant="h6"
                    className={classes.h6}
                >
                    Step List
                </Typography>
                <StepButton 
                    className={classes.summaryButton}
                    summary={{
                        index: steps.structures.length-1,
                        step: "summary",
                        currentStepIndex: currentStepIndex,
                        handleUpdate: updateFunction
                    }}
                />
            </div>
            <Divider />
            <div className={classes.buttonsContainer}>
                <GridList 
                    className={classes.buttonList}
                    itemData={{
                        steps: steps.structures.length - 1,
                        currentStepIndex: currentStepIndex,
                        handleUpdate: updateFunction
                    }}
                    columnCount={gridCol}
                    columnWidth={70}
                    width={drawerWidth-10}
                    rowCount={Math.ceil(steps.structures.length / gridCol)}
                    rowHeight={40}
                    height={height - (35 + 20 + 1 + 4)}
                >
                    {StepButton}
                </GridList>
            </div>
        </Drawer>
    )
}

const StepButton = ({ columnIndex, rowIndex, style, data, summary=null }) => {
    const classes = useStyles();
    let index, step, handleUpdate, currentStepIndex;
    if (summary !== null) {
        index = summary.index;
        step = `${summary.step}`;
        handleUpdate = summary.handleUpdate;
        currentStepIndex = summary.currentStepIndex;
    } else {
        index = rowIndex * gridCol + columnIndex;
        step = index >= data.steps ? null : `${index+1}`;
        handleUpdate = data.handleUpdate;
        currentStepIndex = data.currentStepIndex
    }

    return (
        step === null ? <></> : (
            <div key={`step_${index}`} style={style}>
                <Tooltip  title={summary === null ? `State ${index} → State ${index+1}` : ' Summary of the trajectory'} placement="bottom">
                    <Button
                        className={summary === null ? classes.button : classes.summaryButton}
                        variant={currentStepIndex === index ? "contained" : "outlined"}
                        color={currentStepIndex === index ? (
                            summary === null ? "primary" : "secondary"
                        ) : (
                            summary === null ? "default" : "secondary"
                        )}
                        onClick={() => {handleUpdate(index)}}
                    >
                        {step}
                    </Button>
                </Tooltip>
            </div>
        )
    )
}

export default RightPanel;