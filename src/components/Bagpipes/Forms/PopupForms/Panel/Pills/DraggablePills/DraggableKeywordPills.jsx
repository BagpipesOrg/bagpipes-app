import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { nodeTypeColorMapping } from '../../nodeColorMapping';
import '../Pills.scss';

const DraggableKeywordPills = ({ pill, onRemovePill }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: 'KEYWORD_PILL',
      item: pill,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    return (
      <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }} className="pill keyword-pill">
        <span style={{backgroundColor: 'green'}} className={`w-full text-white p-1 border-green-400 rounded cursor-pointer`}>
          {pill.name} </span>
        {/* Implement removal or other interactions as needed */}
      </div>
    );
  };
  
  export default DraggableKeywordPills;
  
  
  