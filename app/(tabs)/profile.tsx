import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AppColors from '../../constants/Colors';

const ProfileScreen = () => {
  const router = useRouter();

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    orders: 12,
    memberSince: "Jan 2023"
  };

  const menuItems = [
    { icon: "person", name: "Personal Info" },
    { icon: "cart", name: "My Orders" },
    { icon: "heart", name: "Wishlist" },
    { icon: "location", name: "Addresses" },
    { icon: "card", name: "Payment" },
    { icon: "settings", name: "Settings" }
  ];

  const handleLogout = () => {

    router.replace('/auth/index'); 
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: AppColors.background.primary }]}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: AppColors.text.primary }]}>My Profile</Text>
        </View>

        {/* Profile Section */}
        <View style={[styles.profileCard, { backgroundColor: AppColors.background.secondary }]}>
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.avatar} 
          />
          <Text style={[styles.userName, { color: AppColors.text.primary }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: AppColors.text.secondary }]}>{user.email}</Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: AppColors.primary[500] }]}>{user.orders}</Text>
              <Text style={[styles.statLabel, { color: AppColors.text.secondary }]}>Orders</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: AppColors.gray[300] }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: AppColors.primary[500] }]}>{user.memberSince}</Text>
              <Text style={[styles.statLabel, { color: AppColors.text.secondary }]}>Member Since</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuContainer, { backgroundColor: AppColors.background.secondary }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.menuItem, 
                index !== menuItems.length - 1 && { borderBottomColor: AppColors.gray[200] }
              ]}
            >
              <Ionicons 
                name={item.icon as any} 
                size={20} 
                color={AppColors.primary[500]} 
              />
              <Text style={[styles.menuText, { color: AppColors.text.primary }]}>{item.name}</Text>
              <Ionicons 
                name="chevron-forward" 
                size={18} 
                color={AppColors.gray[400]} 
              />
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons 
              name="log-out-outline" 
              size={20} 
              color={AppColors.error || 'red'} 
            />
            <Text style={[styles.menuText, { color: AppColors.error || 'red' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold' },
  profileCard: { margin: 20, padding: 20, borderRadius: 12, alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 3, borderColor: AppColors.primary[100] },
  userName: { fontSize: 20, fontFamily: 'Inter-SemiBold', marginBottom: 4 },
  userEmail: { fontSize: 14, fontFamily: 'Inter-Regular', marginBottom: 20 },
  statsContainer: { flexDirection: 'row', width: '100%', justifyContent: 'center' },
  statItem: { alignItems: 'center', paddingHorizontal: 20 },
  statNumber: { fontSize: 18, fontFamily: 'Inter-Bold' },
  statLabel: { fontSize: 12, fontFamily: 'Inter-Regular', marginTop: 4 },
  statDivider: { width: 1, height: 40 },
  menuContainer: { margin: 20, borderRadius: 12, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  menuText: { flex: 1, fontSize: 16, fontFamily: 'Inter-Medium', marginLeft: 16 }
});

export default ProfileScreen;
