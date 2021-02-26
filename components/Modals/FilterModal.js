import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, View, Text } from "react-native";

import theme from "../../constants/theme";
import { Button } from '..';

import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Layout from "../../constants/theme/Layout";
import { Checkbox, List } from "react-native-paper";

const FilterModal = props => {
    const { visible, onHide, setField, value } = props;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setField('city')}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>{''}</Text>
                    <Text style={{ fontSize: 16, textAlign: "center", borderBottomColor: 'lightgray', borderBottomWidth: 1, paddingBottom: 15 }}>Search By</Text>
                    <View style={styles.btnContainer}>
                        <List.Item
                            onPress={() => setField('username')}
                            style={styles.list}
                            titleStyle={styles.listTxt}
                            title={'Email'}
                            left={() => <AntDesign name={'mail'} style={styles.left_icon} size={20} color={theme.COLORS.PRIMARY} />}
                            right={() => <Checkbox color={theme.COLORS.PRIMARY} status={value === 'username' ? 'checked' : 'unchecked'} onPress={() => setField('username')} />}
                        />
                        <List.Item
                            onPress={() => setField('fullName')}
                            style={styles.list}
                            titleStyle={styles.listTxt}
                            title={'Full Name'}
                            left={() => <AntDesign name={'user'} style={styles.left_icon} size={20} color={theme.COLORS.PRIMARY} />}
                            right={() => <Checkbox color={theme.COLORS.PRIMARY} status={value === 'fullName' ? 'checked' : 'unchecked'} onPress={() => setField('fullName')} />}
                        />
                        <List.Item
                            onPress={() => setField('city')}
                            style={styles.list}
                            titleStyle={styles.listTxt}
                            title={'City'}
                            left={() => <MaterialCommunityIcons name={'home-city-outline'} style={styles.left_icon} size={20} color={theme.COLORS.PRIMARY} />}
                            right={() => <Checkbox color={theme.COLORS.PRIMARY} status={value === 'city' ? 'checked' : 'unchecked'} onPress={() => setField('city')} />}
                        />
                        <View style={{ height: 20 }} />
                        <Button
                            title={'Close'}
                            mode={'contained'}
                            onPress={onHide}
                            color={theme.COLORS.RED}
                            icon='close'
                            small
                            onRight
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        backgroundColor: `rgba(0,0,0,${theme.MODEL_OPACITY})`,
        height: Layout.window.height,
    },
    modalView: {
        marginTop: 'auto',
        backgroundColor: "white",
    },
    btnContainer: {
        margin: 20
    },
    list: {
        borderRadius: 5,
        borderBottomColor: theme.COLORS.SHADOW,
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    listTxt: {
        fontSize: 14,
        color: 'gray',
    },
    left_icon: {
        display: 'flex',
        alignItems: 'center',
        marginVertical: 15,
        marginRight: 15
    },
});

export default FilterModal;
