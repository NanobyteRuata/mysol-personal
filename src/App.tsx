import axios from 'axios';

function App() {
  const checkIn = () => {
    axios.post('https://slack.com/api/chat.postMessage', {
      text: 'おはようございます。',
      channel: 'D048WV2MDUK'
    }, { 
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_OAUTH_USER_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <><input type="button" value="Check In" onClick={() => checkIn()} /></>
  );
}

export default App;
