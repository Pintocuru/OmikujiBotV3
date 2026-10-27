// src/editor/registrationState.ts
import { ref } from 'vue'

/**
 * registerAll() を通った「全部入り」ビルドかどうか。
 * 一部の UI だけ登録するパッケージ(StrawberryChocolate など)では false のまま。
 * DataPacks のように「全 UI が揃っていないと成立しない」機能の出し分けに使う
 */
export const isFullRegistered = ref(false)
