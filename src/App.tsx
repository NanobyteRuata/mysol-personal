import axios from "axios";
import { useEffect, useState } from "react";
import { AuthTestResponse, ChatPostMessageResponse } from "@slack/web-api";

function App() {
  const [inputSlackUAT, setInputSlackUAT] = useState<string>("");

  // Loading Flags
  const [isValidatingSlackUAT, setIsValidatingSlackUAT] =
    useState<boolean>(false);
  const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

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
    setIsCheckingIn(true);
    const success = await sendMessageToSlack(
      "おはようございます。",
      "D048WV2MDUK"
    );
    alert(`Check in ${success ? "success" : "failed"}`);
    setIsCheckingIn(false);
  };

  const checkOut = async () => {
    setIsCheckingOut(true);
    const success = await sendMessageToSlack("お疲れ様です。", "D048WV2MDUK");
    alert(`Check out ${success ? "success" : "failed"}`);
    setIsCheckingOut(false);
  };

  const sendMessageToSlack = async (
    text: string,
    channel: string
  ): Promise<boolean> => {
    try {
      return (
        (
          await axios({
            method: "post",
            url: "https://slack.com/api/chat.postMessage",
            data: `text=${text}&channel=${channel}&token=${slackUAT}`,
          })
        ).data as ChatPostMessageResponse
      ).ok;
    } catch (e) {
      console.error(e);
      alert("Network related error. Check console.");
      return false;
    }
  };

  const saveToken = async () => {
    const isValid = await validate(inputSlackUAT);

    if (isValid) {
      localStorage.setItem("slackUAT", inputSlackUAT);
      setSlackUAT(inputSlackUAT);
      setInputSlackUAT("");
    }
  };

  return slackUAT ? (
    <div>
      <input
        disabled={isCheckingIn}
        type="button"
        value={isCheckingIn ? "Checking in..." : "Check in"}
        onClick={() => checkIn()}
      />
      <input
        disabled={isCheckingOut}
        type="button"
        value={isCheckingOut ? "Checking out..." : "Check out"}
        onClick={() => checkOut()}
      />
    </div>
  ) : (
    <div>
      <input
        disabled={isValidatingSlackUAT}
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
        disabled={isValidatingSlackUAT || inputSlackUAT.length < 1}
        type="button"
        value="Save"
        onClick={() => saveToken()}
      />
    </div>
  );
}

export default App;
