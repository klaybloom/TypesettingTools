import { createApp, defineComponent, h, nextTick } from 'vue'

export async function mountComposable(factory) {
  let result
  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp(defineComponent({
    setup() {
      result = factory()
      return () => h('div')
    }
  }))

  app.mount(container)
  await nextTick()

  return {
    result,
    async unmount() {
      app.unmount()
      container.remove()
      await nextTick()
    }
  }
}
