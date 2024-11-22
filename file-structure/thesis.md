# Structure for `thesis.json`

Array 型態，每個元素為 `Thesis` 物件

## Object Define

### `Research`

- `title`: `Translatable`，標題
- `author`: `Translatable`，作者
- `year`: `Integer`，發表年分(西元)
- `link`: `String`，碩博網連結

### `Translatable`

可以為 `String` 或包含以下內容的物件

- `default`: `String`，預設翻譯語言
- `<lang>`: `String`，key 為翻譯語言，value 為翻譯後結果

```json
"A Normal String"
or
{
  "default": "zh",
  "zh": "中文",
  "en": "English"
}
```

## Example

```json
[
  {
    "title": "Title1",
    "author": "Author1",
    "year": 2024,
    "link": "https://www.google.com"
  },
  {
    "title": {
      "default": "en",
      "en": "Title2",
      "zh": "標題 2"
    },
    "author": {
      "default": "en",
      "en": "Author2",
      "zh": "作者 2"
    },
    "year": 2023,
    "link": "https://www.google.com"
  }
]
```
