import { IProvider } from "@web3auth/base";
import {
  createWalletClient,
  createPublicClient,
  custom,
  formatEther,
  parseEther,
} from "viem";
import { mainnet, polygon } from "viem/chains";

const getViewChain = (provider: IProvider) => {
  switch (provider.chainId) {
    case "0x89":
      return polygon;
    default:
      return mainnet;
  }
};

const getChainId = async (provider: IProvider): Promise<unknown> => {
  try {
    const walletClient = createWalletClient({
      transport: custom(provider),
    });
    const chainId = await walletClient.getChainId();
    return chainId.toString();
  } catch (error) {
    return error;
  }
};

const getAccounts = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });
    const address = await walletClient.getAddresses();
    return address;
  } catch (error) {
    return error;
  }
};

const getBalance = async (provider: IProvider): Promise<string> => {
  try {
    const publicClient = createPublicClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });
    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });
    const address = await walletClient.getAddresses();
    const balance = await publicClient.getBalance({ address: address[0] });
    return formatEther(balance);
  } catch (error) {
    return error as string;
  }
};

const sendTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const publicClient = createPublicClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });
    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });

    const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
    const amount = parseEther("0.0001");
    const address = await walletClient.getAddresses();

    const hash = await walletClient.sendTransaction({
      account: address[0],
      to: destination,
      value: amount,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    return JSON.stringify(receipt, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
  } catch (error) {
    return error;
  }
};

const signMessage = async (provider: IProvider): Promise<unknown> => {
  try {
    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });
    const address = await walletClient.getAddresses();
    const message = "YOUR_MESSAGE";

    const signature = await walletClient.signMessage({
      account: address[0],
      message,
    });

    return signature;
  } catch (error) {
    return error;
  }
};

export default {
  getChainId,
  getAccounts,
  getBalance,
  sendTransaction,
  signMessage,
};
