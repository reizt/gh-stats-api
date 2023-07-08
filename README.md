# 👾 Github Language Stats

リポジトリの Languages 欄とそっくりな Stats を SVG で取得できます。
Github の README.md に以下のコードを貼るとテーマに応じて異なる画像を表示することができます。
`YOUR_USER_NAME`は適宜置き換えてください。

```md
<a href="https://github.com/YOUR_USER_NAME#gh-light-mode-only">
  <img class="languages light" src="https://github-stats.reizt.dev/api/top-langs.svg?userName=YOUR_USER_NAME&theme=light" width="260"/>
</a>
<a href="https://github.com/YOUR_USER_NAME#gh-dark-mode-only">
  <img class="languages dark" src="https://github-stats.reizt.dev/api/top-langs.svg?userName=YOUR_USER_NAME&theme=dark" width="260"/>
</a>
```

HTML で取得したい場合: https://github-stats.reizt.dev/api/top-langs.html?userName=YOUR_USER_NAME

## Tech Stacks

- API: Vercel Express
- Data Fetching: axios
- HTML Rendering: React, React DOM
- HTML -> SVG Conversion: satori
- Input Validation: Zod
