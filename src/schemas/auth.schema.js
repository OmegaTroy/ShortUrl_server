import {z} from 'zod'

export const registerSchema =  z.object({
  username: z.string({
    required_error: 'Username is required'
  }).trim().min(6, { message: "Username must be at least 6 characters" }),
  email: z.string({
    required_error: 'Email is required'
  }).email({
    required_error: 'Invalid email'
  }),
  password: z.string({
    required_error: 'Password is required'
  }).min(6,{
    message: 'Password must be at least 6 characters'
  })
})


export const loginSchema = z.object({
  email: z.string({
    required_error: 'Email is required'
  }).email({
    required_error: 'Invalid Email'
  }),
  password: z.string({
    required_error: 'Password is required'
  }).min(6,{
    message: 'Password must be at least 6 characters'
  })
})