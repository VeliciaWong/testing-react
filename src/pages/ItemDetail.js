import React from "react";
import Clock from "../components/Clock";
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { gql, useQuery as useGraphql } from "@apollo/client";
import { useQuery } from "react-query";
import { useNftCall, useNftMethod } from "../contracts/nft";
import { marketplaceAddress, useMarketplaceMethod } from "../contracts/marketplace";
import { isAddressNull } from "../utils";
import { useWeb3React } from "@web3-react/core";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

const fetcher = gql`
  query($id: ID!){
  tokenById(id: $id) {
    id
    tokenId
    fishId
    imageUri
    uri
    owner {
      id
    }
  }
}
`

const Colection = function (props) {
  const { account } = useWeb3React()
  const { send: sendMint } = useNftMethod('mint')
  const { send: sendApprove } = useNftMethod('approve')
  const { send: sendSetApprovalForAll } = useNftMethod('setApprovalForAll')
  const { send: sendSell } = useMarketplaceMethod('sell')

  const { send: sendBuy } = useMarketplaceMethod('buy')

  const { data: token } = useGraphql(fetcher, {
    variables: {
      id: props.id,
    }
  })

  const { value: ownerOf } = useNftCall('ownerOf', [token?.tokenById.tokenId])
  const { value: isApprovedForAll } = useNftCall('isApprovedForAll', [account, marketplaceAddress])

  const handleSellNft = async () => {
    if (!(token && account === ownerOf)) return
    if (!isApprovedForAll) await sendSetApprovalForAll(marketplaceAddress, true)
    await sendApprove(marketplaceAddress, token?.tokenById.tokenId)
    await sendSell(token?.tokenById.tokenId)
  };

  const handleBuyNft = async () => {
    if (token && account === ownerOf) return
    if (!isApprovedForAll) await sendSetApprovalForAll(marketplaceAddress, true)
    if (isAddressNull(ownerOf)) await sendMint(account, token?.tokenById.tokenId, token?.tokenById.uri)
    else await sendBuy(ownerOf, token?.tokenById.tokenId)
  };

  const { data: metadata } = useQuery(['metadata-nft', token?.tokenById.id], async () => {
    const resp = await fetch(token?.tokenById.uri)
    return await resp.json()
  })

  return (
    <div>
      <GlobalStyles />

      <section className='container'>
        <div className='row mt-md-5 pt-md-4'>

          <div className="col-md-6 text-center">
            <img src={token?.tokenById.imageUri} className="img-fluid img-rounded mb-sm-30" alt="" />
          </div>
          <div className="col-md-6">
            <div className="item_info">
              Auctions ends in
              <div className="de_countdown">
                <Clock deadline="December, 30, 2021" />
              </div>
              <h2>{metadata?.name}</h2>
              <div className="item_info_counts">
                <div className="item_info_type"><i className="fa fa-image"></i>Art</div>
                <div className="item_info_views"><i className="fa fa-eye"></i>250</div>
                <div className="item_info_like"><i className="fa fa-heart"></i>18</div>
              </div>
              <p>{metadata?.description}</p>

              <h6>Creator</h6>
              <div className="item_author">
                <div className="author_list_pp">
                  <span>
                    <img className="lazy" src="/img/author/author-10.jpg" alt="" />
                    <i className="fa fa-check"></i>
                  </span>
                </div>
                <div className="author_list_info">
                  <span>{token?.tokenById.owner.id}</span>
                </div>
              </div>

              <div className="spacer-40"></div>

              <div className="de_tab">
                {
                  (ownerOf === account) && (
                    <span onClick={handleSellNft} className="btn-main">Sell</span>
                  )
                }

                {ownerOf !== account && (
                  <span onClick={handleBuyNft} className="btn-main">Buy</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>

  );

}
export default Colection;