export const getCaretPosition = (editableDivRef) => {
    const editableDiv = editableDivRef.current;
    if (!editableDiv) {
        return 0;
      }
    let caretPos = 0;
    if (window.getSelection && editableDiv) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editableDiv);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretPos = preCaretRange.toString().length;
    }
    return caretPos;
  };
  
  export const setCaretPosition = (editableDivRef, caretPos) => {
    const editableDiv = editableDivRef.current;
    if (!editableDiv || !window.getSelection) {
      return;
    }
  
    const setPos = (node, pos) => {
      const range = document.createRange();
      const sel = window.getSelection();
  
      range.setStart(node, pos);
      range.collapse(true);
  
      sel.removeAllRanges();
      sel.addRange(range);
    }
  
    let currentPos = 0;
    let nodeFound = false;
  
    const searchNode = (node, pos) => {
      if (!node || nodeFound) {
        return;
      }
  
      // If the node is a text node and the position is within this node
      if (node.nodeType === Node.TEXT_NODE) {
        if (currentPos + node.length >= pos) {
          setPos(node, pos - currentPos);
          nodeFound = true;
          return;
        }
        currentPos += node.length;
      }
  
      // If the node is an element node, traverse its children
      if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
          searchNode(node.childNodes[i], pos);
          if (nodeFound) {
            break;
          }
        }
      }
    };
  
    searchNode(editableDiv, caretPos);
  };
  

  export const updateCombinedValue = (editableDiv, onChange) => {
    if (!editableDiv) return;
  
    let combinedValue = '';
    Array.from(editableDiv.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        // For text nodes, add the text content to the combined value
        combinedValue += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE && node.className === 'pill') {
        // For pill elements, create an HTML representation
        const pillId = node.getAttribute('data-id');
        const pillText = node.textContent;
        const pillColor = node.style.backgroundColor;
        combinedValue += `<span draggable="true" contenteditable="false" class="pill" data-id="${pillId}" style="background-color: ${pillColor};">${pillText}</span>`;
      }
    });
    console.log("CustomInput 4. combinedValue:", combinedValue);
  
    // Update the state or prop that tracks the combined value
    // Assuming 'onChange' is a prop function to update the parent component
    onChange(combinedValue);
  };


