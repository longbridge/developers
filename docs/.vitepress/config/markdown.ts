import { type MarkdownOptions } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { tipContainerPlugin } from '../md-plugins/tip-container'
import { GenTryItPlugin } from '../md-plugins/gen-try-it.ts'
import { NormalizeMdPlugin } from '../md-plugins/normalize-md'
import { CliCommandPlugin } from '../md-plugins/cli-command'
import { RegionFilterPlugin } from '../md-plugins/region-filter'

export const markdownConfig: MarkdownOptions = {
  image: {
    lazyLoading: true,
  },
  math: true,
  codeTransformers: [
    // We use `[!!code` in demo to prevent transformation, here we revert it back.
    {
      postprocess(code) {
        return code.replace(/\[\!\!code/g, '[!code')
      },
    },
  ],

  config(md) {
    const fence = md.renderer.rules.fence!
    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
      const { localeIndex = 'root' } = env
      const codeCopyButtonTitle = (() => {
        switch (localeIndex) {
          case 'es':
            return 'Copiar código'
          case 'fa':
            return 'کپی کد'
          case 'ko':
            return '코드 복사'
          case 'pt':
            return 'Copiar código'
          case 'ru':
            return 'Скопировать код'
          case 'zh-CN':
            return '复制代码'
          case 'zh-HK':
            return '複製代碼'
          default:
            return 'Copy code'
        }
      })()
      return fence(tokens, idx, options, env, self).replace(
        '<button title="Copy Code" class="copy"></button>',
        `<button title="${codeCopyButtonTitle}" class="copy"></button>`
      )
    }
    md.use(NormalizeMdPlugin)
    md.use(groupIconMdPlugin)
    md.use(tipContainerPlugin)
    md.use(GenTryItPlugin)
    md.use(CliCommandPlugin)
    md.use(RegionFilterPlugin)
  },
}
