import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utils/connectors';

const Wallet = () => {
  const { activate } = useWeb3React()

  return (
    <div className="row">
      <div className="col-lg-3 mb30">
        <span className="box-url" onClick={() => activate(injected)}>
          <span className="box-url-label">Most Popular</span>
          <img src="./img/wallet/1.png" alt="" className="mb20" />
          <h4>Metamask</h4>
          <p>
            Start exploring blockchain applications in seconds. Trusted by
            over 1 million users worldwide.
          </p>
        </span>
      </div>
    </div>
  );
};
export default Wallet;