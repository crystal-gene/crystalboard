import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FixedSizeList as List } from 'react-window';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { useWindowDimensions } from './utils'

const drawerWidth = 300;

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
        // height: "calc(100% - (30px + 17px + 1px))",
        overflowY: "auto",
        margin: 0,
        padding: 0
    },
    title: {
        margin: "10px 20px"
    },
    iconRoot: {
        minWidth: "30px"
    },
    listGutters: {
        paddingLeft: "15px",
        paddingRight: "0",
    },
    listItem: {
        margin: '0',
        paddingTop: 0,
        paddingBottom: 0
    },
    h6: {
        textWeight: 300,
        fontSize: '17px'
    }
}));

const LeftPanel = ({ checkedIndex, data, handleUpdate }) => {
    const classes = useStyles();
    const updateFunction = (index) => {
        handleUpdate("trajectory", index)
    }
    const { height } = useWindowDimensions();
    return (
        <Drawer
            variant="permanent"
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper
            }}
        > 
            <div className={classes.title}>
                <Typography 
                    variant="h6"
                    className={classes.h6}
                >
                    Trajectory List
                </Typography>
            </div>
            <Divider />
            <List
                classes={{
                    root: classes.list
                }}
                itemData={{
                    nameList: data,
                    checkedIndex: checkedIndex,
                    handleUpdate: updateFunction
                }}
                itemCount={data.length}
                itemSize={52}
                height={height - (30 + 17 + 1)}
                width={drawerWidth}
            >
                {DataRow}
            </List>
        </Drawer>
    )
}

const DataRow = ({ index, data, style }) => {
    const classes = useStyles();
    const name = `${data.nameList[index]}`;
    return (
        <div style={style} key={`trajectory_${index}`}>
            <ListItem 
                button 
                dense
                classes={{
                    root: classes.listItem,
                    gutters: classes.listGutters
                }}
                onClick={() => {
                    data.handleUpdate(index)
                }}
            >
                <ListItemIcon classes={{
                    root: classes.iconRoot
                }}>
                    <Radio
                        checked={data.checkedIndex === index}
                        value={`${index}`}
                        name={name}
                        size="small"
                    />
                </ListItemIcon>
                <ListItemText 
                    primary={
                        name.length > 25 ? name.slice(0, 25) + '...' : name
                    }
                    secondary={"test"}
                />
            </ListItem>
        </div>
    )
}

export default LeftPanel;