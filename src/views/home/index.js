import {
    Stack,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    Badge,
    useToast
  } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import useMyPunks from '../../hooks/useMyPunks';
import { useCallback, useEffect, useState } from 'react';

const Home = () => {
    const [isMinting, setIsMintig ] = useState(false)
    const [imageSrc, setImageSrc] = useState("");
    const { active, account } = useWeb3React();
    const myPunks = useMyPunks();
    const toast = useToast()
  
    const getMyPunksData = useCallback(async () => {
      if (myPunks) {
        const totalSupply = await myPunks.methods.totalSupply().call();
        const dnaPreview = await myPunks.methods
          .deterministicPseudoRandomDNA(totalSupply, account)
          .call();
        const image = await myPunks.methods.imageByDNA(dnaPreview).call();
        setImageSrc(image);
      }
    }, [myPunks, account]);
  
    useEffect(() => {
      getMyPunksData();
    }, [getMyPunksData]);

    const mint = () => {
        setIsMintig(true);

        myPunks.methods.mint().send({
            from: account,
            // value: 1e18, esto por si se quiere cobrar por el minteo
        })
        .on('transactionHash', (txHash) => {
            toast({
                title: 'Transacción enviada.',
                description: txHash,
                status: 'info',
                isClosable: true,
            })
        })
        .on('receipt', () => {
            setIsMintig(false)
            toast({
                title: 'Transacción confirmada.',
                description: 'La ha transacción ha sido confirmada',
                status: 'success',
                isClosable: true,
            })

        })
        .on('error', (error) => {
            setIsMintig(false)
            toast({
                title: 'Transacción fallida.',
                description: error.message,
                status: 'error',
                isClosable: true,
            })

        })
    }

    return (
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column-reverse", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
          >
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "green.400",
                zIndex: -1,
              }}
            >
              My Punks
            </Text>
            <br />
            <Text as={"span"} color={"green.400"}>
              Crea unos avatars pseudoaleatorios
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            My Punks es una colección de Avatares randomizados cuya metadata
            es almacenada on-chain. Poseen características únicas y sólo hay o habrá 10000
            en existencia.
          </Text>
          <Text color={"green.500"}>
            Cada  MyPunk se genera de forma secuencial basado en tu address,
            usa el previsualizador para averiguar cuál sería tu  MyPunk si
            minteas en este momento
          </Text>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: "column", sm: "row" }}
          >
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"green"}
              bg={"green.400"}
              _hover={{ bg: "green.500" }}
              disabled={!myPunks}
              onClick={mint}
              isLoading={isMinting}
            >
              Obtén tu punk
            </Button>
            <Link to="/punks">
              <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
                Galería
              </Button>
            </Link>
          </Stack>
        </Stack>
        <Flex
          flex={1}
          direction="column"
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          <Image src={active ? imageSrc : "https://avataaars.io/"} />
          {active ? (
            <>
              <Flex mt={2}>
                <Badge>
                  Next ID:
                  <Badge ml={1} colorScheme="green">
                    1
                  </Badge>
                </Badge>
                <Badge ml={2}>
                  Address:
                  <Badge ml={1} colorScheme="green">
                    0x0000...0000
                  </Badge>
                </Badge>
              </Flex>
              <Button
                onClick={getMyPunksData}
                mt={4}
                size="xs"
                colorScheme="green"
              >
                Actualizar
              </Button>
            </>
          ) : (
            <Badge mt={2}>Wallet desconectado</Badge>
          )}
        </Flex>
      </Stack>
    );
  };
  
  export default Home;