'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'

export default function SignupPage() {
    const supabase = useSupabaseClient()

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthYear: '',
        gender: '',
        language: '',
        streetName: '',
        streetNumber: '',
        city: '',
        postalCode: '',
        country: '',
        phoneNumber: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Validate basic required fields
            if (!form.email || !form.password || !form.firstName || !form.lastName) {
                setError("Please fill out all required fields.")
                setLoading(false)
                return
            }

            // 1️⃣ Create user in Supabase Auth
            const { data, error: supabaseError } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
            })

            if (supabaseError) throw supabaseError

            const supabaseUserId = data.user?.id
            if (!supabaseUserId) {
                throw new Error("Missing Supabase user ID")
            }

            // 2️⃣ Backend profile creation (fire & forget)
            fetch("https://onsketraetbackend.onrender.com/api/Users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: supabaseUserId,
                    ...form,
                    password: null, // backend ignores password anyway
                }),
            }).catch(err => {
                console.error("Backend API failed:", err)
            })

            // 3️⃣ Redirect immediately — even if backend is slow
            window.location.href = "/login"

        } catch (err: any) {
            setError(err.message || "An error occurred")
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-10 rounded-xl shadow-md max-w-lg w-full">

                <h1 className="text-2xl font-semibold text-center mb-6">Create Account</h1>

                {error && (
                    <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                    {/* First / Last Name */}
                    <input
                        name="firstName"
                        placeholder="First name"
                        onChange={handleChange}
                        className="border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    <input
                        name="lastName"
                        placeholder="Last name"
                        onChange={handleChange}
                        className="border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    {/* Email */}
                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        onChange={handleChange}
                        className="col-span-2 border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    {/* Password */}
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={handleChange}
                        className="col-span-2 border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    {/* Birth Year */}
                    <input
                        name="birthYear"
                        placeholder="Birth year"
                        onChange={handleChange}
                        className="border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    {/* Gender dropdown */}
                    <select
                        name="gender"
                        onChange={handleChange}
                        className="border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    {/* Language */}
                    <input
                        name="language"
                        placeholder="Language"
                        onChange={handleChange}
                        className="col-span-2 border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    {/* Address */}
                    <input
                        name="streetName"
                        placeholder="Street name"
                        onChange={handleChange}
                        className="border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    <input
                        name="streetNumber"
                        placeholder="Street number"
                        onChange={handleChange}
                        className="border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    <input
                        name="city"
                        placeholder="City"
                        onChange={handleChange}
                        className="border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    <input
                        name="postalCode"
                        placeholder="Postal code"
                        onChange={handleChange}
                        className="border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    <input
                        name="country"
                        placeholder="Country"
                        onChange={handleChange}
                        className="col-span-2 border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    {/* Phone */}
                    <input
                        name="phoneNumber"
                        placeholder="Phone number"
                        onChange={handleChange}
                        className="col-span-2 border px-3 py-2 rounded-md focus:ring focus:ring-blue-200"
                    />

                    {/* Submit Button */}
                    <button
                        disabled={loading}
                        className="col-span-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                {/* Go Back to Login */}
                <p className="text-center text-sm mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Go back to login
                    </Link>
                </p>
            </div>
        </div>
    )
}
