import React, { useState, useEffect, useLayoutEffect } from "react";
import styled from "styled-components/native";
import { createMessage, getCurrentUser, DB } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { GiftedChat, Send } from "react-native-gifted-chat";
import { MaterialIcons } from "@expo/vector-icons";
import { Alert } from "react-native";
import * as Clipboard from 'expo-clipboard';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const SendIcon = styled(MaterialIcons).attrs(({ theme, text }) => ({
  name: "send",
  size: 24,
  color: text ? theme.sendBtnActive : theme.sendBtnInactive,
}))``;

const SendButton = (props) => {
  return (
    <Send
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 4,
      }}
      disabled={!props.text}
    >
      <SendIcon text={props.text} />
    </Send>
  );
};

const Channel = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const { uid, name, photo } = getCurrentUser();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title || "Channel",
    });
  }, []);

  useEffect(() => {
    // const unsubscribe = DB.collection("channels")
    //   .doc(route.params.id)
    //   .collection("messages")
    //   .orderBy("createdAt", "desc")
    //   .onSnapshot((snapshot) => {
    //     const list = [];
    //     snapshot.forEach((doc) => {
    //       list.push(doc.data());
    //     });
    //     setMessages(list);
    //   });

    const q = query(
      collection(DB, "channels", route.params.id, "messages"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setMessages(list);
    });
    return () => unsubscribe();
  }, []);

  const _handleMessageSend = async (messageList) => {
    const message = messageList[0];
    try {
      await createMessage({ channelId: route.params.id, message });
    } catch (e) {
      Alert.alert("Message Error", e.message);
    }
  };

  const _handleOnLongPress = (context, message) => {
    const options = ["Copy Text", "Delete Message", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(message.text);
            break;
          case 1:
            Alert.alert(null, "선택한 메시지를 삭제하시겠습니까?", [
              {
                text: "취소",
                onPress: () => console.log("canceled"),
                style: "cancel",
              },
              {
                text: "확인",
                onPress: async () =>
                  await deleteDoc(
                    doc(
                      DB,
                      "channels",
                      route.params.id,
                      "messages",
                      message._id
                    )
                  ),
              },
            ]);
            break;
        }
      }
    );

    // const options = ["Copy Text", "Cancel"];
    // const cancelButtonIndex = options.length - 1;
    // this.context.actionSheet().showActionSheetWithOptions(
    //   {
    //     options,
    //     cancelButtonIndex,
    //   },
    //   (buttonIndex) => {
    //     switch (buttonIndex) {
    //       case 0:
    //         Clipboard.setString(this.props.currentMessage.text);
    //         break;
    //       case 1:
    //         await deleteDoc(doc(DB, "channels", route.params.id, "messages", ))
    //     }
    //   }
    // );
  };

  return (
    <Container>
      {/* <Input
        value={message}
        onChangeText={setMessage}
        onSubmitEditing={() =>
          createMessage({ channelId: route.params.id, message })
        }
      /> */}
      <GiftedChat
        placeholder="Enter a message..."
        messages={messages}
        renderSend={(props) => <SendButton {...props} />}
        user={{ _id: uid, name, avatar: photo }}
        onSend={_handleMessageSend}
        scrollToBottom={true}
        alwaysShowSend={true}
        onLongPress={_handleOnLongPress}
      />
    </Container>
  );
};

export default Channel;
