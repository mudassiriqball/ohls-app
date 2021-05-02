import React, { useState, useEffect, useRef } from "react";
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { Image, Modal, StyleSheet, View, Text } from "react-native";
import axios from "axios";

import theme from "../../constants/theme";
import { Button, EasyToast } from '../../components';
import urls from "../../utils/urls";

import { MaterialIcons } from "@expo/vector-icons";
import Layout from "../../constants/theme/Layout";
import { getBearerTokenFromStorage } from "../../utils/auth";

const ImageModal = props => {
  const { visible, token, user, getUser, onHide } = props;

  // Image
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  // EasyToast
  const toastRef = useRef();
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert('Sorry', 'we need camera roll permissions to make this work!');
      }
    }
  };

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        base64: true
      });
      if (!result.cancelled) {
        setFile(`data:image/jpg;base64,${result.base64}`);
        setImage(result.uri);
        setImgPreview(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };
  const _takePhoto = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        mediaTypes: 'Images',
        quality: 1,
        base64: true
      });
      if (!result.cancelled) {
        setFile(`data:image/jpg;base64,${result.base64}`);
        setImage(result.uri);
        setImgPreview(result.uri);
      }
    }
  };

  const handleImgUpload = async () => {
    let _token = await getBearerTokenFromStorage();
    setIsLoading(true)
    let secure_url = '';
    let uploaded = false;
    let data = {
      "file": file,
      "upload_preset": "ml_default",
    }
    await fetch('https://api.cloudinary.com/v1_1/dsexrbwj1/image/upload', {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then(async res => {
      let data = await res.json()
      secure_url = data.url;
      uploaded = true
    }).catch(err => {
      setToastType('err');
      toastRef && toastRef.current && toastRef.current.show('Fix errors firts !', 500, () => {});
      setIsLoading(false);
    })
    if (uploaded) {
      await axios.put(urls.UPLOAD_AVATAR + user._id, { avatar: secure_url }, {
        headers: {
          'authorization': _token,
        }
      }).then((res) => {
        setIsLoading(false);
        getUser();
        setToastType('success');
        toastRef && toastRef.current && toastRef.current.show('Profile Image Updated Successfully', 500, () => {
          onHide();
          setImage(null);
          setFile(null);
        });
      }).catch((err) => {
        setIsLoading(false);
        console.log('error:', err);
        setToastType('err');
        toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => {});
      });
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <EasyToast
            toastRef={toastRef}
            type={toastType}
            position={'top'}
          />
          <MaterialIcons style={styles.closeBtn} onPress={onHide} name="cancel" size={30} color={theme.COLORS.GRAY} />
          {image == null ?
            <View style={styles.btnContainer}>
              <Button
                title={'Galary'}
                width='45%'
                mode={'contained'}
                icon='image'
                small
                onPress={() => _pickImage()}
              />
              <Button
                title={'Camera'}
                width='45%'
                mode={'contained'}
                small
                icon='camera'
                onPress={() => _takePhoto()}
              />
            </View>
            :
            <View style={{ marginTop: 20 }} style={{ flexDirection: "column", width: '100%' }}>
              <Image
                source={{ uri: imgPreview }}
                style={{
                  width: 124,
                  height: 124,
                  borderRadius: 62,
                  borderWidth: 0,
                  marginBottom: 10,
                  alignSelf: "center"
                }}
              />
              <View style={styles.btnContainer}>
                <Button
                  title={'Retake'}
                  mode={'contained'}
                  disabled={isLoading}
                  width='45%'
                  small
                  icon='upload'
                  onPress={() => { setImage(null), setImgPreview(null) }}
                />
                <Button
                  title={'Upload'}
                  mode={'contained'}
                  small
                  width='45%'
                  icon='upload'
                  disabled={isLoading}
                  loading={isLoading}
                  onPress={() => handleImgUpload()}
                />
              </View>
            </View>
          }
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: `rgba(0,0,0,${theme.MODEL_OPACITY})`,
    alignItems: "center",
    height: Layout.window.height,
    justifyContent: "center"
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: "90%",
    maxWidth: "90%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
  closeBtn: {
    position: "absolute",
    right: 5,
    top: 5,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
    marginTop: 20,
  }
});

export default ImageModal;
