import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MD3_PALETTE = {
  primary: '#4A5FAE',
  surface: '#FFFFFF',
  error: '#BA1A1A',
};

export default function Cart({ cart, products, onChangeQuantity, onRemove, onUpdateOption }) {
  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <View style={styles.cartContainer}>
      <Text style={styles.cartHeader}>Giỏ hàng của bạn</Text>
      {cart.length === 0 ? (
        <View style={styles.cartEmpty}>
          <MaterialCommunityIcons name="cart-outline" size={60} color="#bbb" />
          <Text style={styles.cartEmptyText}>Không có sản phẩm</Text>
        </View>
      ) : (
        cart.map((item, idx) => (
          <View key={idx} style={styles.cartItemCard}>
            <Image source={{ uri: item.image }} style={styles.cartItemImage} />
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemPrice}>{(item.price * item.quantity).toLocaleString()} VNĐ</Text>
              <View style={styles.cartOptionsRow}>
                <FlatList
                  data={products.find(p => p.id === item.id)?.sizes || []}
                  horizontal
                  keyExtractor={s => s}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cartScroll}
                  renderItem={({ item: s }) => (
                    <TouchableOpacity
                      onPress={() => onUpdateOption(item.id, item.size, item.color, 'size', s)}
                      style={[styles.chip, item.size === s && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, item.size === s && styles.chipTextActive]}>{s}</Text>
                    </TouchableOpacity>
                  )}
                />
                <FlatList
                  data={products.find(p => p.id === item.id)?.colors || []}
                  horizontal
                  keyExtractor={c => c}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cartScroll}
                  renderItem={({ item: c }) => (
                    <TouchableOpacity
                      onPress={() => onUpdateOption(item.id, item.size, item.color, 'color', c)}
                      style={[styles.chip, item.color === c && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, item.color === c && styles.chipTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View style={styles.cartActionsRow}>
                <View style={styles.quantityBox}>
                  <TouchableOpacity onPress={() => onChangeQuantity(item.id, item.size, item.color, -1)}>
                    <Text style={styles.qtyBtn}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => onChangeQuantity(item.id, item.size, item.color, 1)}>
                    <Text style={styles.qtyBtn}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => onRemove(item.id, item.size, item.color)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={24} color={MD3_PALETTE.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
      {cart.length > 0 && (
        <View style={styles.cartTotalRow}>
          <Text style={styles.cartTotalText}>Tổng cộng:</Text>
          <Text style={styles.cartTotalAmount}>{total.toLocaleString()} VNĐ</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cartContainer: {
    backgroundColor: '#fafafa',
    padding: 16,
    marginTop: 16,
    borderRadius: 20,
    elevation: 4,
  },
  cartHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  cartEmpty: { alignItems: 'center', paddingVertical: 20 },
  cartEmptyText: { color: '#888', marginTop: 8, fontSize: 16 },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: MD3_PALETTE.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 1,
  },
  cartItemImage: { width: 80, height: 80 },
  cartItemInfo: { flex: 1, padding: 8, justifyContent: 'space-between' },
  cartItemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  cartItemPrice: { fontSize: 14, fontWeight: 'bold', color: MD3_PALETTE.primary, marginVertical: 4 },
  cartOptionsRow: { marginVertical: 4 },
  cartScroll: { marginVertical: 4 },
  chip: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: '#eee', marginRight: 8 },
  chipActive: { backgroundColor: MD3_PALETTE.primary },
  chipText: { fontSize: 12, color: '#555' },
  chipTextActive: { color: '#fff' },
  cartActionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  quantityBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 20, paddingHorizontal: 8 },
  qtyBtn: { fontSize: 18, color: MD3_PALETTE.primary, paddingHorizontal: 6 },
  qtyText: { fontSize: 14, marginHorizontal: 4 },
  cartTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderColor: '#ddd', marginTop: 8 },
  cartTotalText: { fontSize: 16, color: '#555' },
  cartTotalAmount: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});