import axios from "axios";
import { useEffect, useState } from "react";
import { AuthTestResponse, ChatPostMessageResponse } from "@slack/web-api";

function App() {
  const [inputSlackUAT, setInputSlackUAT] = useState<string>("");

  // Loading Flags
  const [isValidatingSlackUAT, setIsValidatingSlackUAT] =
    useState<boolean>(false);
  const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
  // const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // slack user access token
  const [slackUAT, setSlackUAT] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const localStorageSlackUAT = localStorage.getItem("slackUAT");
      const isValid = await validate(localStorageSlackUAT || "");
      if (isValid) setSlackUAT(localStorageSlackUAT);
    };
    initialize();
  }, []);

  const validate = async (token: string): Promise<boolean> => {
    try {
      setIsValidatingSlackUAT(true);
      const response: AuthTestResponse = (
        await axios({
          method: "post",
          url: "https://slack.com/api/auth.test",
          data: `token=${token}`,
        })
      ).data;

      if (!response.ok) alert("Invalid or expired token!");

      return response.ok;
    } catch (e) {
      console.error(e);
      alert("Network related error. Check console.");
      return false;
    } finally {
      setIsValidatingSlackUAT(false);
    }
  };

  const checkIn = async () => {
    try {
      setIsCheckingIn(true);
      const response: ChatPostMessageResponse = (
        await axios({
          method: "post",
          url: "https://slack.com/api/chat.postMessage",
          data: `text=おはようございます。&channel=D048WV2MDUK&token=${slackUAT}`,
        })
      ).data;

      alert(`checkin ${response.ok ? "success" : "failed"}`);
    } catch (e) {
      console.error(e);
      alert("Network related error. Check console.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  const saveToken = async () => {
    const isValid = await validate(inputSlackUAT);

    if (isValid) {
      localStorage.setItem("token", inputSlackUAT);
      setSlackUAT(inputSlackUAT);
      setInputSlackUAT("");
    }
  };

  return slackUAT ? (
    <input
      disabled={isCheckingIn}
      type="button"
      value={isCheckingIn ? "Checking in..." : "Check in"}
      onClick={() => checkIn()}
    />
  ) : (
    <div>
      <input
        disabled={isValidatingSlackUAT || inputSlackUAT.length < 1}
        type="text"
        placeholder={
          isValidatingSlackUAT
            ? "Validating Token..."
            : "New Slack User Access Token"
        }
        value={inputSlackUAT}
        onChange={(e) => setInputSlackUAT(e.target.value)}
      />
      <input
        disabled={isValidatingSlackUAT}
        type="button"
        value="Save"
        onClick={() => saveToken()}
      />
    </div>
  );
}

export default App;
