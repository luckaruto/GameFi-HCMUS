import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Coin from "../../assets/navIcon/coin.svg";
import Gem from "../../assets/diamond.svg";
import Food from "../../assets/candy/14.png";
import { API } from "../apis/constants";
import Blood from "../../assets/medicine.svg";

import Lightning from "../../assets/lightning.svg";
import Lucky from "../../assets/medicine.png";
import ConstantsResponsive from "../constants/Constanst";
import { COLOR } from "../utils/color";
interface ItemProps {
  itemImg?: any;

  gemcost?: any;
  goldcost?: number;
  onPress?: () => void;

  itemAmount?: number;

  itemName?: string;
}

export const ItemComponent: React.FC<ItemProps> = ({
  itemImg,

  gemcost,
  goldcost,
  onPress,

  itemName,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: ConstantsResponsive.MAX_WIDTH / 3 - ConstantsResponsive.XR * 20,
        borderRadius: ConstantsResponsive.XR * 20,
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        flexDirection: "column",
        height:
          ConstantsResponsive.MAX_HEIGHT / 3 - 120 * ConstantsResponsive.YR,
        backgroundColor: COLOR.BROWN_BORDER,
        paddingTop: 2,
      }}
    >
      <View
        style={[
          styles.itemTop,
          {
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: "rexlia",
            color: COLOR.WHITE,
            fontSize: 17,
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          {itemName}
        </Text>
      </View>
      <View style={{ display: "flex", alignItems: "center" }}>
        <Image
          resizeMode="contain"
          source={{ uri: API.server + itemImg }}
          style={{
            width: ConstantsResponsive.XR * 100,
            height: ConstantsResponsive.YR * 100,
          }}
        />
      </View>
      <View
        style={[
          styles.itemBottom,
          {
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            columnGap: 5,
            paddingHorizontal: 20,
            paddingBottom: 5,
          },
        ]}
      >
        {gemcost && gemcost > 0 ? (
          <>
            <Gem
              width={styles.listContainer.width / 5}
              height={styles.itemBottom.height - 10}
            />
            <Text
              style={{
                fontFamily: "rexlia",
                fontWeight: "500",
                color: COLOR.WHITE,
                fontSize: 15,
              }}
            >
              {gemcost}
            </Text>
          </>
        ) : (
          <>
            <Coin
              width={styles.listContainer.width / 5}
              height={styles.itemBottom.height - 10}
            />
            <Text
              style={{
                fontFamily: "rexlia",
                fontWeight: "500",
                color: COLOR.WHITE,
                fontSize: 17,
              }}
            >
              {goldcost}
            </Text>
          </>
        )}
        {/* {goldcost && goldcost > 0 && } */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: ConstantsResponsive.MAX_WIDTH / 3 - ConstantsResponsive.XR * 20,
    borderRadius: ConstantsResponsive.XR * 20,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    padding: ConstantsResponsive.YR * 10,

    flexDirection: "column",
    height: ConstantsResponsive.MAX_HEIGHT / 3 - 120 * ConstantsResponsive.YR,
  },
  itemTop: {
    width: "100%",

    marginBottom: ConstantsResponsive.YR * 10,
  },
  itemBottom: {
    height: ConstantsResponsive.YR * 50,
    marginTop: ConstantsResponsive.YR * 20,
  },
  itemMain: {
    width: ConstantsResponsive.MAX_WIDTH / 3 - 20,
    height:
      ConstantsResponsive.MAX_HEIGHT / 3 -
      2 * 120 * ConstantsResponsive.YR -
      20 * ConstantsResponsive.YR,
  },
});
