# カウンター(useStreamCounters)の残課題

画面に出す値は、Service が Vue のリアクティブな状態として持つ(正本は Service のみ)。`useStreamCounters` は値を持たず、Service の値から作る computed。
この方式で残っている課題をまとめる。

## 1. DeadAir: 配信メタの取得前後で、同接などが「増加」とみなされる

- `serviceMetaStore.getCurrent()` は、取得が終わるまで `null`。カウンターは `upVote` / `viewer` / `follower` を 0 として返す。
- DeadAir のルールに `viewer` などを使っていると、メタの取得が終わった瞬間に「0 → 実際の値」を増加として数え、効果が発動しうる。
- 以前から同じ(armed の待ち時間は、マウント直後の 1 回分しか守っていなかった)。悪化はしていない。
- 対策案: メタが未取得のあいだは、`useDeadAirLogic` の基準値を更新するだけにする。`useStreamCounters` から「メタが取得済みか」を渡す形が候補。

## 2. Pinia のストア経由だと、Service のインスタンスを Vue がプロキシで包む

- 値の追跡は、Service の中のリアクティブな状態が担う。ストア経由かどうかには依存しない(createAppServices.test.ts が両方の経路で確認している)。
- ただし Pinia のストア経由では、Service のインスタンス全体(ExpressionEngine の `parser`、ReactionTotals の `history` など)も、アクセスのたびにプロキシで包まれる。動作には影響しないが、無駄な処理ではある。
- `markRaw` で包まない理由: いまは「通知をごまかす」ためではなく、純粋な最適化にとどまる。負荷が問題になるまで入れなくてよい。

## 3. 新しい Service・状態を足すときの決まり

- 画面に出す値は、Service の中でリアクティブな状態にする(`shallowReactive`)。
- engine・common のように Vue に依存しないクラスは、保存先を引数で受け取り、`createAppServices` がリアクティブにして渡す。
  - `UserStatsManager`: `shallowReactive(new Map())`
  - 変数 (`PlaceholderVariable`): `shallowReactive(new ExpressionEngine())`。ExpressionEngine は `Map` を継承していて、Vue は Map の継承クラスも Map として追跡する。
  - 新しい `PlaceholderVariable` を `createAppServices` の外で作ると、リアクティブにならない。
- 新しいカウンターは、`BUILTIN_COUNTER_KEYS` と `readBuiltinCounter` に足す。購読や更新通知は要らない。
- 守る仕組みは、createAppServices.test.ts(Service ごとの確認)と、useStreamCounters.test.ts(キー一覧の一致)。**新しい Service は、自動では検査されない**ので、テストに 1 件足すこと。

## 4. ReactionStatsManager の burst / peak はリアクティブではない

- リアクションの累計は追跡できるが、バーストレベルとピークは、これまでどおりイベント(`onBurstLevelChange`)で扱う。
- 画面にバーストレベルを出したくなったら、同じ方法(`shallowReactive`)で状態にする。

## 5. ServiceMetaStore はシングルトンのまま

- engine 側(PostOmikujiService)と仮想配信パネルが `getInstance()` で直接使っているため。
- リアクティブにするのに、シングルトンをやめる必要はなかった。やめるなら、engine への受け渡し方を先に決める。

## 6. StreamStatsManager.seenUsers と UserStatsManager の重複

- `seenUsers`(初見・コメント数の計算用)は、`UserStatsManager` が持つユーザーの集合とほぼ同じ。
- `UserStatsManager` には手動の `upsert` / `remove` があり、仕様が違うため、単純には統合できない。統合するなら、先に両者の責務を決める。
