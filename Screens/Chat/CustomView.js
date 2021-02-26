import {
    Image,
    Linking,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
// import apiConfig from '../../config/client.js';
import React, { Component } from 'react';
import { SystemMessage } from 'react-native-gifted-chat';
import * as FileSystem from 'expo-file-system';

export default class CustomView extends Component {
    renderPdf() {
        return (
            <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => this.handleDownload()}>
                <Image
                    style={{ marginHorizontal: 10, marginTop: 10, marginBottom: 5 }}
                    source={require('../../assets/images/pdf.jpg')}
                />
            </TouchableOpacity>
        );
    }

    async handleDownload() {
        // let remoteUrl = this.props.currentMessage.file;
        // let localPath = FileSystem.documentDirectory + this.props.currentMessage.name;

        // FileSystem.downloadAsync(remoteUrl, localPath)
        //     .then(res => {
        //         debugger
        //     });
        const fileUri = `${FileSystem.documentDirectory}${this.props.currentMessage.name}`;
        debugger
        const downloadedFile = await FileSystem.downloadAsync(JSON.parse(this.props.currentMessage.file), fileUri);
        debugger
        if (downloadedFile.status != 200) {
            handleError();
        }
    }

    render() {
        try {
            if (this.props.currentMessage.file &&
                this.props.currentMessage.name.split(".").reverse()[0].toLowerCase() !== 'jpg' &&
                this.props.currentMessage.name.split(".").reverse()[0].toLowerCase() !== 'png' &&
                this.props.currentMessage.name.split(".").reverse()[0].toLowerCase() !== 'jpeg'
            ) {
                return this.renderPdf();
            } else if (this.props.currentMessage.template && this.props.currentMessage.template != 'none') {
                return <SystemMessage />
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}

//

const styles = StyleSheet.create({
    container: {
    },
    mapView: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
    },
    image: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover'
    },
    webview: {
        flex: 1,
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
});