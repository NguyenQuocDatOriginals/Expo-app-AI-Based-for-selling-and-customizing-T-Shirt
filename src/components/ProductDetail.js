import { useMemo, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MD3_PALETTE = {
  primary: '#4A5FAE',
  onPrimary: '#FFFFFF',
  primaryContainer: '#DDE0FF',
  onPrimaryContainer: '#001945',
  secondaryContainer: '#DEE2F9',
  onSecondaryContainer: '#161B2C',
  background: '#FEFBFF',
  onBackground: '#1B1B1F',
  surface: '#FEFBFF',
  onSurface: '#1B1B1F',
  surfaceVariant: '#E3E2EC',
  onSurfaceVariant: '#46464F',
  outline: '#767680',
  success: '#286C2A',
  onSuccess: '#FFFFFF',
};

export default function ProductDetail({ product, onBack, cart, onAddOrUpdateCart }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const currentItem = useMemo(() => {
    return cart.find(item =>
      item.id === product.id &&
      item.size === selectedSize &&
      item.color === selectedColor
    );
  }, [cart, product.id, selectedSize, selectedColor]);

  useEffect(() => {
    setQuantity(currentItem ? currentItem.quantity : 1);
  }, [currentItem, selectedSize, selectedColor]);

  const updateQuantity = (delta) => {
    const newQty = Math.max(1, quantity + delta);
    setQuantity(newQty);
    if (currentItem) {
      onAddOrUpdateCart(
        { ...product, size: selectedSize, color: selectedColor },
        newQty
      );
    }
  };

  const handleAddToCart = () => {
    onAddOrUpdateCart(
      { ...product, size: selectedSize, color: selectedColor },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  
  const total = product.price * quantity;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={MD3_PALETTE.surface} />
      
      <View style={styles.appBar}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={MD3_PALETTE.onSurface} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle} numberOfLines={1}>{product.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kích cỡ</Text>
            <View style={styles.chipContainer}>
              {product.sizes.map(size => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[styles.chip, selectedSize === size && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedSize === size && styles.chipTextActive]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Màu sắc</Text>
            <View style={styles.chipContainer}>
              {product.colors.map(color => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[styles.chip, selectedColor === color && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedColor === color && styles.chipTextActive]}>
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            onPress={() => updateQuantity(-1)}
            disabled={quantity <= 1}
            style={styles.quantityButton}
          >
            <MaterialCommunityIcons
              name="minus"
              size={24}
              color={quantity <= 1 ? MD3_PALETTE.outline : MD3_PALETTE.primary}
            />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(1)}
            style={styles.quantityButton}
          >
            <MaterialCommunityIcons name="plus" size={24} color={MD3_PALETTE.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleAddToCart}
          style={[styles.addButton, added && { backgroundColor: MD3_PALETTE.success }]}
        >
          {added ? (
            <MaterialCommunityIcons name="check-bold" size={24} color={MD3_PALETTE.onSuccess} />
          ) : (
            <MaterialCommunityIcons name="cart-plus" size={24} color={MD3_PALETTE.onPrimary} />
          )}
          <Text style={styles.addButtonText}>
            {added ? 'Đã thêm' : `${total.toLocaleString()} VNĐ`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: MD3_PALETTE.surface },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
    backgroundColor: MD3_PALETTE.surface,
    borderBottomWidth: 1,
    borderBottomColor: MD3_PALETTE.surfaceVariant
  },
  iconButton: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: MD3_PALETTE.onSurface
  },
  placeholder: { width: 48 },
  imageContainer: {
    width: width,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MD3_PALETTE.surface,
    padding: 16
  },
  image: { width: '100%', height: '100%' },
  detailsContainer: { padding: 20 },
  category: {
    color: MD3_PALETTE.secondary,
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  name: {
    color: MD3_PALETTE.onSurface,
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: 12
  },
  description: {
    color: MD3_PALETTE.onSurfaceVariant,
    fontSize: 16,
    lineHeight: 24
  },
  section: { marginTop: 24 },
  sectionTitle: {
    color: MD3_PALETTE.onSurface,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  chip: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: MD3_PALETTE.surface,
    borderWidth: 1,
    borderColor: MD3_PALETTE.outline,
    borderRadius: 20
  },
  chipActive: {
    backgroundColor: MD3_PALETTE.primaryContainer,
    borderColor: MD3_PALETTE.primary
  },
  chipText: { color: MD3_PALETTE.onSurface, fontSize: 14, fontWeight: '500' },
  chipTextActive: { color: MD3_PALETTE.onPrimaryContainer, fontWeight: 'bold' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: MD3_PALETTE.surfaceVariant,
    backgroundColor: MD3_PALETTE.surface,
    gap: 16
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MD3_PALETTE.outline,
    borderRadius: 24
  },
  quantityButton: { padding: 10 },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MD3_PALETTE.onSurface,
    minWidth: 40,
    textAlign: 'center'
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    backgroundColor: MD3_PALETTE.primary,
    borderRadius: 26,
    gap: 12
  },
  addButtonText: { color: MD3_PALETTE.onPrimary, fontSize: 16, fontWeight: 'bold' }
});