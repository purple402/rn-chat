import * as firebase from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import config from "../firebase.json";

const app = firebase.initializeApp(config);

const auth = getAuth();

export const signin = async ({ email, password }) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
};


const uploadImage = async (url) => {
  if (url.startsWith("https")) {
    // http로 시작하는 경우 업로드 필요 없음
    return url;
  }

  // 사진 저장
  const blob = await new Promise((resolve, reject) => {
    // image 불러오기 위한 XML 만든다
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    // XML을 불러오면 상태 확인
    xhr.onload = function () {
      // 성공하면 Promise의 값으로 xhr.response 반환
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      // 실패하면 Promise의 값으로 Error 반환
      reject(new TypeError("Network request failed"));
    };
    // "GET" 인 경우에는 서버에 데이터를 보낼 필요 없음
    xhr.send(null);
  });

  // user정보 가져와서 user별 폴더에 저장
  const user = auth.currentUser;
  const storage = getStorage();
  // 업로드 경로 생성
  const profileRef = ref(storage, `/profile/${user.uid}/photo.png`);
  // blob(사진파일)을 경로에 업로드한다
  await uploadBytes(profileRef, blob, {
    connectType: "image/png",
  });
  blob.close();

  // 업로드한 사진 주소 반환
  return await getDownloadURL(profileRef);
};

export const signup = async ({ name, email, password, photo }) => {
  // 유저 생성
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  // 사진 업로드
  const photoURL = await uploadImage(photo);
  // 유저 정보 추가
  await updateProfile(auth.currentUser, { displayName: name, photoURL });
  return user;
};

export const getCurrentUser = () => {
  const { uid, displayName, email, photoURL } = auth.currentUser;
  return { uid, name: displayName, email, photo: photoURL };
};

export const updateUserInfo = async (photo) => {
  const photoURL = await uploadImage(photo);
  await updateProfile(auth.currentUser, { photoURL });
  return photoURL;
};

export const signout = async () => {
  auth.signOut();
  return {};
};

export const DB = getFirestore();

export const createChannel = async ({ title, desc }) => {
  // doc()에 아무것도 넘기지 않으면 ID 자동생성됨
  // const newChannelRef = collection(DB, "channels");
  const newChannelRef = await addDoc(collection(DB, "channels"), {});
  const id = newChannelRef.id;
  const newChannel = {
    id,
    title,
    description: desc,
    createdAt: Date.now(),
  };
  await setDoc(newChannelRef, newChannel);
  return id;
};

export const createMessage = async ({ channelId, message }) => {
  // return await DB.collection('channels').doc(channelId).collection('messages').add({text: message, createdAt: Date.now()})

  const channelRef = collection(DB, "channels", channelId, "messages");
  // return await addDoc(channelRef, { text: message, createdAt: Date.now() });
  return await setDoc(doc(channelRef, message._id), { ...message, createdAt: Date.now() });
};
