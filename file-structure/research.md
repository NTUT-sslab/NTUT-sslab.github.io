# Structure for `research/research.json`

Array 型態，每個元素為 `Research` 物件

## Object Define

### `Research`

- `title`: `Translatable`，標題
- `type`: `"research" | "project"`，類型，分別為研究與產學計畫
- `researcher`: `Traslatable[]?`，研究人員，`type` 為 `research` 時可用
- `abstractId`: `String?`，摘要 ID，對應到`research/abstract/<abstractId>.txt`，`type` 為 `research` 時可用
- `link`: `String?`，連結

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
    "type": "research",
    "researcher": ["Researcher1"],
    "abstractId": "Title1"
  },
  {
    "title": {
      "default": "en",
      "en": "Title2",
      "zh": "標題 2"
    },
    "type": "research",
    "researcher": [
      {
        "default": "en",
        "en": "Researcher2",
        "zh": "研究員 2"
      },
      "Researcher3"
    ],
    "abstractId": "Title1"
  },
  {
    "title": "Title3",
    "type": "project",
    "link": "https://www.google.com"
  },
  {
    "title": {
      "default": "en",
      "en": "Title4",
      "zh": "標題 4"
    },
    "type": "project",
    "link": "https://www.google.com"
  }
]
```
