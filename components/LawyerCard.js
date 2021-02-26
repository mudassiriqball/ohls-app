import React from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Button } from '.';
import theme from '../constants/theme';

const LawyerCard = props => {
    const { item, navigation } = props;
    return (
        <TouchableOpacity style={styles.touchableOpacity}>
            <View style={{ padding: 0, margin: 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Avatar.Image size={100}
                        source={item.avatar !== '' ? { uri: item.avatar } : require('../assets/images/avatar.jpg')}
                    />
                    <View style={{ marginRight: 'auto', marginLeft: 'auto' }}>
                        <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold' }]} numberOfLines={1}>{item.fullName}</Text>
                        <Text style={styles.text} numberOfLines={1}>{item.city}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.text} numberOfLines={1}>{'Reviews '}{item.reviews && item.reviews.length || '0'}</Text>
                    <Button
                        title={'View Profile'}
                        uppercase={false}
                        small
                        onRight
                        onPress={() => props.navigation.navigate('ViewLawyerProfile', { lawyer: item })}
                    />
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    touchableOpacity: {
        overflow: 'hidden',
        padding: 10,
        borderRadius: 3,
        marginTop: 20,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: theme.COLORS.WHITE,
        shadowOffset: { width: 4, height: 4 },
        elevation: 3,
        shadowRadius: 3
    },
    text: {
        color: theme.COLORS.LIGHT_BLACK
    },
})


export default LawyerCard
