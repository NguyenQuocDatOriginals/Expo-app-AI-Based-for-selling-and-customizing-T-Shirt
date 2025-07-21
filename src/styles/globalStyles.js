import { StyleSheet, Platform } from 'react-native';

// Use system fonts that are available across platforms
const getFontFamily = (weight = 'normal') => {
    if (Platform.OS === 'ios') {
        switch (weight) {
            case 'bold':
                return 'System';
            case '600':
                return 'System';
            default:
                return 'System';
        }
    } else {
        switch (weight) {
            case 'bold':
                return 'sans-serif-bold';
            case '600':
                return 'sans-serif-medium';
            default:
                return 'sans-serif';
        }
    }
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    text: {
        fontFamily: getFontFamily(),
        fontSize: 16,
    },
    heading: {
        fontFamily: getFontFamily('bold'),
        fontSize: 24,
        fontWeight: 'bold',
    },
    subheading: {
        fontFamily: getFontFamily('600'),
        fontSize: 18,
        fontWeight: '600',
    },
    caption: {
        fontFamily: getFontFamily(),
        fontSize: 14,
    },
    buttonText: {
        fontFamily: getFontFamily('600'),
        fontSize: 16,
        fontWeight: '600',
    },
});

export const fontFamily = {
    primary: getFontFamily(),
    bold: getFontFamily('bold'),
    medium: getFontFamily('600'),
}; 