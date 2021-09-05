import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "react-native-rapi-ui";
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { useFonts } from 'expo-font';
import { LogBox } from "react-native";
import { EvaIconsPack } from '@ui-kitten/eva-icons';


// Redux
import { Provider } from 'react-redux';
import { store } from "./store";

export default function App() {

  let [fontsLoaded] = useFonts({
    'Poppins': require('./assets/fonts/Poppins-Regular.ttf')
  });

  LogBox.ignoreAllLogs();

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <ThemeProvider style={{position: "relative"}}>
          <ApplicationProvider {...eva} theme={eva.light}>
            <AppNavigator />
          </ApplicationProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}
