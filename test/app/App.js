    /**
     * Sample React Native App
     * https://github.com/facebook/react-native
     * @flow
     */

     import React, { Component } from 'react';
     import {
        Platform,
        StyleSheet,
        Text,
        View,
        NativeEventEmitter,
        Linking,
    } from 'react-native';
    import { CommandExecutor } from './command_executor.js';
    import { Adjust, AdjustEvent, AdjustConfig } from 'react-native-adjust';

    const {
        NativeModules,
    } = require('react-native');

    const AdjustSdkTest = NativeModules.AdjustSdkTest;

    let AdjustSdkTestEmitter = null;
    if (Platform.OS === "android") {
        AdjustSdkTestEmitter = new NativeEventEmitter(NativeModules.AdjustSdkTest);
    } else if (Platform.OS === "ios") {
        AdjustSdkTestEmitter = new NativeEventEmitter(NativeModules.ASTEventEmitter);
    }

    let emitterSubscription = null;

    const instructions = Platform.select({
        ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
        android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
    });

    type Props = {};
    export default class App extends Component<Props> {
        componentWillMount() {
            var baseUrl = "";
            var gdprUrl = "";
            if (Platform.OS === "android") {
                baseUrl = "https://192.168.8.197:8443";
                gdprUrl = "https://192.168.8.197:8443";
            } else if (Platform.OS === "ios") {
                baseUrl = "http://192.168.8.197:8080";
                gdprUrl = "http://192.168.8.197:8080";
            }

            // AdjustSdkTest.addTestDirectory("current/appSecret/");
            // AdjustSdkTest.addTest("current/event/Test_Event_EventToken_Malformed");
            Adjust.getSdkVersion(function(sdkVersion) {
                AdjustSdkTest.startTestSession(baseUrl, sdkVersion);
            });

            const commandExecutor = new CommandExecutor(baseUrl, gdprUrl);
            emitterSubscription = AdjustSdkTestEmitter.addListener('command', (json) => {
                const className    = json["className"];
                const functionName = json["functionName"];
                const params       = json["params"];
                const order        = json["order"];
                commandExecutor.scheduleCommand(className, functionName, params, order);
            });
        }

        componentDidMount() {
            Linking.addEventListener('url', this.handleDeepLink);
            Linking.getInitialURL().then((url) => {
                if (url) {
                    this.handleDeepLink({ url });
                }
            })
        }

        handleDeepLink(e) {
            Adjust.appWillOpenUrl(e.url);
        }

        componentWillUnmount() {
            emitterSubscription.remove();
        }

        render() {
            return (
                <View style={styles.container}>
                    <Text style={styles.welcome}>
                        Welcome to React Native - Adjust SDK Test App!
                    </Text>
                    <Text style={styles.instructions}>
                        To get started, edit App.js
                    </Text>
                    <Text style={styles.instructions}>
                        {instructions}
                    </Text>
                </View>
                );
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        },
        welcome: {
            fontSize: 20,
            textAlign: 'center',
            margin: 10,
        },
        instructions: {
            textAlign: 'center',
            color: '#333333',
            marginBottom: 5,
        },
    });
