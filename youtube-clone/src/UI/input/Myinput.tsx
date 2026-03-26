import type { InputHTMLAttributes } from 'react'

type MyInputProps = InputHTMLAttributes<HTMLInputElement>

export const Myinput = (props: MyInputProps) => {
  return <input {...props} />
}
