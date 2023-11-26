import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
// import NodeNotifications from './toasts/NodeNotifications';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import Layout from '../Wallet/components/Layout';
import Welcome from '../Welcome/Welcome';
import WalletInfo from '../Wallet/pages/WalletInfo';
import EvmWalletInfo from '../Wallet/pages/EvmWalletInfo';
import BagpipesFlowRoute from '../../routes/BagpipesFlowRoute';
import TransactionMain from '../Bagpipes/CustomNodes/TransactionReview/TransactionMain';
import CreateFromTemplate from '../Bagpipes/TemplateFeatures/CreateFromTemplate';
import ReactTestFlow from '../../ReactTestFlow';
import Sidebar from '../Bagpipes/Sidebar/Sidebar';
import Header from '../Header';
import Lab from '../../pages/Lab/Lab';
import Parachains from '../../pages/Parachains/Parachains';
import ThemeContext from '../../contexts/ThemeContext';
import '../toasts/toast.scss';
// import '../index.css';
import './MainLayout.scss';

function MainLayout({ children }) {
    const { theme } = React.useContext(ThemeContext);

    // const { toastPosition } = useAppStore(state => ({
    //     toastPosition: state.toastPosition,
    //   }));
  return  (
    
            <div className={`main-layout ${theme === 'dark' ? '-dark' : '-light'}`}>

        {/* <Toaster /> */}
        <Toaster
            position="top-left"

            containerStyle={{ position: 'absolute' }} 
            toastOptions={{
                className: 'toast-styles',
                style: {
                    background: '#fff00', // This seems like an incorrect color value. Ensure it's valid.
                    padding: 0,
                    minWidth: "200px",
                    transition: "all 0.5s ease-out",
                    zIndex: 100000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between", // This will push the elements to the opposite ends
                },
            }}
        > 
        {(t) => (
            <ToastBar toast={t}>
                {({ icon, message }) => (
                    <div className={` toast-container ${theme}`}>
                        <div className="toast-content">
                            {icon}
                            {message}
                        </div>
                        {t.type !== 'loading' && (
                            <button className='toast-button' onClick={() => toast.dismiss(t.id)}>x</button>
                        )}
                    </div>
                )}
            </ToastBar> 
        )}
        </Toaster>
        {/* <Header /> */}
            <Routes>
                {/* Root Route */}
                {/* <Route path="/" element={<Layout />}> */}
                    {/* Nested Routes */}
                    <Route index element={<Welcome />} />
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="builder" element={<BagpipesFlowRoute />} />

                    <Route path="lab" element={<Lab />} />
                    <Route path="wallet-info" element={<WalletInfo />} />
                    <Route path="transaction/review" element={<TransactionMain />} />
                    <Route path="parachains" element={<Parachains />} />
                    <Route path="test-flow" element={<ReactTestFlow />} />
                    <Route path="evm-wallet-info" element={<EvmWalletInfo />} />
                {/* </Route> */}
                {/* Other Top-Level Routes */}
                <Route path="/create" element={<CreateFromTemplate />} />
            </Routes>
            <Outlet />
      
</div>
  );
}
  

  export default MainLayout;