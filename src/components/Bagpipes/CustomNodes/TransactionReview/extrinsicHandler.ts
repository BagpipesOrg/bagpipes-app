import { dotToHydraDx } from "../../../Chains/DraftTx/DraftTeleportTx";

export async function extrinsicHandler(actionType: any, formData: any) {
    
    switch(actionType) {
        case 'teleport':
            return handleTeleport(formData);
        case 'swap':
            return handleSwap(formData);
        default:
            throw new Error("Unsupported action type.");
        }
};

function handleTeleport(formData: any) {
    if (formData.source === 'polkadot' && formData.target === 'hydraDx') {
        return dotToHydraDx(formData.amount, formData.address);
    }
    throw new Error("Unsupported teleport direction.");
}
