"use client"

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/breadcrumb'

type FormValues = {
    name: string
    email: string
    password: string
    image: string // base64
}

export default function AccountPage() {
    const { register, handleSubmit, reset, setValue, watch, formState } = useForm<FormValues>({
        defaultValues: { name: '', email: '', password: '', image: '' },
    })
    const { errors, isSubmitting } = formState
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                const email = localStorage.getItem('userEmail')
                if (!email) {
                  router.push("/login")
                  return
                }
                const res = await fetch(`/api/admin/info?email=${encodeURIComponent(email)}`)
                if (!res.ok) {
                  if (res.status === 404) {
                    // User not found in database, clear localStorage and redirect to login
                    localStorage.clear()
                    router.push("/login")
                    return
                  }
                  throw new Error('api')
                }
                const json = await res.json()
                if (!mounted) return
                reset({
                  name: json.name || '',
                  email: json.email || '',
                  password: json.password || '',
                  image: json.image || ''
                })
                localStorage.setItem('userName', json.name || '')
                localStorage.setItem('userEmail', json.email || '')
            } catch (e) {
                const name = localStorage.getItem('userName') || ''
                const email = localStorage.getItem('userEmail') || ''
                reset({ name, email, password: '', image: '' })
            }
        }
        load()
        return () => { mounted = false }
    }, [reset])

    const onSubmit = async (data: FormValues) => {
        try {
            const email = localStorage.getItem('userEmail')
            if (!email) {
              toast({ title: 'Error', description: 'User email not found.' })
              return
            }
            const res = await fetch('/api/admin/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, email }),
            })
            if (!res.ok) throw new Error('Failed to save via API')
            const json = await res.json()
            localStorage.setItem('userName', json.data?.name ?? data.name)
            localStorage.setItem('userEmail', json.data?.email ?? data.email)
            toast({ title: 'Saved', description: 'Your account info was updated.' })
            router.refresh()
        } catch (err) {
            localStorage.setItem('userName', data.name)
            localStorage.setItem('userEmail', data.email)
            toast({ title: 'Saved locally', description: 'Could not reach local API — changes saved to your browser.' })
            router.refresh()
        }
    }

    // Image upload handler
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => {
            setValue('image', reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const imagePreview = watch('image')

    return (
        <div className="space-y-6 p-4 md:p-0">
            <Breadcrumb />
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">My Account</h1>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">Manage your admin profile information</p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-lg bg-card border border-border rounded-md p-4 space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                        Name
                    </label>
                    <Input
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                        <p className="text-destructive text-sm mt-1">{errors.name.message?.toString()}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email',
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email.message?.toString()}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        {...register('password', { minLength: { value: 6, message: 'Min 6 characters' } })}
                    />
                    {errors.password && (
                        <p className="text-destructive text-sm mt-1">{errors.password.message?.toString()}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="image">
                        Profile Image
                    </label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <img src={imagePreview} alt="Profile preview" className="mt-2 w-24 h-24 rounded-full object-cover border" />
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                        Save
                    </Button>
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={() => {
                            const name = localStorage.getItem('userName') || ''
                            const email = localStorage.getItem('userEmail') || ''
                            reset({ name, email, password: '', image: '' })
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </form>
        </div>
    )
}
