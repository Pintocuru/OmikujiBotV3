# i18n fix handoff

## 未着手・未完了
- Batch 01–07: 翻訳修正済み。`npm run build` は Vite 成功後、HondaJanken の後処理で `undefined.map` により失敗。
- Batch 08–09: 確定した翻訳修正なし。

## 保留・要確認
- Batch 01 / 05: 複製名の「(コピー)」は保存データ仕様のため変更しない。
- Batch 07: MessageSettings の動的 slot metadata は翻訳元が対象範囲で特定できず要確認。

## 注意事項
- `src/types/`、監査レポート、進捗表、作業ログは変更しない。
- 保存データや操作仕様を変えない。

## 次回にやること
- Batch 01–07 の lint・型チェック結果と ja/en キー構造は確認済み。保留項目は判断が必要な場合のみ扱う。
