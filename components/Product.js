import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import ProductDetail from '../components/ProductDetail';

const demoProducts = [
  {
    id: 1,
    name: 'T-Shirt Basic',
    price: 150000,
    category: 'Áo thun',
    image: require('../assets/img/tshirt-basic.png'),
    description: 'Cotton 100%, thoáng mát, thiết kế tối giản.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng', 'Đen', 'Xanh']
  },
  {
    id: 2,
    name: 'T-Shirt Premium',
    price: 250000,
    category: 'Áo thun',
    image: require('../assets/img/tshirt-premium.png'),
    description: 'Chất liệu cao cấp, co giãn tốt, bền đẹp.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng', 'Đen']
  },
  {
    id: 3,
    name: 'Hoodie',
    price: 350000,
    category: 'Áo khoác',
    image: require('../assets/img/hoodie.png'),
    description: 'Dày dặn, giữ ấm, phong cách streetwear.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Đen', 'Xám']
  },
  {
    id: 4,
    name: 'Sweater',
    price: 320000,
    category: 'Áo khoác',
    image: require('../assets/img/sweater.png'),
    description: 'Chất liệu len cao cấp, mềm mại, giữ nhiệt tốt trong thời tiết lạnh.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Xám', 'Xanh navy', 'Nâu']
  }
];

export default function Product() {
  const [products] = useState(demoProducts);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrUpdateCart = (product, quantity = 1) => {
    const size = product.size || product.sizes[0];
    const color = product.color || product.colors[0];

    setCart(prev => {
      const index = prev.findIndex(item =>
        item.id === product.id && item.size === size && item.color === color
      );

      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity = quantity;
        return updated;
      }

      return [...prev, { ...product, size, color, quantity }];
    });
  };

  const handleChangeQuantity = (id, size, color, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (id, size, color) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () =>
            setCart(prev =>
              prev.filter(item => !(item.id === id && item.size === size && item.color === color))
            )
        }
      ]
    );
  };

  const handleUpdateCartOption = (id, oldSize, oldColor, type, value) => {
    setCart(prev => {
      const idx = prev.findIndex(item =>
        item.id === id && item.size === oldSize && item.color === oldColor
      );
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx][type] = value;
      return updated;
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        cart={cart}
        setCart={setCart}
        onAddOrUpdateCart={handleAddOrUpdateCart}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🛍️ Sản phẩm nổi bật</Text>
      <TextInput
        style={styles.search}
        placeholder="Tìm kiếm sản phẩm..."
        placeholderTextColor="#7A7A7A"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelectedProduct(item)}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()} VNĐ</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.cartTitle}>🛒 Giỏ hàng của bạn</Text>
      <View style={styles.cartBox}>
        {cart.length === 0 ? (
          <Text style={styles.emptyCart}>Chưa có sản phẩm nào trong giỏ.</Text>
        ) : (
          cart.map(item => (
            <View key={`${item.id}-${item.size}-${item.color}`} style={styles.cartItem}>
              <Image source={item.image} style={styles.cartImage} />
              <View style={styles.cartInfo}>
                <Text style={styles.cartName}>{item.name}</Text>
                <View style={styles.optionRow}>
                  <Text style={styles.cartLabel}>Size:</Text>
                  <ScrollView horizontal>
                    {products.find(p => p.id === item.id).sizes.map(size => (
                      <TouchableOpacity
                        key={size}
                        onPress={() => handleUpdateCartOption(item.id, item.size, item.color, 'size', size)}
                        style={[styles.optionBtn, item.size === size && styles.optionActive]}
                      >
                        <Text style={[styles.optionText, item.size === size && styles.optionTextActive]}>{size}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.optionRow}>
                  <Text style={styles.cartLabel}>Màu:</Text>
                  <ScrollView horizontal>
                    {products.find(p => p.id === item.id).colors.map(color => (
                      <TouchableOpacity
                        key={color}
                        onPress={() => handleUpdateCartOption(item.id, item.size, item.color, 'color', color)}
                        style={[styles.colorBtn, item.color === color && styles.colorActive]}
                      >
                        <Text style={[styles.optionText, item.color === color && styles.optionTextActive]}>{color}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.qtyRow}>
                  <TouchableOpacity onPress={() => handleChangeQuantity(item.id, item.size, item.color, -1)} disabled={item.quantity === 1} style={styles.qtyBtn}>
                    <Text style={styles.qtyTextBtn}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyCount}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => handleChangeQuantity(item.id, item.size, item.color, 1)} disabled={item.quantity === item.stock} style={styles.qtyBtn}>
                    <Text style={styles.qtyTextBtn}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cartPrice}>{(item.price * item.quantity).toLocaleString()} VNĐ</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveFromCart(item.id, item.size, item.color)} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        {cart.length > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()} VNĐ</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: '700', textAlign: 'center', color: '#0288D1', marginTop: 24 },
  search: { backgroundColor: '#F1F8FF', margin: 16, borderRadius: 30, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16, shadowColor: '#0288D1', shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  listContainer: { paddingLeft: 16 },
  card: { backgroundColor: '#E3F2FD', borderRadius: 20, margin: 8, marginLeft: 16, marginRight: 16, width: 200, overflow: 'hidden', shadowColor: '#0288D1', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  image: { width: '100%', height: 200 },
  info: { padding: 12 },
  name: { fontSize: 18, fontWeight: '600', color: '#0277BD' },
  category: { fontSize: 14, color: '#039BE5', marginVertical: 4 },
  price: { fontSize: 16, fontWeight: '700', color: '#01579B' },
  empty: { textAlign: 'center', color: '#81D4FA', marginTop: 24 },

  cartTitle: { fontSize: 28, fontWeight: '700', textAlign: 'center', color: '#0288D1', marginVertical: 24 },
  cartBox: { marginHorizontal: 16, backgroundColor: '#F1FAFF', borderRadius: 20, padding: 16, shadowColor: '#0288D1', shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  emptyCart: { textAlign: 'center', color: '#90CAF9', fontSize: 16, paddingVertical: 32 },
  cartItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  cartImage: { width: 60, height: 60, borderRadius: 12, marginTop: 4 },
  cartInfo: { flex: 1, marginLeft: 12 },
  cartName: { fontSize: 16, fontWeight: '600', color: '#01579B' },
  cartLabel: { fontSize: 14, fontWeight: '600', color: '#0277BD', marginRight: 8 },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  optionBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#E1F5FE', borderRadius: 10, marginRight: 8, borderWidth: 1, borderColor: '#81D4FA' },
  optionActive: { backgroundColor: '#0288D1', borderColor: '#0288D1' },
  optionText: { fontSize: 14, color: '#01579B' },
  optionTextActive: { color: '#FFFFFF' },
  colorBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#E1F5FE', borderRadius: 10, marginRight: 8, borderWidth: 1, borderColor: '#81D4FA' },
  colorActive: { backgroundColor: '#0288D1', borderColor: '#0288D1' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#81D4FA', borderRadius: 8 },
  qtyTextBtn: { fontSize: 16, fontWeight: '700', color: '#01579B' },
  qtyCount: { fontSize: 16, fontWeight: '700', color: '#01579B', marginHorizontal: 12 },
  cartPrice: { fontSize: 14, color: '#0277BD', marginTop: 4 },
  deleteBtn: { marginLeft: 12, alignSelf: 'center', backgroundColor: '#FF5252', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  deleteText: { color: '#FFFFFF', fontWeight: '700' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, borderTopWidth: 1, borderTopColor: '#B3E5FC', paddingTop: 12 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#01579B' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#0288D1' },
});