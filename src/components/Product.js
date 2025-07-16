import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProductDetail from './ProductDetail';
import Cart from './Cart';

const MD3_PALETTE = {
  primary: '#4A5FAE',
  onPrimary: '#FFFFFF',
  secondary: '#595E72',
  background: '#FEFBFF',
  surface: '#FFFFFF',
  outline: '#DDE0FF',
  error: '#BA1A1A',
};

const API_BASE = 'https://6870e3e47ca4d06b34b88489.mockapi.io/api/';
const { width } = Dimensions.get('window');
const numColumns = 2;
const PADDING = 16;
const CARD_MARGIN = 8;
const INFO_HEIGHT = 80;
const cardWidth = (width - PADDING * 2 - CARD_MARGIN * (numColumns - 1)) / numColumns;
const cardHeight = cardWidth + INFO_HEIGHT;

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/admin_products`);
        if (!res.ok) throw new Error();
        setProducts(await res.json());
      } catch {
        Alert.alert('Lỗi', 'Không tải được sản phẩm.');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = products.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrUpdateCart = (prod, quantity = 1) => {
    const size = prod.size || prod.sizes[0];
    const color = prod.color || prod.colors[0];
    setCart(curr => {
      const i = curr.findIndex(c => c.id === prod.id && c.size === size && c.color === color);
      if (i >= 0) {
        const updated = [...curr];
        updated[i].quantity = quantity;
        return updated;
      }
      return [...curr, { ...prod, size, color, quantity }];
    });
  };

  const handleChangeQuantity = (id, size, color, delta) => {
    setCart(curr =>
      curr.map(c =>
        c.id === id && c.size === size && c.color === color
          ? { ...c, quantity: Math.max(1, c.quantity + delta) }
          : c
      )
    );
  };

  const handleRemove = (id, size, color) => {
    setCart(curr => curr.filter(c => !(c.id === id && c.size === size && c.color === color)));
  };

  const handleUpdateOption = (id, oldSize, oldColor, type, value) => {
    setCart(curr => {
      if (
        curr.some(
          c =>
            c.id === id &&
            (type === 'size'
              ? c.size === value && c.color === oldColor
              : c.color === value && c.size === oldSize)
        )
      ) {
        Alert.alert('Lỗi', 'Đã tồn tại sản phẩm với tùy chọn này');
        return curr;
      }
      return curr.map(c =>
        c.id === id && c.size === oldSize && c.color === oldColor
          ? { ...c, [type]: value }
          : c
      );
    });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={() => setSelectedProduct(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.cardPrice}>{item.price.toLocaleString()} VNĐ</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading)
    return (
      <ActivityIndicator style={styles.loader} size="large" color={MD3_PALETTE.primary} />
    );

  if (selectedProduct)
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        cart={cart}
        onAddOrUpdateCart={handleAddOrUpdateCart}
      />
    );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        numColumns={numColumns}
        renderItem={renderProduct}
        contentContainerStyle={styles.productsGrid}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListHeaderComponent={
          <View style={styles.headerSearch}>
            <Text style={styles.headerTitle}>Sản phẩm</Text>
            <View style={styles.searchBox}>
              <MaterialCommunityIcons name="magnify" size={24} color="#888" />
              <TextInput
                placeholder="Tìm kiếm danh mục, sản phẩm"
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>
        }
        ListFooterComponent={
          <Cart
            cart={cart}
            products={products}
            onChangeQuantity={handleChangeQuantity}
            onRemove={handleRemove}
            onUpdateOption={handleUpdateOption}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MD3_PALETTE.background },
  loader: { flex: 1, justifyContent: 'center' },
  headerSearch: { padding: PADDING },
  headerTitle: { marginTop: 50, fontSize: 28, fontWeight: 'bold', color: '#333' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 20,
    marginTop: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  productsGrid: { paddingHorizontal: PADDING, paddingBottom: PADDING },
  card: {
    backgroundColor: MD3_PALETTE.surface,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: CARD_MARGIN,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardImage: { width: '100%', height: cardWidth },
  cardInfo: { padding: 8, height: INFO_HEIGHT, justifyContent: 'space-between' },
  cardCategory: { fontSize: 12, color: MD3_PALETTE.secondary, textTransform: 'uppercase' },
  cardName: { fontSize: 14, fontWeight: '600', color: '#333' },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: MD3_PALETTE.primary },
});