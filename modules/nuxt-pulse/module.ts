/**
 * Vendored from core/pulse/modules/nuxt-pulse (keep in sync when Pulse tracker changes).
 * Blog uses a local copy so Nuxt 4.0 can resolve @nuxt/kit; do not point at sibling path.
 */
import { defineNuxtModule, addPlugin, addImports, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  /** Pulse host, e.g. https://pulse.nezus.cn */
  host: string
  /** Website public id (ws_…) */
  websiteId: string
  /** Auto pageviews on route change */
  autoTrack?: boolean
  /** Master switch */
  enabled?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-pulse',
    configKey: 'pulse',
  },
  defaults: {
    host: '',
    websiteId: '',
    autoTrack: true,
    enabled: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.pulse = {
      host: options.host || process.env.NUXT_PUBLIC_PULSE_HOST || '',
      websiteId: options.websiteId || process.env.NUXT_PUBLIC_PULSE_WEBSITE_ID || '',
      autoTrack: options.autoTrack !== false,
      enabled: options.enabled !== false
        && !!(options.host || process.env.NUXT_PUBLIC_PULSE_HOST)
        && !!(options.websiteId || process.env.NUXT_PUBLIC_PULSE_WEBSITE_ID),
    }

    addPlugin(resolver.resolve('./runtime/plugin.client'))
    addImports([
      { name: 'trackPulseEvent', from: resolver.resolve('./runtime/composables') },
      { name: 'trackPulsePageview', from: resolver.resolve('./runtime/composables') },
      { name: 'usePulse', from: resolver.resolve('./runtime/composables') },
    ])
  },
})
