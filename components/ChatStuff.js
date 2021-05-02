import React, { Component } from 'react';
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator, View, StyleSheet, Clipboard, Image, Text } from "react-native";
import { Bubble, MessageImage, Send, SystemMessage } from "react-native-gifted-chat";
import { Avatar } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import theme from "../constants/theme";
import { TouchableOpacity } from 'react-native-gesture-handler';

export const scrollToBottomComponent = () => {
  return (
    <View style={styles.bottomComponentContainer}>
      <Feather icon='chevron-down' size={36} color='red' />
    </View>
  );
}

export const renderLoading = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large' color='#6646ee' />
    </View>
  );
}

export const renderSystemMessage = (props, sender) => {
  try {
    if (props.currentMessage.file &&
      props.currentMessage.name.split(".").reverse()[0].toLowerCase() !== 'jpg' &&
      props.currentMessage.name.split(".").reverse()[0].toLowerCase() !== 'png' &&
      props.currentMessage.name.split(".").reverse()[0].toLowerCase() !== 'jpeg'
    ) {
      return renderPdf(props, sender);
    } else if (props.currentMessage.file &&
      (props.currentMessage.name.split(".").reverse()[0].toLowerCase() === 'jpg' ||
        props.currentMessage.name.split(".").reverse()[0].toLowerCase() === 'png' ||
        props.currentMessage.name.split(".").reverse()[0].toLowerCase() === 'jpeg')
    ) {
      return renderFileImage(props, sender, true);
    } else if (props.currentMessage.template && props.currentMessage.template != 'none') {
      return <SystemMessage />
    }
    return null;
  } catch (error) {
    return null;
  }
}

export const renderSend = (props, sendLoading) => {
  return (
    sendLoading ?
      <ActivityIndicator style={{ alignSelf: 'center', margin: 10 }} color={theme.COLORS.PRIMARY} />
      :
      <Send {...props}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 12 }}>Send</Text>
      </Send>
  )
}

export const renderAvatar = (props, sender, receiver) => {
  return (
    <Avatar.Image source={{ uri: receiver.avatar }} size={35} />
  );
}

export const renderPdf = (props, sender, receiver) => {
  return (
    <View >
      <Image
        style={{ borderRadius: 5, margin: 7, height: 150, width: 150, backgroundColor: 'black', overflow: 'hidden', resizeMode: 'stretch' }}
        source={props.currentMessage.name.split(".").reverse()[0].toLowerCase() === 'pdf' ? require('../assets/images/pdf.png') : require('../assets/images/file_icon.png')}
      />
      <View style={{ paddingHorizontal: 8 }}>
        <Text numberOfLines={2}
          style={{
            maxWidth: 143,
            color: props.currentMessage.user._id === sender._id ? theme.COLORS.WHITE : theme.COLORS.PRIMARY
          }}
        >{props.currentMessage.name}</Text>
      </View>
    </View>
  );
}

export const renderActions = (pickDocument, takePhoto) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
      <Ionicons name="document-attach-outline" onPress={pickDocument} size={25} style={{ marginRight: 7, marginLeft: 14 }} color={theme.COLORS.GRAY} />
      <MaterialIcons name="add-a-photo" onPress={takePhoto} size={25} style={{ marginHorizontal: 7 }} color={theme.COLORS.GRAY} />
    </View>
  );
}

export const renderBubble = props => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: theme.COLORS.PRIMARY },
      }}
    />
  );
}

export const renderMessageImage = (props, sender) => {
  return (
    <View style={{ flexDirection: 'column' }}>
      <MessageImage
        {...props}
        imageStyle={{ borderRadius: 5, margin: 7, height: 150, width: 150, backgroundColor: 'black', overflow: 'hidden' }}
        imageProps={{ uri: props.currentMessage.image }}
      />
      <View style={{ paddingHorizontal: 8 }}>
        <Text numberOfLines={2}
          style={{
            maxWidth: 143,
            color: props.currentMessage.user._id === sender._id ? theme.COLORS.WHITE : theme.COLORS.PRIMARY
          }}
        >{props.currentMessage.name}</Text>
      </View>
    </View>
  );
}

export const renderFileImage = (props, sender) => {
  return (
    <View style={{ flexDirection: 'column' }}>
      <Image
        source={{ uri: `data:image/png;base64,${props.currentMessage.file}` }}
        style={{ borderRadius: 5, margin: 7, height: 150, width: 150, backgroundColor: 'black', overflow: 'hidden' }}
      />
      <View style={{ paddingHorizontal: 8 }}>
        <Text numberOfLines={2}
          style={{
            maxWidth: 143,
            color: props.currentMessage.user._id === sender._id ? theme.COLORS.WHITE : theme.COLORS.PRIMARY
          }}
        >{props.currentMessage.name}</Text>
      </View>
    </View>
  );
}

export const onLongPress = (context, message, deleteMessage, downloadFile, downloadImage) => {
  try {
    if (message.text) {
      const options = [
        'Copy Text',
        'Delete Message',
        'Cancel',
      ];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
            case 1:
              deleteMessage(message);
              break;
          }
        });
    } else if (message.file &&
      message.name.split(".").reverse()[0].toLowerCase() !== 'jpg' &&
      message.name.split(".").reverse()[0].toLowerCase() !== 'png' &&
      message.name.split(".").reverse()[0].toLowerCase() !== 'jpeg'
    ) {
      const options = [
        'Download File',
        'Delete File',
        'Cancel',
      ];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              downloadFile(message);
              break;
            case 1:
              deleteMessage(message);
              break;
          }
        });
    } else {
      const options = [
        'Download Image',
        'Delete Image',
        'Cancel',
      ];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              downloadImage(message);
              break;
            case 1:
              deleteMessage(message);
              break;
          }
        });
    }
  } catch (err) {
    console.log('onPressError:', err);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
  },
  toolbarContainer: {
    backgroundColor: theme.COLORS.WHITE,
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})