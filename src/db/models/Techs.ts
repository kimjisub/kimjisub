export interface Techs {
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
  file?: File
  emoji?: string
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
  분류: GeneratedType
  "상위 항목": GeneratedType2
  "갤러리에서 보기": GeneratedType3
  "하위 항목": GeneratedType4
  숙련도: GeneratedType5
  "사용한 횟수": GeneratedType6
  프로젝트: GeneratedType7
  "관련 기술": GeneratedType8
  "View: 사용한 횟수": View
  "환경 및 기술": GeneratedType9
}

export interface GeneratedType {
  id: string
  type: string
  multi_select: MultiSelect[]
}

export interface MultiSelect {
  id: string
  name: string
  color: string
}

export interface GeneratedType2 {
  id: string
  type: string
  relation: Relation[]
  has_more: boolean
}

export interface Relation {
  id: string
}

export interface GeneratedType3 {
  id: string
  type: string
  checkbox: boolean
}

export interface GeneratedType4 {
  id: string
  type: string
  relation: Relation2[]
  has_more: boolean
}

export interface Relation2 {
  id: string
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

export interface GeneratedType6 {
  id: string
  type: string
  rollup: Rollup
}

export interface Rollup {
  type: string
  number: number
  function: string
}

export interface GeneratedType7 {
  id: string
  type: string
  relation: Relation3[]
  has_more: boolean
}

export interface Relation3 {
  id: string
}

export interface GeneratedType8 {
  id: string
  type: string
  relation: Relation4[]
  has_more: boolean
}

export interface Relation4 {
  id: string
}

export interface View {
  id: string
  type: string
  formula: Formula
}

export interface Formula {
  type: string
  string: string
}

export interface GeneratedType9 {
  id: string
  type: string
  title: Title[]
}

export interface Title {
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

export interface PageOrDatabase {}
