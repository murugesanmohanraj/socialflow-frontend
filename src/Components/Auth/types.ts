import { FormEventHandler } from "react";

export type AuthMode = "login" | "register" | "forgot";

export type AuthFormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  error: string;
};
