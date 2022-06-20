const Colors = {
  white: "#ffffff",
  black: "#111111",
  main: "#3679fe",
  gray_0: "#d5d5d5",
  gray_1: "#a6a6a6",
  red: "#e84118",
};

export const theme = {
  background: Colors.white,
  text: Colors.black,
  errorText: Colors.red,

  // Button
  btnBackground: Colors.main,
  btnTitle: Colors.white,
  btnTextLink: Colors.main,
  btnSignout: Colors.red,

  // Image
  imgBackground: Colors.gray_0,
  imgBtnBackground: Colors.gray_1,
  imgBtnIcon: Colors.white,

  //Input
  inputBackground: Colors.white,
  inputLabel: Colors.gray_1,
  inputPlaceholder: Colors.gray_1,
  inputBorder: Colors.gray_1,
  inputDisabled: Colors.gray_0,

  // Spinner
  spinnerBackground: Colors.black,
  spinnerIndicator: Colors.white,

  // Tab
  tabBtnActive: Colors.main,
  tabBtnInactive: Colors.gray_1,

  // List - Item
  itemBorder: Colors.gray_0,
  itemTime: Colors.gray_1,
  itemDesc: Colors.gray_1,
  itemIcon: Colors.text,

  // Chat
  sendBtnActive: Colors.main,
  sendBtnInactive: Colors.gray_1,
};
