import React, { useEffect, useState } from "react";
import {
  Platform,
  Text,
  Dimensions,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import { ScrollView as ScrollViewWeb } from "react-native-web";
import tideDataFetcher from "./tideDataFetcher";
import { useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import SimpleGlass from './SimpleGlass';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const isWeb = Platform.OS === "web";

const {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryArea,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryLabel,
} = isWeb ? require("victory") : require("victory-native");

interface TideDataPoint {
  t: string;
  v: string;
}

interface ProcessedDataPoint {
  x: Date;
  y: number;
}

const TideChart: React.FC = () => {
  const isFocused = useIsFocused();
  const theme = useTheme();

  const [tideData, setTideData] = useState<TideDataPoint[]>([]);
  const [activePoint, setActivePoint] = useState<ProcessedDataPoint | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
  //       <ActivityIndicator size="large" color={theme.colors.primary} />
  //     </View>
  //   );
  // }

  const currentTime = new Date();

  const CustomScrollView = (props) => {
    if (isWeb) {
      return <ScrollViewWeb {...props}>{props.children}</ScrollViewWeb>;
    } else {
      return <ScrollView {...props}>{props.children}</ScrollView>;
    }
  };

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      const currentDate = new Date();
      const beginDate = new Date(currentDate);
      const endDate = new Date(currentDate);

      beginDate.setHours(currentDate.getHours() - 12);
      endDate.setHours(currentDate.getHours() + 96);

      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}${month}${day} ${hours}:${minutes}`;
      };

      tideDataFetcher(formatDate(beginDate), formatDate(endDate)).then(
        (data) => {
          setTideData(data);
          setIsLoading(false);
        }
      );
    }
  }, [isFocused]);

  const processedData: ProcessedDataPoint[] = tideData
    .map((point) => ({
      x: new Date(point.t.replace(" ", "T")),
      y: parseFloat(point.v),
    }))
    .filter((point) => !isNaN(point.y));

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const chartPadding = {
    top: 60,
    bottom: 40,
    left: screenWidth * 0.1,
    right: screenWidth * 0.1,
  };

  const minY = Math.min(...processedData.map((point) => point.y));
  const maxY = Math.max(...processedData.map((point) => point.y));
  const absMax = Math.max(Math.abs(minY), Math.abs(maxY));
  const padding = absMax * 0.1;

  const blueData = processedData.map((point) => ({ x: point.x, y: point.y }));
  const whiteData = processedData.map((point) => ({
    x: point.x,
    y: point.y > 0 ? 0 : point.y,
  }));

  const paddedMinY = isNaN(minY) ? -absMax - padding : minY - padding;
  const paddedMaxY = isNaN(maxY) ? absMax + padding : maxY + padding;

  console.log("ChartData:", processedData);

  const styles = StyleSheet.create({
    container: {
      // borderWidth: 1,
      // borderColor: theme.colors.primary,
      // borderRadius: 4,
      flex: 1,
      backgroundColor: theme.colors.background,
      overflow: "hidden",
      color: theme.colors.onSurface,
      shadowColor: theme.colors.secondary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    row: {
      flexDirection: "row",
      color: theme.colors.onSurface,
    },
    header: {
      color: theme.colors.onSurface,
    },
    cell: {
      padding: 8,
      flex: 1,
      // color: theme.colors.onSurface,
      // shadowColor: theme.colors.primary,
      // shadowOffset: {
      //   width: 0,
      //   height: 2,
      // },
      // shadowOpacity: 0.25,
      // shadowRadius: 3.84,
      // elevation: 5,
    },
    text: {
      fontSize: 16,
      color: theme.colors.onSurface,
    },
  });

  const CustomTable = ({ data }: { data: ProcessedDataPoint[] }) => {
    return (
      <View style={styles.container}>
        <SimpleGlass
          style={{
            marginHorizontal: 10,
            marginTop: 10,
            marginBottom: 5,
          }}
          borderRadius={8}
          theme={theme}
        >
          <View style={styles.row}>
            <Text style={[styles.cell, styles.text, { flex: 1, fontWeight: 'bold' }]}>
              Date & Time
            </Text>
            <Text style={[styles.cell, styles.text, { flex: 0.5, fontWeight: 'bold', textAlign: 'right' }]}>
              Height (ft)
            </Text>
          </View>
        </SimpleGlass>
        {data.map((row: ProcessedDataPoint, index: number) => (
          <SimpleGlass
            key={index}
            style={{
              marginHorizontal: 10,
              marginVertical: 2,
            }}
            borderRadius={6}
            theme={theme}
          >
            <View style={styles.row}>
              <Text style={[styles.cell, styles.text, { flex: 1 }]}>
                {new Date(row.x).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text
                style={[styles.cell, styles.text, { flex: 0.5, textAlign: 'right' }]}
              >
                {row.y.toFixed(2)}
              </Text>
            </View>
          </SimpleGlass>
        ))}
      </View>
    );
  };

  const findCurrentTideHeight = (data: ProcessedDataPoint[], currentTime: Date) => {
    if (!data || data.length === 0) {
      return null;
    }

    const before = data.findIndex((point) => point.x >= currentTime);
    const after = before - 1;

    if (before === -1) {
      return data[data.length - 1]?.y;
    }

    if (before === 0 || after === data.length - 1) {
      return data[before]?.y;
    }

    const x1 = data[after]?.x?.getTime();
    const x2 = data[before]?.x?.getTime();
    const y1 = data[after]?.y;
    const y2 = data[before]?.y;

    if (
      x1 === undefined ||
      x2 === undefined ||
      y1 === undefined ||
      y2 === undefined
    ) {
      return null;
    }

    const currentX = currentTime.getTime();
    const interpolatedY = y1 + ((y2 - y1) * (currentX - x1)) / (x2 - x1);
    return interpolatedY;
  };

  const currentTideHeight = findCurrentTideHeight(processedData, currentTime);
  console.log("CurrentTideHeight:", currentTideHeight);
  
  // Calculate tide rate (inches per 15 minutes) using actual data points
  const calculateTideRate = (data: ProcessedDataPoint[], currentTime: Date) => {
    if (!data || data.length < 2) return null;
    
    // Find the closest data points before and after current time
    let beforePoint = null;
    let afterPoint = null;
    
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i].x <= currentTime && data[i + 1].x > currentTime) {
        beforePoint = data[i];
        afterPoint = data[i + 1];
        break;
      }
    }
    
    if (!beforePoint || !afterPoint) {
      // If we're at the edge of data, use the last two points
      if (data.length >= 2) {
        beforePoint = data[data.length - 2];
        afterPoint = data[data.length - 1];
      } else {
        return null;
      }
    }
    
    // Calculate the rate of change between these two actual data points
    const timeDiffMs = afterPoint.x.getTime() - beforePoint.x.getTime();
    const timeDiffMinutes = timeDiffMs / (1000 * 60);
    const heightDiffFeet = afterPoint.y - beforePoint.y;
    
    // Calculate rate per minute, then scale to 15 minutes
    const ratePerMinute = heightDiffFeet / timeDiffMinutes;
    const ratePer15Min = ratePerMinute * 15;
    const rateInInches = ratePer15Min * 12; // Convert feet to inches
    
    return rateInInches;
  };
  
  const tideRate = calculateTideRate(processedData, currentTime);

  const interpolation = "monotoneX";

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return tideData.length > 0 ? (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View style={{ flexDirection: "column" }}>
          {/* Tide Info Header */}
          <SimpleGlass
            style={{
              marginHorizontal: 10,
              marginTop: 10,
              marginBottom: 10,
              padding: 15,
            }}
            borderRadius={12}
            theme={theme}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold',
                color: theme.colors.onBackground,
                marginBottom: 8
              }}>
                NOAA Tide Predictions - Herron Island
              </Text>
              {currentTideHeight !== null && (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ 
                      fontSize: 16,
                      color: theme.colors.onBackground 
                    }}>
                      Current Tide:
                    </Text>
                    <Text style={{ 
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: theme.colors.primary 
                    }}>
                      {currentTideHeight.toFixed(2)} ft
                    </Text>
                    <Text style={{ 
                      fontSize: 14,
                      color: theme.colors.onBackground,
                      opacity: 0.7
                    }}>
                      {currentTime.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </View>
                  {tideRate !== null && (
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      marginTop: 8,
                      paddingTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: theme.colors.outline,
                      gap: 10 
                    }}>
                      <MaterialCommunityIcons 
                        name={tideRate > 0 ? "trending-up" : "trending-down"} 
                        size={20} 
                        color={tideRate > 0 ? '#4CAF50' : '#FF5722'} 
                      />
                      <Text style={{ 
                        fontSize: 15,
                        color: theme.colors.onBackground 
                      }}>
                        Tide Rate:
                      </Text>
                      <Text style={{ 
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: tideRate > 0 ? '#4CAF50' : '#FF5722'
                      }}>
                        {tideRate > 0 ? '+' : ''}{tideRate.toFixed(1)} inches/15min
                      </Text>
                      <Text style={{ 
                        fontSize: 13,
                        color: theme.colors.onBackground,
                        opacity: 0.6,
                        fontStyle: 'italic'
                      }}>
                        ({tideRate > 0 ? 'Rising' : 'Falling'})
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </SimpleGlass>
          
          <CustomScrollView
            horizontal
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <VictoryChart
              // animate={{ duration: 2000, easing: "bounce" }}
              scale={{ x: "time", y: "linear" }}
              domain={{ y: [paddedMinY, paddedMaxY] }}
              padding={chartPadding}
              width={screenWidth * 3}
              style={{
                background: {
                  fill: "transparent"
                }
              }}
              containerComponent={
                <VictoryVoronoiContainer
                  customEvents={() => [
                    {
                      target: "data",
                      eventHandlers: {
                        onMouseOver: () => null,
                        onTouchStart: () => null,
                      },
                    },
                  ]}
                />
              }
            >
              <VictoryAxis
                dependentAxis
                label="Sea Level (ft)"
                style={{
                  axis: { stroke: theme.colors.onBackground },
                  axisLabel: {
                    padding: isWeb ? 40 : 50,
                    dy: isWeb ? 0 : -20,
                    fontSize: 20,
                    fill: theme.colors.onBackground,
                  },
                  tickLabels: { fill: theme.colors.onBackground },
                }}
                interpolation={interpolation}
              />
              <VictoryAxis
                tickFormat={(t: Date) =>
                  t.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
                style={{
                  axisLabel: { padding: 50, fill: "red" },
                  tickLabels: { fill: theme.colors.onBackground },
                }}
                interpolation={interpolation}
              />
              <VictoryArea
                data={blueData}
                style={{
                  data: {
                    fill: theme.colors.primary,
                    fillOpacity: theme.dark ? 0.25 : 0.15,
                    stroke: theme.colors.primary,
                    strokeWidth: 2,
                    strokeOpacity: 0.8,
                  },
                }}
                interpolation={interpolation}
                // animate={{
                //   onExit: {
                //     duration: 500,
                //     before: () => ({
                //       _y: 0,
                //       fill: "orange",
                //     })
                //   }
                // }}
              />
              <VictoryArea
                data={whiteData}
                style={{
                  data: {
                    fill: theme.colors.background,
                  },
                }}
                interpolation={interpolation}
                // animate={{
                //   onExit: {
                //     duration: 500,
                //     before: () => ({
                //       _y: 0,
                //       fill: "orange",
                //     })
                //   }
                // }}
              />
              <VictoryLine
                data={processedData}
                style={{
                  data: { 
                    stroke: theme.colors.primary,
                    strokeWidth: 3,
                    strokeOpacity: 0.9,
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  },
                }}
                interpolation={interpolation}
                // animate={{
                //   onExit: {
                //     duration: 500,
                //     before: () => ({
                //       _y: 0,
                //       fill: "orange",
                //     })
                //   }
                // }}
              />
              <VictoryScatter
                data={processedData}
                size={6}
                style={{ 
                  data: { 
                    fill: theme.colors.primary,
                    fillOpacity: 0.6,
                    stroke: theme.colors.primary,
                    strokeWidth: 2,
                    strokeOpacity: 0.8
                  } 
                }}
                labels={({ datum }: { datum: ProcessedDataPoint }) =>
                  `Time: ${datum.x.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}\nHeight: ${datum.y.toFixed(2)} ft`
                }
                labelComponent={
                  <VictoryTooltip
                    active={(datum: ProcessedDataPoint) => datum.x === currentTime}
                    style={{ fontSize: 12 }}
                  />
                }
                interpolation={interpolation}
              />
              <VictoryLine
                data={[
                  { x: currentTime, y: minY },
                  { x: currentTime, y: maxY },
                ]}
                style={{
                  data: {
                    stroke: theme.colors.secondary,
                    strokeWidth: 2,
                    strokeLinecap: "round",
                    strokeDasharray: "5,5",
                  },
                }}
                interpolation={interpolation}
                labels={[
                  currentTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }),
                ]}
                labelComponent={
                  <VictoryLabel
                    style={{ fill: theme.colors.onBackground }}
                    dy={-20}
                  />
                }
              />
            </VictoryChart>
          </CustomScrollView>
          <CustomTable data={processedData} />
        </View>
      </ScrollView>
    </View>
  ) : null;
};
export default TideChart;
