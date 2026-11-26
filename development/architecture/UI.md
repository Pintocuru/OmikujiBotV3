# UI

## 役割

配信画面に表示するUIコンポーネントと、その表示レイアウトを提供します。コメント吹き出し、ランキング、カウンター、時計、ユーザーボードなどが含まれます。

## 構成

- `src/ui/`: UI本体、編集画面、プレビュー、関連処理
- `src/layout/`: 複数のUIを組み合わせた画面全体のレイアウト
- `src/types/ui/`: UI設定データのスキーマ・型
- `src/register/registerUi.ts`: Generator側のUI登録
- `src/register/registerUiEditor.ts`: Editor側のUI編集機能登録
- `src/register/registerLayouts.ts`: レイアウト登録
- `src/ui/uiRegistry.ts`: Generator側のUIローダー登録先
- `src/editor/ui/uiEditorRegistry.ts`: Editor側のUI編集機能登録先

### 分類の基準

「視聴者が最初に目にする主役は何か」で決める。仕組みや副次機能は基準にしない。
(例: LiveClockはコメントも出すが、主役は時計付きのBOTなのでBOT演出)

### フォルダ構成

| フォルダ | 役割 | UI |
| --- | --- | --- |
| `src/ui/bot/` | BOT演出 | CharacterStage / CommentBubble / KujibikiPanel / FlashBanner / ToastWidgets / LiveClock |
| `src/ui/counter/` | 時間・カウンター | CookieCounter / SnipeTimer / LifeHourglass |
| `src/ui/game/` | ゲーム | DeadAir / LiverBingo / GameRanking |
| `src/ui/user/` | ユーザー | UserBoard / LabelMaker / FlightSeat / LuckyDraw |
| `src/ui/comment/` | コメント表示 | UserComment |

- `src/ui/common/` と `src/ui/uiRegistry.ts` は直下に配置。
- 各UIフォルダの中身(`components/` `editor/` `composables/` など)はUIごとに保持。
- 型定義(`src/types/ui/`)も、`src/ui/` と同じカテゴリで分類する。共通スキーマは `common/` に配置し、UI設定スキーマの集約もカテゴリ単位で行う。安定/実験の区分は設けない。
- 流入(旧StreamCounter)はCookieCounterに統合した(スキーマが同一のため)。

### 各UIの説明

#### bot(BOT演出)

| UI | 説明 |
| --- | --- |
| CharacterStage | 画面全体(fixed)にキャラクターをステージ配置で表示するUI。 `ui.settings.characterStage` がないと何も表示しない点に注意。 |
| CommentBubble | BOTのコメントを吹き出しで表示。コメント中のキャラ(画像を持つキャラの最新1件)を表示し、コメントがないときは常時表示キャラ(設定の `persistentCharacter`)を出す。 |
| KujibikiPanel | BOTメッセージをパネル形式で表示。 `displaySeconds === 0` で常時表示(最新1件)、それ以外はタイムアウト管理で表示数を制御。 |
| FlashBanner | BOTコメントを画面上のバナー表示する。コメントが無い間はslot0の定型文言を一定間隔で表示。キャラ付きコメントではキャラの配色・アニメーションを反映し、文言切替時にラベルを点滅。 |
| ToastWidgets | BOTコメントをトースト(画面端に積む小さな通知)として表示。設定で右/左の寄せとキャラアイコンの有無を切り替えられる。クリックで先に消せる。 |
| LiveClock | 時計(フリップ式)を表示し、最新のslot0の文言を時計の下に出す。 |

#### counter(時間・カウンター)

| UI | 説明 |
| --- | --- |
| CookieCounter | 同接・ギフト等の配信統計(`useStreamCounters`)を、設定した複数カウンターとして表示。数値型の他にvariable型(別のカウンター値を参照するラベル付き表示)に対応。旧StreamCounterを統合。 |
| SnipeTimer | 配信用のカウントダウン/アップタイマー。toggle / reset操作を受け付け、桁(表示形式)の設定を持つ。 |
| LifeHourglass | 「見ている時間を砂粒として貯める」ガジェット。砂粒 = 同接 × 経過秒、ギフトは100円 = 600粒で加算(係数は定数)。カウントアップのみ。詳細は同フォルダの `LifeHourglass.md`。 |

#### game(ゲーム)

| UI | 説明 |
| --- | --- |
| DeadAir | 無言時間をカウントするゲームUI。phase(警告/危険)への到達や残ライフを表示し、メタ情報がreadyになるまでカウンターの初期値を増加として扱わない。 |
| GameRanking | BOTメッセージのスロットをランキング形式に変換して表示。ランキングに関係するメッセージを受け取るたびにAPIでゲームログを保存する。 |
| LiverBingo | ビンゴボードUI(LiverBingoBoard)。 |

#### user(ユーザー)

| UI | 説明 |
| --- | --- |
| UserBoard | LiveConsoleで操作したユーザーの得点・チームを表示。表示内容は表示コンポーネント側で選ぶ。 |
| LabelMaker | 投稿で届いたユーザーを名前ラベルのリストとして表示。表示内容は表示コンポーネント側で選ぶ。 |
| FlightSeat | 飛行機の座席形式のボード。投稿ユーザーが着席し、右下のステータスはクリックで「非表示 → ユーザー名 → チャット数 → ギフト金額」の順に切替可能。座席数/行構成は設定で変更可。 |
| LuckyDraw | 抽選UI。slot0=joinの参加者を貯め、slot0=drawで抽選して当選者を表示。参加者リストと当選履歴はこのUIが保持する。 |

#### comment(コメント表示)

| UI | 説明 |
| --- | --- |
| UserComment | `userComment` 用のBOTメッセージを、コメント欄風の表示に変換する。 |

## 登録と表示

`src/register/registerAll.ts` からUI・レイアウト等の登録処理を呼び出します。`registerUi.ts` はGenerator側のUIローダーとUI内部の部品を登録し、`registerUiEditor.ts` はEditor側の編集機能を登録します。どのUIを登録するかは登録定義に記載され、Generator用とEditor用で対応する定義を管理します。

Generatorは設定データの `ui.settings` に有効化されたUIをRegistryから取得して表示します。レイアウトが指定されている場合は、通常の個別UI表示に代えてレイアウトコンポーネントを表示します。

## サーバーとの関わり

OBS側はサーバーなしでも動く前提です。UI・ゲームがサーバーへ書くのは記録(ゲームログ)が中心で、ユーザーの得点は変えません(得点はLiveConsoleの手動操作だけ)。詳しくは [OBS側のサーバーアクセス](../conventions/obs-server-access.md) を参照してください。

関連: [Generator](./Generator.md)、[Editor](./Editor.md)、[Packages](./Packages.md)
