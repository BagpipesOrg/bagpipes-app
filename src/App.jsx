import { useState, useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from 'antd';
import React from 'react';
import { Switch } from 'antd';
import {WalletHeader, WalletContext} from './components/select_wallet'; // Update the path accordingly
//import { SelectWallet } from './components/list_wallets';
import { Outlet, useNavigate } from 'react-router-dom';
import { SelectWalletModal } from './components/swm';

function App() {
  const [count, setCount] = useState(0)
  const walletContext = useContext(WalletContext);
  const wallet = walletContext.wallet || walletContext.evmWallet;

  return (
    <>
      <div>
<script>
console.log("test");
const theme = 'light';
</script>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
<p>s</p>

<div>
  
<Switch
        checkedChildren='Light'
        className={(!!walletContext.wallet || !!walletContext.evmWallet) ? 'sub-wallet-switch-theme with-header' : 'sub-wallet-switch-theme'}
        defaultChecked={'light' === 'light'}
        onChange={'light'}
        unCheckedChildren='Dark'
      />
      <WalletHeader visible={!!walletContext.wallet || !!walletContext.evmWallet} />
      <Outlet />
      <SelectWalletModal theme={'light'} />

</div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>

   

      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
