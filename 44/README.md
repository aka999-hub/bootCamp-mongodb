# お知らせ：mongoose バージョン 7 でのコード不具合を解決する方法

### お知らせ：mongoose バージョン 7 でのコード不具合を解決する方法

**次の講義動画に関する重要なお知らせです！**
このメモで言及しているコードが何を指しているのかを理解するためにも、ぜひ次の講義動画を最後までご覧ください。

次の動画の内容に沿ってコードを書いているときに、mongoose バージョン 7 以上を使用している場合、下記のようなエラーが発生する可能性があります：

  **TypeError: Invalid schema configuration: `false` is not a valid type at path `id`.**

- 解決策 1
  動画の最後の方で `models/user.js` 内の `userSchema` で定義された   addresses 配列に、以下のコード行を追加しています：

`_id: {id: false},`

  もしこの行を追加して上記のエラーが発生する場合は、   **mongoose バージョン 7** を使用している可能性が高いです。   その場合は、以下のようにコードを書き換えてください：

`_id: {_id: false},`

  このように記述を変更すると、mongoose バージョン 7 で発生する関連エラーが解消されるはずです。

- 解決策 2
  動画で使用しているコードをそのまま使いたい場合、   バージョン 7.0.0 **未満** の mongoose をインストールして   互換性の問題を回避することもできます。以下の npm コマンドを使用してください：

`npm install mongoose@"<7.0.0"`

  このコマンドを正確に入力またはコピー＆ペーストすれば、   上記のエラーは起こらなくなるはずです。