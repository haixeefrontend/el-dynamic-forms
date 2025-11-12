import { useLocale as useElpLocale, localeContextKey } from 'element-plus'
import { InjectionKey } from 'vue'

import enUs from './en-us'
import zhCn from './zh-cn'

export const locales = {
  'en-us': enUs,
  'zh-cn': zhCn,
}

export const overrideLocalesKey: InjectionKey<Record<string, any>> = Symbol('edfOverrideLocales')

export function useLocale() {
  const localeKey = inject(localeContextKey)!
  const mergedLocale = computed(() => {
    const merged = JSON.parse(JSON.stringify(locales[localeKey.value?.name as keyof typeof locales] || locales['en-us']))
    const overrideLocales = inject(overrideLocalesKey, {})
    if (typeof overrideLocales === 'object' && overrideLocales !== null) {
      const overrides = overrideLocales[localeKey.value?.name || '']
      if (typeof overrides === 'object' && overrides !== null) {
        for (const key in overrides) {
          const keys = key.split('.')
          let current = merged
          for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i]
            if (typeof current[k] !== 'object' || current[k] === null) {
              current[k] = {}
            }
            current = current[k]
          }
          current[keys[keys.length - 1]] = overrides[key]
        }
      }
    }
    return {
      name: localeKey.value?.name || 'en-us',
      el: localeKey.value?.el || {},
      ...localeKey.value,
      ...merged,
    }
  })
  return useElpLocale(mergedLocale)
}
