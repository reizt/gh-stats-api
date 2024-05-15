# 👾 Github Language Stats

リポジトリの Languages 欄とそっくりな Stats を SVG で取得できます。
Github の README.md に以下のコードを貼るとテーマに応じて異なる画像を表示することができます。
`USERNAME`は適宜置き換えてください。

```md
<a href="https://github.com/USERNAME#gh-light-mode-only">
  <img class="languages light" src="https://gh-stats-api.reizt.dev/api/top-langs.svg?username=USERNAME&theme=light" width="260"/>
</a>
<a href="https://github.com/USERNAME#gh-stats-api-dark-mode-only">
  <img class="languages dark" src="https://gh-stats-api.reizt.dev/api/top-langs.svg?username=USERNAME&theme=dark" width="260"/>
</a>
```

HTML で取得したい場合: https://gh-stats-api.reizt.dev/api/top-langs.html?username=USERNAME

## Tech Stacks

- API: Vercel Express
- Data Fetching: axios
- HTML Rendering: React, React DOM
- HTML -> SVG Conversion: satori
- Input Validation: Zod
