"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { auth } from "@/firebase/client";
import { Signin, SignUp } from "@/lib/actions/auth.action";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z.string().min(3, { message: "Name must have at least 3 letters." })
        : z.string().optional(),
    email: z.string().email({
      message: "Email must be a valid email.",
    }),
    password: z.string().min(6, {
      message: "Password must contain 6 letters.",
    }),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.]

      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await SignUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        console.log("Sign Up", values);
        toast.success("Successfully signed up. Now please sign in");
        type = "sign-in";
      } else {
        const { email, password } = values;

        const userCredentials = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in failed");
          return;
        }

        await Signin({ email, idToken });

        console.log("Sign In", values);
        toast.success("Successfully signed in");
      }
      form.reset();
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src={"/logo.svg"} alt="logo image" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                label="Name"
                name={"name"}
                placeholder="Your Name"
              />
            )}

            <FormField
              control={form.control}
              label="Email"
              name={"email"}
              type={"email"}
              placeholder="user@example.com"
            />

            <FormField
              control={form.control}
              label="Password"
              name={"password"}
              type="password"
              placeholder="******"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "sign-in" : "sign-up"}
            className="ml-1 text-user-primary font-bold"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
