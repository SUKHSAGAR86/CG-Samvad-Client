///this is for take ip address to client system

const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    (req.connection && req.connection.socket ? req.connection.socket.remoteAddress : null)
  );
};


module.exports = getClientIp;