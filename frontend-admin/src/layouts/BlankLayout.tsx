import type { ReactNode } from 'react'

// 空白布局组件属性
interface BlankLayoutProps {
  children?: ReactNode
}

// 空白布局组件
function BlankLayout({ children }: BlankLayoutProps) {
  return <div style={{ width: '100%', height: '100%' }}>{children}</div>
}

export default BlankLayout
