import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import ProductDetail from '../components/ProductDetail';

const demoProducts = [
  { 
    id: 1, 
    name: 'T-Shirt Basic', 
    price: 150000, 
    stock: 20, 
    category: 'Áo thun', 
    image: require('../assets/img/tshirt-basic.png'),
    description: 'Áo thun chất liệu cotton 100%, thoáng mát, phù hợp cho mọi hoạt động thường ngày. Thiết kế đơn giản, dễ phối đồ.', 
    sizes: ['S', 'M', 'L', 'XL'], 
    colors: ['Trắng', 'Đen', 'Xanh'] 
  },
  { 
    id: 2, 
    name: 'T-Shirt Premium', 
    price: 250000, 
    stock: 10, 
    category: 'Áo thun', 
    image: require('../assets/img/tshirt-premium.png'),
    description: 'Áo thun cao cấp, mềm mại, co giãn tốt, bền màu.', 
    sizes: ['S', 'M', 'L', 'XL'], 
    colors: ['Trắng', 'Đen'] 
  },
  { 
    id: 3, 
    name: 'Hoodie', 
    price: 350000, 
    stock: 5, 
    category: 'Áo khoác', 
    image: require('../assets/img/hoodie.png'),
    description: 'Hoodie dày dặn, giữ ấm tốt, phong cách trẻ trung.', 
    sizes: ['M', 'L', 'XL'], 
    colors: ['Đen', 'Xám'] 
  },
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

  const handleAddToCart = (product) => {
    setCart(prev => {
      const size = product.size || (product.sizes ? product.sizes[0] : '');
      const color = product.color || (product.colors ? product.colors[0] : '');
      const found = prev.find(
        item => item.id === product.id && item.size === size && item.color === color
      );
      if (found) {
        return prev.map(item =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, size, color, quantity: 1 }];
    });
  };

  const handleChangeQuantity = (id, size, color, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, Math.min(item.quantity + delta, item.stock)) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (id, size, color) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size && item.color === color)));
  };

  const handleUpdateCartOption = (id, oldSize, oldColor, optionType, value) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === id && item.size === oldSize && item.color === oldColor);
      if (idx === -1) return prev;
      const item = prev[idx];
      const newOption = { ...item, [optionType]: value };
      const existIdx = prev.findIndex(
        i => i.id === id && i.size === (optionType === 'size' ? value : oldSize) && i.color === (optionType === 'color' ? value : oldColor)
      );
      if (existIdx !== -1 && existIdx !== idx) {
        const merged = { ...prev[existIdx], quantity: prev[existIdx].quantity + item.quantity };
        return prev.filter((_, i) => i !== idx && i !== existIdx).concat(merged);
      }
      return prev.map((it, i) => i === idx ? newOption : it);
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🛍️ Sản phẩm nổi bật</Text>
      <TextInput
        style={styles.search}
        placeholder="🔍 Tìm kiếm sản phẩm"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => setSelectedProduct(item)}
          >
            <Image
              source={item.image}
              style={styles.productImage}
              resizeMode="cover"
            />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>
            <Text style={styles.productPrice}>{item.price.toLocaleString()} VNĐ</Text>
            <Text style={[styles.productStock, { color: item.stock > 0 ? '#388e3c' : '#e53935' }]}>
              {item.stock > 0 ? `Còn ${item.stock} sản phẩm` : 'Hết hàng'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.notFound}>Không tìm thấy sản phẩm phù hợp.</Text>
        }
      />
      <Text style={styles.cartTitle}>🛒 Giỏ hàng của bạn</Text>
      <View style={styles.cartBox}>
        {cart.length === 0 ? (
          <Text style={styles.cartEmpty}>Giỏ hàng trống.</Text>
        ) : (
          cart.map(item => {
            const productOrigin = products.find(p => p.id === item.id);
            return (
              <View key={item.id + (item.size || '') + (item.color || '')} style={styles.cartItem}>
                <Image source={item.image} style={styles.cartImage} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.cartName}>{item.name}</Text>
                  <Text style={styles.cartCategory}>{item.category}</Text>
                  <View style={styles.row}>
                    <Text style={styles.cartLabel}>Kích cỡ:</Text>
                    <ScrollView horizontal>
                      {productOrigin?.sizes?.map(size => (
                        <TouchableOpacity
                          key={size}
                          style={[
                            styles.optionBtn,
                            item.size === size && styles.optionBtnActive
                          ]}
                          onPress={() => handleUpdateCartOption(item.id, item.size, item.color, 'size', size)}
                        >
                          <Text style={{ color: item.size === size ? '#fff' : '#222' }}>{size}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cartLabel}>Màu sắc:</Text>
                    <ScrollView horizontal>
                      {productOrigin?.colors?.map(color => (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.optionBtn,
                            item.color === color && styles.optionBtnActive
                          ]}
                          onPress={() => handleUpdateCartOption(item.id, item.size, item.color, 'color', color)}
                        >
                          <Text style={{ color: item.color === color ? '#fff' : '#222' }}>{color}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cartLabel}>Số lượng:</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => handleChangeQuantity(item.id, item.size, item.color, -1)}
                      disabled={item.quantity === 1}
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => handleChangeQuantity(item.id, item.size, item.color, 1)}
                      disabled={item.quantity === item.stock}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cartPrice}>
                    {(item.price * item.quantity).toLocaleString()} VNĐ
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleRemoveFromCart(item.id, item.size, item.color)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Xóa</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
        {cart.length > 0 && (
          <View style={styles.cartTotalRow}>
            <Text style={styles.cartTotalLabel}>Tổng cộng:</Text>
            <Text style={styles.cartTotal}>{total.toLocaleString()} VNĐ</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbc2eb' },
  title: {
    fontSize: 32, fontWeight: 'bold', color: '#3a2066',
    marginTop: 32, marginBottom: 16, textAlign: 'center'
  },
  search: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16,
    fontSize: 18, marginHorizontal: 24, marginBottom: 16
  },
  productCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 18,
    marginHorizontal: 12, alignItems: 'center', width: 220,
    shadowColor: '#9575cd', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4
  },
  productImage: { width: 120, height: 120, borderRadius: 18, marginBottom: 10 },
  productName: { fontWeight: 'bold', fontSize: 20, color: '#512da8', marginBottom: 2 },
  productCategory: { color: '#7b1fa2', fontSize: 14, marginBottom: 2 },
  productPrice: { color: '#222', fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  productStock: { fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  notFound: { color: '#b39ddb', fontStyle: 'italic', fontSize: 18, marginTop: 30, textAlign: 'center' },
  cartTitle: {
    fontSize: 26, color: '#7b1fa2', fontWeight: 'bold',
    marginTop: 32, marginBottom: 10, textAlign: 'center'
  },
  cartBox: {
    backgroundColor: '#fff', borderRadius: 18, margin: 16, padding: 16,
    shadowColor: '#9575cd', shadowOpacity: 0.12, shadowRadius: 8, elevation: 2
  },
  cartEmpty: { color: '#b39ddb', fontStyle: 'italic', fontSize: 16, textAlign: 'center' },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 18,
    borderBottomWidth: 1, borderBottomColor: '#e1bee7', paddingBottom: 10
  },
  cartImage: { width: 60, height: 60, borderRadius: 12 },
  cartName: { fontWeight: 'bold', fontSize: 16, color: '#512da8' },
  cartCategory: { color: '#7b1fa2', fontSize: 13 },
  cartLabel: { fontWeight: 'bold', marginRight: 8, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  optionBtn: {
    borderWidth: 1, borderColor: '#ce93d8', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, backgroundColor: '#fafafa'
  },
  optionBtnActive: { backgroundColor: '#7b1fa2', borderColor: '#7b1fa2' },
  qtyBtn: {
    backgroundColor: '#a1c4fd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 2, marginHorizontal: 4
  },
  qtyBtnText: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  qtyText: { fontWeight: 'bold', fontSize: 16, marginHorizontal: 6 },
  cartPrice: { color: '#388e3c', fontWeight: 'bold', marginTop: 6 },
  deleteBtn: {
    backgroundColor: '#f857a6', borderRadius: 10, padding: 8, marginLeft: 8,
    alignSelf: 'flex-start'
  },
  cartTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  cartTotalLabel: { fontWeight: 'bold', fontSize: 18, color: '#7b1fa2' },
  cartTotal: { fontWeight: 'bold', fontSize: 18, color: '#388e3c' }
});