import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function ProductDetail({ product, onBack, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        size: selectedSize,
        color: selectedColor,
        quantity
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    Alert.alert('Đã thêm vào giỏ hàng!');
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Quay lại</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.imageBox}>
          <Image
            source={product.image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.price}>{product.price.toLocaleString()} VNĐ</Text>
          <Text style={[styles.stock, { color: product.stock > 0 ? '#388e3c' : '#e53935' }]}>
            {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
          </Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.optionsRow}>
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Kích cỡ:</Text>
              <View style={styles.optionsList}>
                {product.sizes?.map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.optionBtn,
                      selectedSize === size && styles.optionBtnActive
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={{ color: selectedSize === size ? '#fff' : '#512da8', fontWeight: 'bold' }}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Màu sắc:</Text>
              <View style={styles.optionsList}>
                {product.colors?.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.optionBtn,
                      selectedColor === color && styles.optionBtnActive
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text style={{ color: selectedColor === color ? '#fff' : '#512da8', fontWeight: 'bold' }}>{color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Số lượng:</Text>
            <TouchableOpacity
              style={[styles.qtyBtn, quantity === 1 && styles.qtyBtnDisabled]}
              onPress={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity === 1}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.qtyBtn, quantity === product.stock && styles.qtyBtnDisabled]}
              onPress={() => setQuantity(q => Math.min(q + 1, product.stock))}
              disabled={quantity === product.stock}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.addBtn,
              product.stock === 0 && styles.addBtnDisabled
            ]}
            disabled={product.stock === 0}
            onPress={handleAdd}
          >
            <Text style={styles.addBtnText}>
              {added ? '✔️ Đã thêm!' : '🛒 Thêm vào giỏ hàng'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbc2eb',
    paddingTop: 32,
  },
  backBtn: {
    marginLeft: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#7b1fa2',
    fontWeight: 'bold',
    fontSize: 20,
    textDecorationLine: 'underline',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  imageBox: {
    width: 320,
    height: 320,
    backgroundColor: '#f3e5f5',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#9575cd',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 24,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#9575cd',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 32,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4f2e91',
    marginBottom: 8,
    textAlign: 'center',
  },
  category: {
    color: '#7b1fa2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  price: {
    color: '#222',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  stock: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 18,
    lineHeight: 22,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 16,
  },
  optionGroup: {
    flex: 1,
    alignItems: 'center',
  },
  optionLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#512da8',
    fontSize: 15,
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    backgroundColor: '#fafafa',
    borderColor: '#ce93d8',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  optionBtnActive: {
    backgroundColor: '#7b1fa2',
    borderColor: '#7b1fa2',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'center',
    gap: 12,
  },
  qtyLabel: {
    fontWeight: 'bold',
    color: '#512da8',
    fontSize: 16,
    marginRight: 8,
  },
  qtyBtn: {
    backgroundColor: '#a1c4fd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  qtyBtnDisabled: {
    opacity: 0.5,
  },
  qtyBtnText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  qtyText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginHorizontal: 8,
  },
  addBtn: {
    backgroundColor: '#43e97b',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#43e97b',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});