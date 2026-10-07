import React from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Authentication
import {
  AuthProvider,
  useAuth,
} from './AuthContext';

// Authentication screens
import LoginScreen from './screens/LoginScreen';
import FirstAdminScreen from './screens/FirstAdminScreen';

// Main screens
import EmployeeScreen from './screens/EmployeeScreen';
import CustomerScreen from './screens/CustomerScreen';
import VendorScreen from './screens/VendorScreen';
import InventoryScreen from './screens/InventoryScreen';
import SalesScreen from './screens/SalesScreen';
import PurchaseScreen from './screens/PurchaseScreen';

// Edit screens
import EditEmployee from './screens/EditEmployee';
import EditCustomer from './screens/EditCustomer';
import EditVendor from './screens/EditVendor';
import EditInventory from './screens/EditInventory';
import EditSales from './screens/EditSales';
import EditPurchase from './screens/EditPurchase';

// Reports
import ReportsScreen from './screens/ReportsScreen';
import EmployeeAttendanceReport from './screens/EmployeeAttendanceReport';
import InventoryReport from './screens/InventoryReport';
import SalesReport from './screens/SalesReport';
import PurchaseReport from './screens/PurchaseReport';
import SetupScreen from './screens/SetupScreen';
// Admin
import UserManagementScreen from './screens/UserManagementScreen';

const Stack = createNativeStackNavigator();

const {width} = Dimensions.get('window');


// ============================================================
// RBAC PERMISSIONS
// ============================================================

const permissions = {
  Admin: [
    'Employee Management',
    'Inventory Management',
    'Sales Management',
    'Purchase Management',
    'Customer Management',
    'Vendor Management',
    'Reports',
    'User Management',
    'Settings',
  ],

  Manager: [
    'Inventory Management',
    'Sales Management',
    'Purchase Management',
    'Customer Management',
    'Vendor Management',
    'Reports',
  ],

  Staff: [
    'Inventory Management',
    'Sales Management',
    'Customer Management',
    'Reports',
  ],

  Viewer: [
    'Reports',
  ],
};


// ============================================================
// DASHBOARD
// ============================================================

const DashboardScreen = ({navigation}) => {

  const {user, logout} = useAuth();

 const data = [
  {
    id: '1',
    title: 'Employee Management',
    subtitle: 'Manage employees',
    icon: 'account-group-outline',
    color: '#2563EB',
    route: 'EmployeeScreen',
  },

  {
    id: '2',
    title: 'Inventory Management',
    subtitle: 'Manage stock & items',
    icon: 'warehouse',
    color: '#059669',
    route: 'InventoryScreen',
  },

  {
  id: '3',
  title: 'Sales Management',
  subtitle: 'Manage sales orders',
  icon: 'cart-arrow-right',
  color: '#D97706',
  route: 'SalesScreen',
},

{
  id: '4',
  title: 'Purchase Management',
  subtitle: 'Manage purchases',
  icon: 'cart-arrow-down',
  color: '#7C3AED',
  route: 'PurchaseScreen',
},

  {
    id: '5',
    title: 'Customer Management',
    subtitle: 'Manage customers',
    icon: 'account-multiple-outline',
    color: '#0891B2',
    route: 'CustomerScreen',
  },

  {
    id: '6',
    title: 'Vendor Management',
    subtitle: 'Manage vendors',
    icon: 'truck-outline',
    color: '#DB2777',
    route: 'VendorScreen',
  },

  {
    id: '7',
    title: 'Reports',
    subtitle: 'View business reports',
    icon: 'chart-bar',
    color: '#DC2626',
    route: 'Reports',
  },

  {
    id: '8',
    title: 'Settings',
    subtitle: 'Application settings',
    icon: 'cog-outline',
    color: '#64748B',
    route: null,
    disabled: true,
  },

  {
    id: '9',
    title: 'User Management',
    subtitle: 'Manage users & roles',
    icon: 'account-cog-outline',
    color: '#7C3AED',
    route: 'UserManagement',
  },
];


  // ==========================================================
  // FILTER MODULES BASED ON USER ROLE
  // ==========================================================

  const allowedModules =
    permissions[user?.role] || [];

  const filteredData =
    data.filter(item =>
      allowedModules.includes(item.title),
    );


  // ==========================================================
  // MODULE CLICK
  // ==========================================================

  const handleModulePress = item => {

    if (!item.route || item.disabled) {
      return;
    }

    navigation.navigate(item.route);
  };


  // ==========================================================
  // CARD
  // ==========================================================

  const renderDashboardCard = ({item}) => {

    return (
      <TouchableOpacity
        activeOpacity={
          item.disabled ? 1 : 0.75
        }

        disabled={item.disabled}

        style={[
          styles.card,
          item.disabled &&
            styles.disabledCard,
        ]}

        onPress={() =>
          handleModulePress(item)
        }>

        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                item.color,
            },
          ]}>

          <Icon
            name={item.icon}
            size={32}
            color="#FFFFFF"
          />

        </View>


        <View style={styles.cardContent}>

          <Text
            style={[
              styles.cardTitle,
              item.disabled &&
                styles.disabledText,
            ]}>

            {item.title}

          </Text>


          <Text
            style={[
              styles.cardSubtitle,
              item.disabled &&
                styles.disabledText,
            ]}>

            {item.subtitle}

          </Text>

        </View>


        {!item.disabled && (
          <Icon
            name="chevron-right"
            size={25}
            color="#94A3B8"
          />
        )}

      </TouchableOpacity>
    );
  };


  // ==========================================================
  // DASHBOARD
  // ==========================================================

  return (
    <SafeAreaView
      style={styles.safeArea}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#0F172A"
      />


      {/* ====================================================
          HEADER
      ==================================================== */}

      <View style={styles.header}>

        <View style={styles.headerTextContainer}>

          <Text style={styles.welcomeText}>
            Welcome back, {user?.username}
          </Text>

          <Text style={styles.dashboardTitle}>
            Garments Management
          </Text>

          <Text style={styles.dashboardSubtitle}>
            Role: {user?.role}
          </Text>

        </View>


        <View style={styles.headerRight}>

  {/* Store / Business Icon */}
  <View style={styles.headerIcon}>
    <Icon
      name="storefront-outline"
      size={30}
      color="#FFFFFF"
    />
  </View>

  {/* Logout Button */}
  <TouchableOpacity
    style={styles.logoutButton}
    onPress={logout}
    activeOpacity={0.7}>

    <Icon
      name="logout"
      size={21}
      color="#FFFFFF"
    />

  </TouchableOpacity>

</View>

      </View>


      {/* ====================================================
          SUMMARY
      ==================================================== */}

      <View
        style={styles.summaryContainer}>

        <View style={styles.summaryItem}>

          <Icon
            name="view-dashboard-outline"
            size={22}
            color="#2563EB"
          />

          <View>

            <Text style={styles.summaryNumber}>
              {filteredData.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Modules
            </Text>

          </View>

        </View>


        <View style={styles.summaryDivider} />


        <View style={styles.summaryItem}>

          <Icon
            name="shield-account-outline"
            size={22}
            color="#059669"
          />

          <View>

            <Text style={styles.summaryNumber}>
              {user?.role}
            </Text>

            <Text style={styles.summaryLabel}>
              Access Level
            </Text>

          </View>

        </View>

      </View>


      {/* ====================================================
          MODULE HEADER
      ==================================================== */}

      <View style={styles.modulesHeader}>

        <Text style={styles.modulesTitle}>
          Business Modules
        </Text>

        <Text style={styles.modulesCount}>
          {filteredData.length} Available
        </Text>

      </View>


      {/* ====================================================
          MODULE GRID
      ==================================================== */}

      <FlatList
        data={filteredData}
        renderItem={renderDashboardCard}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.grid
        }
        columnWrapperStyle={
          styles.row
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>

            <Icon
              name="lock-outline"
              size={50}
              color="#94A3B8"
            />

            <Text style={styles.emptyTitle}>
              No modules available
            </Text>

            <Text style={styles.emptyText}>
              Your account does not have
              any assigned modules.
            </Text>

          </View>
        }
      />

    </SafeAreaView>
  );
};


// ============================================================
// DETAIL SCREEN
// ============================================================

const DetailScreen = ({
  route,
  navigation,
}) => {

  const {
    id,
    title,
  } = route.params;

  return (
    <View
      style={styles.detailContainer}>

      <Text style={styles.detailTitle}>
        Detail Screen
      </Text>

      <Text style={styles.detailText}>
        ID: {id}
      </Text>

      <Text style={styles.detailText}>
        Module: {title}
      </Text>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.goBack()
        }>

        <Text style={styles.backButtonText}>
          Go Back
        </Text>

      </TouchableOpacity>

    </View>
  );
};


// ============================================================
// MAIN NAVIGATOR
// ============================================================

const AppNavigator = () => {

  const {
    token,
    loading,
  } = useAuth();


  if (loading) {

    return (
      <View
        style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#173F5F"
        />

        <Text style={styles.loadingText}>
          Loading...
        </Text>

      </View>
    );
  }


  return (
    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },

          headerTintColor:
            '#FFFFFF',

          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },

          headerShadowVisible:
            false,
        }}>


        {/* ==================================================
            NOT LOGGED IN
        ================================================== */}
{!token ? (

  <>

    <Stack.Screen
      name="Setup"
      component={SetupScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="FirstAdmin"
      component={FirstAdminScreen}
      options={{
        headerShown: false,
      }}
    />

  </>

) : (

          /* ==================================================
             LOGGED IN
          ================================================== */

          <>

            {/* DASHBOARD */}

            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                headerShown: false,
              }}
            />


            {/* DETAIL */}

            <Stack.Screen
              name="Detail"
              component={DetailScreen}
              options={{
                title: 'Details',
              }}
            />


            {/* EMPLOYEE */}

            <Stack.Screen
              name="EmployeeScreen"
              component={EmployeeScreen}
              options={{
                title:
                  'Employee Management',
              }}
            />

            <Stack.Screen
              name="EditEmployee"
              component={EditEmployee}
              options={{
                title:
                  'Edit Employee',
              }}
            />


            {/* CUSTOMER */}

            <Stack.Screen
              name="CustomerScreen"
              component={CustomerScreen}
              options={{
                title:
                  'Customer Management',
              }}
            />

            <Stack.Screen
              name="EditCustomer"
              component={EditCustomer}
              options={{
                title:
                  'Edit Customer',
              }}
            />


            {/* VENDOR */}

            <Stack.Screen
              name="VendorScreen"
              component={VendorScreen}
              options={{
                title:
                  'Vendor Management',
              }}
            />

            <Stack.Screen
              name="EditVendor"
              component={EditVendor}
              options={{
                title:
                  'Edit Vendor',
              }}
            />


            {/* INVENTORY */}

            <Stack.Screen
              name="InventoryScreen"
              component={InventoryScreen}
              options={{
                title:
                  'Inventory Management',
              }}
            />

            <Stack.Screen
              name="EditInventory"
              component={EditInventory}
              options={{
                title:
                  'Edit Inventory',
              }}
            />


            {/* SALES */}

            <Stack.Screen
              name="SalesScreen"
              component={SalesScreen}
              options={{
                title:
                  'Sales Management',
              }}
            />

            <Stack.Screen
              name="EditSales"
              component={EditSales}
              options={{
                title:
                  'Edit Sales Order',
              }}
            />


            {/* PURCHASE */}

            <Stack.Screen
              name="PurchaseScreen"
              component={PurchaseScreen}
              options={{
                title:
                  'Purchase Management',
              }}
            />

            <Stack.Screen
              name="EditPurchase"
              component={EditPurchase}
              options={{
                title:
                  'Edit Purchase Order',
              }}
            />


            {/* REPORTS */}

            <Stack.Screen
              name="Reports"
              component={ReportsScreen}
              options={{
                title: 'Reports',
              }}
            />

            <Stack.Screen
              name="EmployeeAttendanceReport"
              component={
                EmployeeAttendanceReport
              }
              options={{
                title:
                  'Employee Attendance Report',
              }}
            />

            <Stack.Screen
              name="InventoryReport"
              component={
                InventoryReport
              }
              options={{
                title:
                  'Inventory Report',
              }}
            />

            <Stack.Screen
              name="SalesReport"
              component={
                SalesReport
              }
              options={{
                title:
                  'Sales Report',
              }}
            />

            <Stack.Screen
              name="PurchaseReport"
              component={
                PurchaseReport
              }
              options={{
                title:
                  'Purchase Report',
              }}
            />


            {/* ADMIN USER MANAGEMENT */}

            <Stack.Screen
              name="UserManagement"
              component={
                UserManagementScreen
              }
              options={{
                title:
                  'User Management',
              }}
            />

          </>

        )}

      </Stack.Navigator>

    </NavigationContainer>
  );
};


// ============================================================
// APP
// ============================================================

const App = () => {

  return (
    <AuthProvider>

      <AppNavigator />

    </AuthProvider>
  );
};


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },


  // ========================================================
  // LOADING
  // ========================================================

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },


  // ========================================================
  // HEADER
  // ========================================================

  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 28,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  welcomeText: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 5,
  },

  dashboardTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
  },

  dashboardSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 5,
  },

 headerRight: {
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 12,
},

headerIcon: {
  width: 58,
  height: 58,
  borderRadius: 29,

  backgroundColor: '#1E293B',

  justifyContent: 'center',
  alignItems: 'center',

  borderWidth: 1,
  borderColor: '#334155',
},

logoutButton: {
  marginTop: 10,

  width: 44,
  height: 38,

  borderRadius: 10,

  backgroundColor: '#334155',

  alignItems: 'center',
  justifyContent: 'center',

  borderWidth: 1,
  borderColor: '#475569',
},


  // ========================================================
  // SUMMARY
  // ========================================================

  summaryContainer: {
    marginHorizontal: 16,
    marginTop: -15,

    backgroundColor: '#FFFFFF',

    borderRadius: 14,

    paddingVertical: 15,
    paddingHorizontal: 18,

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    elevation: 4,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  summaryDivider: {
    height: 35,
    width: 1,
    backgroundColor: '#E2E8F0',
  },

  summaryNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },

  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },


  // ========================================================
  // MODULE HEADER
  // ========================================================

  modulesHeader: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    paddingHorizontal: 18,

    marginTop: 22,
    marginBottom: 10,
  },

  modulesTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },

  modulesCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },


  // ========================================================
  // GRID
  // ========================================================

  grid: {
    paddingHorizontal: 12,
    paddingBottom: 25,
  },

  row: {
    justifyContent:
      'space-between',
  },


  // ========================================================
  // CARD
  // ========================================================

  card: {
    backgroundColor: '#FFFFFF',

    width: (width - 36) / 2,

    minHeight: 175,

    borderRadius: 16,

    marginHorizontal: 6,
    marginVertical: 6,

    padding: 16,

    elevation: 4,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,
    shadowRadius: 5,

    justifyContent:
      'space-between',
  },

  disabledCard: {
    backgroundColor: '#E2E8F0',
    opacity: 0.65,
  },

  iconContainer: {
    width: 56,
    height: 56,

    borderRadius: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  cardContent: {
    marginTop: 15,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
  },

  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  disabledText: {
    color: '#64748B',
  },


  // ========================================================
  // EMPTY
  // ========================================================

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingTop: 70,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
  },

  emptyText: {
    marginTop: 7,
    fontSize: 13,
    textAlign: 'center',
    color: '#64748B',
  },


  // ========================================================
  // DETAIL
  // ========================================================

  detailContainer: {
    flex: 1,
    padding: 25,
    backgroundColor: '#F1F5F9',
  },

  detailTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },

  detailText: {
    fontSize: 17,
    color: '#334155',
    marginBottom: 10,
  },

  backButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

});

export default App;