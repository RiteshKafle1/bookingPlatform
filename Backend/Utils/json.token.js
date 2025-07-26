import jwt from "jsonwebtoken";

const generateJsonToken = (res, id) => {
  const jwtToken = jwt.sign(
    {
      userId: id,
    },
    process.env.SECRET,
    {
      expiresIn: "5d",
    }
  );
  res.cookie('token',jwtToken,
    {
      httpOnly:true,
      maxAge:5*24*60*60*1000,
      sameSite:'strict',
    }

  )
  return jwtToken;

};
export default generateJsonToken;
