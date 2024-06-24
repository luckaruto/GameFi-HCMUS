import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PetCard from "../../components/PetCard";
import ConstantsResponsive from "../../constants/Constanst";
import { ELEMENT } from "../../constants/types";
import { showAlert } from "../../redux/alertSlice";

import CustomText from "../../components/CustomText";
import { NFT, UserService } from "../../services/UserService";
import { COLOR } from "../../utils/color";
import { getLevel } from "../../utils/pet";
import Breed from "../../../assets/breed.svg";
import log from "../../logger/index";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import breedSlice, { setFatherPet, setMotherPet } from "../../redux/breedSlice";
import { useAccount } from "wagmi";
import { useIsFocused } from "@react-navigation/native";
type Props = {};

type NFTData = {
  id: string;
  petImg: string;
  element: string;
  level: number;
  name: string;
  rarityPet: string;
  tokenUri: string;
  attributes: {
    element: string;
    eye: string;
    fur: string;
    item: string;
  };
};

const petArray: NFTData[] = [];

const PlayScreen: React.FC<Props> = (props: any) => {
  const [isBreed, setIsBreed] = useState(props.route.params);
  // const { isBreed } = props.route.params;
  const { address, isConnecting, isDisconnected } = useAccount();
  const [data, setData] = useState<NFTData[]>(petArray);
  const dispatch = useDispatch();
  const navigate = useCustomNavigation();
  const isFocused = useIsFocused();
  const { fatherPet, motherPet } = useSelector((state: any) => state.breed);
  const translateYValue = new Animated.Value(0);
  useEffect(() => {
    // Example: Dispatch an alert when the PlayScreen component mounts
    // dispatch(showAlert("This is an alert from PlayScreen"));
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res: NFT[] = await UserService.getNFTsByOwner(address);
      const mappedData: any[] = res.map((nft: any) => {
        console.log("nft ", nft);
        return {
          id: nft.tokenid,
          element: ELEMENT.FIRE,
          level: getLevel(nft.exp),
          petImg: nft.data.image || "",
          name: nft.data.name,
          rarityPet: "special",
          tokenUri: nft.tokenUri,
          attributes: {
            element: nft.data.attributes.element,
            eye: nft.data.attributes.eye,
            fur: nft.data.attributes.fur,
            item: nft.data.attributes.item,
          },
        };
      });

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const onPress = (item: any) => {
    console.log("item ", item);
    try {
      if (!fatherPet.tokenUri) {
        log.warn("father chua co");
        dispatch(setFatherPet(item));
      } else if (!motherPet.tokenUri) {
        log.warn("mother chua co");
        dispatch(setMotherPet(item));
      }
    } catch (e) {
      console.log("Loi");
    }

    navigate.goBack();
  };

  return (
    <View style={styles.backgroundImage} className="bg-[#210035]">
      <Image
        style={{
          width: ConstantsResponsive.MAX_WIDTH,
          height: ConstantsResponsive.MAX_HEIGHT,
          position: "absolute",
        }}
        resizeMode="stretch"
        source={require("../../../assets/backGroundHome_3.png")}
      />
      <Animated.View
        style={{
          flex: 1,
          marginTop: ConstantsResponsive.YR * 150,
          zIndex: 90,
          position: "absolute",
          right: 0,
          transform: [{ translateY: translateYValue }],
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Animated.sequence([
              Animated.timing(translateYValue, {
                toValue: 10,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(translateYValue, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
            ]).start(() => {
              navigate.navigate("Breed");
            });
          }}
        >
          <Breed
            width={ConstantsResponsive.MAX_WIDTH * 0.1}
            height={ConstantsResponsive.MAX_WIDTH * 0.1}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
      <View
        style={styles.playArea}
        className="h-[95%] w-[100%] items-center justify-center "
      >
        <FlatList
          className="flex-1"
          contentContainerStyle={{
            gap: 20,
          }}
          columnWrapperStyle={{
            gap: 20,
            width: "100%",
          }}
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <PetCard
              item={item}
              petImg={item.petImg}
              element={item.element}
              level={item.level}
              name={item.name}
              rarityPet={item.rarityPet}
              isBreed={isBreed}
              tokenUri={item.tokenUri}
              attributes={item.attributes}
              onPress={() => onPress(item)}
            ></PetCard>
          )}
        />
      </View>
    </View>
  );
};

export default PlayScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  backgroundImage: {
    width: ConstantsResponsive.MAX_WIDTH,
    height: ConstantsResponsive.MAX_HEIGHT,
    position: "absolute",
  },
  topPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: ConstantsResponsive.YR * 250,
    flexDirection: "column",
  },
  statsContainer: {
    width: ConstantsResponsive.MAX_WIDTH,
    height: ConstantsResponsive.YR * 120,
    flexDirection: "row",
  },
  stats: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseButton: {
    width: ConstantsResponsive.YR * 50,
    height: ConstantsResponsive.YR * 50,
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  pauseButtonIcon: {
    width: ConstantsResponsive.YR * 25,
    height: ConstantsResponsive.YR * 25,
  },
  levelContainer: {
    width: ConstantsResponsive.YR * 80,
    height: ConstantsResponsive.YR * 80,
    backgroundColor: "#ff1a1a",
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  levelTitle: {
    fontSize: 21,
    color: "white",
    fontFamily: "LilitaOne",
  },
  levelNumber: {
    fontSize: 17,
    color: "white",
    fontFamily: "LilitaOne",
  },
  scoreIcon: {
    position: "absolute",
    left: 0,
    width: ConstantsResponsive.YR * 40,
    height: ConstantsResponsive.YR * 40,
  },
  scoreBar: {
    height: ConstantsResponsive.YR * 25,
    position: "absolute",
    left: 20,
    right: 5,
    backgroundColor: "white",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreNumber: {
    fontSize: 17,
    color: "black",
    fontFamily: "LilitaOne",
  },
  timeIcon: {
    position: "absolute",
    left: 0,
    width: ConstantsResponsive.YR * 40,
    height: ConstantsResponsive.YR * 40,
  },
  timeBar: {
    height: ConstantsResponsive.YR * 25,
    position: "absolute",
    left: 20,
    right: 5,
    backgroundColor: "white",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  timeNumber: {
    fontSize: 17,
    color: "black",
    fontFamily: "LilitaOne",
  },
  healthBarContainer: {
    height: ConstantsResponsive.YR * 40,
    width: ConstantsResponsive.MAX_WIDTH - ConstantsResponsive.XR * 120,
    marginLeft: ConstantsResponsive.XR * 60,
  },
  healthIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    width: ConstantsResponsive.YR * 46,
    height: ConstantsResponsive.YR * 40,
  },
  healthBar: {
    height: ConstantsResponsive.YR * 20,
    width:
      ConstantsResponsive.MAX_WIDTH -
      ConstantsResponsive.XR * 200 -
      ConstantsResponsive.XR * 60,
    marginLeft: ConstantsResponsive.XR * 40,
    marginTop: ConstantsResponsive.YR * 10,
    backgroundColor: "white",
    borderRadius: ConstantsResponsive.YR * 10,
  },
  healthBarInner: {
    position: "absolute",
    backgroundColor: "#ff1a1a",
    left: ConstantsResponsive.XR * 3,

    top: ConstantsResponsive.YR * 3,
    bottom: ConstantsResponsive.YR * 3,
    borderRadius: ConstantsResponsive.YR * 8,
  },
  playArea: {
    width: ConstantsResponsive.MAX_WIDTH,
    marginTop: ConstantsResponsive.YR * 150,
    height:
      ConstantsResponsive.MAX_HEIGHT -
      ConstantsResponsive.YR * 150 -
      ConstantsResponsive.YR * 70,
    flexDirection: "column",
  },
  playRow: {
    height:
      (ConstantsResponsive.MAX_HEIGHT -
        ConstantsResponsive.YR * 250 -
        ConstantsResponsive.YR * 112) /
      4,
    width: ConstantsResponsive.MAX_WIDTH,
    flexDirection: "row",
  },
  playCell: {
    width: ConstantsResponsive.MAX_WIDTH / 3,
    height:
      (ConstantsResponsive.MAX_HEIGHT -
        ConstantsResponsive.YR * 250 -
        ConstantsResponsive.YR * 112) /
      4,
    alignItems: "center",
  },
});
