# slack-word-ranking

## 機能
- Botのいるチャネルの発言を構文解析させ、登場回数を日付毎に保存
- スラッシュコマンドやエンドポイントを叩くことで、登場回数のランキングや登場回数が急上昇した単語を確認可能

## デプロイ方法
1. `slackWordRankingBot`をCloudFunctionsにデプロイ
  - イベントリスナーや定期的なランキング表示に利用
1. `getWordRanking`をCloudFunctionsにデプロイ
  - スラッシュコマンドのエンドポイントに利用
1. Slack Appを作成し、message.channelをlistenさせる
1. スラッシュコマンドを利用する場合はそれも有効化する
