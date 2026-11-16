# AGENTS.md

## Git Branch Rules

AIエージェントがプッシュできるブランチは、次の3つに限定する。

- ChatGPT: `ai/chatgpt`
- MistralAI: `ai/mistral`
- Claude: `ai/claude`

- 上記以外のブランチを新規作成・使用・プッシュしない。
- 作業ごとにブランチを増やさず、専用ブランチを再利用する。
- 他のエージェントのブランチを使用しない。
- `main` への直接プッシュは、許可されない限り禁止する。
- プッシュ前に変更内容と対象ブランチを確認する。
