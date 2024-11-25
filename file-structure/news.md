# Structure for `news.json`

Array 型態，每個元素為 `News` 物件

## Object Define

### `Research`

- `image`: `String`，圖片
- `title`: `Translatable`，標題(網頁上的 tooltip)
- `alt`: `Translatable`，替代文字，找不到圖片會顯示的文字，或 tts 辨識用的文字
- `date`: `String`，日期，排序新聞用

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
    "image": "https://placehold.co/720x480",
    "alt": "Image 1",
    "title": "Image 1",
    "date": "2021-01-01"
  },
  {
    "image": "https://placehold.co/720x480",
    "alt": {
      "default": "en",
      "en": "Image 2",
      "zh": "圖片 2"
    },
    "title": {
      "default": "en",
      "en": "Image 2",
      "zh": "圖片 2"
    },
    "date": "2021-01-02"
  },
  {
    "image": "https://placehold.co/640x480",
    "alt": "Image 3",
    "date": "2021-01-03"
  },
  {
    "image": "https://placehold.co/720x480",
    "alt": "Image 6",
    "date": "2021-01-06"
  },
  {
    "image": "https://placehold.co/720x480",
    "alt": "Image 4",
    "date": "2021-01-04"
  },
  {
    "image": "https://placehold.co/720x480",
    "alt": "Image 5",
    "date": "2021-01-05"
  }
]
```
