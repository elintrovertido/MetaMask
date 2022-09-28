import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import Footer from "./Footer";

function Main() {

    const [api, setApi] = useState(null)
    const [account, setAccount] = useState(null)
    const [balance, setBalance] = useState(null)
    const [address, setAddress] = useState(null)
    const [sendFlag, setSendFlag] = useState(0)

    const connectWallet = async () => {
        if (window.ethereum) {
            console.log("metamask present")
            window.web3 = new Web3(window.ethereum)
            setApi(window.web3)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web = new Web3(window.web3.currentProvider)
        } else {
            console.log("wallet doesnt exists")
        }
    }
    useEffect(() => {
        connectWallet()
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => {
                reload()
            })
        }
    }, [])

    useEffect(() => {
        const getBalance = async () => {
            const accounts = await api.eth.getAccounts();
            setAccount(accounts[0])
            console.log(account)
        }

        getBalance()
    }, [api])

    useEffect(() => {
        const getBalance = async () => {
            const getbal = await api.eth.getBalance(account)
            setBalance(getbal / 1e18)
        }
        getBalance()

    }, [account])

    const transfer = async () => {

        // console.log(address)
        const senderAddress = account
        const recieverAddress = address
        await api.eth.sendTransaction({
            from: senderAddress,
            to: recieverAddress,
            value: api.utils.toWei('1', "ether")
        }, (err, res) => {
            if (err) {
                console.log(err)
                setSendFlag(2)
            } else {
                console.log(res)
                setSendFlag(1)

            }
        })
    }



    const reload = () => {
        
        setSendFlag(0)
        window.location.reload()
    }


    return (
        <>
            
            {
                sendFlag === 1 &&
                <div class="alert alert-success" role="alert">
                    Transaction is Successfull..!
                    <button className="btn btn-primary" onClick={reload}>Reload Page</button>
                </div>
            }
            {
                sendFlag === 2 &&
                <div class="alert alert-danger" role="alert">
                    Trasanction Failed..!
                    <button className="btn btn-primary" onClick={reload}>Reload Page</button>
                </div>

            }

            <div className="container">
            <div class="card ">
                <div class="card-header text-center">
                    {account ? "Heyya Account Details..." : "Please Click on Connect Wallet "}
                </div>
                <div class="card-body">
                    <h5 class="card-title">Account : {account ? account : "not connected"}</h5>
                    <h5 class="card-title">Balance : {balance}</h5>
                    <div class="input-group mb-3" >
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-success" type="button" onClick={transfer}>Transfer</button>
                            &nbsp;
                        </div>
                        <input type="text" class="form-control" placeholder="Send 1 Eth to this Reciever Address" onChange={
                            (e) => {
                                setAddress(e.target.value)
                            }
                        } />
                    </div>
                    <button class="btn btn-outline-primary x" onClick={connectWallet}>Connect to Wallet</button>

                </div>
            </div>
            </div>
                        
        <Footer/>
            
        </>
    )
}

export default Main;