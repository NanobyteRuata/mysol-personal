import axios from 'axios';

function App() {
  const checkIn = async () => {

    axios({
      method: 'post',
      url: 'https://slack.com/api/chat.postMessage',
      data: `text=おはようございます。&channel=D048WV2MDUK&token=${process.env.REACT_APP_OAUTH_USER_ACCESS_TOKEN}`,
    })
      .then((response: any) => {
  
        console.log('response', response);
        alert('checkin success');
  
      })
  
      .catch((error: any) => {
  
        console.log('error', error);
        alert('connection failed');
  
      });
  }

  const testConnection = () => {

    axios({
  
      method: 'post',
  
      url: 'https://slack.com/api/auth.test',

      data: `token=${process.env.REACT_APP_OAUTH_USER_ACCESS_TOKEN}`
  
    })
  
      .then((response: any) => {
        if (!response.data?.ok) {
          console.log(`client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&token=${process.env.REACT_APP_OAUTH_USER_ACCESS_TOKEN}`)
          axios({
            method: 'get',
            url: 'https://slack.com/api/oauth.v2.exchange',
            data: `client_id="${process.env.REACT_APP_CLIENT_ID}"&client_secret="${process.env.REACT_APP_CLIENT_SECRET}"&token="${process.env.REACT_APP_OAUTH_USER_ACCESS_TOKEN}"`
          }).then((response: any) => {
            console.log('token expired. new token info:', response.data)
          }).catch((e) => {
            console.error(e);
            console.log('token expired. can\'t get new token info')
          })
        } else {
          alert('connection success');
        }
  
      })
  
      .catch((error: any) => {
  
        console.log('error', error);
        alert('connection failed');
  
      });
  
  };

  return (
    <><input type="button" value="Check In" onClick={() => checkIn()} /><input type="button" value="Test Connection" onClick={() => testConnection()} /></>
  );
}

export default App;
