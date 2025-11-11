export type FormItemType = 'input' | 'textarea' | 'radio' | 'checkbox' | 'switch' | 'img' | 'speech' | 'video'

export interface BaseField {
  type: FormItemType
  /** 标签 */
  label: string
  /** 是否必填 */
  is_require?: boolean
  /** 占位符 */
  placeholder?: string
  /** 默认值 */
  default_value?: any
  /** 选项，仅当类型为单选或多选时必需 */
  options?: string[]
  /** 排序 */
  sort?: number
  /**
   * 额外信息
   * TODO: 待定
   */
  // extra: {}
}

type FieldLackingType = Omit<BaseField, 'type'>

export interface InputField extends FieldLackingType {
  type: 'input'
}

export interface TextareaField extends FieldLackingType {
  type: 'textarea'
}

export interface RadioField extends FieldLackingType {
  type: 'radio'
  options: string[]
}

export interface CheckboxField extends FieldLackingType {
  type: 'checkbox'
  options: string[]
}

export interface SwitchField extends FieldLackingType {
  type: 'switch'
}

export interface ImgField extends FieldLackingType {
  type: 'img'
}

export interface SpeechField extends FieldLackingType {
  type: 'speech'
}

export interface VideoField extends FieldLackingType {
  type: 'video'
}

export type FormField =
  | InputField
  | TextareaField
  | RadioField
  | CheckboxField
  | SwitchField
  | ImgField
  | SpeechField
  | VideoField
