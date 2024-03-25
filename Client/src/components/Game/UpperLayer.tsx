import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Animated,
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import { store } from "../../redux/store";
import { COLOR } from "../../utils/color";
import { useDispatch, useSelector } from "react-redux";
import {
  emptyBlockList,
  updateDamage,
  updateTable,
  updateTurn,
} from "../../redux/boardSlice";
import GameLogic from "../../utils/game/game";

const UpperLayer = () => {
  const dispatch = useDispatch();
  const blockList = useSelector((state: any) => state.board.blockList);
  const blockState = store.getState().board;
  const { turn, damage, table } = useSelector((state: any) => state.board);
  const [initialState, setInitialState] = useState({
    coordinate: GameLogic.generateAnimatedValueXY(),
  });
  const [isReady, setIsReady] = useState(false);

  const boardTable = useMemo(() => {
    return table.map((row: any) => [...row]);
  }, [table]);
  const cnt = useRef(0);

  useEffect(() => {
    if (blockList && blockList.length) setIsReady(true);
    else setIsReady(false);
  }, [blockList]);
  useEffect(() => {
    if (isReady) {
      console.log("Chay useEffect Animation");
      cnt.current = blockList.length;
      startCollapseAnimation();
    }
  }, [blockList, isReady]);

  /** Service: Generate columns to collapse */
  const generateCols = useMemo<(block: Block) => number[][]>(() => {
    return (block: Block) => {
      dispatch(updateDamage(calcDamage())); // NG

      let startRow = 0;
      let endRow = Math.max(block.startCell.i, block.endCell.i); // Last index is exclusive
      let startCol = Math.min(block.startCell.j, block.endCell.j);
      let endCol = Math.max(block.startCell.j, block.endCell.j); // Last index is exclusive

      const cloneMatrix = [];

      let sliceRow = [];
      // BUG HERE.
      for (let i = startRow; i <= endRow; i++) {
        sliceRow = [];
        for (let j = startCol; j <= endCol; j++) {
          if (i == block.startCell.i) {
            boardTable[i][j] = GameLogic.randomNumber();
          }
          sliceRow.push(boardTable[i][j]);
        }

        cloneMatrix.push(sliceRow);
      }

      return cloneMatrix;
    };
  }, [blockList]);

  const calcDamage = useMemo<() => number>(() => {
    return () => {
      let damage = 0;
      blockList.forEach((block: Block) => {
        const value1 = boardTable[block.startCell.i][block.startCell.j];
        const value2 = boardTable[block.endCell.i][block.endCell.j];
        const value3 =
          block.startCell.i == block.endCell.i
            ? boardTable[block.startCell.i][block.startCell.j + 1]
            : boardTable[block.startCell.i + 1][block.startCell.j];
        const value = value1 == value2 || value1 == value3 ? value1 : value2;

        const times =
          block.startCell.i == block.endCell.i
            ? Math.abs(block.startCell.j - block.endCell.j) + 1
            : Math.abs(block.startCell.i - block.endCell.i) + 1;

        damage += value * times;
      });

      return damage;
    };
  }, [blockList]);
  /**
   * ANIMATION FOR UPPER LAYER TO COLLAPSE
   */
  const startCollapseAnimation = () => {
    if (blockList !== null && blockList.length > 0) {
      blockList.forEach((block: any) => {
        console.log("block: ", block);

        // THIS WILL STORE THE VALUE OF CELL NEED TO DROP DOWN

        const { blockHeight } = GameLogic.calculateCollapseCols(block);

        initialState.coordinate;

        for (let i = 0; i < initialState.coordinate.length; i++) {
          for (let j = 0; j < initialState.coordinate[0].length; j++) {
            Animated.timing(initialState.coordinate[i][j], {
              toValue: { x: 0, y: blockHeight }, // PROBLEM HERE!!!!
              duration: 2000,
              useNativeDriver: true,
            }).start(() => {
              // THIS RUN AFTER THE ANIMATION FINISHED
              cnt.current--;
              if (cnt.current == 0) {
                dispatch(updateTable(boardTable));
                dispatch(emptyBlockList([]));
                if (turn == 1) {
                  dispatch(updateTurn(2));
                } else if (turn == 2) {
                  dispatch(updateTurn(1));
                }
              }
            });
          }
        }
      });
    }
  };

  return useMemo(() => {
    return blockList === null || blockList.length === 0 ? (
      <></>
    ) : (
      blockList.map((block: any, indexBlock: any) => {
        // THIS WILL STORE THE VALUE OF CELL NEED TO DROP DOWN

        const cells = generateCols(block);

        const { top, left, blockWidth, blockHeight } =
          GameLogic.calculateCollapseCols(block);

        console.log("cells ", cells);

        return (
          <View
            key={indexBlock}
            style={{
              position: "absolute",
              zIndex: 5,
              top: top,
              left: left,
              height: blockHeight,
              width: blockWidth,
              overflow: "hidden",
              backgroundColor: "transparent",
              // opacity: 0,
              borderColor: COLOR.PURPLE,
            }}
          >
            {/* cells in block here */}
            {cells.map((row, indexRow) => (
              <View
                key={indexRow}
                style={{
                  flexDirection: "row",
                }}
              >
                {row.map((cell, indexCol) => (
                  <Animated.View
                    key={indexCol}
                    style={{
                      top:
                        cells[0].length > 1
                          ? top - blockHeight
                          : top - 2 * blockHeight,
                      margin: blockState.size.CELL_SPACING,
                      height: blockState.size.HEIGHT_PER_CELL,
                      width: blockState.size.WIDTH_PER_CELL,
                      flexWrap: "wrap",
                      zIndex: 99,
                      backgroundColor: COLOR.RED,
                      borderRadius: 5,

                      transform: [
                        {
                          translateX:
                            initialState.coordinate[indexRow][indexCol].x,
                        },
                        {
                          translateY:
                            initialState.coordinate[indexRow][indexCol].y,
                        },
                      ],
                    }}
                  >
                    {boardTable[indexRow][indexCol] == 0 ? (
                      <Text>0</Text>
                    ) : boardTable[indexRow][indexCol] == 1 ? (
                      <Text>1</Text>
                    ) : boardTable[indexRow][indexCol] == 2 ? (
                      <Text>2</Text>
                    ) : boardTable[indexRow][indexCol] == 3 ? (
                      <Text>3</Text>
                    ) : (
                      <Text>4</Text>
                    )}
                  </Animated.View>
                ))}
              </View>
            ))}
          </View>
        );
      })
    );
  }, [blockList]);
};
const styles = StyleSheet.create({
  boardContainer: {
    height: GameLogic.SIZE_TABLE,
    width: GameLogic.SIZE_TABLE,
    backgroundColor: COLOR.WHITE,
    alignContent: "center",
  },
});

export default UpperLayer;
