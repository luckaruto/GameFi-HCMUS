import React, { useEffect } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import backGroundImage from "../../../assets/background3.png";
import GameBoard from "../../components/Game/Board";
import GameHeader from "../../components/Game/Header";
import UpperLayer from "../../components/Game/UpperLayer";
import { COLOR } from "../../utils/color";
import { Audio } from "expo-av";
import ConstantsResponsive from "../../constants/Constanst";
import { initSocket } from "../../redux/socketSlice";

const GameScreen = () => {
  const dispatch = useDispatch();
  const sound = new Audio.Sound();

  const playSound = async () => {
    try {
      await sound.unloadAsync(); // Unload any sound that might be loaded already
      await sound.loadAsync(
        require("../../../assets/audio/soundTrackGame.mp3"),
      ); // Adjust path
      sound.setOnPlaybackStatusUpdate(async (status) => {
        // Verify that the sound is loaded before checking didJustFinish
        if (status.isLoaded && status.didJustFinish) {
          await sound.setPositionAsync(0); // Rewind the sound to the start
          await sound.playAsync(); // Start playing again
        }
      });
      await sound.playAsync();
      // Additional settings can be adjusted here, e.g., volume, looping
    } catch (error) {
      console.log("Error playing sound", error);
    }
  };
  const { turn, damage, blockList, swapCells } = useSelector(
    (state: any) => state.board,
  );

  const { hp, componentHp, gameRoom } = useSelector(
    (state: any) => state.player,
  );

  /** Init socket */
  useEffect(() => {
    dispatch(initSocket());
    playSound();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          resizeMode="stretch"
          source={backGroundImage}
        />
        <GameHeader />

        <UpperLayer />

        <GameBoard />

        <View
          style={{
            top: 300,
          }}
        >
          <Text style={{ color: COLOR.WHITE }}>
            turn: {turn} damage: {damage}
          </Text>
          <Text style={{ color: COLOR.WHITE }}>
            hp: {hp} componentHp: {componentHp}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.PURPLE,
    width: "100%",
    height: "100%",

    display: "flex",

    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    width: ConstantsResponsive.MAX_WIDTH,
    height: ConstantsResponsive.MAX_HEIGHT,
    position: "absolute",
  },
});

export default GameScreen;
function dispatch(arg0: { payload: any; type: "player/updateHp" }) {
  throw new Error("Function not implemented.");
}
