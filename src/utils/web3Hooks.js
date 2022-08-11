import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';

import { injected } from './connectors';

export function useEagerConnect() {
    const { activate, active } = useWeb3React();

    const [tried, setTried] = useState(false);

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true);
                });
            } else {
                setTried(true);
            }
        });
    }, []); // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    return tried;
}

export function useInactiveListener(suppress = false) {
    const { active, error, activate } = useWeb3React();

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                console.log("Handling 'connect' event");
                activate(injected);
            };
            const handleChainChanged = (chainId) => {
                console.log("Handling 'chainChanged' event with payload", chainId);
                activate(injected);
            };
            const handleAccountsChanged = (accounts) => {
                console.log("Handling 'accountsChanged' event with payload", accounts);
                if (accounts.length > 0) {
                    activate(injected);
                }
            };
            const handleNetworkChanged = (networkId) => {
                console.log("Handling 'networkChanged' event with payload", networkId);
                activate(injected);
            };

            ethereum.on('connect', handleConnect);
            ethereum.on('chainChanged', handleChainChanged);
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('networkChanged', handleNetworkChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('connect', handleConnect);
                    ethereum.removeListener('chainChanged', handleChainChanged);
                    ethereum.removeListener('accountsChanged', handleAccountsChanged);
                    ethereum.removeListener('networkChanged', handleNetworkChanged);
                }
            };
        }
    }, [active, error, suppress, activate]);
}

export const useMethod = (contract, name) => {
    const [state, setState] = useState();
    const { library } = useWeb3React();

    const setError = (error) =>
        setState({
            success: undefined,
            error,
            isLoading: false,
        });

    const send = useCallback(
        async (...args) => {
            if (!library) return;

            const signerContract = contract.connect(library?.getSigner?.());

            if (!signerContract[name]) return setError('function name invalid');

            setState({
                success: undefined,
                error: undefined,
                isLoading: true,
            });

            return await signerContract[name](...args)
                .then((tx) => {
                    tx.wait().then((res) => {
                        setState({
                            success: {
                                response: res,
                            },
                            error: undefined,
                            isLoading: false,
                        });
                    })
                    return tx;
                })
                .catch((err) => {
                    setError(err.reason);
                    throw err;
                });
        },
        [library, contract, name]
    );

    return {
        send,
        state,
    };
};

export const useCall = (
    contract,
    name,
    args = []
) => {
    const { library } = useWeb3React();
    const [state, setState] = useState({});

    const setError = (error) =>
        setState({
            value: undefined,
            error,
            isLoading: false,
        });

    useEffect(() => {
        if (!library) return;

        const signerContract = contract.connect(library?.getSigner?.());

        if (!signerContract[name]) return setError('function name invalid');

        setState({
            value: undefined,
            error: undefined,
            isLoading: true,
        });

        signerContract[name](...args)
            .then((res) => {
                setState({
                    value: res,
                    error: undefined,
                    isLoading: false,
                });
                return res;
            })
            .catch((err) => {
                setError(err.reason);
                throw err;
            });
    }, [library, contract, name]);

    return state;
};
