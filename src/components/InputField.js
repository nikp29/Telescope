import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';

const InputField = ({
    name,
    value,
    setValue
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text
                    style={{
                        fontFamily: "Raleway"
                    }}
                >
                    {name}:
                </Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder={name}
                value={value}
                onChangeText={setValue}
                autoCapitalize="none"
                autoCorrect={false}
                onPress={() => Keyboard.dismiss()}
                />
            </View>
        </View>
    );
};

export default InputField

const styles = StyleSheet.create({
    input: {
        fontSize: 15,
        fontFamily: "Raleway-Regular",
        padding: 5,
    },
    inputContainer: {
        backgroundColor: "rgba(255, 215, 112, 0.7)",
        width: "80%",
        borderRadius: 6,
        // marginBottom: 32,
    },
    textContainer: {
        marginTop: 16,
        alignContent: "flex-start",
        width: "75%",
        marginBottom: 5,
    },
    container: {
        alignItems: "center"
    }
});