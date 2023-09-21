
import React from 'react';
const PriceInfo = ({priceInfo} ) => {


return (
    <div className="sell-price-info mt-4 bg-gray-100 p-2 rounded border border-gray-300 text-gray-700 mt-1 p-3 m-2">
    {/* Extract the values from sellPriceInfoMap[nodeId] and display them */}
    <div>Amount In {}: {priceInfo.amountIn}</div>
    <div>Amount Out: {priceInfo.amountOut}</div>
            <div><strong>Type:</strong> {priceInfo.type}</div>
            <div><strong>Amount In:</strong> {priceInfo.amountIn}</div>
            <div><strong>Amount Out:</strong> {priceInfo.amountOut}</div>
            <div><strong>Spot Price:</strong> {priceInfo.spotPrice}</div>
            <div><strong>Trade Fee:</strong> {priceInfo.tradeFee}</div>
            <div><strong>Price Impact (%):</strong> {priceInfo.priceImpactPct}</div>
            <div><strong>Trade Fee (%):</strong> {priceInfo.tradeFeePct}</div>
            {/* ... add more fields as needed ... */}
        </div>

)

}


export default PriceInfo;