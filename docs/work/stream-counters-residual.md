# カウンター(useStreamCounters)の残課題

`useStreamCounters` は Service(streamStats / reactionStats / userStats / serviceMetaStore)のスナップショットを共有し、各 Service の変更通知で更新する。
この方式で解決しない問題と、次にやることをまとめる。β 版のうちに判断したい。

## 1. 通知の取り決めが暗黙のまま(根治案あり)

- Service に統計を足す・カウンターのキーを足すたびに、次の 3 か所を揃える必要がある。揃え忘れても、エラーにならず「値が古いまま」になる。
  - `BUILTIN_COUNTER_KEYS`(useStreamCounters.ts)
  - `readBuiltinCounter` の switch(同上)
  - `acquireShared` の購読(同上。新しい Service なら `onChange` も作る)
- 根治案: Service の状態を Vue のリアクティブ状態(ref / shallowReactive)で持ち、counters を純粋な computed にする。コピーも購読も要らなくなる。
- 影響範囲が広い。`UserStatsManager`(src/common)は他からも使われる。`ServiceMetaStore` は Pinia の外のシングルトンで、内部の更新は自分自身(this)に書き込む。
- 判断: 新しいカウンターや統計を増やす予定があるなら、リリース前に着手する価値がある。増やさないなら現状で足りる。

## 2. Service が Pinia ストア経由だと「部分的にリアクティブ」になる(要調査)

- `appStore.streamStats.record()` のように **ストア経由で書くと、読み取り側の watchEffect / computed に依存追跡が効く**。Pinia が返すクラスのインスタンスを、Vue がプロキシで包むため(実験で確認済み)。
- 一方、生のインスタンスに書くと通知されない。該当: `createAppServices` の `resetStreamData`、`ServiceMetaStore` の内部更新、`UserStatsControlSync`。
- つまり「どこから書いたか」でリアクティブかどうかが変わる。今回の変更は明示通知に寄せたが、他のコードがこの偶発的な挙動に依存していないかは未調査。
- 次にやること:
  - `createAppServices` の戻り値を `markRaw` して挙動を一貫させる案を試す(ストア経由でもプロキシにならなくなる)。
  - src/ 配下で、`appStore.xxx` の読み取りを computed / watch の中で直接使っている箇所を洗い出す。
  - `useProgressTracker` の「reactive ではない」というコメントは、上の事情と食い違っている。

## 3. 変数カウンター(評価ブロック)の更新契機が弱い

- 現在の再取得の契機は、`botMessages` の増減と、組み込みカウンターの更新のみ。
- 評価ブロックの変数が、コメントも bot メッセージも伴わずに変わったとき(タイマー発火で variable ステップだけ動くなど)は、次の契機まで反映されない可能性がある。
- 対策案: 変数の更新を通知する仕組みを別途設け、revision を進める。現在は標準の `Map` を直接使用しているため、通知を追加する場合は更新 API の設計も合わせて検討する。

## 4. 回避策・ポーリングの整理

- `useDeadAirLogic` の `armed` + `nextTick` は、「マウント後に初期値が入って増加と誤検知される」ための回避策。初期値を setup 時に入れるようにしたので、不要になった可能性がある。DeadAir の挙動を確認してから外す。
- `useProgressTracker` の 1 秒ポーリングは、`onChange` の購読で置き換えられる可能性がある(値の読み取りは `readBuiltinCounter` に共通化済み)。
- `useSandAccumulator` は、配信開始時刻のために `serviceMetaStore` を別に購読している。

## 5. 同じキー列が複数ある

- `BUILTIN_COUNTER_KEYS`(useStreamCounters.ts)、`DEAD_AIR_BUILTIN_COUNTER_KEYS`(src/types/ui/game/DeadAirSchema.ts)、`PROGRESS_COUNTER_KEYS`(src/types/ui/common/ProgressSourceSchema.ts)。
- 型側(src/types)は UI のコードを import できないため、現状は手で揃えている。

## 6. StreamStatsManager.seenUsers と UserStatsManager の重複

- `seenUsers`(初見・コメント数の計算用)は、`UserStatsManager` が持つユーザーの集合とほぼ同じ。
- `UserStatsManager` には手動の `upsert` / `remove` があり、仕様が違うため、単純には統合できない。統合するなら、先に両者の責務を決める。
