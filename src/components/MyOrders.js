import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Dimensions } from 'react-native';

const MD3_PALETTE = {
  primary: '#4A5FAE',
  surface: '#FFFFFF',
  background: '#FEFBFF',
  secondary: '#595E72',
};

const API_URL = 'https://687321edc75558e273536526.mockapi.io/api/admin_orders';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error();
        setOrders(await res.json());
      } catch (err) {
        Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderCustomer}>{item.customer}</Text>
        <Text style={styles.orderStatus}>
          {item.status === 'completed' ? '✅ Hoàn tất' : '⏳ Đang xử lý'}
        </Text>
      </View>
      <Text style={styles.orderEmail}>{item.email}</Text>
      <Text style={styles.orderItems}>{item.items}</Text>
      <Text style={styles.orderTotal}>
        Tổng tiền: {item.total.toLocaleString()} VNĐ
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={MD3_PALETTE.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn hàng của bạn</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MD3_PALETTE.background,
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MD3_PALETTE.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: MD3_PALETTE.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MD3_PALETTE.primary,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4caf50',
  },
  orderEmail: {
    fontSize: 13,
    color: MD3_PALETTE.secondary,
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
});