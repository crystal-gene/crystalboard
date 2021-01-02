import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Simple3DSceneComponent } from '@materialsproject/mp-react-components'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';

const useStyles = makeStyles((theme) => ({
    main: {
        flexGrow: 1,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    container: {
        display: "flex",
        flexDirection: "column"
    },
    gridContainer: {
        flex: "0 0 auto",
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2)
    },
    crystalPaper: {
        width: "fit-content",
        "background-color": "rgba(0, 0, 0, 0.01)"
    },
    crystalContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    metadataPanel: {
        flex: "1 0 auto",
        margin: "20px 40px",
    },
    metadataTitle: {
        marginBottom: 10
    }
}));

const Stage = ({ crystal1, crystal2, metadata }) => {
    const classes = useStyles();
    return (
        <main className={classes.main}>
            <div className={classes.container}>
                <Grid container justify="center" className={classes.gridContainer} spacing={2}>
                    <Grid className={classes.crystalContainer} item xs={5}>
                        <Crystal3D
                            data={crystal1}
                        />
                    </Grid>
                    <Grid className={classes.crystalContainer} item xs={1}>
                        <ArrowForwardRoundedIcon 
                            style={{ fontSize: 40 }}
                            color="action"
                        />
                    </Grid>
                    <Grid className={classes.crystalContainer} item xs={5}>
                        <Crystal3D
                            data={crystal2}
                        />
                    </Grid>
                </Grid>
                <MetadataPanel 
                    data={metadata}
                />
            </div>

        </main>
    )
}

const MetadataPanel = ({ data }) => {
    const classes = useStyles();
    const restoredKeys = ["stepIndex", "summary", "fromInit", "toFinal"];
    return (
        <Card 
            elevation={3}
            classes={{
                root: classes.metadataPanel
            }}
        >
            <CardContent>
                {data.summary ? (
                    <Typography className={classes.metadataTitle} variant="h5">
                        Initial state 
                        <ArrowForwardRoundedIcon style={{verticalAlign: 'middle'}}/> 
                        Final state (Summary)
                    </Typography>
                ) : (
                    <Typography className={classes.metadataTitle}  variant="h5">
                        {data.fromInit ? `Initial state (${data.stepIndex})` : `state ${data.stepIndex}`}
                            <ArrowForwardRoundedIcon style={{verticalAlign: 'middle'}}/> 
                            {data.toFinal ? `final state (${data.stepIndex+1})` : `state ${data.stepIndex+1}`}
                    </Typography>
                )}
                {
                    Object.keys(data).map((key) => restoredKeys.includes(key) ? <></> : (
                        <Typography key={`metadata_${key}`} variant="body1">
                            <b>{key}</b>: {`${data[key]}`}
                        </Typography>
                    ))
                }
            </CardContent>
        </Card>
    )
}

const Crystal3D = ({ data, size=350, options={} }) => {
    // https://github.com/materialsproject/mp-react-components/blob/master/src/components/crystal-toolkit/Simple3DScene/Simple3DSceneComponent.react.tsx#L178
    const classes = useStyles();
    return (
        <Paper
            variant="outlined"
            classes={{
                root: classes.crystalPaper
            }}
            elevation={5}
        >
            <Simple3DSceneComponent
                data={data}
                debug={false}
                animation={'none'}
                axisView={'SW'}
                inletPadding={10}
                sceneSize={size}
                toggleVisibility={{}}
                {...options}
            />
        </Paper>
    )
}

// eslint-disable-next-line
const test_data = {name: "StructureMoleculeComponentScene",
    contents: [{name: "atoms_Na_1a",
        contents: [{positions: [[4.2, 4.2, 0.0],
            [4.2, 0.0, 4.2],
            [0.0, 0.0, 4.2],
            [0.0, 4.2, 4.2],
            [0.0, 4.2, 0.0],
            [4.2, 0.0, 0.0],
            [4.2, 4.2, 4.2],
            [0.0, 0.0, 0.0]],
            color: "#f9dc3c",
            radius: 0.5,
            type: "spheres",
            tooltip: "Na (1a)",
            clickable: true}],
        origin: [-2.1, -2.1, -2.1],
        visible: true}]
}

// eslint-disable-next-line
const test_data_2 = {
    action: 'Modify Na at site 1 (0.0, 0.0, 0.0) to Mg',
    reward: -0.3,
    summary: false,
    stepIndex: 3,
    fromInit: true,
    toFinal: false,
    stepInterval: 1,
    otherMetadata: []
}

export default Stage;