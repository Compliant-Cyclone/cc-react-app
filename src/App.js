import { useEffect, useState } from 'react';
// import { WorldIDWidget, WidgetProps } from "@worldcoin/id";
import './App.css';

import BalanceModal from './components/BalanceModal';
import TransactionModal from './components/TransactionModal';
import bgimage from "./img/cyclone.png"; 
import worldCoin from "./img/worldcoin_full.png"; 


import { 
  containerStyle,
  buttonStyle,
  leftStatus,
  statusIconConnected,
  statusIconDisconnected,
  rowStyle,
  rowStyleRight,
  button76Style
} from './styles/styles'

// Sometimes using Web3 packages like Web3 are just not ideal and you need a simple solution to work with MetaMask. Here are some simple solutions and code snippets you can use
// to get rolling on better understanding how to make simple transactions with MetaMask wallet directly using window.ethereum

function App() {

  const [ isConnectedWorldCoin, setIsConnectedWorldCoin ] = useState(false)
  const [ worldCoinAccount, setWorldCoinAccount ] = useState('')
  const [ walletAccount, setWalletAccount ] = useState('')
  const [ currentChain, setCurrentChain ] = useState('')
  const [ showBalanceModal, setShowBalanceModal ] = useState(false)
  const [ showTransactionModal, setShowTransactionModal ] = useState(false)
  const [ isConnected, setIsConnected ] = useState(false)
  const [ ethBalance, setEthBalance ] = useState(null)


  // Initialize the application and MetaMask Event Handlers
  useEffect(() => {

    // Setup Listen Handlers on MetaMask change events
    if(typeof window.ethereum !== 'undefined') {
        // Add Listener when accounts switch
        window.ethereum.on('accountsChanged', (accounts) => {

          console.log('Account changed: ', accounts[0])
          setWalletAccount(accounts[0])

        })
        
        // Do something here when Chain changes
        window.ethereum.on('chainChanged', (chaindId) => {

          console.log('Chain ID changed: ', chaindId)
          setCurrentChain(chaindId)

        })

    } else {

        alert('Please install MetaMask to use this service!')

    }
  }, [])


  // Used to see if WorldCoinAccount is currently connected to the application
  useEffect(() => {
    setIsConnectedWorldCoin(setWorldCoinAccount ? true : false)
  }, [setWorldCoinAccount])


  // Used to see if the wallet is currently connected to the application
  // If an account has been accessed with MetaMask, then the wallet is connected to the application.
  useEffect(() => {
      setIsConnected(walletAccount ? true : false)
  }, [walletAccount])



  const handleConnectWorldCoin = async (verificationResponse) => {

    console.log('Connecting WorldCoin...')
    console.log(verificationResponse)

    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    // const account = accounts[0]
    
    // console.log('WorldCoin Account: ', account)
    // setWorldCoinAccount(account)
}


  const handleDisconnectWorldCoin = async () => {

    console.log('Disconnecting WorldCoin...')
    setIsConnectedWorldCoin(false)
    setWorldCoinAccount('')
}


  // Connect the Wallet to the current selected account in MetaMask. 
  // Will generate a login request for user if no account is currently connected to the application
  const handleConnectWallet = async () => {

      console.log('Connecting MetaMask...')

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = accounts[0]
      
      console.log('Account: ', account)
      setWalletAccount(account)
  }

  // Handle Disconnected. Removing the state of the account connected 
  // to your app should be enough to handle Disconnect with your application.
  const handleDisconnect = async () => {

      console.log('Disconnecting MetaMask...')
      setIsConnected(false)
      setWalletAccount('')
  }

  // Connect Once and set the account. 
  // Can be used to trigger a new account request each time, 
  // unlike 'eth_requestAccounts'
  const handleConnectOnce = async () => {

      const accounts = await window.ethereum.request({ method: 'wallet_requestPermissions',
          params: [{
            eth_accounts: {}
          }]
      }).then(() => window.ethereum.request({ method: 'eth_requestAccounts' }))
      
      setWalletAccount(accounts[0])

  }

  // Request the personal signature of the user via MetaMask and deliver a message.
  const handlePersonalSign = async () => {

    console.log('Sign Authentication')

    const message = [
      "This site is requesting your signature to approve login authorization!",
      "I have read and accept the terms and conditions (https://compliantcyclone.org/) of this app.",
      "Please sign me in!"
    ].join("\n\n")

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const sign = await window.ethereum.request({ method: 'personal_sign', params: [message, account] })

  }

  // Get the Accounts current Balance and convert to Wei and ETH
  const handleGetBalance = async () => {

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const balance  = await window.ethereum.request({ method: 'eth_getBalance' , params: [ account, 'latest' ]})

    // // Returns a hex value of Wei
    const wei = parseInt(balance, 16)
    const gwei = (wei / Math.pow(10, 9)) // parse to Gwei
    const eth = (wei / Math.pow(10, 18))// parse to ETH

    setEthBalance({ wei, gwei, eth })
    setShowBalanceModal(true)

  }
 
  const handleSendTransaction = async (sender, receiver, amount) => {
    const gasPrice = '0x5208' // 21000 Gas Price
    const amountHex = (amount * Math.pow(10,18)).toString(16)
    
    const tx = {
      from: sender,
      to: receiver,
      value: amountHex,
      gas: gasPrice,
    }

    await window.ethereum.request({ method: 'eth_sendTransaction', params: [ tx ]})

    setShowTransactionModal(false)
  }

  const handleCloseBalanceModal = () => {
    setShowBalanceModal(false)
  }

  const handleOpenTransactionModal = () => {
    setShowTransactionModal(true)
  }
 
  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false)
  }

  return (
    <div className="App" style={{ backgroundImage:`url(${bgimage})`,backgroundRepeat:'no-repeat', backgroundSize: 'cover',  }}>
          <div className="button-76-top">
            COMPLIANT CYCLONE
          </div>

{/* start  container */}
        <div className="container" style={containerStyle}>

                  {/* first verify with worldCoin */}
                  
{/* 
                  WorldCoin error


                  Failed to compile
                ./node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs
                Can't import the named export 'Children' from non EcmaScript module (only default export is available)
                */}


                      {/* <div className="row" style={rowStyleRight}>

                            {
                              isConnectedWorldCoin ? ( 
                                  <div className="button-76" style={{width: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}}>{worldCoinAccount}</div>
                                ) : (
                                  // <div className="button-76" style={button76Style}>Verify with WorldCoin</div>

                                  // <WorldIDWidget
                                  //   actionId="wid_BPZsRJANxct2cZxVRyh80SFG" // obtain this from developer.worldcoin.org
                                  //   signal="my_signal"
                                  //   enableTelemetry
                                  //   onSuccess={(verificationResponse) => { console.log(verificationResponse); handleConnectWorldCoin(verificationResponse); }} // pass the proof to the API or your smart contract
                                  //   onError={(error) => console.error(error)}
                                  //   debug={true} // to aid with debugging, remove in production
                                  // />
                                  
                                  <div>test
                                    </div>

                                )
                            }
                    </div>  */}


                  <div className="row">

                      <a target="_blank" href="https://developer.worldcoin.org/">
                        <img src={worldCoin} style={{ width: '350px',}} alt="Logo" />
                      </a>

                          {/* <div className="left-status" style={leftStatus}>
                              {
                                isConnected ? (
                                  <div className="status-icon connected" style={statusIconConnected}></div>
                                ) : (
                                  <div className="status-icon disconnected" style={statusIconDisconnected}></div>
                                )
                              }
                          </div> */}
                    </div>



                  {/* after isConnectedWorldCoin */}

                  { 
                      isConnectedWorldCoin ? (
                          <div className="row" style={rowStyleRight}>
                                <div className="connect-button" onClick={!isConnected ? handleConnectWallet : handleDisconnect} style={{...buttonStyle, maxWidth: '850px',}}>

                                  <div className="left-status" style={leftStatus}>
                                      {
                                        isConnected ? (
                                          <div className="status-icon connected" style={statusIconConnected}></div>
                                        ) : (
                                          <div className="status-icon disconnected" style={statusIconDisconnected}></div>
                                        )
                                      }
                                  </div>
                                  {
                                    isConnected ? ( 
                                        <div className="button-76" style={{width: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}}>{walletAccount}</div>
                                      ) : (
                                        <div className="button-76" style={button76Style}>Connect Wallet</div>
                                      )
                                  }
                              </div>
                        </div>
                        ) : 
                        (
                          <div>test
                          </div>
                        )
                  }


                  {/* after Metamask isConnected */}

                  {

                  isConnected ? ( 
                              <div className="row" style={rowStyle}>

                                <div className="button-76" onClick={handleDisconnect} style={{...buttonStyle, maxWidth: '850px',}}>
                                    Disconnect Wallet
                                </div>
                              </div>

                              ) : (
                                <div className="button76Style" style={button76Style}></div>
                              )
                  }


                {
                      isConnected ? ( 
                        <div className="row" style={rowStyle}>

                          <button className="button-76" onClick={handleGetBalance} style={{...buttonStyle, maxWidth: '850px',}}>
                              Get Wallet Balance
                          </button>
                          </div>
                                ) : (
                                  <div className="button76Style" style={button76Style}></div>
                                )

                      }

                  {
                    isConnected && (
                      <div className="row" style={rowStyle}>
                        <a target="_blank" className="button-76" href="https://frontend-keyring-administration-zdli-git-c40675-keyring-network.vercel.app/kyc-tokens">DAI KYC</a>
                      </div>
                    )
                  }

                  {
                    isConnected && (
                      <div className="row" style={rowStyle}>
                        <a target="_blank" className="button-76" href="https://frontend-keyring-administration-zdli-kb8obad6y-keyring-network.vercel.app/kyc-tokens">USDC KYC</a>
                      </div>
                    )
                  }

        </div>

{/* end  container */}

        {
          showBalanceModal && (
            <BalanceModal handleCloseModal={handleCloseBalanceModal} ethBalance={ethBalance} />
          )
        }
        {
          showTransactionModal && (
            <TransactionModal handleCloseModal={handleCloseTransactionModal} handleSendTransaction={handleSendTransaction} />
          )
        }


    </div>
  );
}

export default App;


