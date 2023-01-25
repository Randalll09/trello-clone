import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

function App() {
  const onDragEnd = () => {};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <Droppable droppableId="one">
          {() => (
            <ul>
              <Draggable draggableId="one" index={0}>
                {() => <li>Hello</li>}
              </Draggable>
              <Draggable draggableId="two" index={1}>
                {() => <li>Hello</li>}
              </Draggable>
              <Draggable draggableId="three" index={2}>
                {() => <li>Hello</li>}
              </Draggable>
              <Draggable draggableId="four" index={3}>
                {() => <li>Hello</li>}
              </Draggable>
            </ul>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}

export default App;
