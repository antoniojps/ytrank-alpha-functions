import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { object, string, ValidationError } from "yup";
import { mapResponse } from "../utils/response";
import { createContact } from "../utils/sendingblue.service";

let userSchema = object({
  name: string().required("Missing name parameter"),
  email: string()
    .email("Invalid email format")
    .required("Missing email parameter"),
});

interface Contact {
  name: string;
  email: string;
}

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const body = req.body;
    const user = (await userSchema.validate(body)) as Contact;
    const sendinBlueAccountData = await createContact(user);
    context.res = mapResponse({ data: sendinBlueAccountData });
  } catch (err) {
    if (err instanceof ValidationError) {
      context.res = mapResponse({ status: 403, error: err });
      return;
    }

    if (err.message === "duplicate_parameter") {
      context.res = mapResponse({
        status: 409,
        error: Error("Contact already exists"),
      });
      return;
    }

    context.res = mapResponse({ status: 500, error: err });
  }
};

export default httpTrigger;
