# Structure for `member/*.json`

Array 型態，每個元素為 `Member` 物件

## Object Define

### `Member`

- `id`: `String`，學生證 ID
- `name`: `Traslatable`，成員名稱
- `researchDirecion`: `Traslatable[]?`，研究方向
- `interest`: `Traslatable[]?`，興趣
- `image`: `String`，照片
- `avatar`: `String`，大頭照
- `join`: `String`，加入年月，格式(民國年月)：`yyy/mm`
- `email`: `String?`
- `website`: `String?`，個人網站
- `department`: `"csie" | "mpis"`，分別為資工系與資安所
- `degree`: `"undergraduate" | "master" | "phd"`，分別為大學部、碩士與博士

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
    "id": "112598999",
    "name": {
      "default": "zh",
      "en": "Name",
      "zh": "名字"
    },
    "researchDirection": [
      {
        "default": "zh",
        "zh": "軟體工程",
        "en": "Software Engineering"
      }
    ],
    "interest": [
      {
        "default": "zh",
        "zh": "電動",
        "en": "Video Games"
      }
    ],
    "image": "data/image/112598999.png",
    "avatar": "data/avatar/112598999.png",
    "join": "112/9",
    "email": "t112598999@ntut.org.tw",
    "website": "https://www.google.com",
    "department": "csie",
    "degree": "master"
  },
  {
    "id": "112c53999",
    "name": {
      "default": "zh",
      "en": "Name",
      "zh": "名字"
    },
    "researchDirection": [
      {
        "default": "zh",
        "zh": "資訊安全",
        "en": "Information Security"
      },
      "軟體安全"
    ],
    "interest": [
      "CTF"
    ],
    "image": "data/image/112c53999.png",
    "avatar": "",
    "join": "112/9",
    "email": "112c53999@ntut.org.tw",
    "department": "mpis",
    "degree": "master"
  }
]
```
