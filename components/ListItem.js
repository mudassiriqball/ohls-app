import React from 'react'
import { List } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import theme from '../constants/theme'

export default function CustomListItem(props) {
    return (
        <List.Item
            style={styles.list}
            titleStyle={{
                fontSize: 13, margin: 0, padding: 0, color: 'gray'
            }}

            right={() => <AntDesign name={'right'} style={{ alignSelf: 'center', marginRight: 15 }} size={15} color={theme.COLORS.PRIMARY} />}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: theme.COLORS.WHITE,
        paddingBottom: 0,
        paddingTop: 0,
        margin: 0,
        marginVertical: 5,

        shadowColor: theme.COLORS.SHADOW,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        elevation: 2,
        borderRadius: 5,
    }
});