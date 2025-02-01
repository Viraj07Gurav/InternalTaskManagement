
import * as React from "react"

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const baseStyles = "relative top-[-2rem] left-1 max-w-[15rem] sm:max-w-md flex-col items-center rounded-lg border py-4 px-8 [&>svg~*]:pl-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground"
  
  const variants = {
    default: "bg-background text-foreground",
    destructive: "border-4 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
  }

  const variantStyles = variants[variant] || variants.default
  const combinedClassName = `${baseStyles} ${variantStyles} ${className || ''}`

  return (
    <div
      ref={ref}
      role="alert"
      className={combinedClassName}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none tracking-tight ${className || ''}`}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className || ''}`}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription };