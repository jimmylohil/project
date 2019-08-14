import React from 'react';
import  * as Cards  from './DownListUI';

function DownListUIType (props) {
    if (!props.type)
      return "No";

    const Card = Cards[props.type];

    return <Card />
}

export default DownListUIType