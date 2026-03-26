/// <reference types="vite/client" />

// Декларации для статических ресурсов
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

// CSS Modules
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
