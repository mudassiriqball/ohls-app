import axios from "axios";
import urls from "../../utils/urls";

export default async function sendPushNotification(token, _id, title, body, user) {
  await axios({
    method: 'GET',
    url: urls.USER_BY_ID + _id,
    headers: {
      'authorization': token,
    },
  }).then(res => {
    if (res.data.data.fcmToken !== null)
      send(res.data.data.fcmToken, title, body, user);
  }).catch(err => {
    console.log('send notification err:', err);
  });
}

const send = async (expoPushToken, title, body, user) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { user: user },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}