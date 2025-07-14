import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProductDetail from './ProductDetail';

const MD3_PALETTE = {
  primary: '#4A5FAE',
  onPrimary: '#FFFFFF',
  primaryContainer: '#DDE0FF',
  onPrimaryContainer: '#001945',
  secondary: '#595E72',
  secondaryContainer: '#DEE2F9',
  onSecondaryContainer: '#161B2C',
  error: '#BA1A1A',
  background: '#FEFBFF',
  onBackground: '#1B1B1F',
  surface: '#FEFBFF',
  onSurface: '#1B1B1F',
  surfaceVariant: '#E3E2EC',
  onSurfaceVariant: '#46464F',
  outline: '#767680',
};

const API_BASE = 'https://6870e3e47ca4d06b34b88489.mockapi.io/api/';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin_products`);
        if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Lỗi', 'Không tải được sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
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
      const exists = prev.find(item =>
        item.id === id &&
        (type === 'size'
          ? item.size === value && item.color === oldColor
          : item.size === oldSize && item.color === value)
      );
      if (exists) {
        Alert.alert('Lỗi', 'Sản phẩm với lựa chọn này đã có trong giỏ hàng.');
        return prev;
      }
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

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color={MD3_PALETTE.primary} />
      </View>
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        cart={cart}
        onAddOrUpdateCart={handleAddOrUpdateCart}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Sản phẩm</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color={MD3_PALETTE.onSurfaceVariant}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên, danh mục..."
          placeholderTextColor={MD3_PALETTE.onSurfaceVariant}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.productList}>
        {filtered.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.productCard}
            onPress={() => setSelectedProduct(item)}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString()} VNĐ</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.cartSection}>
        <Text style={styles.cartTitle}>Giỏ hàng của bạn</Text>
        {cart.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={48}
              color={MD3_PALETTE.outline}
            />
            <Text style={styles.emptyCartText}>Giỏ hàng đang trống</Text>
          </View>
        ) : (
          <>
            {cart.map(item => (
              <View
                key={`${item.id}-${item.size}-${item.color}`}
                style={styles.cartItem}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.cartItemImage}
                />
                <View style={styles.cartItemDetails}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>
                    {(item.price * item.quantity).toLocaleString()} VNĐ
                  </Text>

                  <View style={styles.optionsContainer}>
                    {products.find(p => p.id === item.id).sizes.map(size => (
                      <TouchableOpacity
                        key={size}
                        onPress={() =>
                          handleUpdateCartOption(item.id, item.size, item.color, 'size', size)
                        }
                        style={[
                          styles.chip,
                          item.size === size && styles.chipActive
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            item.size === size && styles.chipTextActive
                          ]}
                        >
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.optionsContainer}>
                    {products.find(p => p.id === item.id).colors.map(color => (
                      <TouchableOpacity
                        key={color}
                        onPress={() =>
                          handleUpdateCartOption(item.id, item.size, item.color, 'color', color)
                        }
                        style={[
                          styles.chip,
                          item.color === color && styles.chipActive
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            item.color === color && styles.chipTextActive
                          ]}
                        >
                          {color}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.cartItemActions}>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        onPress={() =>
                          handleChangeQuantity(item.id, item.size, item.color, -1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <MaterialCommunityIcons
                          name="minus"
                          size={20}
                          color={MD3_PALETTE.primary}
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleChangeQuantity(item.id, item.size, item.color, 1)
                        }
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={20}
                          color={MD3_PALETTE.primary}
                        />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        handleRemoveFromCart(item.id, item.size, item.color)
                      }
                      style={styles.deleteButton}
                    >
                      <MaterialCommunityIcons
                        name="delete-outline"
                        size={24}
                        color={MD3_PALETTE.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{total.toLocaleString()} VNĐ</Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MD3_PALETTE.background },
  contentContainer: { paddingBottom: 32 },
  header: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: MD3_PALETTE.onBackground },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MD3_PALETTE.surfaceVariant,
    borderRadius: 28,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    marginVertical: 8
  },
  searchIcon: { marginRight: 12 },
  searchInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: MD3_PALETTE.onSurfaceVariant
  },
  productList: { paddingHorizontal: 16, marginTop: 16 },
  productCard: {
    flexDirection: 'row',
    backgroundColor: MD3_PALETTE.surface,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: MD3_PALETTE.outline
  },
  productImage: { width: 100, height: 100, resizeMode: 'cover' },
  productInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  productCategory: {
    fontSize: 12,
    color: MD3_PALETTE.secondary,
    textTransform: 'uppercase'
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: MD3_PALETTE.onSurface,
    marginVertical: 2
  },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: MD3_PALETTE.primary, marginTop: 4 },
  divider: { height: 8, backgroundColor: MD3_PALETTE.surfaceVariant, marginVertical: 24 },
  cartSection: { paddingHorizontal: 16 },
  cartTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: MD3_PALETTE.onBackground,
    marginBottom: 16
  },
  emptyCartContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  emptyCartText: { marginTop: 16, fontSize: 16, color: MD3_PALETTE.onSurfaceVariant },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: MD3_PALETTE.surface,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 1
  },
  cartItemImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: MD3_PALETTE.surfaceVariant
  },
  cartItemDetails: { flex: 1 },
  cartItemName: { fontSize: 16, fontWeight: '600', color: MD3_PALETTE.onSurface },
  cartItemPrice: { fontSize: 14, fontWeight: 'bold', color: MD3_PALETTE.primary, marginVertical: 4 },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: MD3_PALETTE.secondaryContainer,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8
  },
  chipActive: { backgroundColor: MD3_PALETTE.primary },
  chipText: { color: MD3_PALETTE.onSecondaryContainer, fontWeight: '500' },
  chipTextActive: { color: MD3_PALETTE.onPrimary, fontWeight: 'bold' },
  cartItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MD3_PALETTE.primaryContainer,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MD3_PALETTE.onPrimaryContainer,
    marginHorizontal: 16
  },
  deleteButton: {},
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: MD3_PALETTE.outline,
    marginTop: 16,
    paddingTop: 16
  },
  totalLabel: { fontSize: 18, fontWeight: '500', color: MD3_PALETTE.onSurfaceVariant },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: MD3_PALETTE.onSurface }
});