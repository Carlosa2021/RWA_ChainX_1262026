import { createThirdwebClient, defineChain, getContract } from "thirdweb";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const chain = defineChain(Number(process.env.NEXT_PUBLIC_CHAIN_ID || "137"));

export const getTw = (address: `0x${string}`) =>
  getContract({ client, address, chain });
