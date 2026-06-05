const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain:
    process.env.NODE_ENV === "production"
      ? ".tokenmitra.online"
      : undefined,
};

export default cookieOptions;