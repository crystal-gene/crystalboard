import React, { useState } from 'react';
import { Simple3DSceneComponent } from '@materialsproject/mp-react-components'
import { Button } from "@material-ui/core";

const Test = () => {
  const [data, setData ] = useState({});
  const fetchStructure = async () => {
    const resp = await fetch("http://localhost:5000/sample");
    const structure = await resp.json();
    setData(structure);
  }
  return (
    <div 
      style={{
        border: '1px solid'
      }}
    >
      <Simple3DSceneComponent
        style={{ 
          background_color: '#eeeee'
        }}
        data={data}
      />
      <Button onClick={fetchStructure} variant="contained">
        Change Structure
      </Button>
    </div>
  )
}

export default Test;