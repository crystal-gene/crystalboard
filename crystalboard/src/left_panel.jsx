import React from 'react';
import styled from 'styled-components'
import { FixedSizeList as List } from 'react-window';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const LeftPanelDiv = styled.div`
    background-color: #eeeeee;
    margin: 10px 5px;
    padding: 20px 10px;
    width: 20%;
    height: 100%;
`;

const DataRow = ({ index, data  }) => {
    return (
        <ListItem button key={index}>
            <ListItemText primary={data[index]} />
        </ListItem>
    )
}

const LeftPanel = ({  }) => {
    const names = ["1", "2", "3", "4", "5", "6", "7"];
    return (
        <LeftPanelDiv>
            <List
                height={500}
                width={300}
                itemCount={names.length}
                itemSize={35}
                itemData={names}
            >
                {DataRow}
            </List>
        </LeftPanelDiv>
    )
}

export default LeftPanel;