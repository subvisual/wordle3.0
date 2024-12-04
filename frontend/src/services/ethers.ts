import { ethers } from "ethers";
import { MyERC20TokenABI } from "../abis/MyERC20Token.abi";
import { WordleGameABI } from "../abis/WordleGame.abi";
import { ANVIL_RPC_URL, GAME_ADDRESS, TOKEN_ADDRESS } from "../config/config";

const provider = new ethers.JsonRpcProvider(ANVIL_RPC_URL);

const signer = await provider.getSigner();

const tokenContract = new ethers.Contract(TOKEN_ADDRESS, MyERC20TokenABI, signer);
const gameContract = new ethers.Contract(GAME_ADDRESS, WordleGameABI, signer);

export { gameContract, tokenContract };
