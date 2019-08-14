import React from 'react';
import  * as Cards  from './LinearListUI';

function LinearListUIType (props) {
    if (!props.type)
      return "No";

    const Card = Cards[props.type];

    return <Card />
}

export default LinearListUIType