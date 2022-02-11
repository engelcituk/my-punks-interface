import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import useMyPunks  from '../../hooks/useMyPunks';

const Home = () => {
    const { active } = useWeb3React();
    const [ maxSupply, setMaxSupply ] = useState();
    const myPunks = useMyPunks();

    const getMaxSupply = useCallback( async() =>{
        if(myPunks){
            const result = await myPunks.methods.maxSupply().call();
            setMaxSupply(result)
        }
    }, [myPunks])

    useEffect( ()=> {
        getMaxSupply();
    },[getMaxSupply])

    if(!active) return 'Conecta tu Wallet';

    return (
        <>
        <p>maxSupply: {maxSupply}</p>
        </>
    );
};
  
export default Home;