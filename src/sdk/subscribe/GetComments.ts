// src/sdk/subscribe/GetComments.ts
import { PingOneSDK } from "../connection/PingOneSDK";
import OneSDK from "@onecomme.com/onesdk";
import { Comment } from "@onecomme.com/onesdk/types/Comment";

// GetComments.ts
let currentSubscriberId: number | null = null;

export async function GetComments(
  callback: (comments: Comment[]) => void,
  options: { initialLoad?: boolean } = {},
): Promise<boolean> {
  let isFirstCallback = true;
  try {
    if (currentSubscriberId !== null) {
      OneSDK.unsubscribe(currentSubscriberId);
      currentSubscriberId = null;
    }

    if (!(await PingOneSDK())) return false;

    await OneSDK.setup({
      permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
      mode: "all",
      commentLimit: options.initialLoad ? 99999 : 100,
    });

    currentSubscriberId = OneSDK.subscribe({
      action: "comments",
      callback: async (comments: Comment[]) => {
        if (isFirstCallback && options.initialLoad) {
          callback(comments);
          isFirstCallback = false;
          // ★ 初回データ受信後に commentLimit を通常サイズに戻す
          await OneSDK.setup({
            permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
            mode: "all",
          });
          return;
        }
        callback(comments);
      },
    });

    await OneSDK.connect();
    return true;
  } catch (error) {
    console.error("OneSDK 初期化エラー:", error);
    return false;
  }
}

// viteの箇所なのでとりあえず無視
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
if (import.meta.hot) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  import.meta.hot.dispose(() => {
    if (currentSubscriberId !== null) {
      OneSDK.unsubscribe(currentSubscriberId);
      currentSubscriberId = null;
    }
  });
}
