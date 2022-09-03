import abi from "./abi.js";
const { ethers: etherjs } = ethers;

const rpcUrl = "https://eth-goerli.g.alchemy.com/v2/cZArJ5hDwpU8r_6CXv9KbYMJWUtrr3qS";
const signerProvider = new etherjs.providers.Web3Provider(window.ethereum);

const  Addresses = [
  "0xD7B30A24Cb9cf79FBeEd488b8AAC2847D7df5949", 
  "0x2a4F47d6ca6C58b7840f7013F86c0A7E66FE21e3", 
  "0xFB4cBa4Fcc31f92A3a1c1Df6A5f6C80a67866121",
  "0x67fb46Da7aa8F8Df1677Ac191c1072119F5b8874", 
  "0xc3Bfef19ac62199E62fb3cF3bd8949a0Ef4Ad1fd"]

  const signer = signerProvider.getSigner();
let contractAbi;

  const useContract = (
    address = tokenAddress,
    isSigner = false
  ) => {
    const providerSigner = new etherjs.providers.Web3Provider(window.ethereum);
    const signer = providerSigner.getSigner();
    const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);
    const newProvider = isSigner ? signer : provider;
    return new etherjs.Contract(address, abi, newProvider);
  };


const connectWallet = async () => {
  await signerProvider.send("eth_requestAccounts");
  await getUserWallet();
};

const getUserWallet = async () => {
  let userAddress = await signer.getAddress();
  //   connectedWallet = userAddress;
  updateUserAddress(userAddress);
  return userAddress;
  //   console.log(connectedWallet, "connected wallet");
};

function updateUserAddress(address) {
  userAdd.innerText = address;
}

connect.addEventListener("click", connectWallet);

async function getTokenDetails() {
  load.innerText = "Loading...";
  let all = [];
  for(let i = 0; i < Addresses.length; i++){
    const token = await useContract(Addresses[i], abi);
    try {
      const [name, symbol, totalSupply, balanceOf] = await Promise.all([
       token.name(),
       token.symbol(),
       token.totalSupply(),
       token.balanceOf(getUserWallet()),
      ]); 
    all.push({ name, symbol, totalSupply: Number(totalSupply) ,balanceOf});
    } catch (error) {
      console.log("error occurred", error);
    } finally {
      load.innerText = "";
    }
  }
  return all;
 
}

function tokenTemplateUpdate(name, symbol, totalSupply, balanceOf) {
  return `<div class="tok">
    
        <div class="tokenDe">
                <p class="tokenName">${name} - ${symbol} </p>
                <p>Total Supply:${totalSupply}</p>
            </div>
        </div>
    <div class = "bal"> user balance: ${balanceOf}</div>
</div>`;
}


async function InitData() {
  let allDetails = await getTokenDetails();
  console.log(allDetails, "we are here");
  for(let i = 0; i < allDetails.length; i++){
    const { name, symbol, totalSupply, balanceOf } = allDetails[i];
    const template = tokenTemplateUpdate(name, symbol, totalSupply / 10 ** 18, balanceOf);
    
   Token.insertAdjacentHTML('beforeend', template);
    //console.log(template, "...ppp")
  }
 
}

InitData();