export default function obfuscateEmail(email) {
  const [local, domain] = email.split("@");
  const [domainName, domainExt] = domain.split(".");

  const mask = (str) => {
    if (str.length <= 1) return "*";
    return (
      str[0] + "*".repeat(Math.floor(str.length / 2)) + str[str.length - 1]
    );
  };

  const maskedLocal = local
    .split(".")
    .map((part) => mask(part))
    .join(".");

  const maskedDomain = mask(domainName) + "." + domainExt;

  return `${maskedLocal}@${maskedDomain}`;
}
