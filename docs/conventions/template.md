OmikujiBotV3(カレントディレクトリのリポジトリ)を、下記のルールに従って修正してください。
https://github.com/Pintocuru/OmikujiBotV3

【最重要】コードが読めない場合は、他の作業を一切せず
「読めませんでした」とだけ返して中止すること。

【進め方】

1. まず AGENTS.md と docs/conventions/ を読むこと。
2. 変更は patch 単位で行い、各 patch で行った設計判断・影響範囲を
   AGENTS.md の作業ログ(末尾)に追記すること。
   恒久ルール本文(docs/conventions/)は、ルールが変わった時のみ更新すること。
3. 各 patch 後は npm run lint と npm run tsc を通すこと。

【今回の依頼内容】
