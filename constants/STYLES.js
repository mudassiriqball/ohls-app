import { Platform } from "react-native";
import theme from "./theme";

export default {
  iosPickerContainer: {
    overflow: "hidden",
    backgroundColor: theme.COLORS.WHITE,
    height: 57,
    width: "100%",
    marginVertical: 12,
  },
  androidPickerContainer: {
    backgroundColor: theme.COLORS.WHITE,
    height: 57,
    width: "100%",
    marginBottom: 11,
    borderRadius: 4,
    // shadowColor: theme.COLORS.PRIMARY,
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.5,
    // elevation: 3,
  },
  picker: {
    height: Platform.OS == "ios" ? null : 56,
    width: "100%",
    color: theme.COLORS.TEXT,
    backgroundColor: "transparent",
    transform: Platform.OS == "ios" ? null : [{ scaleX: 0.92 }, { scaleY: 0.89 }],
  },
  phoneInput: {
    width: '100%',
    height: 57,
    elevation: 3,
    borderColor: theme.COLORS.GRAY,
    backgroundColor: theme.COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
    marginTop: 6,
  }
}