import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

import { W3mAccountButton } from "@web3modal/wagmi-react-native";
import ConstantsResponsive from "../constants/Constanst";
import { COLOR } from "../utils/color";
import CustomText from "./CustomText";
import Thunder from "../../assets/navIcon/thunder.svg";
import Coin from "../../assets/navIcon/coin.svg";
import useCustomNavigation from "../hooks/useCustomNavigation";
import { ItemAppOwnerService } from "../services/ItemAppOwnerService";
import { useAccount } from "wagmi";
import log from "../logger/index.js";
import logger from "../logger/index.js";
import useFetch from "../hooks/useFetch";
import { UsersService } from "../services/UsersService";
import { useDispatch, useSelector } from "react-redux";
import { updateEnergy } from "../redux/playerSlice";
import { useIsFocused } from "@react-navigation/native";

interface HeaderProps {
  name: string;
}
const GOLD = "Gold";
const GEM = "Gem";

const Header: React.FC<HeaderProps> = ({ name }) => {
  const [data, setData] = useState<any[]>([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  /** useAccount */
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const { reLoad } = useSelector((state: any) => state.reLoad);

  const fetchData = async () => {
    try {
      const res: any[] = await ItemAppOwnerService.getCurrency(
        address || "0xFe25C8BB510D24ab8B3237294D1A8fCC93241454",
      );
      setData([...data, ...res]);
    } catch (error) {
      log.error("ItemAppOwnerService.getCurrency", error);
    }
  };

  const { apiData: energyUser, serverError } = useFetch(
    () =>
      UsersService.getOwnerEnergy(
        address || "0xFe25C8BB510D24ab8B3237294D1A8fCC93241454",
      ),
    [reLoad],
  );

  useEffect(() => {
    fetchData();
  }, [address, reLoad, isFocused]);

  useEffect(() => {
    dispatch(updateEnergy(energyUser?.energy || 0));
  }, [energyUser?.energy]);

  const navigate = useCustomNavigation();
  return (
    <View
      style={{
        width: ConstantsResponsive.MAX_WIDTH * 0.4,
        height: ConstantsResponsive.YR * 40,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        justifyContent: "center",
        columnGap: ConstantsResponsive.XR * 30,

        position: "relative",

        borderRadius: 20,
        paddingHorizontal: ConstantsResponsive.XR * 10,
      }}
    >
      <Image
        resizeMode="stretch"
        style={{
          height: ConstantsResponsive.YR * 40,
          width:
            ConstantsResponsive.MAX_WIDTH * 0.4 + ConstantsResponsive.XR * 4,
          left: 0,

          position: "absolute",
        }}
        source={require("../../assets/backGroundButtonBrown.png")}
      />
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Coin></Coin>
        <CustomText
          style={{
            color: COLOR.YELLOW,
            textAlign: "center",
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          {data && data.length
            ? data.find((item) => item.name == GOLD).quantity
            : 100}
        </CustomText>
      </View>

      <View
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Thunder
          height={ConstantsResponsive.YR * 25}
          width={ConstantsResponsive.XR * 25}
        />
        <CustomText
          style={{
            color: COLOR.CYAN,
            textAlign: "center",
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          {energyUser?.energy}
        </CustomText>
      </View>
    </View>

    // <View className="relative flex h-fit w-[100%] flex-row items-center justify-center   ">
    //   <W3mAccountButton balance="show" style={{ backgroundColor: "white" }} />
    // </View>
  );
};

export default Header;
