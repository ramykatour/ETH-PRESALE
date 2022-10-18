import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { contract_address, contract_abi, speedy_nodes } from "./config";
function App() {
  const [isWalletConnected, setisWalletConnected] = useState(false);
  const [connectBtnText, setConnectBtnText] = useState("Connect Wallet");
  const [contract, setContract] = useState();
  const [contractEthBalance, setcontractEthBalance] = useState(0);
  const [contractTokenBalance, setcontractTokenBalance] = useState(0);
  const [tokenPriceInWei, settokenPriceInWei] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const [selectedEthValue, setselectedEthValue] = useState(0.0000135);

  const [selectedEthValueinWei, setselectedEthValueinWei] = useState();
  const [tokensToGet, settokensToGet] = useState(0);

  const [web3Global, setweb3global] = useState();
  const [isModal, setIsModal] = useState(false);

  const startFunction = async () => {
    // await loadDisconnect()
    const web3 = new Web3(speedy_nodes);
    const isContract = new web3.eth.Contract(contract_abi, contract_address);
    setContract(isContract);
    setweb3global(web3);
  };

  // First one time run
  useEffect(() => {
    const fun = async () => {
      await startFunction();
    };
    fun();
    console.log("contract : ", contract);
  }, []);

  useEffect(() => {
    //connect_wallet();
    console.log("contract : ", contract);
    if (!isModal && web3Global != "") {
      console.log("loaded web3");
      fetch_data();
    }
    // if(!isModal && web3Global === ""){
    //   console.log("empty web3")
    //   fetch_data();
    // }
    //connect_wallet();
  }, [web3Global]);

  // const loadDisconnect = async () => {
    // Chain Disconnect
    // window.ethereum.on("disconnect", async () => {
    // window.localStorage.clear();
    // // await window.ethereum.disconnect();
    // // await window.ethereum.close();
    // // await web3Global.eth.currentProvider.disconnect();
    // await web3Global.current.clearCachedProvider();
    // setIsModal(false);
    // setweb3global("");
    // console.log("chain changed : ");
    // });
  // };

  async function connect_wallet() {
    // if(Web3.givenProvider){

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId:
              "3ca1583421a74069b07075f209879afb", // required
              // "17342b0f3f344d2d96c2c89c5fddc959", // required
          },
        },
        coinbasewallet: {
          package: CoinbaseWalletSDK, // Required
          options: {
            appName: "FlyGuyz", // Required
            infuraId:
              "3ca1583421a74069b07075f209879afb", // Required
            rpc: "", // Optional if `infuraId` is provided; otherwise it's required
            chainId: 1, // Optional. It defaults to 1 if not provided
            darkMode: false, // Optional. Use dark theme, defaults to false
          },
        },
      },
    });

    const provider = await web3Modal.connect();
    if (!provider) {
      return {
        web3LoadingErrorMessage: "Error in connecting Wallet",
      };
    } else {
      const web3 = new Web3(provider);
      setIsModal(true);
      const addresses = await web3.eth.getAccounts();
      const address = addresses[0];

      console.log("address", address);
      setisWalletConnected(true);
      setConnectBtnText("Connected");
      // const contract = new web3.eth.Contract(contract_abi, contract_address);

      setweb3global(web3);
      //   contract.methods.getMintedCount(address).call((err,result) => {
      //     console.log("error: "+err);
      //     if(result != null){
      //        //setMintedCount(result)
      //     }
      // })
      web3.eth.net.getId().then((result) => {
        console.log("Network id: " + result);
        if (result !== 1) {
          alert("Wrong Network Selected. Select Ethereum Mainnet");
        }
      });
    }
  }

  async function fetch_data() {
    // const contract = new web3Global.eth.Contract(
    //   contract_abi,
    //   contract_address
    // );
    //await Web3.givenProvider.enable()

    console.log(
      "contract in fetch_data : ",
      contract.methods.getContractEthBalance()
    );
    contract.methods.getContractEthBalance().call((err, result) => {
      console.log("error: " + err);
      if (result != null) {
        setcontractEthBalance(result);
        calculate_progress(web3Global, result);
      }
    });

    contract.methods.getContractTokenBalance().call((err, result) => {
      console.log("error: " + err);
      if (result != null) {
        setcontractTokenBalance(result);
      }
    });

    contract.methods.tokenPriceInWei().call((err, result) => {
      console.log("error: " + err);
      if (result != null) {
        settokenPriceInWei(result);
      }
    });
    // contract.methods.get_token_count().call((err,result) => {
    //     if(result != null){
    //         settokenCount(result)
    //     }
    // })
  }
  const onEthValueInputHandler = (e) => {
    let temp = parseInt(e.target.value - 0.0000135);
    temp = temp + 1;
    temp = temp * parseInt(tokenPriceInWei);
    let value_in_ether = web3Global.utils.fromWei(temp.toString(), "ether");

    if (parseFloat(value_in_ether) <= 0.0000135) {
      return;
    }
    console.log(value_in_ether);
    setselectedEthValueinWei(temp);
    setselectedEthValue(parseFloat(value_in_ether));
    settokensToGet(parseFloat(value_in_ether) / 0.0000135);
    //setMintValue(+e.target.value);
  };
  const onEthManuallyValueInputHandler = (e) => {
    //if (+e.target.value <= 1 || +e.target.value >=limit) return;

    // let temp = parseInt((e.target.value) - 0.0000135);
    // temp = temp + 1;
    // temp = temp * parseInt(tokenPriceInWei);
    // console.log(web3Global.utils.fromWei(temp.toString() , "ether"));

    setselectedEthValue(parseFloat(e.target.value));
    settokensToGet(parseFloat(e.target.value) / 0.0000135);
    setselectedEthValueinWei(web3Global.utils.toWei(e.target.value));
    //setMintValue(+e.target.value);
  };
  async function show_error_alert(error) {
    let temp_error = error.message.toString();
    console.log(temp_error);
    let error_list = [
      "It's not time yet",
      "Sent Amount Wrong",
      "Max Supply Reached",
      "You have already Claimed Free Nft.",
      "Presale have not started yet.",
      "Presale Ended.",
      "You are not Whitelisted.",
      "Sent Amount Not Enough",
      "Max 20 Allowed.",
      "insufficient funds",
      "Exceeding Per Tx Limit",
      "mint at least one token",
      "incorrect ether amount",
      "Presale Ended.",
      "Sale is Paused.",
      "You are not whitelisted",
      "Invalid Voucher. Try Again.",
      "Max Supply Reached.",
      "Public sale is not started",
      "Needs to send more eth",
      "Public Sale Not Started Yet!",
      "Exceed max adoption amount",
      "Private Sale Not Started Yet!",
      "Exceed max minting amount",
      "TokenCrowdsaleFLYY: sent ETH amount must be between purchasing limit",
      "TokenCrowdsaleFLYY: buyable token amount exceeds crowdsale contract balance",
    ];

    for (let i = 0; i < error_list.length; i++) {
      if (temp_error.includes(error_list[i])) {
        // set ("Transcation Failed")
        alert(error_list[i]);
      }
    }
  }
  async function buy() {
    if (web3Global) {
      // const web3 = new Web3(web3Global);
      // await Web3.givenProvider.enable();
      // const contract = new web3.eth.Contract(contract_abi, contract_address);

      const addresses = await web3Global.eth.getAccounts();
      const address = addresses[0];
      console.log("addresses[0]: " + addresses[0]);

      // price = Math.round(price * 100) / 100;
      console.log("Price:  .........   " + selectedEthValueinWei);
      //   price =0.006;
      try {
        const estemated_Gas = await contract.methods.buyToken().estimateGas({
          from: address,
          value: selectedEthValueinWei.toString(),
          maxPriorityFeePerGas: null,
          maxFeePerGas: null,
        });
        console.log(estemated_Gas);
        const result = await contract.methods.buyToken().send({
          from: address,
          value: selectedEthValueinWei.toString(),
          gas: estemated_Gas,
          maxPriorityFeePerGas: null,
          maxFeePerGas: null,
        });
      } catch (e) {
        show_error_alert(e);
      }

      // await contract.methods.tokenByIndex(i).call();
    } else {
      alert("Web3 Not Found. Try refreshing if you have metamask installed.");
    }
  }
  function calculate_progress(web3Global, contractEthBalance) {
    //let in_ether = web3Global.utils.fromWei("1000000000000000000000", "ether");
    let in_ether = contractEthBalance;
    let in_float = parseFloat(in_ether);

    let total_bought = in_float / 0.0000135;
    total_bought = Math.round(total_bought);

    let total_tokens = 75000000;
    const completed = Math.round(
      (Math.round(total_bought) / total_tokens) * 100
    );
    //let completed = ((total_tokens/ 100) * total_bought).toFixed(2)
    console.table({ in_float, total_bought, completed });
    setProgressPercentage(completed + "%");
  }
  return (
    <div>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>FlyGuyz</title>
      {/* Favicon */}
      <link
        rel="shortcut icon"
        href="img/flyguyz-favicon.png"
        type="image/x-icon"
      />
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Russo+One&family=Ubuntu:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      {/* Boostrap CSS */}
      <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css" />
      {/* FontAwesome CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/fontawesome.min.css"
        integrity="sha512-xX2rYBFJSj86W54Fyv1de80DWBq7zYLn2z0I9bIhQG+rxIF6XVJUpdGnsNHWRa6AvP89vtFupEPDP8eZAtu9qA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/solid.min.css"
        integrity="sha512-qzgHTQ60z8RJitD5a28/c47in6WlHGuyRvMusdnuWWBB6fZ0DWG/KyfchGSBlLVeqAz+1LzNq+gGZkCSHnSd3g=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      {/* CSS */}
      <link rel="stylesheet" href="css/style.css" />
      {/* Header Start */}
      <nav className="navbar navbar-expand-lg">
        <div className="container-xxl flex-nowrap">
          <div id="sideBarNav" className="sidebar-nav me-2 me-md-5">
            <a id="sideBarBtn" href="javascript:void(0)">
              <span />
              <span />
              <span />
              <span />
            </a>
          </div>
          <a className="navbar-brand" href="index.html">
            <img
              src="img/flyguyz-logo.png"
              className="img-fluid"
              alt="FlyGuyz"
            />
          </a>
          <ul className="navbar-nav ms-auto mb-lg-0">
            <li className="nav-item">
              {/* {isWalletConnected && (
                <button
                  type="button"
                  onClick={loadDisconnect}
                  className="btn-buy d-block text-uppercase btn btn-blue"
                >
                  Disconnect
                </button>
              )} */}
              <a
                className="btn btn-blue"
                aria-current="page"
                onClick={connect_wallet}
              >
                {connectBtnText}
              </a>
            </li>
          </ul>
        </div>
      </nav>
      {/* Header   End */}
      {/* Main Start */}
      <div className="container-fluid">
        <div className="row align-items-stretch">
          {/* Sidebar Start */}
          <div id="sideBar" className="sidebar py-4 col-auto">
            <div className="sidebar-block">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="icon">
                      <img
                        src="img/icons/tokenization.svg"
                        alt="Buy Tokens"
                        className="img-fluid"
                      />
                    </i>
                    <span>Buy Tokens</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="https://www.flyguyz.io/" className="nav-link">
                    <i className="icon">
                      <img
                        src="img/icons/home.svg"
                        alt="Home"
                        className="img-fluid"
                      />
                    </i>
                    <span>Home</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="https://www.flyguyz.io/litepaper.html"
                    className="nav-link"
                  >
                    <i className="icon">
                      <img
                        src="img/icons/bird.svg"
                        alt="Litepaper"
                        className="img-fluid"
                      />
                    </i>
                    <span>Litepaper</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="https://www.flyguyz.io/index.html#roadmap"
                    className="nav-link"
                  >
                    <i className="icon">
                      <img src="img/icons/track.svg" alt="Roadmap" />
                    </i>
                    <span>Roadmap</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Sidebar   End */}
          {/* Other Page Start */}
          <div className="col pt-4">
            <div className="wrap px-lg-4 px-xl-5">
              {/* Breadcrumbs Start */}
              <div className="breadcrumbs">
                <a href="#">User dashboard</a>
                <span> ⁄ </span>
                <span>Private Sale</span>
              </div>
              {/* Breadcrumbs   End */}
              {/* Private Sale Start */}
              <div className="private-sale">
                <div className="page-header">
                  <h2 className="page-heading text-uppercase">
                    Private round (WHITELIST OPENED)
                  </h2>
                </div>
                {/* <div class="note mb-5">
          <div class="card-widget card-widget-success h-100">
            <div class="card-widget-body d-flex flex-row align-items-center">
              <div class="dot dot dot-xlg me-3 bg-success"></div>
              <div class="text pe-3">
                <h6 class="text-uppercase mb-0">Private sale is finished. Thank you for participating!</h6>
                <span>We will announce further instructions how to claim your FLYY tokens in User dashboard and what
                  are the dates of Public round, TGE, and listings. Check our social media for the detailed
                  information</span>
              </div>
              <div class="icon icon-lg text-white bg-success"><svg aria-hidden="true" focusable="false"
                  data-prefix="fal" data-icon="check" class="svg-inline--fa fa-check " role="img"
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor"
                    d="M443.3 100.7C449.6 106.9 449.6 117.1 443.3 123.3L171.3 395.3C165.1 401.6 154.9 401.6 148.7 395.3L4.686 251.3C-1.562 245.1-1.562 234.9 4.686 228.7C10.93 222.4 21.06 222.4 27.31 228.7L160 361.4L420.7 100.7C426.9 94.44 437.1 94.44 443.3 100.7H443.3z">
                  </path>
                </svg></div>
            </div>
          </div>
        </div> */}
              </div>
              {/* Private Sale   End */}
              {/* Graphs Start */}
              <section className="section-sale mb-3 mb-lg-5">
                <div className="row">
                  <div className="my-4 col-xxl-8 col-xl-8 col-lg-12 col-md-12">
                    <div className="card h-100">
                      <div className="card-inner after-content">
                        <div className="py-4 card-header">
                          <h6 className="card-heading">Buy Tokens</h6>
                        </div>
                        <div className="pt-3 pb-3 card-body">
                          <div className="h5">Total pay</div>
                          <div className="coin-swap mb-3">
                            <div className="row align-items-center">
                              <div className="col-lg-2 col-md-3 mb-4 mb-md-0">
                                <span className="token token-with-ticker">
                                  <img
                                    src="img/ethereum.svg"
                                    alt="ethereum"
                                    className="img-fluid"
                                  />
                                  <span className="token-name">ETH</span>
                                </span>
                              </div>
                              <div className="col-lg-8 col-md-6 mb-3 mb-md-0">
                                {/* <div class="slider-container">
                          <div class="nouislider text-primary">
                            <div class="noUi-target noUi-ltr noUi-horizontal noUi-txt-dir-ltr">
                              <div class="noUi-base">
                                <div class="noUi-connects">
                                  <div class="noUi-connect" style="transform: translate(0%, 0px) scale(0, 1);"></div>
                                </div>
                                <div class="noUi-origin" style="transform: translate(-1000%, 0px); z-index: 4;">
                                  <div class="noUi-handle noUi-handle-lower" data-handle="0" tabindex="0"
                                    role="slider" aria-orientation="horizontal" aria-valuemin="100.0"
                                    aria-valuemax="50000.0" aria-valuenow="100.0" aria-valuetext="100">
                                    <div class="noUi-touch-area"></div>
                                    <div class="noUi-tooltip">100</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                                <form className="w-100">
                                  <div className="slider">
                                    <span className="min-value">0.0000135</span>
                                    <div className="range">
                                      <input
                                        type="range"
                                        onChange={onEthValueInputHandler}
                                        className="form-range"
                                        min={0.0000135}
                                        max={1000000}
                                        defaultValue={0.0000135}
                                        required
                                      />
                                      {/* <span className="current-value">{selectedEthValue}</span> */}
                                    </div>
                                    <span className="max-value">14</span>
                                  </div>
                                </form>
                              </div>
                              <div className="col-lg-2 col-md-3">
                                <input
                                  type="number"
                                  onChange={onEthManuallyValueInputHandler}
                                  className="form-control"
                                  min={0.0000135}
                                  max={1000000}
                                  defaultValue={selectedEthValue}
                                  value={selectedEthValue}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="coin-swap-arrow">
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              data-prefix="fal"
                              data-icon="arrow-down"
                              className="svg-inline--fa fa-arrow-down fa-2x"
                              role="img"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 384 512"
                            >
                              <path
                                fill="currentColor"
                                d="M378.8 309.8l-176 165.9C199.7 478.6 195.9 480 192 480s-7.719-1.426-10.77-4.31l-176-165.9C-1.297 303.6-1.781 293.1 4.156 286.3c5.953-6.838 16.09-7.259 22.61-1.134L176 425.9V48.59c0-9.171 7.156-16.59 15.1-16.59S208 39.42 208 48.59v377.3l149.2-140.7c6.516-6.125 16.66-5.704 22.61 1.134C385.8 293.1 385.3 303.6 378.8 309.8z"
                              ></path>
                            </svg>
                          </div>
                          <div className="h5">Total receive</div>
                          <div className="coin-swap igu-token mb-3">
                            <span className="token token-with-ticker">
                              <span className="token-left">
                                <img
                                  src="img/icons/flyguyz-icon.png"
                                  alt="FlyGuyz"
                                />
                                <span className="token-name">FLYY</span>
                              </span>
                              <b className="token-value">{tokensToGet}</b>
                            </span>
                          </div>
                          <hr />
                          <div className="h5 tooltip-calculate-result">
                            Avg. Price
                            <small className="text-muted">
                              1 FLYY = 0.0000135 Ethereum (ETH)
                            </small>
                          </div>
                        </div>
                        <div className="text-end card-footer">
                          {!isWalletConnected && (
                            <button
                              type="button"
                              onClick={connect_wallet}
                              className="btn-buy d-block w-100 text-uppercase btn btn-blue"
                            >
                              Connect wallet
                            </button>
                          )}
                          {isWalletConnected && (
                            <button
                              type="button"
                              onClick={buy}
                              className="btn-buy d-block w-100 text-uppercase btn btn-blue"
                            >
                              Buy!
                            </button>
                          )}

                          <div className="text-center mt-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 col-lg-4 col-md-12">
                    <div className="mt-4">
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-7">
                              <div className="text-center text-primary">
                                <p className="mb-0">1 FLYY = </p>
                                <div className="h5">$0.02</div>
                                <hr />
                                <p className="mb-0 text-uppercase text-primary">
                                  Private round
                                </p>
                              </div>
                            </div>
                            <div className="col-5">
                              <div className="text-center">
                                <p className="text-muted mb-0">1 FLYY = </p>
                                <div className="h5">$0.05</div>
                                <hr />
                                <p className="text-muted mb-0 text-uppercase">
                                  Public round
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 fundraising-card col-xl-8 col-lg-12 col-md-12">
                    <div className="h-100 card">
                      <div className="py-4 card-header">
                        <h6 className="card-heading">
                          Private sale Fundraising
                        </h6>
                      </div>
                      <div className="pt-3 pb-0 card-body">
                        <div className="h2 mb-3 text-accent text-uppercase">
                          {progressPercentage}
                        </div>
                        <div className="align-items-center mb-3 row">
                          <div className="fundraising-element mb-3 mb-md-0 text-muted fw-bold text-round col-lg-2 col-md-2">
                            Completed
                          </div>
                          <div className="fundraising-element mb-3 mb-md-0 col-lg-7 col-md-6">
                            <div className="progress">
                              <div
                                role="progressbar"
                                className="progress-bar bg-green progress-bar-animated progress-bar-striped"
                                aria-valuenow={0}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ width: progressPercentage }}
                              >
                                {progressPercentage}
                              </div>
                            </div>
                          </div>
                          <div className="fundraising-element text-muted fw-bold col-lg-3 col-md-4">
                            <span className="token token-with-ticker">
                              <img
                                src="img/icons/flyguyz-icon.png"
                                alt="FlyGuyz"
                              />
                              <span className="token-name">FLYY</span>
                              <b className="token-value">75,000,000</b>
                            </span>
                          </div>
                        </div>
                        <hr />
                        <div className="mb-3 row">
                          <div className="col-lg-6">
                            <p>
                              <b>Token details:</b>
                            </p>
                            <ul>
                              <li>
                                <p>
                                  <small className="text-muted">
                                    Token Symbol:{" "}
                                  </small>
                                  <a href="#" target="_blank" rel="noreferrer">
                                    <b>$FLYY</b>
                                  </a>
                                </p>
                              </li>
                              <li>
                                <p>
                                  <small className="text-muted">
                                    Hard Cap:{" "}
                                  </small>
                                  <strong>
                                    <span>$1,500,000</span>
                                  </strong>
                                </p>
                              </li>
                              {/* <li>
                        <p><small class="text-muted">Private sale supply: </small><b>35,000,000 FLYY</b></p>
                      </li> */}
                              <li>
                                <p>
                                  <small className="text-muted">
                                    Max supply:{" "}
                                  </small>
                                  <b>888,000,000 FLYY</b>
                                </p>
                              </li>
                            </ul>
                          </div>
                          <div className="col-lg-6">
                            <p>
                              <b>Round details:</b>
                            </p>
                            <ul>
                              <li>
                                <p>
                                  <small className="text-muted">
                                    Min. allocation:{" "}
                                  </small>
                                  <b>
                                    <span>$100</span>
                                  </b>
                                </p>
                              </li>
                              <li>
                                <p>
                                  <small className="text-muted">
                                    Max. allocation:{" "}
                                  </small>
                                  <b>
                                    <span>$50,000</span>
                                  </b>
                                </p>
                              </li>
                              <li>
                                <p>
                                  <small className="text-muted">Price: </small>
                                  <b>1 FLYY = 0.02$</b>
                                </p>
                              </li>
                              {/* <li>
                        <p><b>1 FLYY = 0.048 BUSD</b><small class="text-muted"> - Allocation less than
                            $10,000</small></p>
                      </li> */}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Graphs   End */}
            </div>
            {/* Footer Start */}
            <footer className="footer align-self-end py-3 px-xl-5 w-100">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-3">
                    <div className="copyright justify-content-center justify-content-md-start fw-bold">
                      <p className="mb-3 mb-md-0">FlyGuyz © 2022</p>
                    </div>
                  </div>
                  <div className="text-center text-md-start fw-bold col-md-6">
                    <ul className="social-list">
                      <li>
                        <a
                          className="social-list-item social-discord"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-discord" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-telegram"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-telegram" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-twitter"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-twitter" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-binance"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-binance" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-opensea"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-opensea" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-cmc"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-cmc" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-linktree"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-linktree" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center text-md-end text-gray-400 col-md-3">
                    <div className="mb-0 version justify-content-center justify-content-md-start mt-3 mt-md-0">
                      <p>Version 1.0.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
            {/* Footer   End */}
          </div>
          {/* Other Page   End */}
        </div>
      </div>

      <script src="js/jQuery.js"></script>

      <script src="js/bootstrap/bootstrap.bundle.min.js"></script>

      <script src="js/scripts.js"></script>
    </div>
  );
}

export default App;
