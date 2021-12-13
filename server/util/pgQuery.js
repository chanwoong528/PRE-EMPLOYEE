var pgQuery = {};

pgQuery.selectUserByEmailQuery = (pool, email, cb) => {
  const query = {
    name: 'select-by-email',
    text: `SELECT * FROM pre_emp_users WHERE email=$1`,
    values: [email],
  };
  try {
    pool().connect((err, client, release) => {
      if (err) throw new Error(err);
      client.query(query, (err, result) => {
        release();
        if (err) throw new Error(err);
        if (!result.rows[0]) return cb(null, false, { status:406, msg:"No such user found." });
        else {
          // const { password, ...user } = result.rows[0];
          return cb(null, result.rows[0]);
        }
      });
    });
  } catch (err) {
    return cb(err);
  }
};

pgQuery.insertIntoDefaultUsersQuery = (pool, email, password, firstname, lastname, position, cb) => {
  const query = {
    name: 'insert-into-default-users',
    text: `INSERT INTO public.pre_emp_users(
      email, password, firstname, lastname, "position", created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, TO_CHAR(NOW(),'YYYY-MM-DD'), TO_CHAR(NOW(),'YYYY-MM-DD'))`,
    values: [email, password, firstname, lastname, position],
  };
  pool().query(query, (err, result) => {
    if (err) return cb(err);
    if (result) return cb(null, true);
    else return cb(null, false, { status:500, msg: "DB insert: could not complete operation." });
  });
};

module.exports = pgQuery;