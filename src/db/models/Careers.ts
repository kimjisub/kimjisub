export interface Careers {
  object: string
  results: Result[]
  next_cursor: any
  has_more: boolean
  type: string
  page_or_database: PageOrDatabase
  request_id: string
}

export interface Result {
  object: string
  id: string
  created_time: string
  last_edited_time: string
  created_by: CreatedBy
  last_edited_by: LastEditedBy
  cover: any
  icon?: Icon
  parent: Parent
  archived: boolean
  properties: Properties
  url: string
  public_url: string
}

export interface CreatedBy {
  object: string
  id: string
}

export interface LastEditedBy {
  object: string
  id: string
}

export interface Icon {
  type: string
  emoji?: string
  file?: File
}

export interface File {
  url: string
  expiry_time: string
}

export interface Parent {
  type: string
  database_id: string
}

export interface Properties {
  "관련된 프로젝트": GeneratedType
  "수상 및 수료": GeneratedType2
  기관: GeneratedType3
  "갤러리에서 보기": GeneratedType4
  중요도: GeneratedType5
  URL: Url
  분류: GeneratedType6
  날짜: GeneratedType7
  설명: GeneratedType8
  "수상 순위": GeneratedType9
  이름: GeneratedType10
  "맡은 업무": GeneratedType11
}

export interface GeneratedType {
  id: string
  type: string
  relation: Relation[]
  has_more: boolean
}

export interface Relation {
  id: string
}

export interface GeneratedType2 {
  id: string
  type: string
  rich_text: RichText[]
}

export interface RichText {
  type: string
  text: Text
  annotations: Annotations
  plain_text: string
  href: any
}

export interface Text {
  content: string
  link: any
}

export interface Annotations {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

export interface GeneratedType3 {
  id: string
  type: string
  multi_select: MultiSelect[]
}

export interface MultiSelect {
  id: string
  name: string
  color: string
}

export interface GeneratedType4 {
  id: string
  type: string
  checkbox: boolean
}

export interface GeneratedType5 {
  id: string
  type: string
  select?: Select
}

export interface Select {
  id: string
  name: string
  color: string
}

export interface Url {
  id: string
  type: string
  url?: string
}

export interface GeneratedType6 {
  id: string
  type: string
  multi_select: MultiSelect2[]
}

export interface MultiSelect2 {
  id: string
  name: string
  color: string
}

export interface GeneratedType7 {
  id: string
  type: string
  date: Date
}

export interface Date {
  start: string
  end?: string
  time_zone: any
}

export interface GeneratedType8 {
  id: string
  type: string
  rich_text: RichText2[]
}

export interface RichText2 {
  type: string
  text: Text2
  annotations: Annotations2
  plain_text: string
  href: any
}

export interface Text2 {
  content: string
  link: any
}

export interface Annotations2 {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

export interface GeneratedType9 {
  id: string
  type: string
  select?: Select2
}

export interface Select2 {
  id: string
  name: string
  color: string
}

export interface GeneratedType10 {
  id: string
  type: string
  title: Title[]
}

export interface Title {
  type: string
  text: Text3
  annotations: Annotations3
  plain_text: string
  href: any
}

export interface Text3 {
  content: string
  link: any
}

export interface Annotations3 {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

export interface GeneratedType11 {
  id: string
  type: string
  multi_select: MultiSelect3[]
}

export interface MultiSelect3 {
  id: string
  name: string
  color: string
}

export interface PageOrDatabase {}
