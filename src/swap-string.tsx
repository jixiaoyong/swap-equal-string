import { Action, ActionPanel, Clipboard, List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";

export default function Command() {
  const [currentClipboard, setCurrentClipboard] = useState("");

  useEffect(() => {
    (async () => {
      const clipboardContent = (await Clipboard.read()).text;
      setCurrentClipboard(clipboardContent);
    })();
  }, []);

  const swapVariableAndString = async () => {
    const clipboardContent = (await Clipboard.read()).text;
    setCurrentClipboard(clipboardContent);
    const regex = /([\w\.]+)\s*(==|===)\s*(['"`].*?['"`])/g;

    if (!regex.test(currentClipboard)) {
      const errorMsg = "Invalid clipboard: " + currentClipboard;
      console.warn(errorMsg);
      await showToast({ style: Toast.Style.Failure, title: errorMsg });
    } else {
      const newText = currentClipboard.replace(regex, "$3 $2 $1");
      console.log("new text is", newText);
      const toastMsg = currentClipboard + "--->" + newText;
      const toast = await showToast({ style: Toast.Style.Success, title: toastMsg });
      await Clipboard.paste(newText);
      setCurrentClipboard(newText);
      toast.hide();
    }
  };

  return (
    <List>
      <List.Item
        id="string"
        title="Swap Variable and String "
        actions={
          <ActionPanel>
            <Action title="Swap and Copy to Clipboard" onAction={swapVariableAndString} />
          </ActionPanel>
        }
      />
    </List>
  );
}
