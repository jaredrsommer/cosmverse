import { NftInfo } from "../../services/type";

export function randomNft(): NftInfo {
  const price = (Math.random() * 10).toFixed(1);
  const randI = Math.floor((Math.random() * 100) % 2);
  const randT = Math.floor((Math.random() * 100) % 2);
  const randU = Math.floor((Math.random() * 100) % 2);
  const randC = Math.floor((Math.random() * 100) % 2);

  return {
    tokenId: '1',
    image: randI ? "https://rmrk.mypinata.cloud/ipfs/bafybeicpgysjduvvfvpdhe2zqn2hh2dzdcxyracwtn5foak6i5v7rjxiry": "https://rmrk.mypinata.cloud/ipfs/bafybeih3g3e4nlg45osboov64z6wb2m3wyh5fud7dswfs7yhyrysemxcsu",
    title: randT ? "Event 16": "Junonaut",
    user: randU ? "CryptoTank": "KitBaroness",
    price: price + (randC ? " JUNO": " BTC"),
    total: 2
  };
}
