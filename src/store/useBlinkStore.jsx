import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';

const useBlinkStore = create(persist((set, get) => ({
  blinks: {},
  activeBlinksId: null,

  setActiveBlinksId: (blinkId) => set({ activeBlinksId: blinkId }),
  getBlinkData: (id) => get().blinks[id] || null,
  getBlinkMetadata: (id) => get().blinks[id]?.metadata || {},
  getOnChainURLs: (id) => get().blinks[id]?.onChainURLs || [],


  saveBlinkFormData: (id, formData) => set(state => (
    console.log('Saving form data for blink:', id, formData),

    {
    blinks: {
      ...state.blinks,
      [id]: formData
    }
  })),


    // Save metadata specifically
    saveBlinkMetadata: (id, metadata) => set(state => ({
      blinks: {
        ...state.blinks,
        [id]: {
          ...state.blinks[id],
          metadata,
        }
      }
    })),
  
    // Add an on-chain URL to the existing array
    addOnChainURL: (id, url) => set(state => ({
      blinks: {
        ...state.blinks,
        [id]: {
          ...state.blinks[id],
          onChainURLs: [...(state.blinks[id]?.onChainURLs || []), url]
        }
      }
    })),

  // Create a new blink and set it as active
  createNewBlink: () => {
    const newId = uuidv4();
    set(state => ({
      activeBlinkId: newId,
      blinks: {
        ...state.blinks,
        [newId]: { id: newId, title: '', description: '', actions: [] } // Initialize with empty data or defaults
      }
    }));
    return newId;
  },
}),
{
    name: 'blink-app-storage',  
    storage: createJSONStorage(() => localStorage),
    onRehydrateStorage: (state) => {
      console.log('Hydrating state for blinks...');
      return (state, error) => {
        if (error) {
          console.error('An error occurred during hydration:', error);
        } else {
          console.log('State hydrated successfully for blinks.');
        }
      };
    }
  }
  ),
);
  
  window.store = useBlinkStore; // For zukeeper debugging, remove for production
export default useBlinkStore;