import React, { useRef, useState } from 'react';
import { useTippy } from '../../contexts/tooltips/TippyContext';
import FormHeader from '../Bagpipes/Forms/FormHeader';
import './EventNotification.scss';

const CollapsibleSection = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div>
      <div className="flex items-center">
        <span onClick={toggleExpand} className="p-1 cursor-pointer">{isExpanded ? '-' : '+'}</span>
        <strong>{title}</strong>
      </div>
      {isExpanded && (
        <div className="content">
          {typeof content === 'object' ? renderDataContent(content) : <span>{content}</span>}
        </div>
      )}
    </div>
  );
};

const renderDataContent = (data) => {
  if (typeof data !== 'object' || data === null) {
    return <span>{data}</span>;
  }

  return Object.entries(data).map(([key, value], index) => (
    <div key={index} className="ml-4">
      <CollapsibleSection title={key} content={value} />
    </div>
  ));
};

const EventDataPopup = ({ nodeType, eventUpdates, onClose }) => {
  const { hideTippy } = useTippy();

  const handleCancel = () => {
    hideTippy();
    onClose();
  };

  return (
    <div className="eventDataPopup">
      <FormHeader onClose={handleCancel} title="Event Data" />
      <div className="eventData">
        {eventUpdates.map((update, index) => (
          <div className="eventUpdateSection" key={index}>
            <CollapsibleSection title={`Response [${index}]`} content={update} />
          </div>
        ))}
      </div>
    </div>
  );
};

const EventNotification = ({ nodeId, nodeType, eventUpdates }) => {
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

    showTippy('eventData', nodeId, notificationRef.current, <EventDataPopup nodeType={nodeType} eventUpdates={eventUpdates} onClose={handleCloseEventDataPopup} />, 'top-start');
  };

  const handleCloseEventDataPopup = () => {
    setEventDataPopup(false);
  };

  const hasError = eventUpdates.some(update => update.data && update.data.error);
  console.log('eventUpdates has Error', hasError, eventUpdates);

  if (eventUpdates.length === 0) return null;

  return (
    <div
      ref={notificationRef}
      onClick={handleNotificationClick}
      className={`eventNotification ${hasError ? 'error' : 'success'}`}
    >
      {eventUpdates.length}
    </div>
  );
};

export default EventNotification;
