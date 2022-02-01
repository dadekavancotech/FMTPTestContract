import React, { Component, useEffect, useState } from "react";
import DividendDistributor from "./contracts/DividendDistributor.json";
import getWeb3 from "./getWeb3";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  // const [web3, setWeb3] = useState();
  // const [accounts, setAccounts] = useState([]);
  // const [contract, setContract] = useState();

  const [conect, setContract] = useState({
    web3: null,
    accounts: [],
    contract: null,
    balance: 0,
  });

  const [claimDividendResult, setClaimDividendResult] = useState();

  useEffect(() => {
    connectToMetaMask();
  }, []);

  const connectToMetaMask = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DividendDistributor.networks[networkId];
      const instance = new web3.eth.Contract(
        DividendDistributor.abi,
        deployedNetwork && deployedNetwork.address
      );
      var balance = await web3.eth.getBalance(accounts[0]);
      balance = web3.utils.fromWei(balance, "ether");

      setContract({
        web3,
        accounts,
        contract: instance,
        balance,
      });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const ClaimNow = async () => {
    debugger;

    var claimDividendResult = await conect.contract.methods
      .claimDividend()
      .send({ from: conect.accounts[0] });

    setClaimDividendResult(claimDividendResult);
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark"
        aria-label="Main navigation"
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Smart Contract
          </a>
          <button
            className="navbar-toggler p-0 border-0"
            type="button"
            id="navbarSideCollapse"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="navbar-collapse offcanvas-collapse"
            id="navbarsExampleDefault"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <button
            className={
              conect.accounts.length == 0
                ? "btn btn-primary"
                : "btn btn-success"
            }
            type="button"
            onClick={connectToMetaMask}
          >
            {conect.accounts.length == 0
              ? "Connect to MetaMask"
              : conect.accounts[0]}
          </button>
        </div>
      </nav>

      <main className="container" style={{ marginTop: 70 }}>
        <div
          className="my-3 p-3 bg-body rounded shadow-sm"
          style={{ overflowX: "auto" }}
        >
          <h6 className="border-bottom pb-2 mb-0">Pending $USDC Rewards</h6>
          <div className="text-muted pt-3">
            <strong className="d-block text-gray-dark text-bold">
              ${conect.balance} USDC
            </strong>
            <div className="d-block">
              <button
                className="btn btn-primary"
                type="button"
                onClick={ClaimNow}
              >
                Claim Now
              </button>
            </div>
            <div>
              <p>{JSON.stringify(claimDividendResult, null, 4)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
