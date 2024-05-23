// import jwt from "jsonwebtoken";

// export const ValidateToken = async (req, res, next) => {
//   let token;
//   let authHeader = req.headers.Authorization || req.headers.authorization;
//   console.log("authHeader", authHeader); // Log the authHeader to see what's being received

//   if (authHeader && authHeader.startsWith("Bearer")) {
//     token = authHeader.split(" ")[1];
//     // console.log("token", token);

//     jwt.verify(token, "mayorgnn@088", (err, decoded) => {
//       if (err) {
//         const data = {
//           message: "User is not Authorized",
//           status: true,
//           data: null,
//         };
//         //return res.status(401).send(data);
//          return res.status(401).json({msg: 'User is not Authorized'})
//       }else{
//         console.log("this herre",decoded.user)
//       }
//       req.user = decoded.user;
//       next();
//     });
//   } else {
//     console.log("nothiing here")
//     const data = {
//       message: "User is not Authorized",
//       status: true,
//       data: null,
//     };
//     return res.status(401).send(data);
//   }
// };



import jwt from "jsonwebtoken";

export const ValidateToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
 // console.log("authHeader", authHeader); // Log the authHeader to see what's being received

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    // console.log("token", token);

    jwt.verify(token, "mayorgnn@088", (err, decoded) => {
      if (err) {
        const data = {
          message: "User is not Authorized",
          status: true,
          data: null,
        };
        //return res.status(401).send(data);
        return res.status(401).json({msg: 'User is not Authorized'})
      } else {
        // console.log("this here", decoded.user);

        // Check if token has expired
        const currentTimestamp = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
        if (decoded.exp && decoded.exp < currentTimestamp) {
          console.log("Token has expired")
          return res.status(401).json({msg: 'Token has expired'});
        }
      }
      
      req.user = decoded.user;
      next();
    });
  } else {
    console.log("nothing here");
    const data = {
      message: "User is not Authorized",
      status: true,
      data: null,
    };
    return res.status(401).send(data);
  }
};
