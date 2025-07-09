import { useMemo, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const palette = {
  blue: '#2563eb',
  lightBlue: '#dbeafe',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  subtext: '#64748b',
  placeholder: '#9ca3af',
  green: '#16a34a',
};

export default function ProductDetail({ product, onBack, cart, setCart, onAddOrUpdateCart }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const currentItem = useMemo(() => {
    return cart.find(item =>
      item.id === product.id &&
      item.size === selectedSize &&
      item.color === selectedColor
    );
  }, [cart, product.id, selectedSize, selectedColor]);

  useEffect(() => {
    if (currentItem) {
      setQuantity(currentItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [currentItem]);

  const updateQuantity = (delta) => {
    const newQty = Math.max(1, quantity + delta);
    setQuantity(newQty);
    onAddOrUpdateCart({ ...product, size: selectedSize, color: selectedColor }, newQty);
  };

  const handleAddToCart = () => {
    onAddOrUpdateCart({ ...product, size: selectedSize, color: selectedColor }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={palette.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={26} color={palette.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.mainInfo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.name}>{product.name}</Text>
            </View>
            <Text style={styles.price}>{product.price.toLocaleString()} VNĐ</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kích cỡ</Text>
            <View style={styles.optionList}>
              {product.sizes.map(size => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[styles.optionBtn, selectedSize === size && styles.optionBtnActive]}
                >
                  <Text style={[styles.optionText, selectedSize === size && styles.optionTextActive]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Màu sắc</Text>
            <View style={styles.optionList}>
              {product.colors.map(color => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[styles.optionBtn, selectedColor === color && styles.optionBtnActive]}
                >
                  <Text style={[styles.optionText, selectedColor === color && styles.optionTextActive]}>{color}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActionBar}>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => updateQuantity(-1)} disabled={quantity <= 1} style={styles.quantityBtn}>
            <Feather name="minus" size={20} color={quantity <= 1 ? palette.placeholder : palette.blue} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(1)} style={styles.quantityBtn}>
            <Feather name="plus" size={20} color={palette.blue} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.8}
          onPress={handleAddToCart}
        >
          <LinearGradient
            colors={added ? ['#16a34a', '#22c55e'] : [palette.blue, '#3b82f6']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.addToCartButton}
          >
            <Text style={styles.addToCartText}>
              {added ? '✔️ Đã thêm' : 'Thêm vào giỏ hàng'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 12,
    backgroundColor: palette.background,
  },
  headerButton: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600',
    color: palette.text, marginRight: 44,
  },
  imageContainer: {
    width: width, height: width * 0.9,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: palette.card,
  },
  image: { width: '100%', height: '115%' },
  detailsContainer: {
    paddingHorizontal: 20, marginTop: -30,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    backgroundColor: palette.background,
    paddingTop: 20,
  },
  mainInfo: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  category: {
    fontSize: 16, color: palette.subtext, fontWeight: '500',
    marginBottom: 4, textTransform: 'uppercase',
  },
  name: {
    fontSize: 28, fontWeight: 'bold',
    color: palette.text, lineHeight: 36,
  },
  price: {
    fontSize: 24, fontWeight: 'bold', color: palette.blue,
    marginLeft: 10,
  },
  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 18, fontWeight: '600',
    color: palette.text, marginBottom: 12,
  },
  description: {
    fontSize: 16, color: palette.subtext, lineHeight: 24,
  },
  optionList: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },
  optionBtn: {
    backgroundColor: palette.card,
    borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10,
    marginRight: 10, marginBottom: 10,
  },
  optionBtnActive: {
    backgroundColor: palette.lightBlue,
    borderColor: palette.blue,
  },
  optionText: {
    color: palette.text, fontSize: 16, fontWeight: '500',
  },
  optionTextActive: {
    color: palette.blue, fontWeight: 'bold',
  },
  bottomActionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1, borderTopColor: '#e2e8f0',
    gap: 16,
  },
  quantityControl: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: palette.card, borderRadius: 18,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  quantityBtn: { padding: 12 },
  quantityText: {
    fontSize: 18, fontWeight: 'bold',
    color: palette.text, minWidth: 40, textAlign: 'center',
  },
  addToCartButton: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: 18, paddingVertical: 16,
  },
  addToCartText: {
    color: '#fff', fontSize: 18, fontWeight: 'bold',
  },
});