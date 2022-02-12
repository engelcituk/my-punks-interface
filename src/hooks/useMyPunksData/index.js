import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react"
import useMyPunks from "../useMyPunks"

const getPunkData = async ({ myPunks, tokenId}) => {
    const [ tokenURI, dna, owner,
            accesoriesType, clotheColor, clotheType, eyeType, eyeBrowType, facialHairColor,
            facialHairType, hairColor, hatColor, graphicType, mouthType, skinColor, topType ] = await Promise.all([
        myPunks.methods.tokenURI(tokenId).call(),
        myPunks.methods.tokenDNA(tokenId).call(),
        myPunks.methods.ownerOf(tokenId).call(),
        //atributos
        myPunks.methods.getAccesoriesType(tokenId).call(),
        myPunks.methods.getClotheColor(tokenId).call(),
        myPunks.methods.getClotheType(tokenId).call(),
        myPunks.methods.getEyeType(tokenId).call(),
        myPunks.methods.getEyeBrowType(tokenId).call(),
        myPunks.methods.getFacialHairColor(tokenId).call(),
        myPunks.methods.getFacialHairType(tokenId).call(),
        myPunks.methods.getHairColor(tokenId).call(),
        myPunks.methods.getHatColor(tokenId).call(),
        myPunks.methods.getGraphicType(tokenId).call(),
        myPunks.methods.getMouthType(tokenId).call(),
        myPunks.methods.getSkinColor(tokenId).call(),
        myPunks.methods.getTopType(tokenId).call()
    ])

    const responseMetadata = await fetch( tokenURI );
    const metadata = await responseMetadata.json();

    return {
        tokenId,
        attributes:{
            accesoriesType,
            clotheColor,
            clotheType,
            eyeType,
            eyeBrowType,
            facialHairColor,
            facialHairType,
            hairColor,
            hatColor,
            graphicType,
            mouthType,
            skinColor,
            topType
        },
        tokenURI,
        dna,
        owner,
        ...metadata,
    }
}

//plural
const useMyPunksData = ( {owner = null } = {} ) => {
    const [ punks, setPunks ] = useState([])
    const { library } = useWeb3React()

    const[ loading, setLoading ] = useState(true)
    const myPunks = useMyPunks()

    const update = useCallback( async () => {
        if( myPunks ){
            setLoading(true)
            
            let tokenIds;

            if( !library.utils.isAddress(owner) ){
                const totalSupply = await myPunks.methods.totalSupply().call();
                tokenIds = new Array(Number(totalSupply)).fill().map( (_, index ) => index );
            }

            if( library.utils.isAddress(owner) ){
                const balanceOf = await myPunks.methods.balanceOf(owner).call();
                const tokenIdsOfOwner = new Array(Number(balanceOf)).fill().map( (_, index ) =>
                    myPunks.methods.tokenOfOwnerByIndex(owner, index).call()
                );

                tokenIds = await Promise.all(tokenIdsOfOwner)
            }

            const punksPromise = tokenIds.map((tokenId) =>
                getPunkData({ tokenId, myPunks })
            );

            const punksToSet = await Promise.all(punksPromise)
            setPunks(punksToSet)
            setLoading(false)
        }
    },[myPunks, owner, library?.utils]);

    useEffect( () => {
        update();
    },[update]);

    return {loading, punks, update }
}

//singular
const useMyPunkData = (tokenId = null) => {
    const [ punk, setPunk ] = useState({})
    const[ loading, setLoading ] = useState(true)
    const myPunks = useMyPunks()

    const update = useCallback( async () => {
        if( myPunks && tokenId != null ){
            setLoading(true)
            
            const punkToSet = await getPunkData({ tokenId, myPunks })

            setPunk(punkToSet)
            setLoading(false)
        }
    },[myPunks, tokenId]);

    useEffect( () => {
        update();
    },[update]);

    return {loading, punk, update }

}

export { useMyPunksData, useMyPunkData }