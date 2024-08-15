import React, { useState } from 'react';

const InfoDivider = ({ label, value }) => (
    <div className="p-3 m-2 bg-gray-100 rounded border border-gray-300 flex justify-between ">
       <span className='px-1'>{label}:</span> <strong>{" "}  {value} </strong>
    </div>
);

const ConversionDivider = ({ label, value, label2, value2 }) => (
    <div className="p-3 m-2 bg-gray-100 rounded border border-dotted border-gray-300 snap-center flex justify-center">
        <strong>{label} {value} {label2} {value2} </strong>
    </div>
);

const InkInfo = ({ sourceInfo, targetInfo }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="sell-price-info mt-4 bg-gray-100 p-2 rounded border border-gray-300 text-gray-700 mt-1 p-3 m-2 snap-x" style={{ maxWidth: '300px' }}>
            <ConversionDivider label="" value="" label2="->" value2="" />
            <InfoDivider label="Sell" value='test' />
    

            <div className="mt-2 flex justify-end underline">
         
            </div>
        </div>
    );
}

export default InkInfo;

