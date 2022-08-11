import React, { useEffect } from "react";
import { Router, Location, Redirect } from "@reach/router";
import ScrollToTopBtn from "./components/menu/ScrollToTop";
import Header from "./components/menu/header";
import Home from "./pages/home";
import Explore from "./pages/explore";
import ItemDetail from "./pages/ItemDetail";
import Author from "./pages/Author";
import Wallet from "./pages/wallet";
import Fishing from "./pages/fishing";
import Activity from "./pages/activity";

import { createGlobalStyle } from "styled-components";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEagerConnect, useInactiveListener } from "./utils/web3Hooks";
import { useAtom } from "jotai";
import { connectorAtom } from "./utils/atoms";

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location]);
  return children;
};

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id="routerhang">
        <div key={location.key}>
          <Router location={location}>{children}</Router>
        </div>
      </div>
    )}
  </Location>
);

const apolloClient = new ApolloClient({
  uri: "https://app.gc.subsquid.io/beta/firesquid-fish/5/graphql",
  cache: new InMemoryCache(),
});

const queryClient = new QueryClient()

const App = () => {
  const context = useWeb3React();
  const { connector, active } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useAtom(connectorAtom);
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(null);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <div className="wraper">
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <Header />
          <PosedRouter>
            {active && <Redirect from="/Wallet" to="/Author" />}
            <ScrollTop path="/">
              <Home exact path="/">
                <Redirect to="/home" />
              </Home>
              <Explore path="/explore" />
              <ItemDetail path="/token/:id" />
              <Author path="/author" />
              <Fishing path="/fishing" />
              <Wallet path="/wallet" />
              <Activity path="/activity" />
            </ScrollTop>
          </PosedRouter>
          <ScrollToTopBtn />
        </ApolloProvider>
      </QueryClientProvider>
    </div>
  );
}

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

const InitiateWeb3Provider = (props) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App {...props} />
    </Web3ReactProvider>
  );
};

export default InitiateWeb3Provider;
