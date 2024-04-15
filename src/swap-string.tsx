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
        title="将剪贴板中字符串移动到等号左侧并插入到当前位置"
        subtitle="比如 a == 'a'，修改后为：'a' == a"
        actions={
          <ActionPanel>
            <Action title="替换并插入" onAction={swapVariableAndString} />
          </ActionPanel>
        }
      />
    </List>
  );
}
