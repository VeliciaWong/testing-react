import React, { useEffect, useState } from 'react';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { useMutation, useQuery } from 'react-query';
import { axios } from '../utils/axios';
import { useWeb3React } from '@web3-react/core';
import { useNftMethod } from '../contracts/nft';

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

const Fishing = () => {
  const { account } = useWeb3React()
  const { data: allFishes, refetch: refetchAllFishes } = useQuery('all-fish', () => axios.post('/app/api/getAllFishes'));
  const { data: allOwnedFishes, refetch: refetchAllOwnedFishes } = useQuery(['all-owned-fish', account], () => axios.post('/web/api/getFishesByOwner', { user_id: account, is_minted: false }));
  const { mutateAsync: mutateAddCaughtFish } = useMutation((data) => axios.post('/app/api/addCaughtFish', data))
  const { mutateAsync: mutateRequestFishMetadataCID } = useMutation((data) => axios.post('/web/api/getFishMetadataCID', data))
  const { send: sendMint, state: mintState } = useNftMethod('mint')
  const [fishCaught, setFishCaught] = useState(null);

  const randomizeFish = () => {
    const allFishesData = allFishes?.data || []
    return allFishesData[Math.floor(Math.random() * allFishesData.length)]
  }

  const handleMutateAddCaughtFish = async () => {
    const fish = randomizeFish()
    await mutateAddCaughtFish({
      fish_id: fish.id,
      owner: account
    })
    refetchAllFishes()
    refetchAllOwnedFishes()
    setFishCaught(fish)
  }

  const handleMutateRequestFishMetadataCID = async () => {
    const getMetadataCIDPromises = allOwnedFishes.data?.reduce((a, fish) => {
      return [...a, new Promise((resolve) => {
        mutateRequestFishMetadataCID({
          fish_id: fish.id,
        }).then((metadataCID) => {
          resolve(metadataCID.data)
        })
      })]
    }, []);


    const metadataCIDs = await Promise.all(getMetadataCIDPromises)
    const idsAndUris = metadataCIDs.reduce((a, fish, i) => {
      a.uris[i] = `${fish[0].metadata}/${fish[0].id}.json`;
      a.ids[i] = fish[0].id;
      return a
    }, {
      uris: [],
      ids: []
    })

    await sendMint(idsAndUris.uris, idsAndUris.ids).then(async (tx) => {
      await tx.wait()
      alert('success')
    })
  }

  return (
    <div>
      <GlobalStyles />

      <section
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${"./img/background/subheader.jpg"})` }}
      >
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Fishing simulation</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div>
          total fish in pond: {(allFishes?.data || []).length}
        </div>
        <div>
          total fish in basket: {(allOwnedFishes?.data || []).length}
        </div>
        {fishCaught && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '8px' }}>Fish Caught</div>
            <div>name: {fishCaught.name}</div>
            <div>description: {fishCaught.description}</div>
            <div>rarity: {fishCaught.rarity}</div>
            <div>size: {fishCaught.size}</div>
            <div>length: {fishCaught.length}</div>
            <div>weight: {fishCaught.weight}</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div onClick={handleMutateAddCaughtFish} className="btn-main">Fishing</div>
          <div onClick={handleMutateRequestFishMetadataCID} className="btn-main">Bulk Mint {mintState?.success && "success"}</div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
export default Fishing;