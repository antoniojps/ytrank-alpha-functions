import * as SibApiV3Sdk from "@sendinblue/client";

const SibInstance = new SibApiV3Sdk.ContactsApi();
SibInstance.setApiKey(
  SibApiV3Sdk.ContactsApiApiKeys.apiKey,
  process.env.SENDINBLUE_API_KEY
);

interface CreateContactInput {
  email: string;
  name: string;
}

export const createContact = async (contact: CreateContactInput) => {
  try {
    const newContact = await SibInstance.createContact({
      email: contact.email,
      attributes: {
        name: contact.name,
      },
    });

    return newContact.body;
  } catch (err) {
    throw Error(err.response.body.code);
  }
};
