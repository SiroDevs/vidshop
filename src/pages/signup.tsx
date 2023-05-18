import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiAtSymbol, HiFingerPrint, HiOutlineUser } from "react-icons/hi";

import { User } from '../models/user';
import { createUser } from "../services/user_accounts";
import Loader from "../components/loader";
import styles from "../styles/Form.module.css";
import { useAuth } from "../context/AuthContext";
import FormLayout from "../components/layouts/form_layout";
import { mapAuthCodeToMessage } from "../lib/firebase/firebaseMapError";

export default function Register() {
  const { signUpUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState({ password: false, cpassword: false })

  const router = useRouter()
  const callbackUrl = (router.query?.callbackUrl as string) ?? "/"

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  let pwdWatch = watch("password")
  let cPwdWatch = watch("cpassword")
  let cPasswordError,
    pwdLengthError = null

  if (pwdWatch && pwdWatch.length < 6) {
    pwdLengthError = "should be greater than 5 characters"
  } else if (cPwdWatch !== pwdWatch) {
    cPasswordError = "Passwords does not match"
  }

  const onSubmit = async ({ username, email, password }: any) => {
    if (password.length < 6) return
    if (password !== cPwdWatch) return
    const newUser = new User(username, '', '', email, password, 3)
    try {
      setLoading(true)
      Promise.all([
        signUpUser(email, password),
        await createUser(newUser),
        toast.success('Signup was successful'),
        setLoading(false),
        router.push(callbackUrl),
      ]).catch((err) => {
        if (err.response?.data?.message) {
          toast.error(mapAuthCodeToMessage(err.code))
          console.log("error after promise", err)
        } else {
          toast.error(mapAuthCodeToMessage(err.code))
          console.log("error after promise", err)
        }
        setLoading(false)
      })
    } catch (err) {
      setLoading(false)
      console.log("error at try catch ", err)
    }
  }

  return (
    <FormLayout>
      <Head>
        <title>VidShop SignUp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6 mx-auto md:w-3/4 2xl:gap-7">
        <div className="title">
          <h1 className="text-2xl font-bold text-gray-800 md:py-4 md:text-4xl">
            {loading ? 'Signing you up' : 'Sign up'} on VidShop
          </h1>
        </div>

        {loading ? <Loader /> :

          <form
            className="flex flex-col gap-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div
              className={`${styles.inputgroup} ${errors.username && "border-red-500"
                }`}
            >
              <input
                className={styles.inputtext}
                type="text"
                placeholder="Username"
                {...register("username", { required: true })}
              />
              <span className="flex items-center px-3 icon">
                <HiOutlineUser size={23} />
              </span>
            </div>

            <div
              className={`${styles.inputgroup} ${errors.email && "border-red-500"
                }`}
            >
              <input
                className={styles.inputtext}
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
              />
              <span className="flex items-center px-3 icon">
                <HiAtSymbol size={23} />
              </span>
            </div>

            <div
              className={`${styles.inputgroup} ${errors.password && "border-red-500"
                }`}
            >
              <input
                className={styles.inputtext}
                type={show.password ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: true })}
              />
              <span
                className="icon flex cursor-pointer items-center px-3 hover:text-[#6366f1]"
                onClick={() => setShow({ ...show, password: !show.password })}
              >
                <HiFingerPrint size={23} />
              </span>
            </div>
            {errors.password && (
              <p className={styles.inputRegFormError}>
                Enter password (6 and 60 xcters).
              </p>
            )}
            {pwdLengthError && (
              <p className={styles.inputRegFormError}>{pwdLengthError}</p>
            )}

            <div
              className={`${styles.inputgroup} ${cPasswordError && "border-red-500"
                }`}
            >
              <input
                className={styles.inputtext}
                type={show.cpassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("cpassword", { required: true })}
              />
              <span
                className="icon flex cursor-pointer items-center px-3 hover:text-[#6366f1]"
                onClick={() => setShow({ ...show, cpassword: !show.cpassword })}
              >
                <HiFingerPrint size={23} />
              </span>
            </div>
            {cPasswordError && (
              <p className={styles.inputRegFormError}>{cPasswordError}</p>
            )}

            {/* register button */}
            <div className="input-button">
              <button className={styles.button} type="submit">
                Sign Up
              </button>
            </div>
          </form>
        }

        <p className="text-center text-gray-400 ">
          Have an account?{" "}
          <Link href={"/login"}>
            <span className="text-blue-700">Log In</span>
          </Link>
        </p>
      </section>
      <Toaster position="bottom-center" />
    </FormLayout>
  )
}
