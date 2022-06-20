import React, { useContext, useState } from "react";
import { UserContext } from "../contexts";
import styled from "styled-components/native";
import { Button, Image, Input } from "../components";
import { getCurrentUser, updateUserInfo, signout } from "../firebase";
import { Alert } from "react-native";
import { ProgressContext } from "../contexts";
import { ThemeContext } from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const DEFAULT_PHOTO =
  "https://firebasestorage.googleapis.com/v0/b/rn-chat-45c00.appspot.com/o/user.png?alt=media";

const Profile = ({ navigation, route }) => {
  // non-serializable values를 navigation state에 사용했다고 에러가 나온다. JSON.stringify 사용해볼것
  const { spinner } = useContext(ProgressContext);
  const { setUser } = useContext(UserContext);
  const theme = useContext(ThemeContext);
  const user = getCurrentUser();
  const [photo, setPhoto] = useState(user.photo || DEFAULT_PHOTO);

  const _handlePhotoChange = async (url) => {
    try {
      spinner.start();
      const photoURL = await updateUserInfo(url);
      setPhoto(photoURL);
    } catch {
      Alert.alert("Photo Error", e.message);
    } finally {
      spinner.stop();
    }
  };
  return (
    <Container>
      <Image showButton url={photo} onChangePhoto={_handlePhotoChange} />
      <Input label="Name" value={user.name || user.email} disabled />
      <Input label="Email" value={user.email} disabled />
      <Button
        title="Sign out"
        onPress={async () => {
          try {
            spinner.start();
            await signout();
          } catch (e) {
          } finally {
            setUser({});
            spinner.stop();
          }
        }}
        containerStyle={{ backgroundColor: theme.btnSignout }}
      />
    </Container>
  );
};

export default Profile;
