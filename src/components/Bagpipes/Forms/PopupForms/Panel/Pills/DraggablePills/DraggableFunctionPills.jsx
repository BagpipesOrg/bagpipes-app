import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { nodeTypeColorMapping } from '../../nodeColorMapping';
import '../Pills.scss';


const DraggableFunctionPills = ({ name, onDrop }) => {

    const displayName = name.endsWith('(') ? name.slice(0, -1) : name;

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'FUNCTION_BLOCK',
        item: { name },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                // Handle the drop logic here
                onDrop(item.name);
            }
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
  
    return (
        <span ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }} className="pill function-pill">
            <span className="text-black bg-gray-300 p-1 rounded cursor-pointer">
                {displayName}
            </span>
        </span>
    );
};


export default DraggableFunctionPills;

  
  