local claims = {
  email_verified: true
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if "email" in claims && claims.email_verified then "email" else null]: claims.email,
      [if "given_name" in claims && claims.given_name then "first_name" else null]: claims.given_name,
      [if "family_name" in claims && claims.family_name then "last_name" else null]: claims.family_name,
      [if "hd" in claims && claims.email_verified then "hd" else null]: claims.hd,
    },
  },
}