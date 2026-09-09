import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NewSituationScreen from '../screens/NewSituationScreen';
import SituationDetailScreen from '../screens/SituationDetailScreen';
import SituationsScreen from '../screens/SituationsScreen';
import { Situation } from '../types/situation';

export type RootStackParamList = {
  Situations: undefined;
  SituationDetail: { situation: Situation };
  NewSituation: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#F5F7FB' },
          headerTintColor: '#1C2740',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#F5F7FB' },
        }}
      >
        <Stack.Screen
          name="Situations"
          component={SituationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SituationDetail"
          component={SituationDetailScreen}
          options={{ title: 'Situation' }}
        />
        <Stack.Screen
          name="NewSituation"
          component={NewSituationScreen}
          options={{ title: 'Nouvelle situation' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
