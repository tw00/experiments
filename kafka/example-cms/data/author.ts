import {
  uuid,
  firstName,
  lastName,
  phoneNumber,
  username,
  streetAddress,
  arrayElement,
} from 'minifaker';

export function genAuthor({ profileImagesIds }) {
  return {
    id: uuid.v4(),
    firstName: firstName(),
    lastName: lastName(),
    twitter: phoneNumber(),
    username: username(),
    address: streetAddress(),
    image: `hearst://image/${arrayElement(profileImagesIds)}`,
  };
}
