import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper';
import theme from '../../constants/theme';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageModal } from '../../components';

export default function Settings(props) {
  const { user, isLogged, navigation, getUser } = props;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {modalVisible && (
        <ImageModal
          visible={modalVisible}
          onHide={() => setModalVisible(false)}
          getUser={getUser}
          {...props}
        />
      )}
      <View style={styles.avatarContainer}>
        <View style={{ marginRight: 20 }}>
          {user && user.avatar ?
            <Avatar.Image size={80} source={{ uri: user.avatar }} />
            :
            <Image
              source={require('../../assets/images/avatar.jpg')}
              style={styles.avatar}
            />
          }
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, color: theme.COLORS.WHITE, fontWeight: 'bold' }}>{user && user.fullName}</Text>
          <Text style={{ fontSize: 13, color: theme.COLORS.WHITE, fontWeight: 'bold' }}>{user && user.username}</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.uploadAvatar}>
          <MaterialCommunityIcons name="camera-plus-outline" size={25} color={theme.COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>

      <View style={styles.body_container}>
        <View style={styles.account}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.heading}>{'Account'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('UpdateProfile')}>
              <Text style={{ color: theme.COLORS.LINK }}>Update</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.smallText}>{'Mobile'}</Text>
            <Text style={styles.text}>{user.mobile}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.smallText}>{'Gender'}</Text>
            <Text style={styles.text}>{user.gender}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.smallText}>{'City'}</Text>
            <Text style={styles.text}>{user.city}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.smallText}>{'Address'}</Text>
            <Text style={styles.text}>{user.address}</Text>
          </View>
        </View>
        <View style={{ height: 20 }} />

        <Text style={styles.heading}>{'Other'}</Text>
        {user && user.role === 'lawyer' &&
          <TouchableOpacity onPress={() => navigation.navigate('MyHandledCases', { data: user && user._id })} style={styles.linkContainer}>
            <MaterialIcons name="assignment-turned-in" style={styles.icon} size={25} color={theme.COLORS.GRAY} />
            <View style={styles.linkTextContainer}>
              <Text style={styles.text}>{'Handled Cases'}</Text>
              <AntDesign name={'right'} style={styles.icon} size={15} color={theme.COLORS.GRAY} />
            </View>
          </TouchableOpacity>
        }
        {user && user.role === 'lawyer' &&
          <TouchableOpacity onPress={() => navigation.navigate('MyPortfolio')} style={styles.linkContainer}>
            <AntDesign name={'user'} style={styles.icon} size={25} color={theme.COLORS.GRAY} />
            <View style={styles.linkTextContainer}>
              <Text style={styles.text}>{'My Portfolio'}</Text>
              <AntDesign name={'right'} style={styles.icon} size={15} color={theme.COLORS.GRAY} />
            </View>
          </TouchableOpacity>
        }
        <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')} style={styles.linkContainer}>
          <AntDesign name={'lock'} style={styles.icon} size={25} color={theme.COLORS.GRAY} />
          <View style={styles.linkTextContainer}>
            <Text style={styles.text}>{'Change Password'}</Text>
            <AntDesign name={'right'} style={styles.icon} size={15} color={theme.COLORS.GRAY} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView >
  )
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.COLORS.WHITE,
  },
  avatarContainer: {
    padding: theme.SIZES.BASE * 2,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: theme.COLORS.PRIMARY,
    overflow: 'visible',
  },
  uploadAvatar: {
    position: 'absolute',
    bottom: -25,
    right: 20,
    backgroundColor: theme.COLORS.SECONDARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    shadowColor: theme.COLORS.GRAY,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  body_container: {
    flex: 1,
    padding: theme.SIZES.BASE * 2,
  },
  // Account
  account: {
    paddingVertical: 20
  },
  heading: {
    color: theme.COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold'
  },
  textContainer: {
    borderBottomColor: theme.COLORS.SHADOW,
    borderBottomWidth: 1,
    paddingVertical: 10,
    flex: 1
  },
  smallText: {
    fontSize: 12,
    color: theme.COLORS.GRAY
  },
  text: {
    fontSize: 16,
    color: theme.COLORS.GRAY
  },

  // Links
  linkContainer: {
    flexDirection: 'row'
  },
  linkTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: theme.COLORS.SHADOW,
    borderBottomWidth: 1,
    paddingVertical: 20,
    flex: 1
  },

  list: {
    backgroundColor: theme.COLORS.SECONDARY,
    marginVertical: 5,
    paddingVertical: 13,
    justifyContent: 'center',
    shadowColor: theme.COLORS.GRAY,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 3,
    borderRadius: 5,
  },
  icon: {
    display: 'flex',
    alignSelf: 'center',
    marginRight: 10
  },
})

