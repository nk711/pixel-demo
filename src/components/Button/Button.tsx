import React from "react";
import { Pressable, PressableProps, StyleSheet, Text , } from "react-native";
// import { StyleSheet } from "react-native-unistyles";

interface ButtonProps extends PressableProps {
    children: React.ReactNode;
}


const Button = ({  disabled, children, ...props }: ButtonProps) => {

    return (
    <Pressable
    style={({ pressed }) => [
        styles.button,
        {
        // backgroundColor: pressed
        //     ? styles.button.pressedBackgroundColor
        //     : disabled
        //     ? styles.button.disabledBackgroundColor
        //     : styles.button.primaryBackgroundColor,
        },
    ]}
    disabled={disabled}
    {...props}
    >
    <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
);
};
  
//   const styles = StyleSheet.create(theme => ({
    const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        // primaryBackgroundColor: theme.button.primaryBackgroundColor,
        // secondaryBackgroundColor: theme.button.secondaryBackgroundColor,
        // textColor: theme.button.textColor,
        // borderColor: theme.button.borderColor,
        // pressedBackgroundColor: theme.button.pressedBackgroundColor,
        // disabledBackgroundColor: theme.button.disabledBackgroundColor,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
  })

export default Button;
