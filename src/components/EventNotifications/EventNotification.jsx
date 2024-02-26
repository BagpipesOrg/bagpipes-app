import React, { useRef, useState } from 'react';
import { useTippy } from '../../contexts/tooltips/TippyContext'; 
import FormHeader from '../Bagpipes/Forms/FormHeader';
import FormFooter from '../Bagpipes/Forms/FormFooter';
import './EventNotification.scss';

// Assuming EventData is a component you've defined to format and display your event updates
const EventDataPopup = ({ eventUpdates, onClose }) => {
    const { hideTippy } = useTippy();
    
    const handleCancel = () => {
        hideTippy();
        onClose(); // Invoke the onClose function passed from the parent component
    };
  
    return(
    <div className=''>
        <FormHeader onClose={handleCancel} title='Event Data'  />  
        <div className='eventData'>
        {eventUpdates.map((update, index) => (
            <div className='w-full' key={index}>
            <strong>Timestamp:</strong> {update.timestamp}
            <pre>{JSON.stringify(update.eventData, null, 2)}</pre>
            </div>
        ))}
        </div>
    </div>
  );
};

const EventNotification = ({ nodeId, eventUpdates }) => {
    const notificationRef = useRef();
    const { showTippy } = useTippy();
    const [isEventDataPoppedUp, setEventDataPopup] = useState(false);

  
  
    const handleNotificationClick = (e) => {

        e.stopPropagation();
        
      const rect = notificationRef.current.getBoundingClientRect();
      const calculatedPosition = {
        x: rect.right,
        y: rect.top
      };
  
      // Show the Tippy with event data on click
      showTippy('eventData', nodeId, calculatedPosition, <EventDataPopup eventUpdates={eventUpdates} onClose={handleCloseEventDataPopup} />, 'top-start');
    };

    const handleCloseEventDataPopup = () => {
        setEventDataPopup(false);
    };

  
    if (eventUpdates.length === 0) return null;

    return (
      <div 
        ref={notificationRef} 
        onClick={handleNotificationClick} 
        className="eventNotification"
      >
        {eventUpdates.length}
      </div>
    );
  };
  
  export default EventNotification;