import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "@reach/router";
import ContentLoader from "react-content-loader";
import { useQuery } from "react-query";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

const NftCard = ({ nft }) => {
  const { data: metadata, isSuccess } = useQuery(['metadata-nft', nft.id], async () => {
    const resp = await fetch(nft.uri)
    return await resp.json()
  })

  if (isSuccess) {
    return (
      <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4">
        {/* TODO: need dynamic link */}
        <Link to={`/token/${nft.id}`}>
          <div className="nft__item m-0">
            <div className="author_list_pp">
              <span>
                {/* TODO: img dummy */}
                <img className="lazy" src="/img/author/author-10.jpg" alt="" />
                <i className="fa fa-check"></i>
              </span>
            </div>
            <div
              className="nft__item_wrap"
            >
              <Outer>
                <span>
                  <img
                    src={nft?.imageUri}
                    className="lazy nft__item_preview"
                    alt=""
                  />
                </span>
              </Outer>
            </div>
            <div className="nft__item_info">
              <span>
                <h4>{metadata?.name}</h4>
              </span>
              <div className="nft__item_price">
                {/* TODO: data dummy */}
                0.08 ASTR
              </div>
              <div className="nft__item_like">
                <i className="fa fa-heart"></i>
                {/* TODO: data dummy */}
                <span>0</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4">
        <div className="nft__item m-0">
          <ContentLoader
            speed={2}
            width="100%"
            height={400}
            viewBox="0 0 400 600"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <circle cx="55" cy="40" r="38" />
            <rect x="0" y="65" rx="2" ry="2" width="400" height="400" />
            <rect x="0" y="525" rx="0" ry="0" width="255" height="20" />
            <rect x="0" y="565" rx="0" ry="0" width="84" height="20" />
          </ContentLoader>
        </div>
      </div>
    )
  }

};

export default class Responsive extends Component {
  dummyData = [
    {
      deadline: "December, 30, 2021",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-1.jpg",
      previewImg: "./img/items/static-1.jpg",
      title: "Pinky Ocean",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-10.jpg",
      previewImg: "./img/items/static-2.jpg",
      title: "Deep Sea Phantasy",
      price: "0.06 ETH",
      bid: "1/22",
      likes: 80,
    },
    {
      deadline: "",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-11.jpg",
      previewImg: "./img/items/static-3.jpg",
      title: "Rainbow Style",
      price: "0.05 ETH",
      bid: "1/11",
      likes: 97,
    },
    {
      deadline: "January, 1, 2022",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-12.jpg",
      previewImg: "./img/items/static-4.jpg",
      title: "Two Tigers",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-9.jpg",
      previewImg: "./img/items/anim-4.webp",
      title: "The Truth",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "January, 15, 2022",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-2.jpg",
      previewImg: "./img/items/anim-2.webp",
      title: "Running Puppets",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-3.jpg",
      previewImg: "./img/items/anim-1.webp",
      title: "USA Wordmation",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-4.jpg",
      previewImg: "./img/items/anim-5.webp",
      title: "Loop Donut",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "January, 3, 2022",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-5.jpg",
      previewImg: "./img/items/anim-3.webp",
      title: "Lady Copter",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-7.jpg",
      previewImg: "./img/items/static-5.jpg",
      title: "Purple Planet",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-6.jpg",
      previewImg: "./img/items/anim-6.webp",
      title: "Oh Yeah!",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "January, 10, 2022",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-8.jpg",
      previewImg: "./img/items/anim-7.webp",
      title: "This is Our Story",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-9.jpg",
      previewImg: "./img/items/static-6.jpg",
      title: "Pixel World",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
    {
      deadline: "January, 10, 2022",
      authorLink: "#",
      nftLink: "#",
      bidLink: "#",
      authorImg: "./img/author/author-12.jpg",
      previewImg: "./img/items/anim-8.webp",
      title: "I Believe I Can Fly",
      price: "0.08 ETH",
      bid: "1/20",
      likes: 50,
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      nfts: this.dummyData.slice(0, 8),
      height: 0,
    };
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  loadMore = () => {
    let nftState = this.state.nfts;
    let start = nftState.length;
    let end = nftState.length + 4;
    this.setState({
      nfts: [...nftState, ...this.dummyData.slice(start, end)],
    });
  };

  onImgLoad({ target: img }) {
    let currentHeight = this.state.height;
    if (currentHeight < img.offsetHeight) {
      this.setState({
        height: img.offsetHeight,
      });
    }
  }

  render() {
    return (
      <div className="row">

        {this.props.tokens?.map((nft, index) => (
          <NftCard key={index} nft={nft} />
        ))}
        {this.state.nfts.length !== this.dummyData.length && (
          <div className="col-lg-12">
            <div className="spacer-single"></div>
            <span
              onClick={() => this.props.loadMore()}
              className="btn-main lead m-auto"
            >
              Load More
            </span>
          </div>
        )}
      </div>
    );
  }
}
