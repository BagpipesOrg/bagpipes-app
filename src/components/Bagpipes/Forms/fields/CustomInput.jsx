import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Fields.scss';
import { useDrop } from 'react-dnd';
import { setCaretPosition, getCaretPosition, updateCombinedValue } from './utils';




const getNodeSize = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    // For text nodes, estimate size. This is an approximation.
    // One approach is to create a temporary element, add the text, and measure it.
    let tempDiv = document.createElement('div');
    tempDiv.style.display = 'inline-block';
    tempDiv.textContent = node.textContent;
    document.body.appendChild(tempDiv);
    let size = { width: tempDiv.offsetWidth, height: tempDiv.offsetHeight };
    document.body.removeChild(tempDiv);
    return size;
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // For element nodes (like pills), use their actual size.
    console.log("CustomNode Node type and size:", node.nodeType, { width: node.offsetWidth, height: node.offsetHeight });

    return { width: node.offsetWidth, height: node.offsetHeight };
  }

  return { width: 0, height: 0 };
};


const calculateIndexFromPosition = (editableDiv, position) => {
  let childNodes = editableDiv.childNodes;
  let accumulatedOffset = 0;
  
  for (let i = 0; i < childNodes.length; i++) {
    let node = childNodes[i];
    let nodeSize = getNodeSize(node); // Function to calculate the size of the node
    console.log("CustomInput 1. calculating middle point");
    // Calculate middle point of the node for more accurate positioning
    let middlePoint = accumulatedOffset + nodeSize.width / 2;

  if (position.x <= middlePoint) {
      // Determine if the drop is closer to the previous node or this node
      if (i > 0 && position.x < accumulatedOffset - getNodeSize(editableDiv.childNodes[i - 1]).width / 2) {
        return i - 1;  // Drop between the previous node and this node
      }
      return i; // Drop before this node
    }
    
    accumulatedOffset += nodeSize.width;
  }

  return childNodes.length; // If not found, insert at the end
};


const calculateIndexFromCaretPosition = (editableDiv, caretPos) => {
  let cumulativeLength = 0;
  
  for (let i = 0; i < editableDiv.childNodes.length; i++) {
    let node = editableDiv.childNodes[i];
    let nodeLength = node.nodeType === Node.TEXT_NODE ? node.textContent.length : 1; // Assuming a pill counts as one character

    if (cumulativeLength + nodeLength >= caretPos) {
      return i; // Insert at this index
    }

    cumulativeLength += nodeLength;
  }

  return editableDiv.childNodes.length; // Insert at the end if not found
};


const createPillElement = (pill) => {
console.log("CustomInput 1. creating pill element", pill);
  let pillElement = document.createElement('span');
  pillElement.setAttribute('data-id', pill.id);
  pillElement.textContent = pill.text;
  pillElement.className = 'pill';
  pillElement.style.backgroundColor = pill.color;
  pillElement.setAttribute('contenteditable', 'false');

  //  // Attach drag handlers if provided
  //  if (dragSource) {
  //   const [, drag] = dragSource();
  //   drag(pillElement);
  // }


  return pillElement;
};

const insertPillAtPosition = (editableInputRef, pill, dropCoordinates, onChange) => {
  const editableDiv = editableInputRef.current;
  if (!editableDiv) return;

  let index;
  if (dropCoordinates) {
    index = calculateIndexFromPosition(editableDiv, dropCoordinates);
} else {
// If dropCoordinates aren't provided, use the caret position
const caretPos = getCaretPosition(editableInputRef);
index = calculateIndexFromCaretPosition(editableDiv, caretPos);
}

let pillElement = createPillElement(pill);

if (editableDiv.childNodes[index]) {
editableDiv.insertBefore(pillElement, editableDiv.childNodes[index]);
} else {
editableDiv.appendChild(pillElement);
}

updateCombinedValue(editableDiv, onChange); // Update the combined value
};

const insertPillAtCursorPosition = (editableInputRef, pill) => {
  const editableDiv = editableInputRef.current;
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const pillNode = createPillElement(pill);
  range.insertNode(pillNode);

  const textNode = document.createTextNode(' '); // Create a spacer text node
  range.insertNode(textNode); // Insert it after the pill

  // Update cursor position
  range.setStartAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);

  updateCombinedValue(editableDiv); // Update combined value
};

const CustomInput = ({ value, onChange, onClick, placeholder, className, pills, setPills, }) => {
  const editableInputRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [editableContent, setEditableContent] = useState("");
  const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 });
  const [{ isOver }, drop] = useDrop({
    accept: 'NODE',
     hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset && editableInputRef.current) {
        const dropTargetRect = editableInputRef.current.getBoundingClientRect();
      
        const xPosition = clientOffset.x - dropTargetRect.left;
        const yPosition = clientOffset.y - dropTargetRect.top;
      
        setDropPosition({ x: xPosition, y: yPosition });
        console.log("CustomInput Drop position:", xPosition, yPosition);  // Debug log

      }
    },
    drop: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        const newPill = {
          id: item.id,  // Ensure unique ID for each pill
          text: item.label,  // Text to display on the pill
          color: 'green',
          contentEditable: false, // Color or other styling for the pill
        };
        console.log("CustomInput Dropping item:", item); // Debug statement
        insertPillAtPosition(editableInputRef, newPill, dropPosition, onChange);

        setPills(currentPills => [...currentPills, newPill]);
        updateCombinedValue(editableInputRef.current, onChange);
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });



  // Merged ref callback
const refCallback = useCallback(
  (node) => {
    // Assigns the node to the drop ref
    drop(node);

    // Also keeps your own reference to the node
    editableInputRef.current = node;
  },
  [drop], // Recreate this callback if 'drop' changes
);


  useEffect(() => {
    // Update the editableContent based on the external 'value'
    // This might involve parsing the value if it's a string combining pills and text
    setEditableContent(value);
  }, [value]);

  const insertPill = (pill) => {
    const pillHtml = `<span class="pill" contenteditable="false" style="background-color: ${pill.color};">${pill.text}</span>`;
    setEditableContent(prev => prev + pillHtml);
    // onChange(editableContent + pillHtml);
    updateCombinedValue(editableInputRef.current, onChange);

  };
  

  const removePill = (pillId) => {
    setPills(pills.filter(pill => pill.id !== pillId));
    // Update combined value if necessary
  };
  

  const handleContentChange = (e) => {
    const caretPosition = getCaretPosition(editableInputRef);
    const newContent = e.target.innerHTML;
    setEditableContent(newContent);
    onChange(newContent);
  
    setTimeout(() => {
      setCaretPosition(editableInputRef, caretPosition);
    }, 0);
  };

  const handlePillClick = (pillId) => {
    // Remove the clicked pill and update the state
    const newPills = pills.filter(pill => pill.id !== pillId);
    setPills(newPills);
  };

 // Implement drag logic
const handleDragStart = (event) => {
  // Logic for starting drag
};

const handleDragEnd = (event) => {
  // Logic for ending drag, possibly removing pill from original position
};


  return (
    <div className={`custom-input-container ${className}`} onClick={onClick}>
      <div 
        ref={refCallback}
        className="editable-input" 
        contentEditable="true"
        dangerouslySetInnerHTML={{ __html: editableContent }}
        onInput={handleContentChange}
        placeholder={placeholder}
      >
      </div>
    </div>
  );
};

export default CustomInput;