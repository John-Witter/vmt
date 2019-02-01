import React, { PureComponent } from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Aux from '../../Components/HOC/Auxil';


@DragDropContext(HTML5Backend, { window })
export default class DnD extends PureComponent{
  render() {
    return (
      <Aux>
        {this.props.children}
      </Aux>
    )
  }
}
