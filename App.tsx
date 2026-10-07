import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployeeScreen from './screens/EmployeeScreen';
import CustomerScreen from './screens/CustomerScreen';
import VendorScreen from './screens/VendorScreen';
import InventoryScreen from './screens/InventoryScreen';
import EditEmployee from './screens/EditEmployee';
import EditCustomer from './screens/EditCustomer';
import EditVendor from './screens/EditVendor';
import EditInventory from './screens/EditInventory';
import SalesScreen from './screens/SalesScreen';
import PurchaseScreen from './screens/PurchaseScreen';
import EditSales from './screens/EditSales';
import EditPurchase from './screens/EditPurchase';
const Stack = createNativeStackNavigator();

const DashboardScreen = ({ navigation }) => {
  const [data] = useState([
    { id: 1, title: 'Employee Management' },
    { id: 2, title: 'Inventory Management' },
    { id: 3, title: 'Sales Management' },
    { id: 4, title: 'Purchase Management' },
    { id: 5, title: 'Reports' },
    { id: 6, title: 'Settings' },
    { id: 7, title: 'Customer Management' },
    { id: 8, title: 'Vendor Management' },
  ]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 15,
        }}
      >
        Dashboard
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              {item.title}
            </Text>

           <Button
  title="Go"
  onPress={() => {
    if (item.title === 'Employee Management') {
      navigation.navigate('EmployeeScreen');
    } else if (item.title === 'Customer Management') {
      navigation.navigate('CustomerScreen');
    }
    else if (item.title === 'Vendor Management') {
      navigation.navigate('VendorScreen');
    }
      else if (item.title === 'Inventory Management') {
      navigation.navigate('InventoryScreen');
    }
    else if (item.title === 'Sales Management') {
  navigation.navigate('SalesScreen');
}
else if (item.title === 'Purchase Management') {
  navigation.navigate('PurchaseScreen');
}
  }}
  disabled={
    item.title !== 'Employee Management' &&
    item.title !== 'Customer Management' &&
    item.title !== 'Vendor Management' &&
    item.title !== 'Inventory Management' &&
    item.title !== 'Sales Management' &&
    item.title !== 'Purchase Management'
  }
/>
          </View>
        )}
      />
    </View>
  );
};

const DetailScreen = ({ route, navigation }) => {
  const { id, title } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Detail Screen
      </Text>

      <Text style={{ fontSize: 18, marginTop: 15 }}>
        ID: {id}
      </Text>

      <Text style={{ fontSize: 18, marginTop: 10 }}>
        Module: {title}
      </Text>

      <View style={{ marginTop: 20 }}>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />

        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Details' }}
        />
        <Stack.Screen
          name="EmployeeScreen"
          component={EmployeeScreen}
        />
    <Stack.Screen
          name="CustomerScreen"
          component={CustomerScreen}
        />
            <Stack.Screen
          name="VendorScreen"
          component={VendorScreen}
        />
            <Stack.Screen
          name="InventoryScreen"
          component={InventoryScreen}
        />
        <Stack.Screen
  name="SalesScreen"
  component={SalesScreen}
  options={{title: 'Sales Management'}}
/>
<Stack.Screen
  name="PurchaseScreen"
  component={PurchaseScreen}
  options={{title: 'Purchase Management'}}
/>

<Stack.Screen
  name="EditPurchase"
  component={EditPurchase}
  options={{title: 'Edit Purchase Order'}}
/>
<Stack.Screen
  name="EditSales"
  component={EditSales}
  options={{title: 'Edit Sales Order'}}
/>
        <Stack.Screen name="EditInventory" component={EditInventory} options={{ title: 'Edit Inventory', }} />
        <Stack.Screen name="EditVendor" component={EditVendor} options={{ title: 'Edit Vendor', }} />
        <Stack.Screen name="EditCustomer" component={EditCustomer} options={{ title: 'Edit Customer', }} />
        <Stack.Screen name="EditEmployee" component={EditEmployee} options={{ title: 'Edit Employee', }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;