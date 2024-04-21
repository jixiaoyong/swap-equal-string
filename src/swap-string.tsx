import { Action, ActionPanel, Clipboard, Form, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";

export default function Command() {
  const [currentClipboard, setCurrentClipboard] = useState("");
  const regex = /([\w.]+)\s*(==|===)\s*(['"`].*?['"`])/g;

  useEffect(() => {
    (async () => {
      const clipboardContent = (await Clipboard.read()).text;
      setCurrentClipboard(clipboardContent);
    })();
  }, []);

  const swapVariableAndString = async () => {
    const clipboardContent = (await Clipboard.read()).text;
    setCurrentClipboard(clipboardContent);

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

  const swapVariableAndStringFunc = function (source: string) {
    return source.replace(regex, "$3 $2 $1");
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action title="替换并插入" onAction={swapVariableAndString} />
        </ActionPanel>
      }
    >
      <Form.Description text="将剪贴板中字符串移动到等号左侧并插入到当前位置" title=""></Form.Description>
      <Form.Description text="比如 a == 'a'，修改后为：'a' == a" title=""></Form.Description>
      <Form.TextArea
        id="ddd"
        title="剪贴板内容："
        value={currentClipboard}
        onChange={setCurrentClipboard}
        error={regex.test(currentClipboard) ? "" : "不符合格式要求"}
      ></Form.TextArea>
      <Form.Description text={swapVariableAndStringFunc(currentClipboard)} title="替换后："></Form.Description>
    </Form>
  );
}
