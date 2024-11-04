// @ts-nocheck
import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import {  Handle, Position, useNodeId } from 'reactflow';
import SocketContext from '../../../../contexts/SocketContext';
import { useAddressBook } from '../../../../contexts/AddressBookContext';
import useExecuteScenario from '../../hooks/useExecuteScenario';
import AccountDropdown from '../../CustomNodes/ChainNode/AccountDropdown';
import useAppStore from '../../../../store/useAppStore';
import { getOrderedList } from '../../hooks/utils/scenarioExecutionUtils';
import AddContacts from '../../CustomNodes/ChainNode/AddContacts'
import {  getAssetOptions } from '../../CustomNodes/ChainNode/options';
import { getSavedFormState, setSavedFormState } from '../../utils/storageUtils';
import BalanceTippy from '../../CustomNodes/ChainNode/BalanceTippy';
import ThemeContext from '../../../../contexts/ThemeContext';
import { buildHrmp, listChains, getAssetBalanceForChain } from 'chains-lib';
import { mapToObject } from '../../utils/storageUtils';
import { ChainIcon } from '../../../Icons/icons';
import { ChainNodeFormProps } from '../types';
import NodeForm from '../NodeForm';

import '../../node.styles.scss';
import 'antd/dist/antd.css';
import '../../../../index.css';
import '../../CustomNodes/ChainNode/ChainNode.scss';
import '../../../../main.scss';

import '/plus.svg'

const ChainNodeForm: React.FC<ChainNodeFormProps> = ({ visible, nodeId, nodes, edges, onNodesChange, setModalNodeId, inputNodes}) => {
  const { theme } = useContext(ThemeContext);

  const socket = useContext(SocketContext);
  const { nodeContentMap, executeScenario } = useExecuteScenario();
  // const nodeId = useNodeId();
  const [content, setContent] = useState("");
  const savedState = getSavedFormState(nodeId); 
  const { scenarios, activeScenarioId, loading, saveChainAddress, isModalVisible, setIsModalVisible, saveNodeFormData, saveHrmpChannels, hrmpChannels  } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    loading: state.loading,
    isModalVisible: state.isModalVisible,
    setIsModalVisible: state.setIsModalVisible,
    saveNodeFormData: state.saveNodeFormData,
    saveHrmpChannels: state.saveHrmpChannels,
    hrmpChannels: state.hrmpChannels,
  }));
  const { addContact, contacts, error, setError } = useAddressBook();
  const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
  const [allAddresses, setAllAddresses] = useState([]);

  const [assetOptions, setAssetOptions] = useState([]);
  const [assetsForChain, setAssetsForChain] = useState([]);
  const initialState = savedState || {
    chain: "",
      asset: {
          name: "",
          assetId: null
      },
      address: "",
      amount: null,
      delay: null,
      contact: null
  };
  const [formState, setFormState] = useState(savedState || initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);

  const inputRef = useRef(null);
  const [chainList, setChainList] = useState({});
  const ChainInfoList = Object.values(chainList);
  const selectedChainLogo = ChainInfoList.find(chain => chain.name === formState.chain)?.logo;



  // HRMP channel filtering area 
  const currentNode = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId);
  const currentNodeId = currentNode?.id;  
  const diagramData = scenarios[activeScenarioId]?.diagramData;
  const orderedList = getOrderedList(diagramData.edges);
  const currentNodeIndex = orderedList.indexOf(currentNodeId);
  const previousNodeIndex = currentNodeIndex - 2;

  const chainNameToId = (chainName) => {
    const chainInfo = ChainInfoList.find(info => info.name === chainName);
    return chainInfo ? chainInfo.paraid : null;
  }

  const sourceChainName = scenarios[activeScenarioId]?.diagramData?.nodes[previousNodeIndex]?.formData?.chain;
  const sourceChainId = chainNameToId(sourceChainName);
  let filteredChainInfoList: any[];
  const hrmpForSource = hrmpChannels[sourceChainId] || [];  // Default to an empty array if undefined

  // Always include "polkadot" and filter based on HRMP channels if they exist
  filteredChainInfoList = ChainInfoList.filter(chainInfo => {
      return chainInfo.name.toLowerCase() === "polkadot" || hrmpForSource.length === 0 || hrmpForSource.includes(chainInfo.paraid);
  });

  console.log(`sourceChainName:`, sourceChainName);

  if (sourceChainName == 'rococo') {
    filteredChainInfoList = ChainInfoList.filter(chainInfo => {
      return chainInfo.name.toLowerCase() === "rococo";
  });
  }

  if (sourceChainName == 'sora') {
    filteredChainInfoList = ChainInfoList.filter(chainInfo => {
      return chainInfo.name.toLowerCase() === "rococo";
  });
  }

 // filteredChainInfoList = ChainInfoList.filter(chainInfo => {
 //    return chainInfo.name.toLowerCase() === "rococo" | hrmpForSource.length === 0 || hrmpForSource.includes(12011);
 //});

  // Log a warning if the HRMP channels list is empty
  if (hrmpForSource.length === 0) {
    console.log(`hrmpForSource:`, hrmpForSource);
      console.warn(`No HRMP channels or empty HRMP channels list for source chain ID: ${sourceChainId}. Showing all options.`, ChainInfoList);
    //  filteredChainInfoList = [];
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching HRMP channels at initialization');
      try {
        const newHrmpChannels = await buildHrmp(relaychain);
        saveHrmpChannels(newHrmpChannels); // Assuming saveHrmpChannels is a function to store the channels in your state
        console.log('HRMP channels fetched and saved:', newHrmpChannels);
      } catch (error) {
        console.error('Failed to fetch HRMP channels:', error);
      }
    };
  
    fetchData();
  }, []); 

  // END of HRMP channel filtering area


  const fetchAddressesFromExtension = () => {
    // Return a mock list of addresses for simplicity.
    return [];
  };
  
  // Assuming we have some function to fetch addresses from the extension
  const extensionAddresses = useMemo(() => fetchAddressesFromExtension(), []);



  // Filtered assets based on the selected chain
  const assetsForSelectedChain = assetOptions.find(option => option.chain === formState.chain)?.assets || [];
  const filteredAssets = Array.isArray(assetsForSelectedChain) ? assetsForSelectedChain : [assetsForSelectedChain];
    // console.log('ChainInfoList', ChainInfoList)

    const handleFormChange = (field, value) => {
      setFormState(prev => ({
          ...prev,
          [field]: value
      }));
  };

  const handleDelayChange = async (e) => {
    const delayamount = e.target.value;
    
    // Update the chain in the form state
    handleFormChange("delay", delayamount);
  };


  const handleChainChange = async (e) => {
    const selectedChainName = e.target.value;
    
    // Update the chain in the form state
    handleFormChange("chain", selectedChainName);
    setIsLoading(true);
  };

  const handleAssetChange = (e) => {
    const selectedAssetName = e.target.value;
    let selectedAssetInfo;

    if (selectedAssetName !== 'Select an asset') {
      selectedAssetInfo = assetsForChain.find(asset => asset.asset.name === selectedAssetName);
      // console.log('selectedAssetInfo', selectedAssetInfo);
    }
    if (selectedAssetInfo) {
      setFormState(prevState => ({
        ...prevState,
        asset: {
          name: selectedAssetInfo.asset.name,
          assetId: selectedAssetInfo.assetId,
          symbol: selectedAssetInfo.asset.symbol
        }
      }));
    } else {
      setFormState(prevState => ({
        ...prevState,
        asset: null
      }));
    }
};

  useEffect(() => {
    if (formState.chain) {
      const controller = new AbortController();
      const signal = controller.signal;
  
      const fetchAssets = async () => {
        try {
          const assetsData = await getAssetOptions(formState.chain, signal); 
          if (!signal.aborted) {
            setAssetsForChain(assetsData.assets);
            // console.log('Fetched assets:', assetsData);
  
            if (!formState.asset && assetsData.assets?.length) {
              handleFormChange("asset", assetsData.assets[0]);
            }
          }
        } catch (error) {
          if (!signal.aborted) {
            console.error("Failed to fetch assets for chain", formState.chain, error);
            // Handle this error as needed, maybe show a user-friendly message
          }
        } finally {
          if (!signal.aborted) {
            setIsLoading(false);
          }
        }
      };
  
      fetchAssets();
  
      return () => controller.abort();  // Cleanup function
    }
  }, [formState.chain]);
  


  useEffect(() => {
    setFormState(initialState);
  }, [nodeId]);

  useEffect(() => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    // console.log('currentNodeFormData', scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId));
    if (currentNodeFormData) {
        setFormState({
            chain: currentNodeFormData?.chain?.name || "",
            display: currentNodeFormData?.chain?.display || "",
            asset: {
                name: currentNodeFormData?.asset?.name || "",
                assetId: currentNodeFormData?.asset?.assetId || null
            },
            // address, amount...
        });
    }
  }, [ nodeId, activeScenarioId]);

  useEffect(() => {
    const formData = { ...formState };

    saveNodeFormData(activeScenarioId, nodeId, formData);
    setSavedFormState(nodeId, formData); // save to local storage
  }, [formState]);

  useEffect(() => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    
    if (currentNodeFormData) {
        setFormState(currentNodeFormData);
    }
  }, [ nodeId, activeScenarioId]);

  useEffect(() => {
    setAllAddresses([...extensionAddresses, ...contacts.map(contact => contact.address)]);
  }, [extensionAddresses, contacts]);


  useEffect(() => {
    if (isModalVisible && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isModalVisible]);


  useEffect(() => {
    if (loading) { // If a new execution is starting...
      setContent(""); // Clear the content
    } else {
      setContent(nodeContentMap[nodeId] || '');
    }
  }, [nodeContentMap, nodeId]);

  useEffect(() => {
    const fetchChains = async () => {
        const chains = listChains();
        setChainList(chains);
    };

    fetchChains();
  }, []);

  const fetchBalance = async (signal) => {
    try {
      setIsFetchingBalance(true);
      const fetchedBalance = await getAssetBalanceForChain(formState.chain, formState.address,  formState.asset.assetId, signal); 
      if (!signal.aborted) {
        setBalance(fetchedBalance);
      }
    } catch (error) {
      if (!signal.aborted) {
        console.error("Failed to fetch balance", error);
      }
    } finally {
      if (!signal.aborted) {
        setIsFetchingBalance(false);
      }
    }
};

useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (formState.chain && formState.asset && formState.address) {

    fetchBalance(signal);

    }

    return () => controller.abort();
}, [formState.chain, formState.asset, formState.address]);


  return (
    <NodeForm
    visible={visible}
    nodeId={nodeId}
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChange}
    setModalNodeId={setModalNodeId}
    inputNodes={inputNodes}
>
    <div className={`${theme}`}>
       
      <div className='flex justify-between m-1 '>
        <ChainIcon className="h-4 w-4" fillColor='rgb(156 163 175' />
        <div className="text-xxs node-form-input primary-font mb-1">{nodeId}</div>
      </div>
      {selectedChainLogo && (
          <div className="chain-logo-container mb-2 mt-2 flex justify-center ">
            <img src={selectedChainLogo} alt={`${formState.chain} Logo`} className="chain-logo w-12 h-12" /> 
          </div>
        )}
     
      
        <div className="mb-3">
        <div className="form-selection">
            <h3 >Chain</h3> 
            <select 
                className=" text-black in-node-border font-semibold p-2  bg-white"
                onChange={handleChainChange}
                value={formState.chain}  // sets the value for the dropdown from the state
            >
                <option value="" selected>Select chain</option>
                {filteredChainInfoList.map((ChainInfo, index) => (
                  <option key={ChainInfo.name} value={ChainInfo.name}>
                    {ChainInfo.display}
                  </option>
                ))}
            </select>
          </div>
      
        <div className="mb-3">
        {formState.chain && (
          <div className="form-selection">
            <h3>Asset </h3>
            {isLoading ? (
               <div className="select-container">
               <div className=" border-gray-300 p-2 font-semibold rounded-md w-full">
                 <div className="spinner"></div>  
               </div>
             </div>
          ) : (
            <select className="asset-selector text-black font-semibold in-node-border border-gray-300 p-2 bg-white" onChange={handleAssetChange} value={formState.asset ? formState.asset.name : ""}>
              <option value="">Select an asset</option>
               {assetsForChain.map(asset => (
                   <option key={asset.assetId} value={asset.asset.name}>
                    {asset.asset.symbol} | {asset.asset.name} | AssetId: {asset.assetId}
                   </option>
               ))}
            </select>
          )}
          </div>
        )}
      </div>
  
      {formState.chain && (
          <div className="form-selection">
          <h3>Addresses99:</h3>
          <div className="flex items-center font-semibold text-black justify-start  w-full">
            <AccountDropdown 
                selectedChainName={formState.chain}
                selectedAddress={formState.address}  // Pass address value from state
                onSelect={(address) => handleFormChange("address", address)} 
            />
          </div>
          <AddContacts />
        </div>
      )}
 

    {formState.chain && (
      <div className="form-selection ">
        <div className='flex justify-between'>
        <h3>Amount</h3>
          <div className="flex primary-font">

            { isFetchingBalance ? (
              <div className="small-spinner"></div>
            ) : (
              balance !== null && (
                <BalanceTippy balance={balance} symbol={formState.asset.symbol} />
              )
            )}
            
            <span onClick={fetchBalance} className="text-xs m-1 p-0 rounded refresh-button">
              <img className="h-3 w-3" src="/refresh.svg" />
            </span>
          </div>
          </div>
          
       
        <div className="unbounded-black">
          <input 
            className='unbounded-black text-xl text-black p-1 in-node-border border-gray-300 rounded amount-selector'
            type="number" 
            placeholder="0.0000" 
            value={formState.amount}
            onChange={(e) => handleFormChange('amount', e.target.value)}
          />
        </div>
      </div>
    )}
<div className=''>
{formState.chain == 'polkadot' && (
      <div class="form-selection"  onChange={handleDelayChange}  value={formState.delay}>
          
          <h3>
          Schedule (delay number of blocks)
          </h3>
    
          <div class="unbounded-black">
            <input class="unbounded-black text-xl text-black pl-1 in-node-border border-gray-300 rounded amount-selector" type="number" placeholder="0" min="0"/>
        </div></div> )} 

        {formState.chain && (

      // {formState.chain && contacts.length > 0 && (
        <div className="form-selection ">
            <h3>Contacts</h3>
            <select 
                className="contact-selector font-semibold text-black in-node-border border-gray-300 p-2 rounded"
                value={formState.contact || ""}
                onChange={(e) => {
                    if(e.target.value === 'create_new_contact') {
                      <AddContacts />
                      setIsModalVisible(true)
                      } else {
                        handleFormChange("contact", e.target.value);
                      }
                }}
            >
                <option value="create_new_contact" style={{ borderBottom: '1px solid #ccc', fontWeight: 500 }}>Create New Contact</option> {/* Added style for borderBottom */}
                <option value="">Select Contact</option>
                {contacts.map(contact => (
                    <option key={contact.address} value={contact.address}>
                        {`${contact.name} (${contact.address})`}
                    </option>
                ))}
            </select>
        </div>
      )}
      </div>
 
    </div>
   
    </div>
    </NodeForm>
  );
  
};

export default ChainNodeForm;