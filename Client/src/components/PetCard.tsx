import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import LEAF from "../../assets/SVGLeaf.svg";
import IRON from "../../assets/SVGIron.svg";
import WATER from "../../assets/SVGWater.svg";
import STONE from "../../assets/SVGStone.svg";
import FIRE from "../../assets/SVGFire.svg";
import Egg from "../../assets/SVGEgg.svg";
import { ELEMENT } from "../constants/types";
import { Image } from "react-native";
import Pet from "../../assets/Pet.png";
import useCustomNavigation from "../hooks/useCustomNavigation";

interface PetCardProps {
  petImg: string;
  element: string;
  level: number;
  name: string;
  rarityPet: string;
}

const PetCard: React.FC<PetCardProps> = ({
  petImg,
  element,
  level,
  name,
  rarityPet,
}) => {
  const navigate = useCustomNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigate.navigate("DetailOfPet");
      }}
    >
      <View className="flex w-full flex-col  rounded-[20px] bg-[#2B2B2B] p-[15px]">
        <View className="mb-2 flex flex-row items-center justify-between">
          {ELEMENT.FIRE === element && <FIRE></FIRE>}
          {ELEMENT.IRON === element && <IRON></IRON>}
          {ELEMENT.LEAF === element && <LEAF></LEAF>}
          {ELEMENT.STONE === element && <STONE></STONE>}
          {ELEMENT.WATER === element && <WATER></WATER>}
          <View className="jutify-center relative items-center">
            <Egg></Egg>
            <Text className="absolute mt-2 text-[16px] font-bold">{level}</Text>
          </View>
        </View>
        <Image
          className="h-[150px] w-[150px] object-scale-down  "
          source={petImg !== "" ? { uri: petImg } : Pet}
        />
       

        <Text className="mt-2 font-rexlia text-[20px] text-white"> {name}</Text>
        <Text className=" text-right font-rexlia text-[20px] font-extralight text-white">
          {rarityPet}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PetCard;
